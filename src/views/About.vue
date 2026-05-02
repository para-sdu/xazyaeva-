<template>
  <div class="about-page">
    <section class="about-header">
      <h1>О нас</h1>
      <p>AZHAR DONATION FUND - мы меняем мир к лучшему</p>
    </section>

    <section class="about-content">
      <div class="about-section">
        <h2>Наша миссия</h2>
        <p>
          AZHAR DONATION FUND — это благотворительная платформа, созданная для того, чтобы объединить тех, кто нуждается в помощи, 
          и тех, кто готов помочь. Мы верим, что каждый человек заслуживает достойной жизни, и наша миссия — сделать помощь доступной, 
          прозрачной и эффективной.
        </p>
      </div>

      <div class="about-section">
        <h2>Что мы делаем</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">✓</div>
            <h3>Проверка нуждающихся</h3>
            <p>Мы тщательно проверяем документы и истории всех, кто запрашивает помощь, чтобы гарантировать, что доноры помогают реальным людям.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">💰</div>
            <h3>Прозрачные сборы</h3>
            <p>Каждый проект имеет свою "копилку" с четко обозначенной целью. Вы можете отслеживать прогресс сбора средств в реальном времени.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🤝</div>
            <h3>Прямая помощь</h3>
            <p>Ваши пожертвования напрямую идут на помощь нуждающимся. Мы обеспечиваем максимальную прозрачность всех операций.</p>
          </div>
        </div>
      </div>

      <div class="about-section">
        <h2>Наши ценности</h2>
        <div class="values-list">
          <div class="value-item">
            <h3>Доверие</h3>
            <p>Мы строим доверие через прозрачность и честность во всех наших действиях.</p>
          </div>
          <div class="value-item">
            <h3>Прозрачность</h3>
            <p>Каждое пожертвование отслеживается, и вы всегда знаете, куда идут ваши средства.</p>
          </div>
          <div class="value-item">
            <h3>Помощь</h3>
            <p>Наша главная цель — помочь тем, кто в этом нуждается, и сделать мир лучше.</p>
          </div>
        </div>
      </div>

      <div class="about-section stats-section">
        <h2>Наши достижения</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <h3>453+</h3>
            <p>Получено пожертвований</p>
          </div>
          <div class="stat-card">
            <h3>32M</h3>
            <p>Ежемесячно пожертвовано</p>
          </div>
          <div class="stat-card">
            <h3>372M</h3>
            <p>Благотворительность в прошлом году</p>
          </div>
          <div class="stat-card">
            <h3>100+</h3>
            <p>Активных проектов</p>
          </div>
        </div>
      </div>

      <div class="about-section">
        <h2>Присоединяйтесь к нам</h2>
        <p>
          Каждый может внести свой вклад в изменение мира к лучшему. Станьте донором, создайте проект или просто поделитесь 
          информацией о нашей платформе. Вместе мы можем сделать больше!
        </p>
        <div class="cta-buttons">
          <router-link to="/register" class="cta-button primary">Стать донором</router-link>
          <router-link to="/projects" class="cta-button secondary">Посмотреть проекты</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
</script>

<style scoped>
.about-page {
  min-height: 100vh;
  background-color: #f7f7f7;
}

.about-header {
  background-color: #222;
  color: white;
  text-align: center;
  padding: 80px 5%;
}

.about-header h1 {
  font-size: 48px;
  margin: 0 0 15px 0;
  color: white;
}

.about-header p {
  font-size: 20px;
  color: #ccc;
  margin: 0;
}

.about-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 5%;
}

.about-section {
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.about-section h2 {
  font-size: 32px;
  color: #222;
  margin: 0 0 25px 0;
  text-align: center;
}

.about-section > p {
  font-size: 18px;
  line-height: 1.8;
  color: #444;
  text-align: center;
  max-width: 900px;
  margin: 0 auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-top: 30px;
}

.feature-card {
  text-align: center;
  padding: 30px 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.feature-card h3 {
  font-size: 20px;
  color: #222;
  margin: 0 0 15px 0;
}

.feature-card p {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.values-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 30px;
}

.value-item {
  padding: 25px;
  background-color: #f9f9f9;
  border-radius: 8px;
  border-left: 4px solid #ff6600;
}

.value-item h3 {
  font-size: 24px;
  color: #ff6600;
  margin: 0 0 15px 0;
}

.value-item p {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.stats-section {
  background: linear-gradient(135deg, #ff6600 0%, #e55a00 100%);
  color: white;
}

.stats-section h2 {
  color: white;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  margin-top: 30px;
}

.stat-card {
  text-align: center;
  padding: 30px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

.stat-card h3 {
  font-size: 42px;
  margin: 0 0 10px 0;
  color: white;
  font-weight: bold;
}

.stat-card p {
  font-size: 16px;
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
}

.cta-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 30px;
  flex-wrap: wrap;
}

.cta-button {
  padding: 15px 40px;
  border-radius: 4px;
  font-size: 18px;
  font-weight: bold;
  text-decoration: none;
  transition: all 0.3s;
  display: inline-block;
}

.cta-button.primary {
  background-color: #ff6600;
  color: white;
}

.cta-button.primary:hover {
  background-color: #e55a00;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 102, 0, 0.3);
}

.cta-button.secondary {
  background-color: white;
  color: #ff6600;
  border: 2px solid #ff6600;
}

.cta-button.secondary:hover {
  background-color: #ff6600;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 102, 0, 0.3);
}

@media (max-width: 768px) {
  .about-header h1 {
    font-size: 36px;
  }

  .about-header p {
    font-size: 16px;
  }

  .about-section {
    padding: 25px;
  }

  .about-section h2 {
    font-size: 24px;
  }

  .features-grid,
  .values-list {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .cta-buttons {
    flex-direction: column;
  }

  .cta-button {
    width: 100%;
    text-align: center;
  }
}
</style>

