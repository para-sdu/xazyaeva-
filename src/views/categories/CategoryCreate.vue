<template>
  <div class="category-create-page">
    <section class="create-header">
      <h1>Создать категорию</h1>
      <p>Заполните форму для создания новой категории</p>
    </section>

    <section class="create-content">
      <form @submit.prevent="handleSubmit" class="create-form">
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

        <div v-if="error" class="error-message">
          {{ error }}
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
            :disabled="loading"
            class="submit-button"
          >
            {{ loading ? 'Создание...' : 'Создать категорию' }}
          </button>
        </div>
      </form>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCategoryStore } from '../../stores/useCategoryStore'

const router = useRouter()
const categoryStore = useCategoryStore()

const loading = ref(false)
const error = ref('')

const formData = ref({
  name: '',
  description: '',
})

async function handleSubmit() {
  loading.value = true
  error.value = ''

  try {
    await categoryStore.createCategory(formData.value)
    router.push('/categories')
  } catch (err) {
    error.value = err.message || 'Не удалось создать категорию'
  } finally {
    loading.value = false
  }
}

function goBack() {
  router.back()
}
</script>

<style scoped>
.category-create-page {
  min-height: 100vh;
  background-color: #f7f7f7;
}

.create-header {
  background-color: #222;
  color: white;
  text-align: center;
  padding: 60px 5%;
}

.create-header h1 {
  font-size: 42px;
  margin: 0 0 10px 0;
  color: white;
}

.create-header p {
  font-size: 18px;
  color: #ccc;
  margin: 0;
}

.create-content {
  max-width: 700px;
  margin: 0 auto;
  padding: 40px 5%;
}

.create-form {
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
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
  .create-form {
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

