import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '../api/index'
import { useAuthStore } from './useAuthStore'

export const useUserStore = defineStore('user', () => {
  const users = ref([])
  const currentUser = ref(null)

  const authStore = useAuthStore()
  
  const token = computed(() => authStore.authData?.token)

  async function getAllUsers() {
    try {
      const headers = {}
      if (token.value) {
        headers.Authorization = `Bearer ${token.value}`
      }
      const response = await api.get('/users', { headers })
      users.value = response.data
      return response.data
    } catch (err) {
      console.error('Ошибка при получении пользователей:', err)
      throw new Error('Не удалось загрузить пользователей')
    }
  }

  async function getCurrentUser() {
    if (!token.value) {
      currentUser.value = null
      return null
    }
    try {
      const response = await api.get('/users/me', {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      })
      currentUser.value = response.data
      return response.data
    } catch (err) {
      console.error('Ошибка при получении текущего пользователя:', err)
      currentUser.value = null
      return null
    }
  }

  async function getUserById(userId) {
    try {
      const allUsers = await getAllUsers()
      const user = allUsers.find(u => u.id === userId)
      if (!user) {
        throw new Error('Пользователь не найден')
      }
      return user
    } catch (err) {
      console.error('Ошибка при получении пользователя:', err)
      throw new Error('Не удалось загрузить данные пользователя')
    }
  }

  async function updateUser(userId, data) {
    try {
      const formData = new FormData()
      
      if (data.fullName !== undefined && data.fullName !== null) {
        formData.append('fullName', data.fullName)
      }
      if (data.email !== undefined && data.email !== null) {
        formData.append('email', data.email)
      }
      if (data.password !== undefined && data.password !== null && data.password !== '') {
        formData.append('password', data.password)
      }
      if (data.role !== undefined && data.role !== null) {
        formData.append('role', data.role)
      }
      if (data.avatar !== undefined && data.avatar !== null) {
        formData.append('avatar', data.avatar)
      }
      if (data.document !== undefined && data.document !== null) {
        formData.append('document', data.document)
      }

      const response = await api.put(`/users/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${token.value}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      
      if (currentUser.value && currentUser.value.id === userId) {
        currentUser.value = response.data
      }
      
      return response.data
    } catch (err) {
      console.error('Ошибка при обновлении пользователя:', err)
      throw new Error('Не удалось обновить данные пользователя')
    }
  }

  async function verifyUser(userId) {
    try {
      const response = await api.put(`/users/${userId}/verify`, {}, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      })
      
      const verifiedUser = response.data
      const index = users.value.findIndex(u => u.id === userId)
      if (index !== -1) {
        users.value[index] = verifiedUser
      } else {
        users.value.push(verifiedUser)
      }
      
      if (currentUser.value && currentUser.value.id === userId) {
        currentUser.value = verifiedUser
      }
      
      return verifiedUser
    } catch (err) {
      console.error('Ошибка при верификации пользователя:', err)
      throw new Error(err.response?.data?.message || 'Не удалось верифицировать пользователя')
    }
  }

  return {
    users,
    currentUser,
    getAllUsers,
    getCurrentUser,
    getUserById,
    updateUser,
    verifyUser,
  }
})
