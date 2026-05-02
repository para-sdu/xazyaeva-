<template>
  <div class="project-edit-page">
    <section class="edit-header">
      <h1>Изменить проект</h1>
      <p>Обновите информацию о проекте</p>
    </section>

    <section class="edit-content">
      <div v-if="loading" class="loading">
        <p>Загрузка проекта...</p>
      </div>

      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
        <button @click="goBack" class="back-button">Вернуться назад</button>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="edit-form">
        <div class="form-group">
          <label for="title">Название проекта *</label>
          <input
            id="title"
            v-model="formData.title"
            type="text"
            required
            placeholder="Введите название проекта"
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
            placeholder="Опишите ваш проект"
            class="form-textarea"
          ></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="category">Категория</label>
            <select
              id="category"
              v-model="formData.categoryId"
              class="form-select"
            >
              <option :value="null">Выберите категорию</option>
              <option
                v-for="category in categories"
                :key="category.id"
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="targetAmount">Целевая сумма (KZT) *</label>
            <input
              id="targetAmount"
              v-model.number="formData.targetAmount"
              type="number"
              min="0"
              required
              placeholder="0"
              class="form-input"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="images">Изображения проекта</label>
          <div class="image-upload-section">
            <input
              id="images"
              type="file"
              multiple
              accept="image/*"
              @change="handleImageChange"
              class="file-input"
            />
            <div v-if="existingImages.length > 0" class="existing-images">
              <h4>Текущие изображения:</h4>
              <div class="image-list">
                <div
                  v-for="(imagePath, index) in existingImages"
                  :key="index"
                  class="image-item"
                >
                  <div class="image-preview-item">
                    <img :src="getImageUrl(imagePath)" :alt="`Image ${index + 1}`" />
                  </div>
                  <div class="image-info">
                    <span class="image-name">{{ getImageName(imagePath) }}</span>
                    <button
                      type="button"
                      @click="removeExistingImage(index)"
                      class="remove-image-btn"
                    >
                      × Удалить
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="imagePreviews.length > 0" class="new-images">
              <h4>Новые изображения:</h4>
              <div class="image-list">
                <div
                  v-for="(preview, index) in imagePreviews"
                  :key="index"
                  class="image-item"
                >
                  <div class="image-preview-item">
                    <img :src="preview.url" :alt="preview.file.name" />
                  </div>
                  <div class="image-info">
                    <span class="image-name">{{ preview.file.name }}</span>
                    <button
                      type="button"
                      @click="removeImage(index)"
                      class="remove-image-btn"
                    >
                      × Удалить
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
import { useProjectStore } from '../../stores/useProjectStore'
import { useCategoryStore } from '../../stores/useCategoryStore'
import { getFileUrl } from '../../utils/backendUrl'

const router = useRouter()
const route = useRoute()
const projectStore = useProjectStore()
const categoryStore = useCategoryStore()

const loading = ref(false)
const error = ref('')
const submitting = ref(false)
const submitError = ref('')
const categories = ref([])
const imageFiles = ref([])
const imagePreviews = ref([])
const existingImages = ref([])
const existingImageIds = ref([])
const projectAuthorId = ref(null)

const formData = ref({
  title: '',
  description: '',
  categoryId: null,
  targetAmount: null,
})

async function loadCategories() {
  try {
    await categoryStore.getAllCategories()
    categories.value = categoryStore.categories
  } catch (err) {
    console.error('Ошибка при загрузке категорий:', err)
  }
}

async function loadProject() {
  loading.value = true
  error.value = ''
  try {
    const project = await projectStore.getProjectById(route.params.id)
    formData.value = {
      title: project.title || '',
      description: project.description || '',
      categoryId: project.category?.id || null,
      targetAmount: project.targetAmount || null,
    }
    
    if (project.author?.id) {
      projectAuthorId.value = project.author.id
    }
    
    if (project.imagePaths && project.imagePaths.length > 0) {
      existingImages.value = [...project.imagePaths]
    }
    
    if (project.images && Array.isArray(project.images) && project.images.length > 0) {
      existingImageIds.value = project.images.map(img => img.id || img)
    } else if (project.imageIds && Array.isArray(project.imageIds) && project.imageIds.length > 0) {
      existingImageIds.value = [...project.imageIds]
    }
  } catch (err) {
    error.value = err.message || 'Не удалось загрузить проект'
  } finally {
    loading.value = false
  }
}

function getImageUrl(imagePath) {
  return getFileUrl(imagePath)
}

function getImageName(imagePath) {
  if (!imagePath) return 'Изображение'
  const parts = imagePath.split('/')
  return parts[parts.length - 1] || 'Изображение'
}

function handleImageChange(event) {
  const files = Array.from(event.target.files || [])
  imageFiles.value = files

  imagePreviews.value = files.map(file => ({
    file,
    url: URL.createObjectURL(file)
  }))
}

function removeImage(index) {
  imageFiles.value.splice(index, 1)
  if (imagePreviews.value[index]) {
    URL.revokeObjectURL(imagePreviews.value[index].url)
  }
  imagePreviews.value.splice(index, 1)
}

function removeExistingImage(index) {
  existingImages.value.splice(index, 1)
  if (existingImageIds.value.length > index) {
    existingImageIds.value.splice(index, 1)
  }
}

async function handleSubmit() {
  submitting.value = true
  submitError.value = ''

  try {
    const imageIds = [...existingImageIds.value]
    
    if (imageFiles.value.length > 0) {
      for (const file of imageFiles.value) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('projectId', route.params.id)

        const imageResponse = await projectStore.uploadImage(formData)
        imageIds.push(imageResponse.id)
      }
    }

    const projectData = {
      title: formData.value.title,
      description: formData.value.description,
      authorId: projectAuthorId.value,
      categoryId: formData.value.categoryId || null,
      targetAmount: formData.value.targetAmount || 0,
      imageIds: imageIds,
    }

    await projectStore.updateProject(route.params.id, projectData, [])
    router.push(`/projects/${route.params.id}`)
  } catch (err) {
    submitError.value = err.message || 'Не удалось обновить проект'
  } finally {
    submitting.value = false
  }
}

function goBack() {
  router.back()
}

onMounted(async () => {
  await Promise.all([
    loadCategories(),
    loadProject()
  ])
})
</script>

<style scoped>
.project-edit-page {
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
  max-width: 900px;
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
.form-textarea,
.form-select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  font-family: inherit;
  transition: border-color 0.3s;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #ff6600;
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.image-upload-section {
  margin-top: 10px;
}

.file-input {
  width: 100%;
  padding: 10px;
  border: 2px dashed #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
  cursor: pointer;
  transition: border-color 0.3s;
}

.file-input:hover {
  border-color: #ff6600;
}

.existing-images,
.new-images {
  margin-top: 20px;
}

.existing-images h4,
.new-images h4 {
  font-size: 16px;
  color: #222;
  margin: 0 0 15px 0;
}

.image-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.image-item {
  display: flex;
  gap: 15px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #ddd;
  align-items: center;
}

.image-preview-item {
  position: relative;
  width: 120px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #ddd;
}

.image-preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
}

.image-name {
  font-size: 14px;
  color: #222;
  word-break: break-word;
  flex: 1;
}

.remove-image-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  white-space: nowrap;
}

.remove-image-btn:hover {
  background-color: #c82333;
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
  .form-row {
    grid-template-columns: 1fr;
  }

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

