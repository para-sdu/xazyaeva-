<template>
    <div class="home-page">
        <!-- Hero Banner -->
        <section class="hero-banner">
            <h1>The smallest act of kindness is worth more than the grandest intention!</h1>
        </section>

        <!-- Stats -->
        <section class="stats-section">
            <div class="stat-item">
                <h3>{{ formatStatNumber(stats.totalCount) }}+</h3>
                <p>Получено пожертвований</p>
            </div>
            <div class="stat-item">
                <h3>{{ formatStatAmount(stats.monthSum) }}</h3>
                <p>Ежемесячно пожертвовано</p>
            </div>
            <div class="stat-item">
                <h3>372М</h3>
                <p>Благотворительность в прошлом году</p>
            </div>
        </section>

        <!-- How It Works -->
        <section class="how-it-works-steps">
            <h2>Наша платформа: Доверие. Прозрачность. Помощь.</h2>
            <div class="steps-container">
                <div class="step-item">
                    <span>1</span>
                    <h3>Проверка Нуждающихся</h3>
                    <p>Мы тщательно проверяем документы и истории всех, кто запрашивает помощь, чтобы гарантировать, что
                        доноры помогают реальным людям.</p>
                </div>
                <div class="step-item">
                    <span>2</span>
                    <h3>Создание "Копилки" и Истории</h3>
                    <p>После верификации нуждающийся получает свою "Копилку" с нужной суммой и публикует свою историю
                        для доноров.</p>
                </div>
                <div class="step-item">
                    <span>3</span>
                    <h3>Выбор и Прогресс</h3>
                    <p>Доноры выбирают, кому доверяют, и отслеживают прогресс сбора средств в "Копилке" в реальном
                        времени.</p>
                </div>
            </div>
        </section>

        <hr />

        <!-- Projects -->
        <section class="projects-section">
            <h2 style="color: #333;">Актуальные проекты и их истории</h2>
            <div v-if="projectsLoading" class="loading-projects">
                <p>Загрузка проектов...</p>
            </div>
            <div v-else-if="formattedProjects.length === 0" class="empty-projects">
                <p>Проекты не найдены</p>
            </div>
            <div v-else class="projects-grid">
                <ProjectCard 
                    v-for="project in formattedProjects" 
                    :key="project.id"
                    :project="project"
                    @donate="handleDonate"
                />
            </div>
        </section>

        <hr />

        <!-- About + Donate -->
        <section class="about-donate-section">
            <div class="left-content">
                <h2>AZHAR Donation Fund помогает адресно</h2>
                <h3>Наше главное стремление — помогать людям</h3>
                <p>Мы соединяем доноров, волонтёров и проверенные проекты помощи в Алматы. На платформе можно выбрать
                    конкретный сбор, увидеть цель, текущий прогресс и поддержать людей, которым нужна медицинская,
                    образовательная или срочная бытовая помощь.</p>
                <router-link to="/about"
                    style="color: white; background-color: #ff6600; padding: 10px 20px; display: inline-block; margin-top: 15px; border-radius: 4px; text-decoration: none;">Подробнее
                    о нас</router-link>
            </div>
            <div class="right-donate-cta">
                <div class="cta-content">
                    <h3>Сделайте пожертвование прямо сейчас</h3>
                    <p>Выберите проект, которому хотите помочь, и внесите свой вклад в благотворительность. Каждое пожертвование имеет значение!</p>
                    <ul class="cta-benefits">
                        <li>✓ Прозрачность всех операций</li>
                        <li>✓ Отслеживание прогресса в реальном времени</li>
                        <li>✓ Прямая помощь нуждающимся</li>
                    </ul>
                    <router-link to="/projects" class="cta-button">
                        Выбрать проект
                    </router-link>
                </div>
            </div>
        </section>

        <hr />

        <!-- Join Us -->
        <section class="join-us-section">
            <h2>Присоединяйтесь к нам и начните менять мир!</h2>
            <div class="join-us-cards">
                <div class="join-card">
                    <h3>Я нуждаюсь в помощи</h3>
                    <p>Пройдите нашу простую процедуру верификации, расскажите свою историю и начните сбор средств на
                        свою "копилку".</p>
                    <router-link to="/projects" class="join-button">Зарегистрировать проект</router-link>
                </div>
                <div class="join-card">
                    <h3>Я хочу помогать (Донор)</h3>
                    <p>Читайте проверенные истории, выбирайте, кому вы доверяете, и следите за прогрессом сбора в
                        "копилках" нуждающихся.</p>
                    <router-link to="/projects" class="join-button">Стать Донором</router-link>
                </div>
            </div>
        </section>

        <hr />

        <!-- Categories -->
        <section class="categories-section">
            <h2>Категории</h2>
            <div class="categories-text">
                <h3>Несколько вариантов пожертвований для вашего удобства</h3>
                <p>Выберите категорию, которая вам ближе всего, или пожертвуйте на наиболее актуальный проект. Мы
                    гарантируем, что ваши средства будут использованы максимально эффективно.</p>
                <router-link to="/categories"
                    style="color: #333; border: 1px solid #333; padding: 10px 20px; display: inline-block; margin-top: 15px; border-radius: 4px; text-decoration: none;">Смотреть
                    все категории</router-link>
            </div>
            <div class="categories-grid">
                <div class="category-card">
                    <h4>Образование</h4>
                    <p>Поддержка школьных программ.</p>
                </div>
                <div class="category-card">
                    <h4>Здоровье</h4>
                    <p>Финансирование операций и лекарств.</p>
                </div>
                <div class="category-card">
                    <h4>Чрезвычайные ситуации</h4>
                    <p>Помощь при стихийных бедствиях.</p>
                </div>
                <div class="category-card">
                    <h4>Питание</h4>
                    <p>Обеспечение продовольствием.</p>
                </div>
            </div>
        </section>

        <hr />

        <section class="gallery-section">
            <h2>ФОТОГАЛЕРЕЯ</h2>
            <div class="photo-grid">
                <img src="https://cdn.nur.kz/images/1200x675/a8b0fff23f08c639.jpeg?version=1"
                    style="width:400px; height:400px; object-fit:cover; border-radius:20px;"
                    alt="Волонтеры собирают помощь" />
                <img src="https://img.freepik.com/premium-photo/donation-box-free-food-food-reserves_378481-7686.jpg"
                    style="width:400px; height:400px; object-fit:cover; border-radius:20px;"
                    alt="Коробка с надписью Donation" />
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTisQN0ocVkmpC9nr81HZitrV6Rux9ICXKsXg&s"
                    style="width:400px; height:400px; object-fit:cover; border-radius:20px;"
                    alt="Дети улыбаются после помощи" />
                <img src="https://static-cdn.toi-media.com/www/uploads/2025/05/AFP__20250430__442C9NP__v1__HighRes__PalestinianIsraelConflict.jpg"
                    style="width:400px; height:400px; object-fit:cover; border-radius:20px;"
                    alt="Раздача продовольственной помощи" />
                <img src="https://www.shutterstock.com/image-photo/poor-people-get-welfare-assistance-600nw-2478831077.jpg"
                    style="width:400px; height:400px; object-fit:cover; border-radius:20px;"
                    alt="Люди получают благотворительную помощь" />
                <img src="https://media.istockphoto.com/id/1625310710/photo/happy-group-of-volunteer-people-stacking-hands-celebrating-together-outdoor-teamwork-and.jpg?s=612x612&w=0&k=20&c=KrkTdMYjObaAhhwzsTnHf8dIDpdmc5pvAujfCl6riXU="
                    style="width:400px; height:400px; object-fit:cover; border-radius:20px;"
                    alt="Улыбающиеся люди после волонтёрских мероприятий" />
            </div>
    </section>

    <hr />

    <!-- Секция с картой Алматы -->
    <section class="map-section-home">
      <h2>Мы в Алматы</h2>
      <p class="map-section-subtitle">Интерактивная карта города — нажмите на маркер для подробностей</p>
      <!-- Leaflet + OpenStreetMap: бесплатно, адаптивно -->
      <AlmatyMap height="420px" />
    </section>
</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ProjectCard from '../components/ProjectCard.vue'
import AlmatyMap from '../components/AlmatyMap.vue'
import { useUserStore } from '../stores/useUserStore'
import { useDonationStore } from '../stores/useDonationStore'
import { useProjectStore } from '../stores/useProjectStore'
import { getFileUrl } from '../utils/backendUrl'

const router = useRouter()
const userStore = useUserStore()
const donationStore = useDonationStore()
const projectStore = useProjectStore()

const stats = ref({
  totalCount: 0,
  monthSum: 0,
  lastYearSum: 0
})

const projectsLoading = ref(false)

function formatStatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

function formatStatAmount(amount) {
  if (amount >= 1000000000) {
    return (amount / 1000000000).toFixed(1) + 'B'
  } else if (amount >= 1000000) {
    return (amount / 1000000).toFixed(0) + 'M'
  } else if (amount >= 1000) {
    return (amount / 1000).toFixed(0) + 'K'
  }
  return amount.toString()
}

async function loadStats() {
  try {
    const [totalCount, monthSum, lastYearSum] = await Promise.all([
      donationStore.getTotalDonationsCount(),
      donationStore.getDonationsSumForCurrentMonth(),
      donationStore.getDonationsSumForLastYear()
    ])
    stats.value = {
      totalCount: totalCount || 0,
      monthSum: monthSum || 0,
      lastYearSum: lastYearSum || 0
    }
  } catch (err) {
    console.error('Ошибка при загрузке статистики:', err)
  }
}

async function loadProjects() {
  projectsLoading.value = true
  try {
    await projectStore.getAllProjects()
  } catch (err) {
    console.error('Ошибка при загрузке проектов:', err)
  } finally {
    projectsLoading.value = false
  }
}

onMounted(async () => {
  if (userStore.currentUser === null) {
    try {
      await userStore.getCurrentUser()
    } catch (err) {
      console.log('User not authenticated')
    }
  }
  await Promise.all([
    loadStats(),
    loadProjects()
  ])
})

/**
 * formattedProjects:
 * - Берём первые 4 проекта
 * - Фильтруем: если collectedAmount >= targetAmount — проект завершён и скрывается со страницы
 */
const formattedProjects = computed(() => {
  return projectStore.projects
    // Скрываем проекты, достигшие цели пожертвований
    .filter(project => !projectStore.isProjectCompleted(project))
    .slice(0, 4)
    .map(project => {
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

function handleDonate(project) {
  router.push(`/projects/${project.id}/donate`)
}
</script>

<style scoped>
/* === ВЕСЬ ОРИГИНАЛЬНЫЙ CSS === */
body {
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #ffffff;
    color: #333;
}

a {
    text-decoration: none;
    color: #ff6600;
}

h1, h2, h3, h4, h5, h6 {
    font-weight: bold;
}

h2 {
    text-align: center;
    margin-bottom: 40px;
    font-size: 36px;
}


.hero-banner {
    background-color: #3f3f46;
    color: white;
    text-align: center;
    padding: 100px 5%;
}

.hero-banner h1 {
    font-size: 56px;
    margin-bottom: 5px;
    font-weight: bold;
}

.hero-banner p {
    font-size: 18px;
}

.stats-section {
    display: flex;
    justify-content: space-around;
    padding: 40px 5%;
    background-color: #f7f7f7;
    text-align: center;
}

.stat-item h3 {
    color: #ff6600;
    font-size: 36px;
    font-weight: bold;
    margin: 0;
}

.stat-item p {
    margin: 5px 0 0;
}

.how-it-works-steps {
    padding: 60px 5%;
    background-color: #ffffff;
}

.steps-container {
    display: flex;
    justify-content: space-between;
    gap: 30px;
    margin-top: 40px;
}

.step-item {
    flex: 1;
    text-align: center;
    padding: 20px;
    border-right: 1px solid #eee;
}

.step-item:last-child {
    border-right: none;
}

.step-item span {
    color: #ff6600;
    font-size: 40px;
    font-weight: bold;
    display: block;
    margin-bottom: 10px;
}

.step-item h3 {
    margin-top: 0;
    font-size: 22px;
    font-weight: bold;
}

.projects-section {
    padding: 60px 5%;
    background-color: #fff8f8;
}

.projects-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 30px;
    max-width: 1400px;
    margin: 0 auto;
}

.projects-grid :deep(.project-card) {
    flex: 0 0 calc(25% - 23px);
    max-width: calc(25% - 23px);
    min-width: 280px;
    box-sizing: border-box;
}

@media (max-width: 1400px) {
    .projects-grid {
        max-width: calc(100% - 10%);
    }
    .projects-grid :deep(.project-card) {
        flex: 0 0 calc(25% - 23px);
        max-width: calc(25% - 23px);
    }
}

@media (max-width: 1200px) {
    .projects-grid :deep(.project-card) {
        flex: 0 0 calc(33.333% - 20px);
        max-width: calc(33.333% - 20px);
    }
}

@media (max-width: 900px) {
    .projects-grid :deep(.project-card) {
        flex: 0 0 calc(50% - 15px);
        max-width: calc(50% - 15px);
    }
}

@media (max-width: 600px) {
    .projects-grid :deep(.project-card) {
        flex: 0 0 100%;
        max-width: 100%;
    }
}

.loading-projects,
.empty-projects {
    text-align: center;
    padding: 60px 20px;
    font-size: 18px;
    color: #666;
}

.about-donate-section {
    display: flex;
    padding: 60px 5%;
    gap: 40px;
}

.left-content {
    flex: 1;
}

.left-content h2 {
    font-size: 32px;
    font-weight: bold;
    text-align: left;
    margin-bottom: 15px;
}

.left-content h3 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 15px;
}

.right-donate-cta {
    flex: 1;
    background: linear-gradient(135deg, #ff6600 0%, #e55a00 100%);
    padding: 40px;
    border-radius: 8px;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
}

.cta-content {
    text-align: center;
}

.cta-content h3 {
    font-size: 28px;
    font-weight: bold;
    color: white;
    margin: 0 0 20px 0;
}

.cta-content p {
    font-size: 16px;
    line-height: 1.6;
    margin: 0 0 25px 0;
    opacity: 0.95;
}

.cta-benefits {
    list-style: none;
    padding: 0;
    margin: 0 0 30px 0;
    text-align: left;
    display: inline-block;
}

.cta-benefits li {
    font-size: 16px;
    margin-bottom: 12px;
    padding-left: 5px;
}

.cta-button {
    display: inline-block;
    background-color: white;
    color: #ff6600;
    padding: 15px 40px;
    border-radius: 8px;
    font-size: 18px;
    font-weight: bold;
    text-decoration: none;
    transition: transform 0.3s, box-shadow 0.3s;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.cta-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.join-us-section {
    padding: 80px 5%;
    text-align: center;
    background-color: #222;
    color: white;
}

.join-us-cards {
    display: flex;
    justify-content: center;
    gap: 50px;
    margin-top: 40px;
}

.join-card {
    max-width: 350px;
    padding: 30px;
    background-color: #333;
    border-radius: 8px;
}

.join-card h3 {
    color: #ff6600;
    font-size: 24px;
    font-weight: bold;
}

.join-button {
    background-color: white;
    color: #ff6600;
    padding: 12px 25px;
    border-radius: 4px;
    margin-top: 15px;
    display: inline-block;
    font-weight: bold;
    text-decoration: none;
}

.categories-section {
    padding: 60px 5%;
    background-color: #ffffff;
    display: flex;
    gap: 40px;
    align-items: center;
}

.categories-text {
    flex: 1;
}

.categories-text h3 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 15px;
}

.categories-grid {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.category-card {
    background-color: #ff6600;
    color: white;
    padding: 20px;
    border-radius: 8px;
}

.category-card h4 {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
}

.gallery-section {
    padding: 60px 5%;
}

.gallery-section h2 {
    font-size: 36px;
    font-weight: bold;
}

.photo-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-top: 20px;
}

.photo-grid img {
    width: 100%;
    height: auto;
    display: block;
    object-fit: cover;
    border-radius: 5px;
}

/* Мобильная адаптация */
@media (max-width: 768px) {
    .hero-banner {
        padding: 60px 20px;
    }

    .hero-banner h1 {
        font-size: 32px;
    }

    .hero-banner p {
        font-size: 16px;
    }

    .stats-section {
        flex-direction: column;
        gap: 30px;
        padding: 40px 20px;
    }

    .stat-item h3 {
        font-size: 28px;
    }

    .how-it-works-steps {
        padding: 40px 20px;
    }

    .steps-container {
        flex-direction: column;
        gap: 30px;
    }

    .step-item {
        border-right: none;
        border-bottom: 1px solid #eee;
        padding-bottom: 30px;
    }

    .step-item:last-child {
        border-bottom: none;
    }

    .step-item span {
        font-size: 36px;
    }

    .step-item h3 {
        font-size: 20px;
    }

    .projects-section {
        padding: 40px 20px;
    }

    h2 {
        font-size: 28px;
        margin-bottom: 30px;
    }

    .about-donate-section {
        flex-direction: column;
        padding: 40px 20px;
        gap: 30px;
    }

    .left-content h2 {
        font-size: 26px;
    }

    .left-content h3 {
        font-size: 20px;
    }

    .right-donate-cta {
        padding: 30px 20px;
    }

    .cta-content h3 {
        font-size: 24px;
    }

    .cta-content p {
        font-size: 14px;
    }

    .cta-button {
        padding: 12px 30px;
        font-size: 16px;
    }

    .join-us-section {
        padding: 40px 20px;
    }

    .join-us-cards {
        flex-direction: column;
        gap: 30px;
    }

    .join-card {
        max-width: 100%;
    }

    .categories-section {
        flex-direction: column;
        padding: 40px 20px;
        gap: 30px;
    }

    .categories-grid {
        grid-template-columns: 1fr;
    }

    .gallery-section {
        padding: 40px 20px;
    }

    .photo-grid {
        grid-template-columns: 1fr;
        gap: 15px;
    }

    .photo-grid img {
        width: 100%;
        height: 300px;
    }
}

@media (max-width: 480px) {
    .hero-banner h1 {
        font-size: 24px;
    }

    .stat-item h3 {
        font-size: 24px;
    }

    h2 {
        font-size: 24px;
    }

    .left-content h2 {
        font-size: 22px;
    }

    .cta-content h3 {
        font-size: 20px;
    }

    .photo-grid img {
        height: 250px;
    }
}

/* === СЕКЦИЯ КАРТЫ АЛМАТЫ === */
.map-section-home {
  padding: 60px 5%;
  background-color: #f7f7f7;
  text-align: center;
}

.map-section-home h2 {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 8px;
}

.map-section-subtitle {
  color: #666;
  font-size: 15px;
  margin: 0 0 24px 0;
}

@media (max-width: 768px) {
  .map-section-home {
    padding: 40px 20px;
  }
  .map-section-home h2 {
    font-size: 26px;
  }
}
</style>
