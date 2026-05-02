<template>
  <div class="donate-page">
    <section class="donate-header">
      <h1>Пожертвование</h1>
    </section>

    <section class="donate-section">
      <div v-if="loading" class="loading">
        <p>Обработка платежа...</p>
      </div>

      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
        <button @click="goBack" class="back-button">Вернуться назад</button>
      </div>

      <div v-else-if="success" class="success-container">
        <div class="success-message">
          <div class="success-icon">✓</div>
          <h2>Спасибо за ваше пожертвование!</h2>
          <p>Ваше пожертвование успешно обработано.</p>
          <div class="donation-details">
            <p><strong>Сумма:</strong> {{ formatKZT(donationAmount) }}</p>
            <p><strong>Проект:</strong> {{ projectTitle }}</p>
          </div>
          <button @click="goToProject" class="view-project-button">Посмотреть проект</button>
          <button @click="goHome" class="home-button">На главную</button>
        </div>
      </div>

      <div v-else-if="isProjectFullyFunded" class="fully-funded-container">
        <div class="fully-funded-message">
          <div class="fully-funded-icon">🎉</div>
          <h2>Проект полностью профинансирован!</h2>
          <p>Этот проект уже достиг своей цели. Спасибо всем донорам за поддержку!</p>
          <button @click="goToProject" class="view-project-button">Посмотреть проект</button>
          <button @click="goBack" class="back-button">Вернуться назад</button>
        </div>
      </div>

      <div v-else class="donate-content">
        <div class="project-summary" v-if="project">
          <h2>{{ project.title }}</h2>
          <p class="project-description">{{ project.description }}</p>
          <div class="project-progress">
            <div class="progress-info">
              <span>Собрано: {{ formatKZT(project.collectedAmount) }}</span>
              <span>Цель: {{ formatKZT(project.targetAmount) }}</span>
            </div>
            <div class="progress-bar-container">
              <div class="progress-bar" :style="{ width: progressPercentage + '%' }"></div>
            </div>
            <p class="progress-percentage">{{ progressPercentage }}%</p>
          </div>
        </div>

        <form @submit.prevent="handleSubmit" class="donate-form">
          <div class="form-group">
            <label for="amount" class="form-label">Сумма пожертвования (KZT)</label>
            <input
              type="number"
              id="amount"
              v-model.number="amount"
              class="form-input"
              min="1"
              step="1"
              required
              placeholder="Введите сумму"
            />
            <div class="quick-amounts">
              <button
                type="button"
                v-for="quickAmount in quickAmounts"
                :key="quickAmount"
                @click="setAmount(quickAmount)"
                class="quick-amount-btn"
                :class="{ active: amount === quickAmount }"
              >
                {{ formatKZT(quickAmount) }}
              </button>
            </div>
          </div>

          <div class="payment-method">
            <h3>Способ оплаты</h3>
            <div class="payment-options">
              <label class="payment-option">
                <input type="radio" v-model="paymentMethod" value="card" checked />
                <span>💳 Банковская карта</span>
              </label>
              <label class="payment-option">
                <input type="radio" v-model="paymentMethod" value="kaspi" />
                <span>📱 Kaspi QR</span>
              </label>
              <label class="payment-option">
                <input type="radio" v-model="paymentMethod" value="halyk" />
                <span>🏦 Halyk Bank</span>
              </label>
            </div>
          </div>

          <div class="payment-details" v-if="paymentMethod === 'card'">
            <div class="form-group">
              <label for="cardNumber" class="form-label">Номер карты</label>
              <input
                type="text"
                id="cardNumber"
                v-model="cardNumber"
                class="form-input"
                placeholder="0000 0000 0000 0000"
                maxlength="19"
                @input="formatCardNumber"
              />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="expiry" class="form-label">Срок действия</label>
                <input
                  type="text"
                  id="expiry"
                  v-model="expiry"
                  class="form-input"
                  placeholder="MM/YY"
                  maxlength="5"
                  @input="formatExpiry"
                />
              </div>
              <div class="form-group">
                <label for="cvv" class="form-label">CVV</label>
                <input
                  type="text"
                  id="cvv"
                  v-model="cvv"
                  class="form-input"
                  placeholder="000"
                  maxlength="3"
                />
              </div>
            </div>
            <div class="form-group">
              <label for="cardName" class="form-label">Имя на карте</label>
              <input
                type="text"
                id="cardName"
                v-model="cardName"
                class="form-input"
                placeholder="IVAN IVANOV"
              />
            </div>
          </div>

          <div class="donation-summary">
            <div class="summary-row">
              <span>Сумма пожертвования:</span>
              <span class="summary-amount">{{ formatKZT(amount || 0) }}</span>
            </div>
            <div class="summary-row total">
              <span>Итого к оплате:</span>
              <span class="summary-amount">{{ formatKZT(amount || 0) }}</span>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" @click="goBack" class="cancel-button">Отмена</button>
            <button type="submit" :disabled="!amount || amount <= 0 || processing" class="submit-button">
              {{ processing ? 'Обработка...' : 'Пожертвовать' }}
            </button>
          </div>
        </form>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectStore } from '../../stores/useProjectStore'
import { useDonationStore } from '../../stores/useDonationStore'

const route = useRoute()
const router = useRouter()
const projectStore = useProjectStore()
const donationStore = useDonationStore()

const loading = ref(false)
const processing = ref(false)
const error = ref('')
const success = ref(false)
const amount = ref(null)
const paymentMethod = ref('card')
const cardNumber = ref('')
const expiry = ref('')
const cvv = ref('')
const cardName = ref('')
const donationAmount = ref(0)
const projectTitle = ref('')

const project = computed(() => projectStore.currentProject)

const quickAmounts = [1000, 5000, 10000, 25000, 50000]

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

function formatKZT(value) {
  const num = Number(value) || 0
  return `${num.toLocaleString('ru-RU')} KZT`
}

function setAmount(value) {
  amount.value = value
}

function formatCardNumber(event) {
  let value = event.target.value.replace(/\s/g, '')
  value = value.replace(/\D/g, '')
  if (value.length > 16) value = value.slice(0, 16)
  cardNumber.value = value.match(/.{1,4}/g)?.join(' ') || value
}

function formatExpiry(event) {
  let value = event.target.value.replace(/\D/g, '')
  if (value.length > 4) value = value.slice(0, 4)
  if (value.length >= 2) {
    value = value.slice(0, 2) + '/' + value.slice(2)
  }
  expiry.value = value
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
  } catch (err) {
    error.value = err.message || 'Не удалось загрузить проект'
  } finally {
    loading.value = false
  }
}

async function handleSubmit() {
  if (isProjectFullyFunded.value) {
    error.value = 'Проект уже полностью профинансирован'
    return
  }

  if (!amount.value || amount.value <= 0) {
    error.value = 'Введите сумму пожертвования'
    return
  }

  processing.value = true
  error.value = ''

  try {
    await donationStore.createDonation(project.value.id, amount.value)
    donationAmount.value = amount.value
    projectTitle.value = project.value.title
    success.value = true
    
    await projectStore.getProjectById(project.value.id)
  } catch (err) {
    error.value = err.message || 'Не удалось обработать пожертвование'
  } finally {
    processing.value = false
  }
}

function goBack() {
  router.back()
}

function goToProject() {
  router.push(`/projects/${project.value.id}`)
}

function goHome() {
  router.push('/')
}

onMounted(() => {
  loadProject()
})
</script>

<style scoped>
.donate-page {
  min-height: 100vh;
  background-color: #f7f7f7;
}

.donate-header {
  background-color: #222;
  color: white;
  text-align: center;
  padding: 60px 5%;
}

.donate-header h1 {
  font-size: 42px;
  margin: 0;
  color: white;
}

.donate-section {
  padding: 60px 5%;
  max-width: 1400px;
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

.success-container,
.fully-funded-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.success-message,
.fully-funded-message {
  text-align: center;
  background-color: white;
  padding: 60px 40px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 500px;
}

.success-icon,
.fully-funded-icon {
  width: 80px;
  height: 80px;
  background-color: #4caf50;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  margin: 0 auto 20px;
}

.fully-funded-icon {
  background-color: #ffc107;
  font-size: 48px;
}

.fully-funded-message h2 {
  color: #222;
  margin: 0 0 10px 0;
}

.fully-funded-message p {
  color: #666;
  margin: 0 0 20px 0;
}

.success-message h2 {
  color: #222;
  margin: 0 0 10px 0;
}

.success-message p {
  color: #666;
  margin: 0 0 20px 0;
}

.donation-details {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 4px;
  margin: 20px 0;
  text-align: left;
}

.donation-details p {
  margin: 10px 0;
  color: #222;
}

.view-project-button,
.home-button {
  padding: 12px 30px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin: 10px;
  transition: background-color 0.3s;
}

.view-project-button {
  background-color: #ff6600;
  color: white;
}

.view-project-button:hover {
  background-color: #e55a00;
}

.home-button {
  background-color: #6c757d;
  color: white;
}

.home-button:hover {
  background-color: #5a6268;
}

.donate-content {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 40px;
  align-items: start;
}

.project-summary {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  height: fit-content;
  position: sticky;
  top: 20px;
}

.project-summary h2 {
  font-size: 24px;
  color: #222;
  margin: 0 0 15px 0;
}

.project-description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
}

.project-progress {
  margin-top: 20px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.progress-bar-container {
  width: 100%;
  height: 20px;
  background-color: #eee;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 5px;
}

.progress-bar {
  height: 100%;
  background-color: #ff6600;
  transition: width 0.3s;
}

.progress-percentage {
  text-align: right;
  font-size: 12px;
  color: #666;
  margin: 0;
}

.donate-form {
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  min-width: 0;
}

.form-group {
  margin-bottom: 25px;
}

.form-label {
  display: block;
  font-weight: bold;
  color: #222;
  margin-bottom: 8px;
  font-size: 14px;
}

.form-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #ff6600;
}

.quick-amounts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 10px;
  margin-top: 10px;
}

.quick-amount-btn {
  padding: 8px 16px;
  border: 2px solid #ddd;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.quick-amount-btn:hover {
  border-color: #ff6600;
  color: #ff6600;
}

.quick-amount-btn.active {
  border-color: #ff6600;
  background-color: #ff6600;
  color: white;
}

.payment-method {
  margin: 30px 0;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.payment-method h3 {
  margin: 0 0 15px 0;
  font-size: 18px;
  color: #222;
}

.payment-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.payment-option {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.payment-option:hover {
  background-color: #f0f0f0;
}

.payment-option input[type="radio"] {
  cursor: pointer;
}

.payment-details {
  margin: 20px 0;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.donation-summary {
  margin: 30px 0;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  color: #666;
}

.summary-row.total {
  border-top: 2px solid #ddd;
  padding-top: 10px;
  margin-top: 10px;
  font-size: 18px;
  font-weight: bold;
  color: #222;
}

.summary-amount {
  color: #ff6600;
  font-weight: bold;
}

.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}

.cancel-button {
  flex: 1;
  background-color: #6c757d;
  color: white;
  padding: 15px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.cancel-button:hover {
  background-color: #5a6268;
}

.submit-button {
  flex: 2;
  background-color: #ff6600;
  color: white;
  padding: 15px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover:not(:disabled) {
  background-color: #e55a00;
}

.submit-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
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

@media (max-width: 1024px) {
  .donate-section {
    max-width: 100%;
    padding: 40px 3%;
  }

  .donate-content {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .project-summary {
    position: static;
  }
}

@media (max-width: 768px) {
  .donate-section {
    padding: 30px 2%;
  }

  .donate-header h1 {
    font-size: 32px;
  }

  .donate-form {
    padding: 25px;
  }

  .project-summary {
    padding: 20px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .quick-amounts {
    grid-template-columns: repeat(2, 1fr);
  }

  .form-actions {
    flex-direction: column;
  }

  .cancel-button,
  .submit-button {
    flex: 1;
    width: 100%;
  }
}
</style>

