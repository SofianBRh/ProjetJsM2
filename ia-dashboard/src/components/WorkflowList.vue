// src/components/WorkflowList.vue
<template>
  <div class="bg-white shadow rounded-lg p-4">
    <h2 class="text-xl font-bold mb-4">Workflows</h2>
    <div class="space-y-4">
      <div v-for="workflow in workflows" :key="workflow.workflow_id" class="border-b pb-4">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-lg font-medium">{{ workflow.name }}</h3>
            <p class="text-sm text-gray-500">Status: {{ workflow.status }}</p>
          </div>
          <div class="space-x-2">
            <button 
              @click="$emit('execute-workflow', workflow.workflow_id)"
              :disabled="workflow.status === 'in_progress'"
              class="bg-blue-500 text-white px-3 py-1 rounded disabled:opacity-50"
            >
              Exécuter
            </button>
            <button 
              @click="$emit('delete-workflow', workflow.workflow_id)"
              class="bg-red-500 text-white px-3 py-1 rounded"
            >
              Supprimer
            </button>
          </div>
        </div>
        <div v-if="workflow.steps" class="mt-2">
          <div class="flex space-x-4">
            <div v-for="(step, index) in workflow.steps" :key="index" class="text-sm">
              {{ step.step_type }}: {{ step.status }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  workflows: {
    type: Array,
    required: true,
    default: () => []
  }
})

defineEmits(['execute-workflow', 'delete-workflow'])
</script>