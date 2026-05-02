<template>
  <div class="user-profile-page">
    <section class="profile-header">
      <h1>Профиль пользователя</h1>
    </section>

    <section class="profile-section">
      <div v-if="loading" class="loading">
        <p>Загрузка данных...</p>
      </div>

      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
        <button @click="goBack" class="back-button">Вернуться назад</button>
      </div>

      <div v-else-if="user" class="profile-content">
        <div class="profile-card">
          <div class="profile-avatar-section">
            <img :src="avatarUrl" :alt="user.fullName" class="profile-avatar" />
          </div>

          <div class="profile-info">
            <h2>{{ user.fullName }}</h2>
            <div class="info-row">
              <span class="info-label">Email:</span>
              <span class="info-value">{{ user.email }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Роль:</span>
              <span class="info-value">{{ roleDisplay }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Статус:</span>
              <span class="info-value" :class="{ verified: isUserVerified, unverified: !isUserVerified }">
                {{ isUserVerified ? 'Верифицирован' : 'Не верифицирован' }}
              </span>
            </div>
          </div>
        </div>

        <div class="documents-section" v-if="user.docPath && user.role === 'NEEDS_HELP'">
          <h3 class="documents-title">Документы</h3>
          <div class="document-item">
            <div class="document-info">
              <span class="document-icon">📄</span>
              <span class="document-name">Загруженный документ</span>
            </div>
            <a :href="documentUrl" target="_blank" class="document-link">Просмотреть</a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../../stores/useUserStore'
import { getFileUrl } from '../../utils/backendUrl'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const loading = ref(false)
const error = ref('')
const user = ref(null)

const avatarUrl = computed(() => {
  if (!user.value?.avatarPath) {
    return 'https://as2.ftcdn.net/jpg/03/31/69/91/1000_F_331699188_lRpvqxO5QRtwOM05gR50ImaaJgBx68vi.jpg'
  }
  return getFileUrl(user.value.avatarPath)
})

const documentUrl = computed(() => {
  if (!user.value?.docPath) return ''
  return getFileUrl(user.value.docPath)
})

const roleDisplay = computed(() => {
  const roleMap = {
    'DONOR': 'Донор',
    'NEEDS_HELP': 'Нуждающийся',
    'ADMIN': 'Администратор'
  }
  return roleMap[user.value?.role] || user.value?.role || 'Не указано'
})

const isUserVerified = computed(() => {
  if (!user.value) return false
  const verified = user.value.isVerified !== undefined ? user.value.isVerified : user.value.verified
  return verified === true
})

async function loadUser() {
  const userId = route.params.id
  if (!userId) {
    error.value = 'ID пользователя не указан'
    return
  }

  loading.value = true
  error.value = ''
  try {
    user.value = await userStore.getUserById(Number(userId))
  } catch (err) {
    error.value = err.message || 'Не удалось загрузить данные пользователя'
  } finally {
    loading.value = false
  }
}

function goBack() {
  router.back()
}

onMounted(() => {
  loadUser()
})
</script>

<style scoped>
.user-profile-page {
  min-height: 100vh;
  background-color: #f7f7f7;
}

.profile-header {
  background-color: #222;
  color: white;
  text-align: center;
  padding: 60px 5%;
}

.profile-header h1 {
  font-size: 42px;
  margin: 0;
  color: white;
}

.profile-section {
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

.profile-content {
  background-color: white;
  border-radius: 8px;
  padding: 40px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.profile-card {
  display: flex;
  gap: 40px;
  margin-bottom: 30px;
}

.profile-avatar-section {
  position: relative;
  flex-shrink: 0;
}

.profile-avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #ff6600;
}

.profile-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: #4caf50;
  color: white;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
}

.profile-info {
  flex: 1;
}

.profile-info h2 {
  font-size: 32px;
  margin: 0 0 20px 0;
  color: #222;
}

.info-row {
  display: flex;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.info-row:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.info-label {
  font-weight: bold;
  color: #666;
  min-width: 120px;
}

.info-value {
  color: #222;
}

.info-value.verified {
  color: #4caf50;
  font-weight: bold;
}

.info-value.unverified {
  color: #ff9800;
}

.documents-section {
  margin-top: 30px;
  padding-top: 30px;
  border-top: 1px solid #eee;
}

.documents-title {
  font-size: 24px;
  color: #222;
  margin: 0 0 20px 0;
}

.document-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 4px;
  border: 1px solid #eee;
}

.document-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.document-icon {
  font-size: 24px;
}

.document-name {
  color: #222;
  font-size: 16px;
}

.document-link {
  background-color: #ff6600;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  text-decoration: none;
  font-size: 14px;
  transition: background-color 0.3s;
}

.document-link:hover {
  background-color: #e55a00;
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
  .user-profile-page {
    padding: 0;
  }

  .profile-header {
    padding: 40px 20px;
  }

  .profile-header h1 {
    font-size: 28px;
  }

  .profile-section {
    padding: 30px 20px;
  }

  .profile-content {
    padding: 25px;
  }

  .profile-card {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }

  .profile-avatar {
    width: 120px;
    height: 120px;
  }

  .profile-info {
    text-align: left;
  }

  .profile-info h2 {
    font-size: 24px;
    text-align: center;
  }

  .info-row {
    flex-direction: column;
    gap: 5px;
    align-items: flex-start;
  }

  .info-label {
    min-width: auto;
    font-size: 14px;
  }

  .info-value {
    font-size: 14px;
  }

  .documents-title {
    font-size: 20px;
  }

  .document-item {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .document-link {
    width: 100%;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .profile-header h1 {
    font-size: 24px;
  }

  .profile-info h2 {
    font-size: 20px;
  }

  .profile-avatar {
    width: 100px;
    height: 100px;
  }

  .documents-title {
    font-size: 18px;
  }
}
</style>

