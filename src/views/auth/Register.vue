<template>
  <div class="register-page">
    <section class="auth-section">
      <div class="auth-container">
        <h2>Регистрация</h2>
        <form @submit.prevent="handleRegister" class="auth-form">
          <div class="form-group">
            <input
              type="text"
              v-model="fullName"
              placeholder="Полное имя"
              required
              class="form-input"
            />
          </div>
          <div class="form-group">
            <input
              type="email"
              v-model="email"
              placeholder="Ваш Email"
              required
              class="form-input"
            />
          </div>
          <div class="form-group">
            <input
              type="password"
              v-model="password"
              placeholder="Пароль"
              minlength="8"
              required
              class="form-input"
            />
          </div>
          <div class="form-group">
            <select v-model="role" required class="form-input">
              <option value="">Выберите роль</option>
              <option value="NEEDS_HELP">Нуждающийся</option>
              <option value="DONOR">Донор</option>
            </select>
          </div>
          <div v-if="error" class="error-message">{{ error }}</div>
          <div v-if="success" class="success-message">{{ success }}</div>
          <button type="submit" class="auth-button">Зарегистрироваться</button>
          <p class="auth-link">
            Уже есть аккаунт? <router-link to="/login">Войти</router-link>
          </p>
        </form>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/useAuthStore'

const router = useRouter()
const authStore = useAuthStore()

const fullName = ref('')
const email = ref('')
const password = ref('')
const role = ref('')
const error = ref('')
const success = ref('')

async function handleRegister() {
  error.value = ''
  success.value = ''
  
  if (!role.value) {
    error.value = 'Пожалуйста, выберите роль'
    return
  }

  try {
    await authStore.register(fullName.value, email.value, password.value, role.value)
    success.value = 'Регистрация успешна! Перенаправление на страницу входа...'
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (err) {
    error.value = err.message || 'Ошибка регистрации. Попробуйте еще раз.'
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  color: #333;
  font-family: 'Arial', sans-serif;
}

.auth-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 5%;
  background-color: #f7f7f7;
}

.auth-container {
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
}

.auth-container h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-size: 28px;
}

.auth-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 20px;
}

.form-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #ff6600;
}

.error-message {
  color: #d32f2f;
  background-color: #ffebee;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
  text-align: center;
  font-size: 14px;
}

.success-message {
  color: #2e7d32;
  background-color: #e8f5e9;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
  text-align: center;
  font-size: 14px;
}

.auth-button {
  background-color: #ff6600;
  color: white;
  padding: 15px;
  border: none;
  border-radius: 4px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 10px;
}

.auth-button:hover {
  background-color: #e55a00;
}

.auth-link {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.auth-link a {
  color: #ff6600;
  text-decoration: none;
}

.auth-link a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .auth-section {
    padding: 40px 20px;
  }

  .auth-container {
    padding: 30px 20px;
  }

  .auth-container h2 {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .auth-container h2 {
    font-size: 22px;
  }

  .form-input {
    font-size: 16px;
  }

  .auth-button {
    font-size: 16px;
    padding: 12px;
  }
}
</style>
