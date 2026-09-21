import axios from 'axios'

function resolveApiBase() {
  const fromEnv = import.meta.env.VITE_API_URL
  const isLocalhost = fromEnv && /localhost|127\.0\.0\.1/.test(fromEnv)

  // Production builds must never call the visitor's localhost.
  if (import.meta.env.PROD) {
    if (!fromEnv || isLocalhost) return '/api'
    return fromEnv
  }

  return fromEnv || 'http://localhost:3000/api'
}

const API_BASE = resolveApiBase()

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
})

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tcr_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 globally — clear token and redirect to home
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('tcr_token')
      localStorage.removeItem('tcr_user')
    }
    return Promise.reject(error)
  },
)

export default api
