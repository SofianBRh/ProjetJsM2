// src/views/DashboardView.vue
<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Navbar -->
    <nav class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex justify-between items-center">
          <h1 class="text-xl font-bold">IA Dashboard</h1>
          <button 
            @click="handleLogout"
            class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 py-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <!-- New Workflow Form -->
        <div class="bg-white shadow rounded-lg p-4">
          <h2 class="text-lg font-bold mb-4">Nouveau Workflow</h2>
          <form @submit.prevent="createNewWorkflow" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Nom</label>
              <input
                v-model="workflowForm.name"
                type="text"
                class="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Source de données</label>
              <input
                v-model="workflowForm.data_source"
                type="text"
                class="w-full p-2 border rounded"
                required
              />
            </div>
            <button 
              type="submit"
              class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              :disabled="loading"
            >
              {{ loading ? 'Création...' : 'Créer Workflow' }}
            </button>
          </form>
        </div>

        <!-- File Upload -->
        <div class="bg-white shadow rounded-lg p-4">
          <h2 class="text-lg font-bold mb-4">Upload de fichier</h2>
          <div
            class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
            @dragover.prevent="handleDragOver"
            @drop.prevent="handleFileDrop"
            @click="$refs.fileInput.click()"
          >
            <input
              ref="fileInput"
              type="file"
              class="hidden"
              @change="handleFileSelect"
            />
            <p>Glissez un fichier ici ou cliquez pour sélectionner</p>
          </div>
        </div>
      </div>


      <!-- Workflows List -->
      <workflow-list
        :workflows="workflows"
        @execute-workflow="executeWorkflow"
        @delete-workflow="deleteWorkflow"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useApi } from '../composables/useApi'
import WorkflowList from '../components/WorkflowList.vue'

// State
const fileInput = ref(null)
const workflows = ref([])
const loading = ref(false)
const workflowForm = reactive({
  name: '',
  data_source: '',
  steps: [
    { step_type: "data_cleaning", parameters: { method: "remove_nulls" } },
    { step_type: "feature_engineering", parameters: { techniques: ["PCA", "scaling"] } },
    { step_type: "model_training", parameters: { model_type: "linear_regression" } }
  ]
})

// Hooks
const router = useRouter()
const authStore = useAuthStore()
const api = useApi()

// Methods
const handleLogout = () => {
  document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  authStore.logout()
  router.push('/login')
}

const loadWorkflows = async () => {
  try {
    workflows.value = await api.getWorkflows()
  } catch (error) {
    // Handle error
  }
}

const createNewWorkflow = async () => {
  if (loading.value) return

  loading.value = true
  try {
    const response = await api.createWorkflow(workflowForm)
    workflows.value.push(response)
    workflowForm.name = ''
    workflowForm.data_source = ''
  } catch (error) {
    // Handle error
  } finally {
    loading.value = false
  }
}

const executeWorkflow = async (workflowId) => {
  try {
    console.log(workflowId);
    const response = await api.executeWorkflow(workflowId)
    const index = workflows.value.findIndex(w => w.workflow_id === workflowId)
    if (index !== -1) {
      workflows.value[index] = { ...workflows.value[index], ...response }
      startPolling(workflowId)
    }
  } catch (error) {
    console.log(error)
    // Handle error
  }
}

const deleteWorkflow = async (workflowId) => {
  try {
    await api.deleteWorkflow(workflowId)
    workflows.value = workflows.value.filter(w => w.workflow_id !== workflowId)
  } catch (error) {
    // Handle error
  }
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) uploadFile(file)
}

const handleFileDrop = (event) => {
  const file = event.dataTransfer.files[0]
  if (file) uploadFile(file)
}

const handleDragOver = (event) => {
  event.preventDefault()
}

const uploadFile = async (file) => {
  try {
    await api.uploadFile(file)
    await loadWorkflows()
  } catch (error) {
    // Handle error
  }
}

// Polling
const pollingIntervals = new Map()

const startPolling = (workflowId) => {
  const pollStatus = async () => {
    try {
      const status = await api.getWorkflowStatus(workflowId)
      const index = workflows.value.findIndex(w => w.workflow_id === workflowId)
      if (index !== -1) {
        workflows.value[index] = { ...workflows.value[index], ...status }
      }
      
      if (status.status !== 'completed' && status.status !== 'error') {
        pollingIntervals.set(workflowId, setTimeout(() => pollStatus(), 5000))
      }
    } catch (error) {
      // Handle error
    }
  }
  pollStatus()
}

const clearPolling = () => {
  pollingIntervals.forEach(interval => clearTimeout(interval))
  pollingIntervals.clear()
}

// Lifecycle
onMounted(() => {
  loadWorkflows()
  document.title = 'IA Dashboard'
})

onUnmounted(() => {
  clearPolling()
})
</script>