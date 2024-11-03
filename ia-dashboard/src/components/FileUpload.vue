<template>
  <div class="max-w-xl">
    <label class="block text-sm font-medium text-gray-700">
      Fichier à uploader
    </label>
    <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
      <div class="space-y-1 text-center">
        <div class="flex text-sm text-gray-600">
          <label
            class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
          >
            <span>Upload a file</span>
            <input
              ref="fileInput"
              type="file"
              class="sr-only"
              @change="handleFileChange"
            />
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useApi } from '../composables/useApi'

const emit = defineEmits(['file-uploaded'])
const { fetchWithConfig } = useApi()
const fileInput = ref(null)

const handleFileChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await fetchWithConfig('/file', {
      method: 'POST',
      body: formData,
      headers: {}
    })
    emit('file-uploaded', response)
    fileInput.value.value = ''
  } catch (err) {
    // Gérer l'erreur
  }
}
</script>
