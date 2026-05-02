import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '../api/index'
import { useAuthStore } from './useAuthStore'

export const useEventStore = defineStore('event', () => {
  const events = ref([])
  const currentEvent = ref(null)

  const authStore = useAuthStore()
  const token = computed(() => authStore.authData?.token)

  async function getAllEvents() {
    try {
      const headers = {}
      if (token.value) {
        headers.Authorization = `Bearer ${token.value}`
      }
      const response = await api.get('/events', { headers })
      events.value = response.data
      return response.data
    } catch (err) {
      console.error('Ошибка при получении событий:', err)
      throw new Error('Не удалось загрузить события')
    }
  }

  async function getEventById(id) {
    try {
      const headers = {}
      if (token.value) {
        headers.Authorization = `Bearer ${token.value}`
      }
      const response = await api.get(`/events/${id}`, { headers })
      currentEvent.value = response.data
      return response.data
    } catch (err) {
      console.error(`Ошибка при получении события ${id}:`, err)
      throw new Error('Не удалось загрузить событие')
    }
  }

  async function createEvent(eventData) {
    try {
      const payload = {
        title: eventData.title,
        description: eventData.description,
        eventDate: eventData.eventDate,
        location: eventData.location,
        organizerId: eventData.organizerId,
      }

      const response = await api.post('/events', payload, {
        headers: {
          Authorization: `Bearer ${token.value}`,
          'Content-Type': 'application/json',
        },
      })

      events.value.push(response.data)
      return response.data
    } catch (err) {
      console.error('Ошибка при создании события:', err)
      throw new Error(err.response?.data?.message || 'Не удалось создать событие')
    }
  }

  async function updateEvent(eventId, eventData) {
    try {
      const payload = {
        title: eventData.title,
        description: eventData.description,
        eventDate: eventData.eventDate,
        location: eventData.location,
      }

      const response = await api.put(`/events/${eventId}`, payload, {
        headers: {
          Authorization: `Bearer ${token.value}`,
          'Content-Type': 'application/json',
        },
      })

      const index = events.value.findIndex((e) => e.id === eventId)
      if (index !== -1) events.value[index] = response.data

      return response.data
    } catch (err) {
      console.error('Ошибка при обновлении события:', err)
      throw new Error('Не удалось обновить событие')
    }
  }

  async function deleteEvent(id) {
    try {
      await api.delete(`/events/${id}`, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      })
      events.value = events.value.filter((e) => e.id !== id)
    } catch (err) {
      console.error(`Ошибка при удалении события ${id}:`, err)
      throw new Error('Не удалось удалить событие')
    }
  }

  async function joinEvent(eventId) {
    try {
      const response = await api.post(`/events/${eventId}/join`, {}, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      })
      
      const index = events.value.findIndex((e) => e.id === eventId)
      if (index !== -1) {
        events.value[index] = response.data
      }
      
      if (currentEvent.value && currentEvent.value.id === eventId) {
        currentEvent.value = response.data
      }
      
      return response.data
    } catch (err) {
      console.error('Ошибка при присоединении к событию:', err)
      throw new Error(err.response?.data?.message || 'Не удалось присоединиться к событию')
    }
  }

  async function leaveEvent(eventId) {
    try {
      const response = await api.post(`/events/${eventId}/leave`, {}, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      })
      
      const index = events.value.findIndex((e) => e.id === eventId)
      if (index !== -1) {
        events.value[index] = response.data
      }
      
      if (currentEvent.value && currentEvent.value.id === eventId) {
        currentEvent.value = response.data
      }
      
      return response.data
    } catch (err) {
      console.error('Ошибка при выходе из события:', err)
      throw new Error(err.response?.data?.message || 'Не удалось выйти из события')
    }
  }

  return {
    events,
    currentEvent,
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    joinEvent,
    leaveEvent,
  }
})

