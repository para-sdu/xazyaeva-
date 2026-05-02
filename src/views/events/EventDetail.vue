<template>
  <div class="event-detail-page">
    <div v-if="loading" class="loading">
      <p>Загрузка события...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="goBack" class="back-button">Вернуться назад</button>
    </div>

    <div v-else-if="event" class="event-detail">
      <div class="event-header">
        <button @click="goBack" class="back-button-header">← Назад</button>
        <h1>{{ event.title }}</h1>
      </div>

      <div class="event-content">
        <div class="event-main-info">
          <div class="event-description">
            <h2>О событии</h2>
            <p>{{ event.description }}</p>
          </div>

          <div class="event-details">
            <div class="detail-item">
              <span class="detail-label">📅 Дата и время:</span>
              <span class="detail-value">{{ formatDateTime(event.eventDate) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">📍 Место:</span>
              <span class="detail-value">{{ event.location }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">👥 Участников:</span>
              <span class="detail-value">{{ event.participants?.length || 0 }}</span>
            </div>
          </div>

          <div class="event-organizer" v-if="event.organizer">
            <h3>Организатор</h3>
            <div class="organizer-info" @click="goToOrganizerProfile" style="cursor: pointer;">
              <img 
                :src="organizerAvatarUrl" 
                :alt="event.organizer.fullName" 
                class="organizer-avatar"
              />
              <div class="organizer-details">
                <p class="organizer-name">{{ event.organizer.fullName }}</p>
                <p class="organizer-email">{{ event.organizer.email }}</p>
              </div>
            </div>
          </div>

          <div class="event-actions">
            <button 
              v-if="isAuthenticated && !isParticipant && !isOrganizer" 
              @click="handleJoin" 
              class="join-button"
            >
              Присоединиться
            </button>
            <button 
              v-if="isAuthenticated && isParticipant && !isOrganizer" 
              @click="handleLeave" 
              class="leave-button"
            >
              Отменить участие
            </button>
            <div v-if="!isAuthenticated && !isOrganizer" class="auth-message">
              <p>Чтобы принять участие в событии, пожалуйста, <router-link to="/login" class="login-link">войдите</router-link> в систему</p>
            </div>
            <div v-if="canEditOrDelete" class="admin-actions">
              <button v-if="canEdit" @click="handleEdit" class="edit-button">Изменить событие</button>
              <button v-if="canDelete" @click="handleDelete" class="delete-button">Удалить событие</button>
            </div>
          </div>
        </div>

        <div class="event-participants-section">
          <h3>Участники ({{ event.participants?.length || 0 }})</h3>
          <div v-if="!event.participants || event.participants.length === 0" class="empty-participants">
            <p>Пока нет участников</p>
          </div>
          <div v-else class="participants-list">
            <div
              v-for="participant in event.participants"
              :key="participant.id"
              class="participant-item"
              @click="goToParticipantProfile(participant.id)"
            >
              <img 
                :src="getParticipantAvatarUrl(participant)" 
                :alt="participant.fullName" 
                class="participant-avatar"
              />
              <div class="participant-info">
                <p class="participant-name">{{ participant.fullName }}</p>
                <p class="participant-email">{{ participant.email }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEventStore } from '../../stores/useEventStore'
import { useUserStore } from '../../stores/useUserStore'
import { useAuthStore } from '../../stores/useAuthStore'
import { getFileUrl } from '../../utils/backendUrl'

const route = useRoute()
const router = useRouter()
const eventStore = useEventStore()
const userStore = useUserStore()
const authStore = useAuthStore()

const loading = ref(false)
const error = ref('')
const event = ref(null)

const isAuthenticated = computed(() => !!authStore.authData?.token)

const isParticipant = computed(() => {
  if (!event.value || !userStore.currentUser) return false
  return event.value.participants?.some(p => p.id === userStore.currentUser.id) || false
})

const isOrganizer = computed(() => {
  if (!event.value || !userStore.currentUser) return false
  return event.value.organizer?.id === userStore.currentUser.id
})

const canEdit = computed(() => {
  return isOrganizer.value || userStore.currentUser?.role === 'ADMIN'
})

const canDelete = computed(() => {
  return isOrganizer.value || userStore.currentUser?.role === 'ADMIN'
})

const canEditOrDelete = computed(() => {
  return canEdit.value || canDelete.value
})

const organizerAvatarUrl = computed(() => {
  if (!event.value?.organizer?.avatarPath) {
    return 'https://as2.ftcdn.net/jpg/03/31/69/91/1000_F_331699188_lRpvqxO5QRtwOM05gR50ImaaJgBx68vi.jpg'
  }
  return getFileUrl(event.value.organizer.avatarPath)
})

function formatDateTime(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getParticipantAvatarUrl(participant) {
  if (!participant?.avatarPath) {
    return 'https://as2.ftcdn.net/jpg/03/31/69/91/1000_F_331699188_lRpvqxO5QRtwOM05gR50ImaaJgBx68vi.jpg'
  }
  return getFileUrl(participant.avatarPath)
}

function goToOrganizerProfile() {
  if (event.value?.organizer?.id) {
    router.push(`/users/${event.value.organizer.id}`)
  }
}

function goToParticipantProfile(participantId) {
  if (participantId) {
    router.push(`/users/${participantId}`)
  }
}

async function handleJoin() {
  if (!isAuthenticated.value) {
    router.push('/login')
    return
  }
  
  try {
    await eventStore.joinEvent(event.value.id)
    await loadEvent()
  } catch (err) {
    alert(err.message || 'Не удалось присоединиться к событию')
  }
}

async function handleLeave() {
  try {
    await eventStore.leaveEvent(event.value.id)
    await loadEvent()
  } catch (err) {
    alert(err.message || 'Не удалось отменить участие')
  }
}

function handleEdit() {
  if (event.value?.id) {
    router.push(`/events/${event.value.id}/edit`)
  }
}

async function handleDelete() {
  if (!confirm('Вы уверены, что хотите удалить это событие?')) {
    return
  }
  
  try {
    await eventStore.deleteEvent(event.value.id)
    router.push('/events')
  } catch (err) {
    alert(err.message || 'Не удалось удалить событие')
  }
}

function goBack() {
  router.back()
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
    event.value = await eventStore.getEventById(Number(eventId))
  } catch (err) {
    error.value = err.message || 'Не удалось загрузить данные события'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (isAuthenticated.value) {
    try {
      await userStore.getCurrentUser()
    } catch (err) {
      console.error('Ошибка при загрузке текущего пользователя:', err)
    }
  }
  await loadEvent()
})
</script>

<style scoped>
.event-detail-page {
  min-height: 100vh;
  background-color: #f7f7f7;
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

.event-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 5%;
}

.event-header {
  margin-bottom: 40px;
}

.back-button-header {
  background: none;
  border: none;
  color: #ff6600;
  font-size: 16px;
  cursor: pointer;
  padding: 10px 0;
  margin-bottom: 20px;
}

.back-button-header:hover {
  text-decoration: underline;
}

.event-header h1 {
  font-size: 42px;
  margin: 0;
  color: #222;
}

.event-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
}

.event-main-info {
  background-color: white;
  border-radius: 8px;
  padding: 40px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.event-description {
  margin-bottom: 30px;
}

.event-description h2 {
  font-size: 28px;
  margin: 0 0 15px 0;
  color: #222;
}

.event-description p {
  color: #666;
  line-height: 1.8;
  font-size: 16px;
}

.event-details {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: bold;
  color: #666;
}

.detail-value {
  color: #222;
}

.event-organizer {
  margin-bottom: 30px;
  padding-top: 30px;
  border-top: 1px solid #eee;
}

.event-organizer h3 {
  font-size: 24px;
  margin: 0 0 20px 0;
  color: #222;
}

.organizer-info {
  display: flex;
  gap: 15px;
  align-items: center;
  transition: opacity 0.2s;
}

.organizer-info:hover {
  opacity: 0.8;
}

.organizer-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.organizer-details {
  flex: 1;
}

.organizer-name {
  font-size: 18px;
  font-weight: bold;
  margin: 0 0 5px 0;
  color: #222;
}

.organizer-email {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.event-actions {
  padding-top: 30px;
  border-top: 1px solid #eee;
}

.join-button,
.leave-button {
  width: 100%;
  padding: 15px;
  font-size: 18px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-bottom: 15px;
}

.join-button {
  background-color: #ff6600;
  color: white;
}

.join-button:hover {
  background-color: #e55a00;
}

.leave-button {
  background-color: #6c757d;
  color: white;
}

.leave-button:hover {
  background-color: #5a6268;
}

.admin-actions {
  display: flex;
  gap: 10px;
}

.edit-button,
.delete-button {
  flex: 1;
  padding: 12px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.edit-button {
  background-color: #4caf50;
  color: white;
}

.edit-button:hover {
  background-color: #45a049;
}

.delete-button {
  background-color: #f44336;
  color: white;
}

.delete-button:hover {
  background-color: #da190b;
}

.auth-message {
  padding: 20px;
  background-color: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 15px;
}

.auth-message p {
  margin: 0;
  color: #856404;
  font-size: 16px;
}

.login-link {
  color: #ff6600;
  font-weight: bold;
  text-decoration: none;
}

.login-link:hover {
  text-decoration: underline;
}

.event-participants-section {
  background-color: white;
  border-radius: 8px;
  padding: 40px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  height: fit-content;
  position: sticky;
  top: 20px;
}

.event-participants-section h3 {
  font-size: 24px;
  margin: 0 0 20px 0;
  color: #222;
}

.empty-participants {
  text-align: center;
  padding: 40px 20px;
  color: #666;
}

.participants-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.participant-item {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.participant-item:hover {
  background-color: #f9f9f9;
}

.participant-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.participant-info {
  flex: 1;
}

.participant-name {
  font-size: 16px;
  font-weight: bold;
  margin: 0 0 5px 0;
  color: #222;
}

.participant-email {
  font-size: 14px;
  color: #666;
  margin: 0;
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

@media (max-width: 968px) {
  .event-content {
    grid-template-columns: 1fr;
  }
  
  .event-participants-section {
    position: static;
  }
}

@media (max-width: 768px) {
  .event-detail {
    padding: 20px;
  }

  .event-header h1 {
    font-size: 28px;
  }

  .event-description h2 {
    font-size: 20px;
  }

  .event-description p {
    font-size: 15px;
  }

  .detail-item {
    flex-direction: column;
    gap: 5px;
    align-items: flex-start;
  }

  .detail-label {
    font-size: 14px;
  }

  .detail-value {
    font-size: 16px;
  }

  .organizer-info {
    flex-direction: column;
    text-align: center;
  }

  .organizer-avatar {
    width: 80px;
    height: 80px;
  }

  .participants-grid {
    grid-template-columns: 1fr;
  }

  .admin-actions {
    flex-direction: column;
  }

  .edit-button,
  .delete-button {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .event-header h1 {
    font-size: 24px;
  }

  .event-description h2 {
    font-size: 18px;
  }

  .participate-button {
    font-size: 16px;
    padding: 12px 20px;
  }
}
</style>

