import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

// Retry configuration
const MAX_RETRIES = 3
const RETRY_DELAY_MS = 1000

// Retry helper function
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const fetchWithRetry = async (apiCall, retries = MAX_RETRIES) => {
  try {
    return await apiCall()
  } catch (error) {
    if (retries > 0 && 
        (error.code === 'ECONNREFUSED' || 
         error.code === 'ERR_NETWORK' || 
         error.code === 'ECONNABORTED' ||
         (error.response && error.response.status >= 500))) {
      await sleep(RETRY_DELAY_MS * (MAX_RETRIES - retries + 1))
      return fetchWithRetry(apiCall, retries - 1)
    }
    throw error
  }
}

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 second timeout
  withCredentials: true, // Important for CORS with credentials
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle different error types
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      return Promise.reject({
        code: error.code,
        message: 'Cannot connect to server. Please ensure the backend is running on port 8080.'
      })
    }
    
    if (error.response) {
      const { status, data } = error.response
      
      // Handle 401 Unauthorized
      if (status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login'
        }
      }
      
      // Return structured error
      return Promise.reject({
        status,
        message: data?.message || data?.error || 'An error occurred',
        data: data,
        response: error.response
      })
    }
    
    return Promise.reject({
      message: error.message || 'An unexpected error occurred',
      error
    })
  }
)

// Health check API
export const healthAPI = {
  check: () => api.get('/health'),
  test: () => api.get('/test'),
}

// Auth API
export const authAPI = {
  login: async (credentials) => {
    try {
      const response = await fetchWithRetry(() => api.post('/auth/login', credentials))
      return response
    } catch (error) {
      throw error
    }
  },
  
  register: async (userData) => {
    try {
      const response = await fetchWithRetry(() => api.post('/auth/register', userData))
      return response
    } catch (error) {
      throw error
    }
  },
  
  getCurrentUser: async () => {
    try {
      const response = await fetchWithRetry(() => api.get('/candidate/me'))
      return response
    } catch (error) {
      throw error
    }
  },
}

// Candidate API
export const candidateAPI = {
  getProfile: () => api.get('/candidate/me'),
  updateProfile: (data) => api.put('/candidate/update', data),
}

// Application API
export const applicationAPI = {
  submitApplication: (formData) => {
    return fetchWithRetry(() => api.post('/application/submit', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000, // 30 seconds for file uploads
    }))
  },
  
  getMyApplication: () => fetchWithRetry(() => api.get('/application/me')),
  
  getMyApplications: () => fetchWithRetry(() => api.get('/application/my-applications')),
  
  getAllApplications: () => fetchWithRetry(() => api.get('/application/admin/all')),
  
  updateApplicationStatus: (id, status) => 
    fetchWithRetry(() => api.put(`/application/admin/update-status/${id}`, { status })),
  
  searchApplications: (params) => 
    fetchWithRetry(() => api.get('/application/admin/search', { params })),
  
  downloadResume: (filename) => 
    fetchWithRetry(() => api.get(`/application/admin/resume/${filename}`, { 
      responseType: 'blob',
      timeout: 30000 
    })),
}

// Job API
export const jobAPI = {
  getAllJobs: () => fetchWithRetry(() => api.get('/jobs')),
  getFeaturedJobs: () => fetchWithRetry(() => api.get('/jobs/featured')),
  getJobById: (id) => fetchWithRetry(() => api.get(`/jobs/${id}`)),
  searchJobs: (params) => fetchWithRetry(() => api.get('/jobs/search', { params })),
  getJobFilters: () => fetchWithRetry(() => api.get('/jobs/filters')),
}

// Test backend connection
export const testBackendConnection = async () => {
  try {
    const response = await fetchWithRetry(() => healthAPI.check())
    return { success: true, data: response.data }
  } catch (error) {
    return { 
      success: false, 
      error: error.message || 'Backend connection failed' 
    }
  }
}

export default api
