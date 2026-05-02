<template>
  <div class="verification-page">
    <section class="verification-header">
      <h1>Верификация</h1>
      <p>Верификация проектов и пользователей</p>
    </section>

    <section class="verification-content">
      <div class="tabs">
        <button 
          @click="activeTab = 'projects'" 
          :class="{ active: activeTab === 'projects' }"
          class="tab-button"
        >
          Проекты
        </button>
        <button 
          @click="activeTab = 'users'" 
          :class="{ active: activeTab === 'users' }"
          class="tab-button"
        >
          Пользователи
        </button>
      </div>

      <div v-if="loading" class="loading">
        <p>Загрузка данных...</p>
      </div>

      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
      </div>

      <div v-else>
        <div v-if="activeTab === 'projects'" class="tab-content">
          <h2>Проекты, требующие верификации</h2>
          <div v-if="unverifiedProjects.length === 0" class="empty-state">
            <p>Все проекты верифицированы</p>
          </div>
          <div v-else class="items-grid">
            <div v-for="project in unverifiedProjects" :key="project.id" class="verification-card">
              <div class="card-header">
                <h3>{{ project.title }}</h3>
                <span class="status-badge unverified">Не верифицирован</span>
              </div>
              <p class="card-description">{{ project.description }}</p>
              <div class="card-info">
                <div class="info-item">
                  <span class="info-label">Автор:</span>
                  <span class="info-value">{{ project.author?.fullName || 'Не указан' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Категория:</span>
                  <span class="info-value">{{ project.category?.name || 'Без категории' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Цель:</span>
                  <span class="info-value">{{ formatKZT(project.targetAmount) }}</span>
                </div>
              </div>
              <div class="card-actions">
                <button @click="viewProject(project.id)" class="view-button">Просмотреть</button>
                <button @click="verifyProject(project.id)" class="verify-button">Верифицировать</button>
              </div>
            </div>
          </div>

          <div v-if="verifiedProjects.length > 0" class="verified-section">
            <h2>Верифицированные проекты</h2>
            <div class="items-grid">
              <div v-for="project in verifiedProjects" :key="project.id" class="verification-card verified">
                <div class="card-header">
                  <h3>{{ project.title }}</h3>
                  <span class="status-badge verified">✓ Верифицирован</span>
                </div>
                <p class="card-description">{{ project.description }}</p>
                <div class="card-info">
                  <div class="info-item">
                    <span class="info-label">Автор:</span>
                    <span class="info-value">{{ project.author?.fullName || 'Не указан' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Категория:</span>
                    <span class="info-value">{{ project.category?.name || 'Без категории' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Цель:</span>
                    <span class="info-value">{{ formatKZT(project.targetAmount) }}</span>
                  </div>
                </div>
                <div class="card-actions">
                  <button @click="viewProject(project.id)" class="view-button">Просмотреть</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'users'" class="tab-content">
          <h2>Пользователи, требующие верификации</h2>
          <div v-if="unverifiedUsers.length === 0" class="empty-state">
            <p>Все пользователи верифицированы</p>
          </div>
          <div v-else class="items-grid">
            <div v-for="user in unverifiedUsers" :key="user.id" class="verification-card">
              <div class="card-header">
                <div class="user-header-info">
                  <img 
                    :src="getUserAvatarUrl(user)" 
                    :alt="user.fullName" 
                    class="user-avatar-small"
                  />
                  <div>
                    <h3>{{ user.fullName }}</h3>
                    <p class="user-email">{{ user.email }}</p>
                  </div>
                </div>
                <span class="status-badge unverified">Не верифицирован</span>
              </div>
              <div class="card-info">
                <div class="info-item">
                  <span class="info-label">Роль:</span>
                  <span class="info-value">{{ getRoleDisplay(user.role) }}</span>
                </div>
                <div class="info-item" v-if="user.docPath">
                  <span class="info-label">Документ:</span>
                  <a :href="getDocumentUrl(user)" target="_blank" class="document-link">Просмотреть</a>
                </div>
              </div>
              <div class="card-actions">
                <button @click="viewUser(user.id)" class="view-button">Просмотреть профиль</button>
                <button @click="verifyUser(user.id)" class="verify-button">Верифицировать</button>
              </div>
            </div>
          </div>

          <div v-if="verifiedUsers.length > 0" class="verified-section">
            <h2>Верифицированные пользователи</h2>
            <div class="items-grid">
              <div v-for="user in verifiedUsers" :key="user.id" class="verification-card verified">
                <div class="card-header">
                  <div class="user-header-info">
                    <img 
                      :src="getUserAvatarUrl(user)" 
                      :alt="user.fullName" 
                      class="user-avatar-small"
                    />
                    <div>
                      <h3>{{ user.fullName }}</h3>
                      <p class="user-email">{{ user.email }}</p>
                    </div>
                  </div>
                  <span class="status-badge verified">✓ Верифицирован</span>
                </div>
                <div class="card-info">
                  <div class="info-item">
                    <span class="info-label">Роль:</span>
                    <span class="info-value">{{ getRoleDisplay(user.role) }}</span>
                  </div>
                </div>
                <div class="card-actions">
                  <button @click="viewUser(user.id)" class="view-button">Просмотреть профиль</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectStore } from '../../stores/useProjectStore'
import { useUserStore } from '../../stores/useUserStore'
import { getFileUrl } from '../../utils/backendUrl'

const router = useRouter()
const projectStore = useProjectStore()
const userStore = useUserStore()

const activeTab = ref('projects')
const loading = ref(false)
const error = ref('')

const unverifiedProjects = computed(() => {
  return projectStore.projects.filter(p => {
    const verified = p.isVerified !== undefined ? p.isVerified : p.verified
    return !verified
  })
})

const verifiedProjects = computed(() => {
  return projectStore.projects.filter(p => {
    const verified = p.isVerified !== undefined ? p.isVerified : p.verified
    return verified
  })
})

const unverifiedUsers = computed(() => {
  return userStore.users.filter(u => {
    const verified = u.isVerified !== undefined ? u.isVerified : u.verified
    return !verified
  })
})

const verifiedUsers = computed(() => {
  return userStore.users.filter(u => {
    const verified = u.isVerified !== undefined ? u.isVerified : u.verified
    return verified
  })
})

function formatKZT(amount) {
  const value = amount || 0
  return `${value.toLocaleString('ru-RU')} KZT`
}

function getRoleDisplay(role) {
  const roleMap = {
    'DONOR': 'Донор',
    'NEEDS_HELP': 'Нуждающийся',
    'ADMIN': 'Администратор'
  }
  return roleMap[role] || role || 'Не указано'
}

function getUserAvatarUrl(user) {
  if (!user?.avatarPath) {
    return 'https://as2.ftcdn.net/jpg/03/31/69/91/1000_F_331699188_lRpvqxO5QRtwOM05gR50ImaaJgBx68vi.jpg'
  }
  return getFileUrl(user.avatarPath)
}

function getDocumentUrl(user) {
  if (!user?.docPath) return ''
  return getFileUrl(user.docPath)
}

async function loadData() {
  loading.value = true
  error.value = ''
  try {
    await Promise.all([
      projectStore.getAllProjectsForAdmin(), // Используем метод для администраторов, чтобы получить все проекты
      userStore.getAllUsers()
    ])
  } catch (err) {
    error.value = err.message || 'Не удалось загрузить данные'
  } finally {
    loading.value = false
  }
}

async function verifyProject(projectId) {
  try {
    await projectStore.verifyProject(projectId)
    await loadData()
  } catch (err) {
    error.value = err.message || 'Не удалось верифицировать проект'
  }
}

async function verifyUser(userId) {
  try {
    const verifiedUser = await userStore.verifyUser(userId)
    await nextTick()
    await userStore.getAllUsers()
  } catch (err) {
    error.value = err.message || 'Не удалось верифицировать пользователя'
  }
}

function viewProject(projectId) {
  router.push(`/projects/${projectId}`)
}

function viewUser(userId) {
  router.push(`/users/${userId}`)
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.verification-page {
  min-height: 100vh;
  background-color: #f7f7f7;
}

.verification-header {
  background-color: #222;
  color: white;
  text-align: center;
  padding: 60px 5%;
}

.verification-header h1 {
  font-size: 42px;
  margin: 0 0 10px 0;
  color: white;
}

.verification-header p {
  font-size: 18px;
  color: #ccc;
  margin: 0;
}

.verification-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 5%;
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  border-bottom: 2px solid #ddd;
}

.tab-button {
  padding: 12px 30px;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  font-size: 16px;
  font-weight: bold;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: -2px;
}

.tab-button:hover {
  color: #ff6600;
}

.tab-button.active {
  color: #ff6600;
  border-bottom-color: #ff6600;
}

.tab-content h2 {
  font-size: 28px;
  color: #222;
  margin: 0 0 25px 0;
}

.loading,
.error,
.empty-state {
  text-align: center;
  padding: 60px 20px;
  font-size: 18px;
  color: #666;
}

.error {
  color: #d32f2f;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
}

.verification-card {
  background-color: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.verification-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.verification-card.verified {
  border-left: 4px solid #4caf50;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.user-header-info {
  display: flex;
  gap: 12px;
  align-items: center;
  flex: 1;
}

.user-avatar-small {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ff6600;
}

.user-email {
  font-size: 14px;
  color: #666;
  margin: 5px 0 0 0;
}

.card-header h3 {
  font-size: 20px;
  color: #222;
  margin: 0;
}

.card-description {
  color: #666;
  line-height: 1.6;
  margin: 0 0 15px 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.status-badge {
  padding: 5px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  white-space: nowrap;
}

.status-badge.verified {
  background-color: #4caf50;
  color: white;
}

.status-badge.unverified {
  background-color: #ff9800;
  color: white;
}

.card-info {
  margin: 15px 0;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-label {
  font-weight: bold;
  color: #666;
}

.info-value {
  color: #222;
}

.document-link {
  color: #ff6600;
  text-decoration: none;
}

.document-link:hover {
  text-decoration: underline;
}

.card-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.view-button,
.verify-button {
  flex: 1;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.view-button {
  background-color: #6c757d;
  color: white;
}

.view-button:hover {
  background-color: #5a6268;
}

.verify-button {
  background-color: #4caf50;
  color: white;
}

.verify-button:hover {
  background-color: #45a049;
}

.verified-section {
  margin-top: 50px;
  padding-top: 30px;
  border-top: 2px solid #eee;
}

@media (max-width: 768px) {
  .items-grid {
    grid-template-columns: 1fr;
  }

  .card-actions {
    flex-direction: column;
  }

  .view-button,
  .verify-button {
    width: 100%;
  }
}
</style>

