<template>
  <div class="project-detail-page">
    <div v-if="loading" class="loading">
      <p>Загрузка проекта...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="goBack" class="back-button">Вернуться назад</button>
    </div>

    <div v-else-if="project" class="project-detail">
      <div class="project-header">
        <button @click="goBack" class="back-button-header">← Назад</button>
        <h1>{{ project.title }}</h1>
        <p v-if="project.category" class="project-category">#{{ project.category.name }}</p>
      </div>

      <div class="project-content">
        <div class="project-images-section">
          <div class="image-carousel" v-if="images.length > 0">
            <img :src="currentImage" :alt="project.title" class="main-image" />
            <button 
              v-if="images.length > 1"
              class="carousel-btn carousel-btn-left" 
              @click="previousImage"
              aria-label="Предыдущее изображение"
            >
              ‹
            </button>
            <button 
              v-if="images.length > 1"
              class="carousel-btn carousel-btn-right" 
              @click="nextImage"
              aria-label="Следующее изображение"
            >
              ›
            </button>
            <div v-if="images.length > 1" class="carousel-indicators">
              <span 
                v-for="(img, index) in images" 
                :key="index"
                class="indicator"
                :class="{ active: currentImageIndex === index }"
                @click="goToImage(index)"
              ></span>
            </div>
          </div>
          <div v-else class="no-image">
            <p>Изображения отсутствуют</p>
          </div>

          <div class="donations-history">
            <h3>История пожертвований</h3>
            <div v-if="donationsLoading" class="loading-donations">
              <p>Загрузка истории...</p>
            </div>
            <div v-else-if="donationsError" class="error-donations">
              <p>{{ donationsError }}</p>
            </div>
            <div v-else-if="donations.length === 0" class="empty-donations">
              <p>Пожертвований пока нет</p>
            </div>
            <div v-else class="donations-list">
              <div
                v-for="donation in donations"
                :key="donation.id"
                class="donation-item"
              >
                <div class="donation-donor" @click="goToDonorProfile(donation.donor.id)" style="cursor: pointer;">
                  <img 
                    :src="getDonorAvatarUrl(donation.donor)" 
                    :alt="donation.donor.fullName" 
                    class="donor-avatar"
                  />
                  <div class="donor-info">
                    <p class="donor-name">{{ donation.donor.fullName }}</p>
                    <p class="donation-date">{{ formatDate(donation.createdAt) }}</p>
                  </div>
                </div>
                <div class="donation-amount">
                  <span class="amount-value">{{ formatKZT(donation.amount) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="project-info-section">
          <div class="project-description">
            <h2>О проекте</h2>
            <p>{{ project.description }}</p>
          </div>

          <div class="project-author" v-if="project.author">
            <h3>Автор проекта</h3>
            <div class="author-info" @click="goToUserProfile" style="cursor: pointer;">
              <img 
                :src="authorAvatarUrl" 
                :alt="project.author.fullName" 
                class="author-avatar"
              />
              <div class="author-details">
                <p class="author-name">{{ project.author.fullName }}</p>
                <p class="author-email">{{ project.author.email }}</p>
                <span v-if="isAuthorVerified" class="verified-badge">✓ Верифицирован</span>
              </div>
            </div>
          </div>

          <div class="project-progress">
            <h3>Прогресс сбора</h3>
            <div class="progress-stats">
              <div class="stat-item">
                <span class="stat-label">Собрано:</span>
                <span class="stat-value collected">{{ formatKZT(project.collectedAmount) }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Цель:</span>
                <span class="stat-value target">{{ formatKZT(project.targetAmount) }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Прогресс:</span>
                <span class="stat-value progress">{{ progressPercentage }}%</span>
              </div>
            </div>
            <div class="progress-bar-container">
              <div class="progress-bar" :style="{ width: progressPercentage + '%' }"></div>
            </div>
          </div>

          <div class="project-actions">
            <button v-if="isAuthenticated && isDonor && !isProjectFullyFunded" @click="handleDonate" class="donate-button">Помочь</button>
            <div v-if="isProjectFullyFunded" class="fully-funded-message">
              <p>🎉 Проект полностью профинансирован! Спасибо всем донорам!</p>
            </div>
            <div v-if="!isAuthenticated && !isProjectFullyFunded" class="auth-message">
              <p>Чтобы помочь проекту или создать свой, пожалуйста, <router-link to="/login" class="login-link">войдите</router-link> в систему</p>
            </div>
            <div v-if="canEditOrDelete" class="admin-actions">
              <button v-if="canEdit" @click="handleEdit" class="edit-button">Изменить проект</button>
              <button v-if="canDelete" @click="handleDelete" class="delete-button">Удалить проект</button>
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
import { useProjectStore } from '../../stores/useProjectStore'
import { useUserStore } from '../../stores/useUserStore'
import { useDonationStore } from '../../stores/useDonationStore'
import { useAuthStore } from '../../stores/useAuthStore'
import { getFileUrl } from '../../utils/backendUrl'

const route = useRoute()
const router = useRouter()
const projectStore = useProjectStore()
const userStore = useUserStore()
const donationStore = useDonationStore()
const authStore = useAuthStore()

const isAuthenticated = computed(() => !!authStore.authData?.token)

const isDonor = computed(() => {
  return userStore.currentUser?.role === 'DONOR'
})

const canEdit = computed(() => {
  const role = userStore.currentUser?.role
  return role === 'ADMIN' || role === 'NEEDS_HELP'
})

const canDelete = computed(() => {
  return userStore.currentUser?.role === 'ADMIN'
})

const canEditOrDelete = computed(() => {
  return canEdit.value || canDelete.value
})

const isAuthorVerified = computed(() => {
  if (!project.value?.author) return false
  const author = project.value.author
  const verified = author.isVerified !== undefined ? author.isVerified : author.verified
  return verified === true
})

const loading = ref(false)
const error = ref('')
const currentImageIndex = ref(0)
const donations = ref([])
const donationsLoading = ref(false)
const donationsError = ref('')

const project = computed(() => projectStore.currentProject)

const images = computed(() => {
  if (!project.value?.imagePaths || project.value.imagePaths.length === 0) {
    return []
  }
  return project.value.imagePaths.map(imagePath => getFileUrl(imagePath))
})

const currentImage = computed(() => {
  if (images.value.length === 0) return ''
  return images.value[currentImageIndex.value]
})

const authorAvatarUrl = computed(() => {
  if (!project.value?.author?.avatarPath) {
    return 'https://as2.ftcdn.net/jpg/03/31/69/91/1000_F_331699188_lRpvqxO5QRtwOM05gR50ImaaJgBx68vi.jpg'
  }
  return getFileUrl(project.value.author.avatarPath)
})

const progressPercentage = computed(() => {
  if (!project.value?.targetAmount || project.value.targetAmount === 0) {
    return 0
  }
  const percentage = (project.value.collectedAmount / project.value.targetAmount) * 100
  return Math.min(Math.round(percentage), 100)
})

const isProjectFullyFunded = computed(() => {
  if (!project.value?.targetAmount || project.value.targetAmount === 0) {
    return false
  }
  return project.value.collectedAmount >= project.value.targetAmount
})

function nextImage() {
  if (images.value.length > 1) {
    currentImageIndex.value = (currentImageIndex.value + 1) % images.value.length
  }
}

function previousImage() {
  if (images.value.length > 1) {
    currentImageIndex.value = currentImageIndex.value === 0 
      ? images.value.length - 1 
      : currentImageIndex.value - 1
  }
}

function goToImage(index) {
  currentImageIndex.value = index
}

const formatKZT = (amount) => {
  const value = amount || 0
  return `${value.toLocaleString('ru-RU')} KZT`
}

function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getDonorAvatarUrl(donor) {
  if (!donor?.avatarPath) {
    return 'https://as2.ftcdn.net/jpg/03/31/69/91/1000_F_331699188_lRpvqxO5QRtwOM05gR50ImaaJgBx68vi.jpg'
  }
  return getFileUrl(donor.avatarPath)
}

async function loadProject() {
  const projectId = route.params.id
  if (!projectId) {
    error.value = 'ID проекта не указан'
    return
  }

  loading.value = true
  error.value = ''
  try {
    await projectStore.getProjectById(projectId)
    await loadDonations(projectId)
  } catch (err) {
    error.value = err.message || 'Не удалось загрузить проект'
  } finally {
    loading.value = false
  }
}

async function loadDonations(projectId) {
  donationsLoading.value = true
  donationsError.value = ''
  try {
    const donationsData = await donationStore.getProjectDonations(projectId)
    donations.value = donationsData
  } catch (err) {
    donationsError.value = err.message || 'Не удалось загрузить историю пожертвований'
  } finally {
    donationsLoading.value = false
  }
}

function handleDonate() {
  if (isProjectFullyFunded.value) {
    return
  }
  router.push(`/projects/${project.value.id}/donate`)
}

function goToUserProfile() {
  if (project.value?.author?.id) {
    router.push(`/users/${project.value.author.id}`)
  }
}

function goToDonorProfile(donorId) {
  if (donorId) {
    router.push(`/users/${donorId}`)
  }
}

function goBack() {
  router.back()
}

function handleEdit() {
  router.push(`/projects/${project.value.id}/edit`)
}

async function handleDelete() {
  if (!confirm('Вы уверены, что хотите удалить этот проект?')) {
    return
  }

  try {
    await projectStore.deleteProject(project.value.id)
    router.push('/projects')
  } catch (err) {
    alert(err.message || 'Не удалось удалить проект')
  }
}

onMounted(async () => {
  await loadProject()
  if (userStore.currentUser === null) {
    try {
      await userStore.getCurrentUser()
    } catch (err) {
      console.log('User not authenticated')
    }
  }
})
</script>

<style scoped>
.project-detail-page {
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

.project-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 5%;
}

.project-header {
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
  transition: opacity 0.3s;
}

.back-button-header:hover {
  opacity: 0.8;
}

.project-header h1 {
  font-size: 42px;
  color: #222;
  margin: 0 0 10px 0;
}

.project-category {
  color: #ff6600;
  font-size: 18px;
  margin: 0;
}

.project-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.project-images-section {
  position: relative;
}

.image-carousel {
  position: relative;
  width: 100%;
  aspect-ratio: 4/3;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 28px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
  z-index: 2;
}

.carousel-btn:hover {
  background-color: rgba(0, 0, 0, 0.7);
}

.carousel-btn-left {
  left: 15px;
}

.carousel-btn-right {
  right: 15px;
}

.carousel-indicators {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 2;
}

.indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: background-color 0.3s;
}

.indicator.active {
  background-color: white;
}

.indicator:hover {
  background-color: rgba(255, 255, 255, 0.8);
}

.no-image {
  width: 100%;
  aspect-ratio: 4/3;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #eee;
  border-radius: 8px;
  color: #666;
}

.project-info-section {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.project-description h2,
.project-author h3,
.project-progress h3 {
  font-size: 24px;
  color: #222;
  margin: 0 0 15px 0;
}

.project-description p {
  font-size: 16px;
  line-height: 1.6;
  color: #444;
  margin: 0;
}

.project-author {
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.author-info {
  display: flex;
  gap: 15px;
  align-items: center;
  transition: opacity 0.3s, transform 0.2s;
  padding: 10px;
  border-radius: 8px;
}

.author-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ff6600;
}

.author-details {
  flex: 1;
}

.author-name {
  font-size: 18px;
  font-weight: bold;
  color: #222;
  margin: 0 0 5px 0;
}

.author-email {
  font-size: 14px;
  color: #666;
  margin: 0 0 5px 0;
}

.verified-badge {
  display: inline-block;
  background-color: #4caf50;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.project-progress {
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.progress-stats {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-label {
  font-size: 16px;
  color: #666;
}

.stat-value {
  font-size: 18px;
  font-weight: bold;
}

.stat-value.collected {
  color: #4caf50;
}

.stat-value.target {
  color: #222;
}

.stat-value.progress {
  color: #ff6600;
}

.progress-bar-container {
  width: 100%;
  height: 30px;
  background-color: #eee;
  border-radius: 15px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: #ff6600;
  transition: width 0.3s;
}

.project-actions {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.donate-button {
  width: 100%;
  background-color: #ff6600;
  color: white;
  padding: 15px 30px;
  border: none;
  border-radius: 4px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.donate-button:hover {
  background-color: #e55a00;
}

.auth-message {
  padding: 20px;
  background-color: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 8px;
  text-align: center;
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

.fully-funded-message {
  padding: 30px;
  background-color: #d4edda;
  border: 2px solid #28a745;
  border-radius: 8px;
  text-align: center;
  margin: 20px 0;
}

.fully-funded-message p {
  margin: 15px 0;
  color: #155724;
  font-size: 18px;
  font-weight: 500;
}

.admin-actions {
  display: flex;
  gap: 10px;
}

.edit-button,
.delete-button {
  flex: 1;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.edit-button {
  background-color: #6c757d;
  color: white;
}

.edit-button:hover {
  background-color: #5a6268;
}

.delete-button {
  background-color: #dc3545;
  color: white;
}

  .delete-button:hover {
    background-color: #c82333;
  }

  .donations-history {
    margin-top: 30px;
    padding: 20px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  .donations-history h3 {
    font-size: 24px;
    color: #222;
    margin: 0 0 20px 0;
  }

  .loading-donations,
  .error-donations,
  .empty-donations {
    text-align: center;
    padding: 30px 20px;
    color: #666;
    font-size: 16px;
  }

  .error-donations {
    color: #d32f2f;
  }

  .donations-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .donation-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    background-color: #f9f9f9;
    border-radius: 8px;
    border: 1px solid #eee;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .donation-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .donation-donor {
    display: flex;
    gap: 12px;
    align-items: center;
    flex: 1;
    transition: opacity 0.2s;
  }

  .donation-donor:hover {
    opacity: 0.8;
  }

  .donor-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #ff6600;
  }

  .donor-info {
    flex: 1;
  }

  .donor-name {
    font-size: 16px;
    font-weight: bold;
    color: #222;
    margin: 0 0 5px 0;
  }

  .donation-date {
    font-size: 14px;
    color: #666;
    margin: 0;
  }

  .donation-amount {
    text-align: right;
  }

  .amount-value {
    font-size: 18px;
    font-weight: bold;
    color: #4caf50;
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
  .project-detail {
    padding: 20px;
  }

  .project-content {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .project-header h1 {
    font-size: 28px;
  }

  .project-category {
    font-size: 16px;
  }

  .image-carousel {
    aspect-ratio: 16/9;
  }

  .carousel-btn {
    width: 40px;
    height: 40px;
    font-size: 24px;
  }

  .carousel-btn-left {
    left: 10px;
  }

  .carousel-btn-right {
    right: 10px;
  }

  .project-description h2,
  .project-author h3,
  .project-progress h3 {
    font-size: 20px;
  }

  .project-description p {
    font-size: 15px;
  }

  .author-info {
    flex-direction: column;
    text-align: center;
  }

  .author-avatar {
    width: 80px;
    height: 80px;
  }

  .admin-actions {
    flex-direction: column;
  }

  .edit-button,
  .delete-button {
    width: 100%;
  }

  .donations-history {
    margin-top: 20px;
    padding: 15px;
  }

  .donations-history h3 {
    font-size: 20px;
  }

  .donation-item {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .donation-amount {
    width: 100%;
    text-align: left;
    padding-top: 10px;
    border-top: 1px solid #eee;
  }
}

@media (max-width: 480px) {
  .project-header h1 {
    font-size: 24px;
  }

  .project-description h2,
  .project-author h3,
  .project-progress h3 {
    font-size: 18px;
  }

  .carousel-btn {
    width: 35px;
    height: 35px;
    font-size: 20px;
  }

  .stat-label,
  .stat-value {
    font-size: 14px;
  }

  .donate-button {
    font-size: 16px;
    padding: 12px 20px;
  }
}
</style>

