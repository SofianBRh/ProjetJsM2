
import { ref } from 'vue'

export function useApi() {
  const baseUrl = 'http://localhost:3000'
  const error = ref(null)
  const loading = ref(false)

  const api = {
    // Gestion des workflows
    async createWorkflow(workflowData) {
      return await fetchWithConfig('/workflow', {
        method: 'POST',
        body: JSON.stringify(workflowData)
      })
    },

    async executeWorkflow(workflowId) {
      return await fetchWithConfig(`/workflow/${workflowId}/execute`, {
        method: 'POST'
      })
    },

    async getWorkflowStatus(workflowId) {
      return await fetchWithConfig(`/workflow/${workflowId}/status`, {
        method: 'POST'
      })
    },

    async deleteWorkflow(workflowId) {
      return await fetchWithConfig(`/workflow/${workflowId}`, {
        method: 'DELETE'
      })
    },

    // Gestion des modèles
    async trainModel(modelData) {
      return await fetchWithConfig('/model/train', {
        method: 'POST',
        body: JSON.stringify(modelData)
      })
    },

    async getModelStatus(modelId) {
      return await fetchWithConfig(`/model/${modelId}/status`, {
        method: 'GET'
      })
    },

    async predict(modelId, data) {
      return await fetchWithConfig(`/model/${modelId}/predict`, {
        method: 'POST',
        body: JSON.stringify({ input_data: data })
      })
    },

    // Gestion des fichiers
    async uploadFile(file) {
      const formData = new FormData()
      formData.append('file', file)
      return await fetchWithConfig('/file', {
        method: 'POST',
        body: formData,
        headers: {} // Supprimer le Content-Type pour l'upload
      })
    }
  }
  

  const fetchWithConfig = async (endpoint, config = {}) => {
    loading.value = true
    error.value = null
    
    try {
      // Vérifier si c'est un upload de fichier
      const isFileUpload = config.body instanceof FormData

      const finalConfig = {
        ...config,
        headers: {
          // N'ajouter le Content-Type que si ce n'est pas un upload de fichier
          ...(!isFileUpload && { 'Content-Type': 'application/json' }),
          ...config.headers,
        },
      }

      const response = await fetch(`${baseUrl}${endpoint}`, finalConfig)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    ...api,
    error,
    loading
  }
}