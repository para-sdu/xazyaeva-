<template>
  <div class="event-create-page">
    <section class="create-header">
      <h1>Создать событие</h1>
      <p>Заполните форму для создания нового волонтёрского события</p>
    </section>

    <section class="create-content">
      <form @submit.prevent="handleSubmit" class="create-form">
        <div class="form-group">
          <label for="title">Название события *</label>
          <input
            id="title"
            v-model="formData.title"
            type="text"
            required
            placeholder="Введите название события"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="description">Описание *</label>
          <textarea
            id="description"
            v-model="formData.description"
            required
            rows="6"
            placeholder="Опишите событие"
            class="form-textarea"
          ></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="eventDate">Дата и время события *</label>
            <input
              id="eventDate"
              v-model="formData.eventDate"
              type="datetime-local"
              required
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="location">Место проведения *</label>
            <input
              id="location"
              v-model="formData.location"
              type="text"
              required
              placeholder="Введите адрес или место"
              class="form-input"
            />
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="submit-button" :disabled="submitting">
            {{ submitting ? 'Создание...' : 'Создать событие' }}
          </button>
          <button type="button" @click="goBack" class="cancel-button">
            Отмена
          </button>
        </div>
      </form>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useEventStore } from '../../stores/useEventStore'
import { useUserStore } from '../../stores/useUserStore'

const router = useRouter()
const eventStore = useEventStore()
const userStore = useUserStore()

const submitting = ref(false)
const formData = ref({
  title: '',
  description: '',
  eventDate: '',
  location: '',
})

async function handleSubmit() {
  if (!userStore.currentUser) {
    alert('Необходимо войти в систему')
    router.push('/login')
    return
  }

  submitting.value = true
  try {
    const eventData = {
      ...formData.value,
      organizerId: userStore.currentUser.id,
      eventDate: new Date(formData.value.eventDate).toISOString(),
    }

    await eventStore.createEvent(eventData)
    router.push('/events')
  } catch (err) {
    alert(err.message || 'Не удалось создать событие')
  } finally {
    submitting.value = false
  }
}

function goBack() {
  router.back()
}

async function loadCurrentUser() {
  try {
    await userStore.getCurrentUser()
  } catch (err) {
    console.error('Ошибка при загрузке пользователя:', err)
  }
}

onMounted(() => {
  loadCurrentUser()
})
</script>

<style scoped>
.event-create-page {
  min-height: 100vh;
  background-color: #f7f7f7;
}

.create-header {
  background-color: #222;
  color: white;
  text-align: center;
  padding: 60px 5%;
}

.create-header h1 {
  font-size: 42px;
  margin: 0 0 10px 0;
}

.create-header p {
  font-size: 18px;
  margin: 0;
  opacity: 0.9;
}

.create-content {
  padding: 60px 5%;
  max-width: 800px;
  margin: 0 auto;
}

.create-form {
  background-color: white;
  border-radius: 8px;
  padding: 40px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 8px;
  color: #222;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  font-family: inherit;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #ff6600;
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}

.submit-button,
.cancel-button {
  flex: 1;
  padding: 15px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button {
  background-color: #ff6600;
  color: white;
}

.submit-button:hover:not(:disabled) {
  background-color: #e55a00;
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.cancel-button {
  background-color: #6c757d;
  color: white;
}

.cancel-button:hover {
  background-color: #5a6268;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>

