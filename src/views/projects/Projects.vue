<template>
  <div class="projects-page">
    <section class="projects-header">
      <div class="header-content">
        <div>
          <h1>Все проекты</h1>
          <p>Выберите проект, которому хотите помочь</p>
        </div>
        <button
          v-if="canCreateProject"
          @click="goToCreateProject"
          class="create-project-button"
        >
          Создать проект
        </button>
      </div>
    </section>

    <section class="projects-section">
      <div v-if="loading" class="loading">
        <p>Загрузка проектов...</p>
      </div>
      
      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
      </div>

      <div v-else-if="formattedProjects.length === 0" class="empty">
        <p>Проекты не найдены</p>
      </div>

      <!-- Сетка активных проектов (цель не достигнута) -->
      <div v-else class="projects-grid">
        <ProjectCard 
          v-for="project in formattedProjects" 
          :key="project.id"
          :project="project"
          @donate="handleDonate"
        />
      </div>

      <!-- Блок завершённых проектов -->
      <div v-if="!loading && !error && completedProjects.length > 0" class="completed-section">
        <button class="toggle-completed-btn" @click="showCompleted = !showCompleted">
          {{ showCompleted ? '▲ Скрыть' : '▼ Показать' }} завершённые проекты ({{ completedProjects.length }})
        </button>
        <div v-if="showCompleted" class="projects-grid completed-grid">
          <ProjectCard 
            v-for="project in completedProjects" 
            :key="project.id"
            :project="project"
            @donate="handleDonate"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectStore } from '../../stores/useProjectStore'
import { useUserStore } from '../../stores/useUserStore'
import ProjectCard from '../../components/ProjectCard.vue'
import { getFileUrl } from '../../utils/backendUrl'

const router = useRouter()
const projectStore = useProjectStore()
const userStore = useUserStore()
const loading = ref(false)
const error = ref('')
// Управляет видимостью блока завершённых проектов
const showCompleted = ref(false)

const canCreateProject = computed(() => {
  const role = userStore.currentUser?.role
  const isVerified = userStore.currentUser?.isVerified !== undefined 
    ? userStore.currentUser.isVerified 
    : userStore.currentUser?.verified
  
  if (role === 'ADMIN') {
    return true
  }
  
  if (role === 'NEEDS_HELP') {
    return isVerified === true
  }
  
  return false
})

/**
 * formattedProjects — только активные (незавершённые) проекты.
 * Проект считается завершённым, если collectedAmount >= targetAmount
 * (и targetAmount задан и > 0).
 */
const formattedProjects = computed(() => {
  return projectStore.projects
    // Оставляем только активные проекты
    .filter(project => !projectStore.isProjectCompleted(project))
    .map(project => mapProjectImages(project))
})

/**
 * completedProjects — отдельный список проектов, достигших цели.
 * Они не скрываются полностью, а сворачиваются под кнопку.
 */
const completedProjects = computed(() => {
  return projectStore.projects
    .filter(project => projectStore.isProjectCompleted(project))
    .map(project => mapProjectImages(project))
})

/** Общая функция маппинга изображений проекта */
function mapProjectImages(project) {
  const images = []
  if (project.imagePaths && project.imagePaths.length > 0) {
    project.imagePaths.forEach(imagePath => {
      images.push(getFileUrl(imagePath))
    })
  }
  if (images.length === 0) {
    images.push('/placeholder.jpg')
  }
  return {
    ...project,
    images,
    image: images[0],
    alt: project.title || 'Проект'
  }
}

async function loadProjects() {
  loading.value = true
  error.value = ''
  try {
    await projectStore.getAllProjects()
  } catch (err) {
    error.value = err.message || 'Не удалось загрузить проекты'
  } finally {
    loading.value = false
  }
}

function handleDonate(project) {
  // Навигация на страницу пожертвования для выбранного проекта
  router.push(`/projects/${project.id}/donate`)
}

function goToCreateProject() {
  router.push('/projects/create')
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
    loadProjects(),
    loadCurrentUser()
  ])
})
</script>

<style scoped>
.projects-page {
  min-height: 100vh;
  background-color: #f7f7f7;
}

.projects-header {
  background-color: #222;
  color: white;
  padding: 60px 5%;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
}

.header-content > div {
  text-align: left;
}

.projects-header h1 {
  font-size: 42px;
  margin-bottom: 10px;
  color: white;
}

.projects-header p {
  font-size: 18px;
  color: #ccc;
}

.create-project-button {
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

.create-project-button:hover {
  background-color: #e55a00;
}

.projects-section {
  padding: 60px 5%;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  max-width: 1400px;
  margin: 0 auto;
}

@media (max-width: 1400px) {
  .projects-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 1200px) {
  .projects-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .projects-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }
}

.loading,
.error,
.empty {
  text-align: center;
  padding: 60px 20px;
  font-size: 18px;
  color: #666;
}

.error {
  color: #d32f2f;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }

  .header-content > div {
    text-align: center;
  }

  .create-project-button {
    width: 100%;
  }
}
/* === БЛОК ЗАВЕРШЁННЫХ ПРОЕКТОВ === */
.completed-section {
  margin-top: 50px;
  padding-top: 30px;
  border-top: 2px dashed #ddd;
}

/* Кнопка раскрытия/скрытия завершённых */
.toggle-completed-btn {
  display: block;
  margin: 0 auto 30px;
  background: none;
  border: 2px solid #aaa;
  color: #555;
  padding: 10px 28px;
  border-radius: 30px;
  font-size: 15px;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
}

.toggle-completed-btn:hover {
  border-color: #ff6600;
  color: #ff6600;
}

/* Уменьшенная прозрачность завершённых карточек */
.completed-grid {
  opacity: 0.75;
}
</style>

