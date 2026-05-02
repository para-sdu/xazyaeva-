<template>
  <div class="event-edit-page">
    <section class="edit-header">
      <h1>Изменить событие</h1>
      <p>Обновите информацию о событии</p>
    </section>

    <section class="edit-content">
      <div v-if="loading" class="loading">
        <p>Загрузка события...</p>
      </div>

      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
        <button @click="goBack" class="back-button">Вернуться назад</button>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="edit-form">
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
            {{ submitting ? 'Сохранение...' : 'Сохранить изменения' }}
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
import { useRoute, useRouter } from 'vue-router'
import { useEventStore } from '../../stores/useEventStore'

const route = useRoute()
const router = useRouter()
const eventStore = useEventStore()

const loading = ref(false)
const error = ref('')
const submitting = ref(false)
const formData = ref({
  title: '',
  description: '',
  eventDate: '',
  location: '',
})

function formatDateTimeForInput(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

async function loadEvent() {
  const eventId = route.params.id
  if (!eventId) {
    error.value = 'ID события не указан'
    return
  }

  loading.value = true
  error.value = ''
  try {
    const event = await eventStore.getEventById(Number(eventId))
    formData.value = {
      title: event.title || '',
      description: event.description || '',
      eventDate: formatDateTimeForInput(event.eventDate),
      location: event.location || '',
    }
  } catch (err) {
    error.value = err.message || 'Не удалось загрузить данные события'
  } finally {
    loading.value = false
  }
}

async function handleSubmit() {
  submitting.value = true
  try {
    const eventData = {
      ...formData.value,
      eventDate: new Date(formData.value.eventDate).toISOString(),
    }

    await eventStore.updateEvent(Number(route.params.id), eventData)
    router.push(`/events/${route.params.id}`)
  } catch (err) {
    alert(err.message || 'Не удалось обновить событие')
  } finally {
    submitting.value = false
  }
}

function goBack() {
  router.back()
}

onMounted(() => {
  loadEvent()
})
</script>

<style scoped>
.event-edit-page {
  min-height: 100vh;
  background-color: #f7f7f7;
}

.edit-header {
  background-color: #222;
  color: white;
  text-align: center;
  padding: 60px 5%;
}

.edit-header h1 {
  font-size: 42px;
  margin: 0 0 10px 0;
}

.edit-header p {
  font-size: 18px;
  margin: 0;
  opacity: 0.9;
}

.edit-content {
  padding: 60px 5%;
  max-width: 800px;
  margin: 0 auto;
}

.loading,
.error {
  text-align: center;
  padding: 60px 20px;
  font-size: 18px;
}

.error {
  color: #d32f2f;
}

.edit-form {
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

.back-button {
  background-color: #6c757d;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
}

.back-button:hover {
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

