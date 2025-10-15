import axios from 'axios'

// Configuración de la URL base del API
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://sushi-pos-backend.onrender.com'

// Asegurar que la URL base no termine con /api para evitar duplicación
const BASE_URL = API_URL.endsWith('/api') ? API_URL : `${API_URL}/api`

// Debug: Log de la URL base siempre para debug
console.log('🔧 API Base URL:', BASE_URL)
console.log('🔧 Environment API_URL:', process.env.NEXT_PUBLIC_API_URL)
console.log('🔧 NODE_ENV:', process.env.NODE_ENV)

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para agregar token de autenticación y debug
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  // Debug: Log de la URL completa siempre para debug
  const fullUrl = (config.baseURL || '') + (config.url || '')
  console.log('🚀 Making request to:', fullUrl)
  console.log('🚀 Request config:', {
    baseURL: config.baseURL,
    url: config.url,
    method: config.method,
    headers: config.headers
  })
  
  return config
})

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response received:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    })
    return response
  },
  (error) => {
    console.error('❌ Request failed:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      fullUrl: (error.config?.baseURL || '') + (error.config?.url || '')
    })
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      // No redirigir automáticamente, dejar que el componente maneje la redirección
    }
    return Promise.reject(error)
  }
)

// Función para obtener la URL base del backend
export const getBackendUrl = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://sushi-pos-backend.onrender.com'
  return API_URL.endsWith('/api') ? API_URL.replace('/api', '') : API_URL
}

// Función para construir URLs de imágenes
export const getImageUrl = (imagePath: string) => {
  if (!imagePath) return null
  if (imagePath.startsWith('http')) return imagePath
  
  const backendUrl = getBackendUrl()
  return `${backendUrl}${imagePath}`
}

export default api
