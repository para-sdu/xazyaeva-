import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '../api/index'
import { useAuthStore } from './useAuthStore'

export const useDonationStore = defineStore('donation', () => {
  const donations = ref([])

  const authStore = useAuthStore()
  const token = computed(() => authStore.authData?.token)

  async function createDonation(projectId, amount) {
    try {
      const response = await api.post('/donations', {
        projectId,
        amount
      }, {
        headers: {
          Authorization: `Bearer ${token.value}`,
          'Content-Type': 'application/json',
        },
      })
      return response.data
    } catch (err) {
      console.error('Ошибка при создании пожертвования:', err)
      throw new Error(err.response?.data?.message || 'Не удалось создать пожертвование')
    }
  }

  async function getProjectDonations(projectId) {
    try {
      const response = await api.get(`/projects/${projectId}/donations`, {
        headers: token.value ? {
          Authorization: `Bearer ${token.value}`,
        } : {},
      })
      return response.data
    } catch (err) {
      console.error('Ошибка при получении истории пожертвований:', err)
      throw new Error(err.response?.data?.message || 'Не удалось загрузить историю пожертвований')
    }
  }

  async function getTotalDonationsCount() {
    try {
      const headers = {}
      if (token.value) {
        headers.Authorization = `Bearer ${token.value}`
      }
      const response = await api.get('/donations/count', { headers })
      return response.data.count
    } catch (err) {
      console.error('Ошибка при получении общего количества пожертвований:', err)
      throw new Error('Не удалось загрузить количество пожертвований')
    }
  }

  async function getDonationsSumForCurrentMonth() {
    try {
      const headers = {}
      if (token.value) {
        headers.Authorization = `Bearer ${token.value}`
      }
      const response = await api.get('/donations/month-sum', { headers })
      return response.data.sum
    } catch (err) {
      console.error('Ошибка при получении суммы пожертвований за месяц:', err)
      throw new Error('Не удалось загрузить сумму пожертвований за месяц')
    }
  }

  async function getDonationsSumForLastYear() {
    try {
      const headers = {}
      if (token.value) {
        headers.Authorization = `Bearer ${token.value}`
      }
      const response = await api.get('/donations/last-year-sum', { headers })
      return response.data.sum
    } catch (err) {
      console.error('Ошибка при получении суммы пожертвований за прошлый год:', err)
      throw new Error('Не удалось загрузить сумму пожертвований за прошлый год')
    }
  }

  return {
    donations,
    createDonation,
    getProjectDonations,
    getTotalDonationsCount,
    getDonationsSumForCurrentMonth,
    getDonationsSumForLastYear,
  }
})

