import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '../api/index'
import { useAuthStore } from './useAuthStore'

export const useCategoryStore = defineStore('category', () => {
  const categories = ref([])

  const authStore = useAuthStore()
  const token = computed(() => authStore.authData?.token)

  async function getAllCategories() {
    try {
      const headers = {}
      if (token.value) {
        headers.Authorization = `Bearer ${token.value}`
      }
      const response = await api.get('/categories', { headers })
      categories.value = response.data
      return response.data
    } catch (err) {
      console.error('Ошибка при получении категорий:', err)
      throw new Error('Не удалось загрузить категории')
    }
  }

  async function getCategoryById(id) {
    try {
      const headers = {}
      if (token.value) {
        headers.Authorization = `Bearer ${token.value}`
      }
      const response = await api.get(`/categories/${id}`, { headers })
      return response.data
    } catch (err) {
      console.error('Ошибка при получении категории:', err)
      throw new Error('Не удалось загрузить категорию')
    }
  }

  async function createCategory(categoryData) {
    try {
      const response = await api.post('/categories', categoryData, {
        headers: {
          Authorization: `Bearer ${token.value}`,
          'Content-Type': 'application/json',
        },
      })
      categories.value.push(response.data)
      return response.data
    } catch (err) {
      console.error('Ошибка при создании категории:', err)
      throw new Error(err.response?.data?.message || 'Не удалось создать категорию')
    }
  }

  async function updateCategory(id, categoryData) {
    try {
      const response = await api.put(`/categories/${id}`, categoryData, {
        headers: {
          Authorization: `Bearer ${token.value}`,
          'Content-Type': 'application/json',
        },
      })
      const index = categories.value.findIndex(c => c.id === id)
      if (index !== -1) {
        categories.value[index] = response.data
      }
      return response.data
    } catch (err) {
      console.error('Ошибка при обновлении категории:', err)
      throw new Error(err.response?.data?.message || 'Не удалось обновить категорию')
    }
  }

  async function deleteCategory(id) {
    try {
      await api.delete(`/categories/${id}`, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      })
      categories.value = categories.value.filter(c => c.id !== id)
    } catch (err) {
      console.error('Ошибка при удалении категории:', err)
      throw new Error(err.response?.data?.message || 'Не удалось удалить категорию')
    }
  }

  return {
    categories,
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
  }
})

