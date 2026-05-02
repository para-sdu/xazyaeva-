<script setup>
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { useAuthStore } from './stores/useAuthStore'
import { useUserStore } from './stores/useUserStore'
import { useRouter } from 'vue-router'
import { getFileUrl } from './utils/backendUrl'

const authStore = useAuthStore()
const userStore = useUserStore()
const router = useRouter()

const isAuthenticated = computed(() => !!authStore.authData?.token)
const showDropdown = ref(false)
const showMobileMenu = ref(false)

const currentUser = computed(() => userStore.currentUser)

const isAdmin = computed(() => {
  return currentUser.value?.role === 'ADMIN'
})

const avatarUrl = computed(() => {
  if (!currentUser.value?.avatarPath) {
    return 'https://as2.ftcdn.net/jpg/03/31/69/91/1000_F_331699188_lRpvqxO5QRtwOM05gR50ImaaJgBx68vi.jpg'
  }
  return getFileUrl(currentUser.value.avatarPath)
})

async function loadCurrentUser() {
  if (isAuthenticated.value) {
    try {
      await userStore.getCurrentUser()
    } catch (err) {
      console.error('Ошибка загрузки пользователя:', err)
    }
  }
}

watch(isAuthenticated, (newVal) => {
  if (newVal) {
    loadCurrentUser()
  } else {
    userStore.currentUser = null
  }
})

function handleLogout() {
  authStore.logout()
  userStore.currentUser = null
  showDropdown.value = false
  closeMobileMenu()
  router.push('/')
}

function goToProfile() {
  showDropdown.value = false
  closeMobileMenu()
  router.push('/profile')
}

function goToVerification() {
  showDropdown.value = false
  closeMobileMenu()
  router.push('/verification')
}

function goToCategories() {
  showDropdown.value = false
  closeMobileMenu()
  router.push('/categories')
}

function toggleDropdown() {
  showDropdown.value = !showDropdown.value
}

function toggleMobileMenu() {
  showMobileMenu.value = !showMobileMenu.value
}

function closeMobileMenu() {
  showMobileMenu.value = false
}

function closeDropdown(e) {
  if (showDropdown.value && !e.target.closest('.user-menu')) {
    showDropdown.value = false
  }
}

function handleDocumentClick(e) {
  closeDropdown(e)
}

onMounted(() => {
  if (isAuthenticated.value) {
    loadCurrentUser()
  }
  document.addEventListener('click', handleDocumentClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick)
})
</script>

<template>
  <div class="app">
    <header class="header">
      <div class="logo-container">
        <span class="logo-text">AZHAR DONATION FUND</span>
      </div>
      <button class="mobile-menu-toggle" @click="toggleMobileMenu" aria-label="Меню">
        <span></span>
        <span></span>
        <span></span>
      </button>
      <nav class="nav-links" :class="{ 'mobile-open': showMobileMenu }">
        <router-link to="/" @click="closeMobileMenu">Главная</router-link>
        <router-link to="/projects" @click="closeMobileMenu">Проекты</router-link>
        <router-link to="/events" @click="closeMobileMenu">Волонтерство</router-link>
        <router-link to="/about" @click="closeMobileMenu">О нас</router-link>
        <router-link to="/contacts" @click="closeMobileMenu">Контакты</router-link>
        <router-link v-if="!isAuthenticated" to="/projects" class="nav-donate" @click="closeMobileMenu">Пожертвовать</router-link>
        <router-link v-if="!isAuthenticated" to="/login" @click="closeMobileMenu">Войти</router-link>
        <div v-if="isAuthenticated" class="user-menu" @click.stop="toggleDropdown">
          <div class="user-info">
            <img :src="avatarUrl" :alt="currentUser?.fullName || 'User'" class="user-avatar" />
            <span class="user-name">{{ currentUser?.fullName || 'Загрузка...' }}</span>
          </div>
          <div v-if="showDropdown" class="dropdown-menu" @click.stop>
            <a href="#" @click.prevent="goToProfile" class="dropdown-item">Профиль</a>
            <a v-if="isAdmin" href="#" @click.prevent="goToVerification" class="dropdown-item">Верификация</a>
            <a v-if="isAdmin" href="#" @click.prevent="goToCategories" class="dropdown-item">Категории</a>
            <a href="#" @click.prevent="handleLogout" class="dropdown-item">Выйти</a>
          </div>
        </div>
      </nav>
      <div v-if="showMobileMenu" class="mobile-menu-overlay" @click="closeMobileMenu"></div>
    </header>

    <main>
      <RouterView />
    </main>

    <footer class="footer">
      <div class="footer-content">
        <div class="footer-info">
          <p>AZHAR DONATION FUND - мы меняем мир к лучшему.</p>
        </div>
        <div class="footer-links">
          <!-- Ссылки footer: используем router-link вместо мёртвых href="#" -->
          <router-link to="/">Главная</router-link>
          <router-link to="/about">О нас</router-link>
          <router-link to="/contacts">Контакты</router-link>
        </div>
      </div>
      <p style="text-align: center; margin-top: 20px;">&copy; 2026 AZHAR DONATION FUND. Все права защищены.</p>
    </footer>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}

.header {
  background-color: #222;
  color: white;
  padding: 15px 5%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo-text {
  font-size: 20px;
  font-weight: bold;
  margin-left: 10px;
  color: white;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-links a {
  color: white;
  text-decoration: none;
  transition: opacity 0.3s;
}

.nav-links a:hover {
  opacity: 0.8;
}

.nav-donate {
  background-color: #ff6600;
  padding: 10px 15px;
  border-radius: 4px;
}

.footer {
  background-color: #222;
  color: #ccc;
  padding: 40px 5%;
  margin-top: auto;
}

.footer-content {
  display: flex;
  justify-content: space-between;
}

.footer a {
  color: #aaa;
  margin-right: 15px;
  text-decoration: none;
}

.footer a:hover {
  color: #ff6600;
}

.footer p {
  font-size: 14px;
}

.mobile-menu-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  z-index: 1001;
}

.mobile-menu-toggle span {
  width: 25px;
  height: 3px;
  background-color: white;
  transition: all 0.3s;
  border-radius: 2px;
}

.mobile-menu-overlay {
  /* По умолчанию overlay скрыт и не блокирует клики */
  display: none;
  pointer-events: none;
}

.user-menu {
  position: relative;
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ff6600;
}

.user-name {
  color: white;
  font-size: 14px;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 10px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  min-width: 150px;
  z-index: 1000;
  overflow: hidden;
}

.dropdown-item {
  display: block;
  padding: 12px 16px;
  color: #222 !important;
  text-decoration: none;
  transition: background-color 0.2s;
  background-color: white;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
  color: #222 !important;
}

.dropdown-item:first-child {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.dropdown-item:last-child {
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}

/* Мобильная адаптация */
@media (max-width: 768px) {
  .header {
    position: relative;
    padding: 15px 20px;
  }

  .logo-text {
    font-size: 16px;
  }

  .mobile-menu-toggle {
    display: flex;
  }

  .mobile-menu-toggle.active span:nth-child(1) {
    transform: rotate(45deg) translate(8px, 8px);
  }

  .mobile-menu-toggle.active span:nth-child(2) {
    opacity: 0;
  }

  .mobile-menu-toggle.active span:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -7px);
  }

  .nav-links {
    position: fixed;
    top: 0;
    right: -100%;
    width: 280px;
    height: 100vh;
    background-color: #222;
    flex-direction: column;
    align-items: flex-start;
    padding: 80px 20px 20px;
    gap: 0;
    transition: right 0.3s ease;
    z-index: 1000;
    overflow-y: auto;
  }

  .nav-links.mobile-open {
    right: 0;
  }

  .nav-links a {
    width: 100%;
    padding: 15px 0;
    border-bottom: 1px solid #444;
    font-size: 16px;
  }

  .nav-links .nav-donate {
    background-color: #ff6600;
    padding: 15px;
    border-radius: 4px;
    margin-top: 10px;
    text-align: center;
  }

  .user-menu {
    width: 100%;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #444;
  }

  .user-info {
    width: 100%;
    justify-content: flex-start;
  }

  .user-name {
    font-size: 16px;
  }

  .dropdown-menu {
    position: static;
    width: 100%;
    margin-top: 10px;
    box-shadow: none;
    border: none;
    background-color: #333;
  }

  .dropdown-item {
    color: white !important;
    background-color: #333;
    padding: 15px;
  }

  .dropdown-item:hover {
    background-color: #444;
  }

  .mobile-menu-overlay {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
    /* pointer-events: all — только когда overlay реально показан */
    pointer-events: all;
  }
}

@media (max-width: 480px) {
  .logo-text {
    font-size: 14px;
  }

  .nav-links {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }

  .footer-links {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .footer a {
    margin-right: 0;
  }
}
</style>
