import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '../api/index'
import { useAuthStore } from './useAuthStore'

export const useProjectStore = defineStore('project', () => {
  const projects = ref([])
  const currentProject = ref(null)

  const authStore = useAuthStore()
  const token = computed(() => authStore.authData?.token)

  /**
   * Единая проверка завершённости проекта:
   * проект завершён, если сумма сбора достигла цели.
   */
  function isProjectCompleted(project) {
    const targetAmount = Number(project?.targetAmount || 0)
    const collectedAmount = Number(project?.collectedAmount || 0)
    return targetAmount > 0 && collectedAmount >= targetAmount
  }

  async function getAllProjects() {
    try {
      const headers = {}
      if (token.value) {
        headers.Authorization = `Bearer ${token.value}`
      }
      const response = await api.get('/projects', { headers })
      projects.value = response.data
      return response.data
    } catch (err) {
      console.error('Ошибка при получении проектов:', err)
      throw new Error('Не удалось загрузить проекты')
    }
  }

  async function getAllProjectsForAdmin() {
    try {
      if (!token.value) {
        throw new Error('Требуется авторизация')
      }
      const response = await api.get('/projects/admin/all', {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
      projects.value = response.data
      return response.data
    } catch (err) {
      console.error('Ошибка при получении всех проектов для администратора:', err)
      throw new Error('Не удалось загрузить проекты')
    }
  }

  async function getProjectById(id) {
    try {
      const headers = {}
      if (token.value) {
        headers.Authorization = `Bearer ${token.value}`
      }
      const response = await api.get(`/projects/${id}`, { headers })
      currentProject.value = response.data
      return response.data
    } catch (err) {
      console.error(`Ошибка при получении проекта ${id}:`, err)
      throw new Error('Не удалось загрузить проект')
    }
  }

  async function createProject(projectData, imageFiles = []) {
    try {
      const payload = {
        title: projectData.title,
        description: projectData.description,
        authorId: projectData.authorId,
        categoryId: projectData.categoryId || null,
        targetAmount: projectData.targetAmount || null,
        collectedAmount: projectData.collectedAmount || 0,
        imageIds: projectData.imageIds || [],
      }

      const response = await api.post('/projects', payload, {
        headers: {
          Authorization: `Bearer ${token.value}`,
          'Content-Type': 'application/json',
        },
      })

      const createdProject = response.data
      const imageIds = []

      if (imageFiles && imageFiles.length > 0) {
        for (const file of imageFiles) {
          const formData = new FormData()
          formData.append('file', file)
          formData.append('projectId', createdProject.id)

          const imageResponse = await api.post('/images', formData, {
            headers: {
              Authorization: `Bearer ${token.value}`,
              'Content-Type': 'multipart/form-data',
            },
          })

          imageIds.push(imageResponse.data.id)
        }

        if (imageIds.length > 0) {
          const updatePayload = {
            ...payload,
            imageIds: imageIds,
          }

          const updateResponse = await api.put(`/projects/${createdProject.id}`, updatePayload, {
            headers: {
              Authorization: `Bearer ${token.value}`,
              'Content-Type': 'application/json',
            },
          })

          const index = projects.value.findIndex((p) => p.id === createdProject.id)
          if (index !== -1) {
            projects.value[index] = updateResponse.data
          }
          return updateResponse.data
        }
      }

      projects.value.push(createdProject)
      return createdProject
    } catch (err) {
      console.error('Ошибка при создании проекта:', err)
      throw new Error(err.response?.data?.message || 'Не удалось создать проект')
    }
  }

  async function updateProject(projectId, projectData, imageFiles = []) {
    try {
      const imageIds = []

      for (const file of imageFiles) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('projectId', projectId)

        const response = await api.post('/images', formData, {
          headers: {
            Authorization: `Bearer ${token.value}`,
            'Content-Type': 'multipart/form-data',
          },
        })

        imageIds.push(response.data.id)
      }

      const payload = {
        title: projectData.title,
        description: projectData.description,
        categoryId: projectData.categoryId || null,
        targetAmount: projectData.targetAmount || null,
        imageIds: imageIds.length > 0 ? imageIds : (projectData.imageIds || []),
      }
      
      if (projectData.authorId) {
        payload.authorId = projectData.authorId
      }

      const response = await api.put(`/projects/${projectId}`, payload, {
        headers: {
          Authorization: `Bearer ${token.value}`,
          'Content-Type': 'application/json',
        },
      })

      const index = projects.value.findIndex((p) => p.id === projectId)
      if (index !== -1) projects.value[index] = response.data

      return response.data
    } catch (err) {
      console.error('Ошибка при обновлении проекта:', err)
      throw new Error('Не удалось обновить проект')
    }
  }

  async function deleteProject(id) {
    try {
      const response = await api.delete(`/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      })
    } catch (err) {
      console.error(`Ошибка при удалении проекта ${id}:`, err)
      throw new Error('Не удалось удалить проект')
    }
  }

  async function verifyProject(projectId) {
    try {
      const response = await api.put(`/projects/${projectId}/verify`, {}, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      })
      
      const index = projects.value.findIndex(p => p.id === projectId)
      if (index !== -1) {
        projects.value[index] = response.data
      }
      
      if (currentProject.value && currentProject.value.id === projectId) {
        currentProject.value = response.data
      }
      
      return response.data
    } catch (err) {
      console.error('Ошибка при верификации проекта:', err)
      throw new Error(err.response?.data?.message || 'Не удалось верифицировать проект')
    }
  }

  async function uploadImage(formData) {
    try {
      const response = await api.post('/images', formData, {
        headers: {
          Authorization: `Bearer ${token.value}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    } catch (err) {
      console.error('Ошибка при загрузке изображения:', err)
      throw new Error(err.response?.data?.message || 'Не удалось загрузить изображение')
    }
  }

  return {
    projects,
    currentProject,
    isProjectCompleted,
    getAllProjects,
    getAllProjectsForAdmin,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    verifyProject,
    uploadImage,
  }
})
