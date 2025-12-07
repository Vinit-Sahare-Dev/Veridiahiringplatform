import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

// Create axios instance with timeout
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
})

// Add request interceptor to include auth token
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

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error)
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status
    })
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      console.error('Backend server not running. Please start the backend server.')
    }
    
    return Promise.reject(error)
  }
)

// Health check API
export const healthAPI = {
  check: () => api.get('/health'),
  test: () => api.get('/test'),
}

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/candidate/me'),
}

// Candidate API
export const candidateAPI = {
  getProfile: () => api.get('/candidate/me'),
  updateProfile: (data) => api.put('/candidate/update', data),
}

// Application API
export const applicationAPI = {
  submitApplication: (formData) => {
    const formDataObj = new FormData()
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== undefined) {
        formDataObj.append(key, formData[key])
      }
    })
    return api.post('/application/submit', formDataObj, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  getMyApplication: () => api.get('/application/me'),
  getAllApplications: () => api.get('/application/admin/all'),
  updateApplicationStatus: (id, status) => 
    api.put(`/application/admin/update-status/${id}`, { status }),
  searchApplications: (params) => api.get('/application/admin/search', { params }),
  downloadResume: (filename) => 
    api.get(`/application/admin/resume/${filename}`, { responseType: 'blob' }),
}

export default api
