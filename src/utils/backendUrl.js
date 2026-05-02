/**
 * Утилита для получения базового URL бэкенда
 * Использует переменную окружения VITE_BACKEND_URL или извлекает из VITE_API_BASE_URL
 */
export function getBackendUrl() {
  // Если явно указан VITE_BACKEND_URL, используем его
  if (import.meta.env.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL
  }
  
  // Иначе извлекаем из VITE_API_BASE_URL (убираем /api/v1)
  if (import.meta.env.VITE_API_BASE_URL) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL
    // Убираем /api/v1 из конца URL
    return apiUrl.replace(/\/api\/v1\/?$/, '')
  }
  
  // Fallback для разработки
  return 'http://localhost:8080'
}

/**
 * Получить полный URL для изображения/файла
 * @param {string} path - Путь к файлу (может начинаться с / или без)
 * @returns {string} Полный URL
 */
export function getFileUrl(path) {
  if (!path) return ''
  
  // Если уже полный URL (http/https), возвращаем как есть
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  
  const backendUrl = getBackendUrl()
  
  // Убираем /app из начала пути, если он там есть (для Render.com)
  let cleanPath = path
  if (cleanPath.startsWith('/app/')) {
    cleanPath = cleanPath.substring(5) // Убираем '/app/'
  } else if (cleanPath.startsWith('app/')) {
    cleanPath = cleanPath.substring(4) // Убираем 'app/'
  }
  
  // Если путь начинается с /, просто добавляем к базовому URL
  if (cleanPath.startsWith('/')) {
    return `${backendUrl}${cleanPath}`
  }
  
  // Если путь уже содержит images/, docs/, avatars/ - добавляем / в начало
  if (cleanPath.startsWith('images/') || cleanPath.startsWith('docs/') || cleanPath.startsWith('avatars/')) {
    return `${backendUrl}/${cleanPath}`
  }
  
  // Иначе добавляем /
  return `${backendUrl}/${cleanPath}`
}

