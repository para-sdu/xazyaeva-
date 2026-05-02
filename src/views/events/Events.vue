<template>
  <div class="events-page">
    <section class="events-header">
      <div class="header-content">
        <div>
          <h1>Волонтёрские события</h1>
          <p>Присоединяйтесь к волонтёрским мероприятиям</p>
        </div>
        <button
          v-if="isAdmin"
          @click="goToCreateEvent"
          class="create-event-button"
        >
          Создать событие
        </button>
      </div>
    </section>

    <section class="events-section">
      <div v-if="loading" class="loading">
        <p>Загрузка событий...</p>
      </div>
      
      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
      </div>

      <div v-else-if="events.length === 0" class="empty">
        <p>События не найдены</p>
      </div>

      <div v-else class="events-grid">
        <EventCard
          v-for="event in events"
          :key="event.id"
          :event="event"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useEventStore } from '../../stores/useEventStore'
import { useUserStore } from '../../stores/useUserStore'
import EventCard from '../../components/EventCard.vue'

const router = useRouter()
const eventStore = useEventStore()
const userStore = useUserStore()
const loading = ref(false)
const error = ref('')
const events = ref([])

const isAdmin = computed(() => {
  return userStore.currentUser?.role === 'ADMIN'
})

function goToCreateEvent() {
  router.push('/events/create')
}

async function loadEvents() {
  loading.value = true
  error.value = ''
  try {
    events.value = await eventStore.getAllEvents()
  } catch (err) {
    error.value = err.message || 'Не удалось загрузить события'
  } finally {
    loading.value = false
  }
}

async function loadCurrentUser() {
  try {
    await userStore.getCurrentUser()
  } catch (err) {
    console.error('Ошибка при загрузке пользователя:', err)
  }
}

onMounted(async () => {
  await Promise.all([
    loadEvents(),
    loadCurrentUser()
  ])
})
</script>

<style scoped>
.events-page {
  min-height: 100vh;
  background-color: #f7f7f7;
}

.events-header {
  background-color: #222;
  color: white;
  padding: 60px 5%;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content h1 {
  font-size: 42px;
  margin: 0 0 10px 0;
}

.header-content p {
  font-size: 18px;
  margin: 0;
  opacity: 0.9;
}

.create-event-button {
  background-color: #ff6600;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  white-space: nowrap;
}

.create-event-button:hover {
  background-color: #e55a00;
}

.events-section {
  padding: 60px 5%;
  max-width: 1200px;
  margin: 0 auto;
}

.loading,
.error,
.empty {
  text-align: center;
  padding: 60px 20px;
  font-size: 18px;
}

.error {
  color: #d32f2f;
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
  max-width: 1400px;
  margin: 0 auto;
}

@media (max-width: 1024px) {
  .events-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
}

@media (max-width: 768px) {
  .events-grid {
    grid-template-columns: 1fr;
  }
  
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }

  .create-event-button {
    width: 100%;
  }
}
</style>

