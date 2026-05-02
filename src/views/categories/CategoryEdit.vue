<template>
  <div class="category-edit-page">
    <section class="edit-header">
      <h1>Изменить категорию</h1>
      <p>Обновите информацию о категории</p>
    </section>

    <section class="edit-content">
      <div v-if="loading" class="loading">
        <p>Загрузка категории...</p>
      </div>

      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
        <button @click="goBack" class="back-button">Вернуться назад</button>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="edit-form">
        <div class="form-group">
          <label for="name">Название категории *</label>
          <input
            id="name"
            v-model="formData.name"
            type="text"
            required
            placeholder="Введите название категории"
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
            placeholder="Опишите категорию"
            class="form-textarea"
          ></textarea>
        </div>

        <div v-if="submitError" class="error-message">
          {{ submitError }}
        </div>

        <div class="form-actions">
          <button
            type="button"
            @click="goBack"
            class="cancel-button"
          >
            Отмена
          </button>
          <button
            type="submit"
            :disabled="submitting"
            class="submit-button"
          >
            {{ submitting ? 'Сохранение...' : 'Сохранить изменения' }}
          </button>
        </div>
      </form>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCategoryStore } from '../../stores/useCategoryStore'

const router = useRouter()
const route = useRoute()
const categoryStore = useCategoryStore()

const loading = ref(false)
const error = ref('')
const submitting = ref(false)
const submitError = ref('')

const formData = ref({
  name: '',
  description: '',
})

async function loadCategory() {
  loading.value = true
  error.value = ''
  try {
    const category = await categoryStore.getCategoryById(route.params.id)
    formData.value = {
      name: category.name,
      description: category.description,
    }
  } catch (err) {
    error.value = err.message || 'Не удалось загрузить категорию'
  } finally {
    loading.value = false
  }
}

async function handleSubmit() {
  submitting.value = true
  submitError.value = ''

  try {
    await categoryStore.updateCategory(route.params.id, formData.value)
    router.push('/categories')
  } catch (err) {
    submitError.value = err.message || 'Не удалось обновить категорию'
  } finally {
    submitting.value = false
  }
}

function goBack() {
  router.back()
}

onMounted(() => {
  loadCategory()
})
</script>

<style scoped>
.category-edit-page {
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
  color: white;
}

.edit-header p {
  font-size: 18px;
  color: #ccc;
  margin: 0;
}

.edit-content {
  max-width: 700px;
  margin: 0 auto;
  padding: 40px 5%;
}

.edit-form {
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.loading,
.error {
  text-align: center;
  padding: 60px 20px;
  font-size: 18px;
  color: #666;
}

.error {
  color: #d32f2f;
}

.back-button {
  margin-top: 20px;
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.back-button:hover {
  background-color: #5a6268;
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #222;
  font-size: 14px;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  font-family: inherit;
  transition: border-color 0.3s;
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

.error-message {
  background-color: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 20px;
  border: 1px solid #fcc;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.cancel-button,
.submit-button {
  padding: 12px 30px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.cancel-button {
  background-color: #6c757d;
  color: white;
}

.cancel-button:hover {
  background-color: #5a6268;
}

.submit-button {
  background-color: #ff6600;
  color: white;
}

.submit-button:hover:not(:disabled) {
  background-color: #e55a00;
}

.submit-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .edit-form {
    padding: 25px;
  }

  .form-actions {
    flex-direction: column;
  }

  .cancel-button,
  .submit-button {
    width: 100%;
  }
}
</style>

