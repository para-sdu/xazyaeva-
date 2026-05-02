<template>
  <div class="categories-page">
    <section class="categories-header">
      <div class="header-content">
        <div>
          <h1>Категории</h1>
          <p>Управление категориями проектов</p>
        </div>
        <button
          v-if="isAdmin"
          @click="goToCreateCategory"
          class="create-category-button"
        >
          Создать категорию
        </button>
      </div>
    </section>

    <section class="categories-section">
      <div v-if="loading" class="loading">
        <p>Загрузка категорий...</p>
      </div>
      
      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
      </div>

      <div v-else-if="categories.length === 0" class="empty">
        <p>Категории не найдены</p>
        <button @click="goToCreateCategory" class="create-button">
          Создать первую категорию
        </button>
      </div>

      <div v-else class="categories-grid">
        <div
          v-for="category in categories"
          :key="category.id"
          class="category-card"
          @click="goToCategoryDetail(category.id)"
        >
          <div class="card-content">
            <h3 class="category-name">{{ category.name }}</h3>
            <p class="category-description">{{ category.description }}</p>
          </div>
          <div v-if="isAdmin" class="card-actions" @click.stop>
            <button
              @click="editCategory(category.id)"
              class="edit-button"
            >
              Изменить
            </button>
            <button
              @click="deleteCategory(category.id)"
              class="delete-button"
            >
              Удалить
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCategoryStore } from '../../stores/useCategoryStore'
import { useUserStore } from '../../stores/useUserStore'

const router = useRouter()
const categoryStore = useCategoryStore()
const userStore = useUserStore()

const loading = ref(false)
const error = ref('')

const categories = computed(() => categoryStore.categories)
const isAdmin = computed(() => userStore.currentUser?.role === 'ADMIN')

async function loadCategories() {
  loading.value = true
  error.value = ''
  try {
    await categoryStore.getAllCategories()
  } catch (err) {
    error.value = err.message || 'Не удалось загрузить категории'
  } finally {
    loading.value = false
  }
}

function goToCreateCategory() {
  router.push('/categories/create')
}

function goToCategoryDetail(id) {
  router.push(`/categories/${id}`)
}

function editCategory(id) {
  router.push(`/categories/${id}/edit`)
}

async function deleteCategory(id) {
  if (!confirm('Вы уверены, что хотите удалить эту категорию?')) {
    return
  }

  try {
    await categoryStore.deleteCategory(id)
    await loadCategories()
  } catch (err) {
    error.value = err.message || 'Не удалось удалить категорию'
  }
}

onMounted(async () => {
  await loadCategories()
  try {
    await userStore.getCurrentUser()
  } catch (err) {
    console.log('User not authenticated')
  }
})
</script>

<style scoped>
.categories-page {
  min-height: 100vh;
  background-color: #f7f7f7;
}

.categories-header {
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

.categories-header h1 {
  font-size: 42px;
  margin-bottom: 10px;
  color: white;
}

.categories-header p {
  font-size: 18px;
  color: #ccc;
}

.create-category-button {
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

.create-category-button:hover {
  background-color: #e55a00;
}

.categories-section {
  padding: 60px 5%;
  max-width: 1400px;
  margin: 0 auto;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
}

.category-card {
  background-color: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
}

.category-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-content {
  margin-bottom: 20px;
}

.category-name {
  font-size: 24px;
  color: #222;
  margin: 0 0 12px 0;
  font-weight: bold;
}

.category-description {
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.card-actions {
  display: flex;
  gap: 10px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.edit-button,
.delete-button {
  flex: 1;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
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

.create-button {
  margin-top: 20px;
  background-color: #ff6600;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.create-button:hover {
  background-color: #e55a00;
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

  .create-category-button {
    width: 100%;
  }

  .categories-grid {
    grid-template-columns: 1fr;
  }

  .card-actions {
    flex-direction: column;
  }

  .edit-button,
  .delete-button {
    width: 100%;
  }
}
</style>

