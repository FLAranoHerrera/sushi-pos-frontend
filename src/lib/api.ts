import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://sushi-pos-backend.onrender.com/api'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para agregar token de autenticación
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      // No redirigir automáticamente, dejar que el componente maneje la redirección
    }
    return Promise.reject(error)
  }
)

export default api
