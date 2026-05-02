<template>
  <div class="profile-edit-page">
    <section class="profile-header">
      <h1>Редактирование профиля</h1>
    </section>

    <section class="profile-section">
      <div v-if="loading" class="loading">
        <p>Загрузка данных...</p>
      </div>

      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
      </div>

      <div v-else-if="user" class="edit-content">
        <form @submit.prevent="handleSubmit" class="edit-form">
          <div class="form-group avatar-group">
            <label class="form-label">Аватар</label>
            <div class="avatar-preview-section">
              <img :src="avatarPreview" :alt="formData.fullName" class="avatar-preview" />
              <input
                type="file"
                ref="avatarInput"
                @change="handleAvatarChange"
                accept="image/*"
                class="file-input"
                id="avatar-input"
              />
              <label for="avatar-input" class="file-label">Выбрать фото</label>
              <button
                v-if="avatarPreview !== defaultAvatar"
                type="button"
                @click="removeAvatar"
                class="remove-avatar-btn"
              >
                Удалить
              </button>
            </div>
          </div>

          <div class="form-group">
            <label for="fullName" class="form-label">Полное имя</label>
            <input
              type="text"
              id="fullName"
              v-model="formData.fullName"
              class="form-input"
              required
            />
          </div>

          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input
              type="email"
              id="email"
              v-model="formData.email"
              class="form-input"
              required
            />
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Новый пароль (оставьте пустым, чтобы не менять)</label>
            <input
              type="password"
              id="password"
              v-model="formData.password"
              class="form-input"
              placeholder="Введите новый пароль"
            />
          </div>

          <div class="form-group">
            <label for="role" class="form-label">Роль</label>
            <select id="role" v-model="formData.role" class="form-select" disabled>
              <option value="DONOR">Донор</option>
              <option value="NEEDS_HELP">Нуждающийся</option>
              <option value="ADMIN">Администратор</option>
            </select>
            <p class="form-hint">Роль нельзя изменить</p>
          </div>

          <div class="form-group">
            <label class="form-label">Документ</label>
            <div class="document-section">
              <input
                type="file"
                ref="documentInput"
                @change="handleDocumentChange"
                accept="application/pdf"
                class="file-input"
                id="document-input"
              />
              <label for="document-input" class="file-label">Загрузить документ (PDF)</label>
              <button
                v-if="formData.document"
                type="button"
                @click="removeDocument"
                class="remove-document-btn"
              >
                Удалить
              </button>
              <p v-if="user.docPath" class="document-info">
                Текущий документ: <a :href="documentUrl" target="_blank">Просмотреть</a>
              </p>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" @click="goBack" class="cancel-button">Отмена</button>
            <button type="submit" :disabled="saving" class="save-button">
              {{ saving ? 'Сохранение...' : 'Сохранить изменения' }}
            </button>
          </div>
        </form>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/useUserStore'
import { getFileUrl } from '../../utils/backendUrl'

const router = useRouter()
const userStore = useUserStore()

const loading = ref(false)
const saving = ref(false)
const error = ref('')
const avatarInput = ref(null)
const documentInput = ref(null)

const user = computed(() => userStore.currentUser)

const defaultAvatar = 'https://as2.ftcdn.net/jpg/03/31/69/91/1000_F_331699188_lRpvqxO5QRtwOM05gR50ImaaJgBx68vi.jpg'

const formData = ref({
  fullName: '',
  email: '',
  password: '',
  role: '',
  avatar: null,
  document: null,
})

const avatarPreview = ref(defaultAvatar)

const documentUrl = computed(() => {
  if (!user.value?.docPath) return ''
  return getFileUrl(user.value.docPath)
})

function initializeForm() {
  if (user.value) {
    formData.value = {
      fullName: user.value.fullName || '',
      email: user.value.email || '',
      password: '',
      role: user.value.role || '',
      avatar: null,
      document: null,
    }

    if (user.value.avatarPath) {
      avatarPreview.value = getFileUrl(user.value.avatarPath)
    } else {
      avatarPreview.value = defaultAvatar
    }
  }
}

function handleAvatarChange(event) {
  const file = event.target.files[0]
  if (file) {
    formData.value.avatar = file
    const reader = new FileReader()
    reader.onload = (e) => {
      avatarPreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

function removeAvatar() {
  formData.value.avatar = null
  avatarPreview.value = defaultAvatar
  if (avatarInput.value) {
    avatarInput.value.value = ''
  }
}

function handleDocumentChange(event) {
  const file = event.target.files[0]
  if (file) {
    formData.value.document = file
  }
}

function removeDocument() {
  formData.value.document = null
  if (documentInput.value) {
    documentInput.value.value = ''
  }
}

async function loadUser() {
  loading.value = true
  error.value = ''
  try {
    await userStore.getCurrentUser()
    initializeForm()
  } catch (err) {
    error.value = err.message || 'Не удалось загрузить данные пользователя'
  } finally {
    loading.value = false
  }
}

async function handleSubmit() {
  if (!user.value) return

  saving.value = true
  error.value = ''

  try {
    const updateData = {
      fullName: formData.value.fullName,
      email: formData.value.email,
      password: formData.value.password || null,
      role: formData.value.role,
      avatar: formData.value.avatar,
      document: formData.value.document,
    }

    await userStore.updateUser(user.value.id, updateData)
    router.push('/profile')
  } catch (err) {
    error.value = err.message || 'Не удалось сохранить изменения'
  } finally {
    saving.value = false
  }
}

function goBack() {
  router.push('/profile')
}

onMounted(() => {
  if (!user.value) {
    loadUser()
  } else {
    initializeForm()
  }
})
</script>

<style scoped>
.profile-edit-page {
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

.edit-content {
  background-color: white;
  border-radius: 8px;
  padding: 40px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-weight: bold;
  color: #222;
  font-size: 14px;
}

.form-input,
.form-select {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #ff6600;
}

.form-select:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.form-hint {
  font-size: 12px;
  color: #666;
  margin: 0;
}

.avatar-group {
  align-items: center;
}

.avatar-preview-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.avatar-preview {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #ff6600;
}

.file-input {
  display: none;
}

.file-label {
  background-color: #ff6600;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  text-align: center;
  display: inline-block;
}

.file-label:hover {
  background-color: #e55a00;
}

.remove-avatar-btn,
.remove-document-btn {
  background-color: #dc3545;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.remove-avatar-btn:hover,
.remove-document-btn:hover {
  background-color: #c82333;
}

.document-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.document-info {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.document-info a {
  color: #ff6600;
  text-decoration: none;
}

.document-info a:hover {
  text-decoration: underline;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.cancel-button {
  background-color: #6c757d;
  color: white;
  padding: 12px 30px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.cancel-button:hover {
  background-color: #5a6268;
}

.save-button {
  background-color: #ff6600;
  color: white;
  padding: 12px 30px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.save-button:hover:not(:disabled) {
  background-color: #e55a00;
}

.save-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>

