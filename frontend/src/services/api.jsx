import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
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
    console.log(`[API] ${config.method.toUpperCase()} ${config.url}`)
    console.log('[API] Headers:', config.headers)
    console.log('[API] Token exists:', !!token)
    return config
  },
  (error) => {
    console.error('[API] Request error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`[API] Response from ${response.config.url}:`, response.status)
    return response
  },
  (error) => {
    console.error('[API] Response error:', error)
    
    // Handle different error types
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      console.error('❌ Backend server not running on port 8080')
      return Promise.reject({
        code: error.code,
        message: 'Cannot connect to server. Please ensure the backend is running on port 8080.'
      })
    }
    
    if (error.response) {
      const { status, data } = error.response
      
      // Handle 401 Unauthorized
      if (status === 401) {
        console.warn('⚠️ Unauthorized access - clearing session')
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
      console.log('[AUTH] Attempting login for:', credentials.email)
      const response = await api.post('/auth/login', credentials)
      console.log('[AUTH] Login successful')
      return response
    } catch (error) {
      console.error('[AUTH] Login failed:', error)
      throw error
    }
  },
  
  register: async (userData) => {
    try {
      console.log('[AUTH] Attempting registration for:', userData.email)
      const response = await api.post('/auth/register', userData)
      console.log('[AUTH] Registration successful')
      return response
    } catch (error) {
      console.error('[AUTH] Registration failed:', error)
      throw error
    }
  },
  
  getCurrentUser: async () => {
    try {
      const response = await api.get('/candidate/me')
      return response
    } catch (error) {
      console.error('[AUTH] Get current user failed:', error)
      throw error
    }
  },
}

// Candidate API
export const candidateAPI = {
  getProfile: () => api.get('/candidate/me'),
  updateProfile: (data) => api.put('/candidate/update', data),
  uploadProfilePhoto: (formData) => api.post('/candidate/upload-photo', formData, {
    headers: {
      // Don't set Content-Type - let browser set it with boundary
    },
    timeout: 30000, // 30 seconds for file uploads
  }),
}

// Application API
export const applicationAPI = {
  submitApplication: (formData) => {
    // FormData automatically sets Content-Type with boundary
    return api.post('/application/submit', formData, {
      headers: {
        // Don't set Content-Type - let browser set it with boundary
      },
      timeout: 30000, // 30 seconds for file uploads
    })
  },
  
  getMyApplication: () => api.get('/application/me'),
  
  getMyApplications: () => api.get('/application/my-applications'),
  
  getAllApplications: () => api.get('/application/admin/all'),
  
  updateApplicationStatus: (id, status) => 
    api.put(`/application/admin/update-status/${id}`, { status }),
  
  searchApplications: (params) => 
    api.get('/application/admin/search', { params }),
  
  downloadResume: (filename) => 
    api.get(`/application/admin/resume/${filename}`, { 
      responseType: 'blob',
      timeout: 30000 
    }),
}

// Job API
export const jobAPI = {
  getAllJobs: () => api.get('/jobs'),
  getFeaturedJobs: () => api.get('/jobs/featured'),
  getJobById: (id) => api.get(`/jobs/${id}`),
  searchJobs: (params) => api.get('/jobs/search', { params }),
  getJobFilters: () => api.get('/jobs/filters'),
}

// Test backend connection
export const testBackendConnection = async () => {
  try {
    console.log('🔍 Testing backend connection...')
    const response = await healthAPI.check()
    console.log('✅ Backend is running:', response.data)
    return { success: true, data: response.data }
  } catch (error) {
    console.error('❌ Backend connection failed:', error)
    return { 
      success: false, 
      error: error.message || 'Backend connection failed' 
    }
  }
}

export default api