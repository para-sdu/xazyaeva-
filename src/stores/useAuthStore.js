import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '../api/index'
import Cookies from 'universal-cookie'

export const useAuthStore = defineStore('auth', () => {
  const authData = ref(null)
  const cookies = new Cookies()

  async function register(fullName, email, password, role) {
    try {
      await api.post('/auth/register', { fullName, email, password, role })
    } catch (err) {
      throw new Error(getApiErrorMessage(err, 'Ошибка регистрации'))
    }
  }

  async function login(email, password) {
    try {
      const token = (await api.post('/auth/login', { email, password })).data.token
      saveAuthData({ token })
    } catch (err) {
      throw new Error(getApiErrorMessage(err, 'Ошибка входа'))
    }
  }

  function getApiErrorMessage(err, fallback) {
    const serverMessage = err.response?.data?.message
    if (serverMessage) {
      return translateServerMessage(serverMessage)
    }

    if (err.code === 'ERR_NETWORK') {
      return 'Сервер не отвечает. Проверьте, что backend запущен на http://localhost:8080'
    }

    return fallback
  }

  function translateServerMessage(message) {
    if (message.includes('Password must be between 8 and 100 characters')) {
      return 'Пароль должен быть минимум 8 символов'
    }

    if (message.includes('User with this email already exists')) {
      return 'Пользователь с таким email уже зарегистрирован'
    }

    if (message.includes('Email should be valid')) {
      return 'Введите корректный email'
    }

    if (message.includes('Full name is required')) {
      return 'Введите полное имя'
    }

    if (message.includes('Role is required')) {
      return 'Выберите роль'
    }

    return message
  }

  function logout() {
    if (authData.value) {
      authData.value.token = null
    }
    removeAuthData()
  }

  function saveAuthData(data) {
    authData.value = data
    cookies.set('authData', data, { path: '/', secure: true, sameSite: 'Strict' })
  }

  function removeAuthData() {
    authData.value = null
    cookies.remove('authData', { path: '/' })
  }

  function readAuthData() {
    const storedAuthData = cookies.get('authData')
    if (storedAuthData) authData.value = storedAuthData
  }
  readAuthData()

  return { authData, register, login, logout }
})
