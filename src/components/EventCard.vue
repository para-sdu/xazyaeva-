<template>
  <div class="event-card" @click="goToEvent">
    <div class="event-card-header">
      <div class="event-date-badge">
        <span class="date-day">{{ formatDay(event.eventDate) }}</span>
        <span class="date-month">{{ formatMonth(event.eventDate) }}</span>
      </div>
      <div class="event-title-section">
        <h3 class="event-title">{{ event.title }}</h3>
        <div class="event-meta">
          <span class="event-time">🕐 {{ formatTime(event.eventDate) }}</span>
        </div>
      </div>
    </div>
    
    <p class="event-description">{{ truncateDescription(event.description) }}</p>
    
    <div class="event-footer">
      <div class="event-location">
        <span class="location-icon">📍</span>
        <span class="location-text">{{ event.location }}</span>
      </div>
      <div class="event-participants">
        <span class="participants-icon">👥</span>
        <span class="participants-count">{{ event.participants?.length || 0 }}</span>
      </div>
    </div>
    
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  event: {
    type: Object,
    required: true
  }
})

const router = useRouter()

function formatDay(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.getDate().toString().padStart(2, '0')
}

function formatMonth(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
  return months[date.getMonth()]
}

function formatTime(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

function truncateDescription(description) {
  if (!description) return ''
  return description.length > 120 ? description.substring(0, 120) + '...' : description
}

function goToEvent() {
  router.push(`/events/${props.event.id}`)
}
</script>

<style scoped>
.event-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07), 0 1px 3px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);
  min-height: 320px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.event-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
  border-color: rgba(255, 102, 0, 0.15);
}

.event-card-header {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  align-items: flex-start;
}

.event-date-badge {
  background: linear-gradient(135deg, #ff6600 0%, #ff8533 100%);
  color: white;
  border-radius: 16px;
  padding: 16px;
  min-width: 75px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(255, 102, 0, 0.3);
  flex-shrink: 0;
}

.date-day {
  display: block;
  font-size: 32px;
  font-weight: bold;
  line-height: 1;
  margin-bottom: 6px;
}

.date-month {
  display: block;
  font-size: 14px;
  font-weight: 500;
  text-transform: uppercase;
  opacity: 0.95;
  letter-spacing: 0.5px;
}

.event-title-section {
  flex: 1;
  min-width: 0;
}

.event-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 10px 0;
  color: #1a1a1a;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.event-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
}

.event-time {
  display: flex;
  align-items: center;
  gap: 4px;
}

.event-description {
  color: #555;
  line-height: 1.7;
  margin: 0 0 24px 0;
  font-size: 16px;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.event-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  margin-top: auto;
}

.event-location,
.event-participants {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  color: #666;
}

.location-icon,
.participants-icon {
  font-size: 18px;
}

.location-text {
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.participants-count {
  font-weight: 600;
  color: #ff6600;
}


@media (max-width: 1200px) {
  .event-card {
    padding: 28px;
    min-height: 300px;
  }
  
  .event-title {
    font-size: 22px;
  }
  
  .date-day {
    font-size: 28px;
  }
  
  .event-description {
    font-size: 15px;
  }
}

@media (max-width: 768px) {
  .event-card-header {
    flex-direction: column;
    gap: 12px;
  }
  
  .event-date-badge {
    align-self: flex-start;
  }
  
  .event-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>

