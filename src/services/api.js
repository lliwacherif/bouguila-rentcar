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

/** Turn a stored upload path into an address the current page can load. */
export function mediaUrl(src) {
  if (!src || typeof src !== 'string') return ''
  if (src.startsWith('blob:') || src.startsWith('data:')) return src

  const origin = API_BASE.startsWith('http') ? API_BASE.replace(/\/api\/?$/, '') : ''
  let path = src

  if (/^https?:\/\//i.test(src)) {
    try {
      const parsed = new URL(src)
      if (!parsed.pathname.startsWith('/uploads/') && !parsed.pathname.startsWith('/api/uploads/')) {
        return src
      }
      path = parsed.pathname
    } catch {
      return src
    }
  }

  if (path.startsWith('/uploads/')) path = `/api${path}`
  if (path.startsWith('/api/uploads/')) return `${origin}${path}`
  return src
}

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
