<template>
  <!-- Контейнер карты — ID уникален для предотвращения конфликтов -->
  <div ref="mapContainer" class="almaty-map" :id="mapId"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Leaflet импортируется динамически, чтобы избежать SSR-проблем
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Исправляем стандартную проблему с иконками маркеров Leaflet в Vite/Webpack
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// Переопределяем пути к иконкам (Leaflet ищет их по относительным путям, что ломается в сборке)
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const props = defineProps({
  /** Высота карты (CSS-строка) */
  height: {
    type: String,
    default: '450px',
  },
})

const mapContainer = ref(null)

// Генерируем уникальный ID на случай нескольких экземпляров на странице
const mapId = `almaty-map-${Math.random().toString(36).slice(2, 9)}`

let mapInstance = null

onMounted(() => {
  // Координаты центра Алматы
  const ALMATY_COORDS = [43.2220, 76.8512]
  const ZOOM_LEVEL = 13

  // Инициализируем карту
  mapInstance = L.map(mapContainer.value, {
    center: ALMATY_COORDS,
    zoom: ZOOM_LEVEL,
    scrollWheelZoom: false, // отключаем зум колесом — удобнее на странице
  })

  // Подключаем слой OpenStreetMap (бесплатно, без API-ключа)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
    maxZoom: 19,
  }).addTo(mapInstance)

  // Добавляем маркер на центр Алматы
  const marker = L.marker(ALMATY_COORDS).addTo(mapInstance)

  // Всплывающее окно маркера
  marker
    .bindPopup(
      `<div style="text-align:center; font-family: Arial, sans-serif;">
        <strong style="font-size:15px;">🏙️ Алматы</strong><br/>
        <span style="color:#ff6600; font-size:13px;">AZHAR DONATION FUND</span><br/>
        <small style="color:#666;">ул. Абая, 150, Казахстан</small>
      </div>`,
      { maxWidth: 220 }
    )
    .openPopup()
})

onUnmounted(() => {
  // Уничтожаем карту при размонтировании, чтобы не было утечек памяти
  if (mapInstance) {
    mapInstance.remove()
    mapInstance = null
  }
})
</script>

<style scoped>
.almaty-map {
  width: 100%;
  height: v-bind(height);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  /* z-index нужен, чтобы попапы карты не уходили под другие элементы */
  z-index: 0;
  position: relative;
}

/* Адаптивность на мобильных */
@media (max-width: 768px) {
  .almaty-map {
    height: 300px !important;
  }
}
</style>
