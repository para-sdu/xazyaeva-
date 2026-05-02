<template>
  <div class="category-detail-page">
    <section class="category-header">
      <div class="header-content">
        <div>
          <router-link to="/categories" class="back-link">← Назад к категориям</router-link>
          <h1>{{ category?.name || 'Загрузка...' }}</h1>
          <p class="category-description">{{ category?.description || '' }}</p>
        </div>
        <div v-if="isAdmin" class="admin-actions">
          <button @click="goToEdit" class="edit-button">Изменить</button>
          <button @click="handleDelete" class="delete-button">Удалить</button>
        </div>
      </div>
    </section>

    <section class="projects-section">
      <div v-if="loading" class="loading">
        <p>Загрузка...</p>
      </div>
      
      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
      </div>

      <div v-else-if="categoryProjects.length === 0" class="empty">
        <p>В этой категории пока нет проектов</p>
        <router-link to="/projects" class="browse-projects-link">Посмотреть все проекты</router-link>
      </div>

      <div v-else>
        <h2 class="projects-title">Проекты в категории ({{ categoryProjects.length }})</h2>
        <div class="projects-grid">
          <ProjectCard 
            v-for="project in formattedProjects" 
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
import { useRoute, useRouter } from 'vue-router'
import { useCategoryStore } from '../../stores/useCategoryStore'
import { useProjectStore } from '../../stores/useProjectStore'
import { useUserStore } from '../../stores/useUserStore'
import ProjectCard from '../../components/ProjectCard.vue'
import { getFileUrl } from '../../utils/backendUrl'

const route = useRoute()
const router = useRouter()
const categoryStore = useCategoryStore()
const projectStore = useProjectStore()
const userStore = useUserStore()

const category = ref(null)
const loading = ref(false)
const error = ref('')

const categoryId = computed(() => Number(route.params.id))
const isAdmin = computed(() => userStore.currentUser?.role === 'ADMIN')

const categoryProjects = computed(() => {
  if (!projectStore.projects || !category.value) {
    return []
  }
  return projectStore.projects.filter(project => {
    return project.category?.id === category.value.id || project.categoryId === category.value.id
  })
})

const formattedProjects = computed(() => {
  return categoryProjects.value.map(project => {
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
      images: images,
      image: images[0],
      alt: project.title || 'Проект'
    }
  })
})

async function loadCategory() {
  loading.value = true
  error.value = ''
  try {
    category.value = await categoryStore.getCategoryById(categoryId.value)
  } catch (err) {
    error.value = err.message || 'Не удалось загрузить категорию'
  } finally {
    loading.value = false
  }
}

async function loadProjects() {
  try {
    await projectStore.getAllProjects()
  } catch (err) {
    console.error('Ошибка при загрузке проектов:', err)
  }
}

function goToEdit() {
  router.push(`/categories/${categoryId.value}/edit`)
}

async function handleDelete() {
  if (!confirm('Вы уверены, что хотите удалить эту категорию?')) {
    return
  }

  try {
    await categoryStore.deleteCategory(categoryId.value)
    router.push('/categories')
  } catch (err) {
    error.value = err.message || 'Не удалось удалить категорию'
  }
}

function handleDonate(project) {
  router.push(`/projects/${project.id}/donate`)
}

onMounted(async () => {
  await Promise.all([
    loadCategory(),
    loadProjects()
  ])
  
  try {
    await userStore.getCurrentUser()
  } catch (err) {
    console.log('User not authenticated')
  }
})
</script>

<style scoped>
.category-detail-page {
  min-height: 100vh;
  background-color: #f7f7f7;
}

.category-header {
  background-color: #222;
  color: white;
  padding: 60px 5%;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  max-width: 1400px;
  margin: 0 auto;
  gap: 30px;
}

.back-link {
  color: #ccc;
  text-decoration: none;
  font-size: 14px;
  margin-bottom: 15px;
  display: inline-block;
  transition: color 0.3s;
}

.back-link:hover {
  color: #ff6600;
}

.category-header h1 {
  font-size: 42px;
  margin: 0 0 15px 0;
  color: white;
}

.category-description {
  font-size: 18px;
  color: #ccc;
  line-height: 1.6;
  margin: 0;
  max-width: 800px;
}

.admin-actions {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}

.edit-button,
.delete-button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
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

.projects-section {
  padding: 60px 5%;
  max-width: 1400px;
  margin: 0 auto;
}

.projects-title {
  font-size: 32px;
  color: #222;
  margin: 0 0 30px 0;
  font-weight: bold;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
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

.browse-projects-link {
  display: inline-block;
  margin-top: 20px;
  background-color: #ff6600;
  color: white;
  padding: 12px 30px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.3s;
}

.browse-projects-link:hover {
  background-color: #e55a00;
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

@media (max-width: 768px) {
  .category-header {
    padding: 40px 20px;
  }

  .header-content {
    flex-direction: column;
    gap: 20px;
  }

  .category-header h1 {
    font-size: 32px;
  }

  .category-description {
    font-size: 16px;
  }

  .admin-actions {
    width: 100%;
    flex-direction: column;
  }

  .edit-button,
  .delete-button {
    width: 100%;
  }

  .projects-section {
    padding: 40px 20px;
  }

  .projects-title {
    font-size: 24px;
  }

  .projects-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }
}
</style>

