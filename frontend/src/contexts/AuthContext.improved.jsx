import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing token on mount
    const initAuth = async () => {
      const token = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')
      
      if (token && storedUser) {
        try {
          // Parse stored user
          const userData = JSON.parse(storedUser)
          setUser(userData)
        } catch (error) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        }
      }
      
      setLoading(false)
    }

    initAuth()
  }, [])

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password })
      
      // Handle the response structure from your backend
      const { data } = response
      
      // Check if the response has the expected structure
      if (!data) {
        throw new Error('Invalid response from server')
      }
      
      // Your backend returns: { success: true, message: "...", data: { token, email, name, role } }
      const authData = data.data || data
      
      if (!authData.token) {
        throw new Error('No token received from server')
      }
      
      // Store token
      localStorage.setItem('token', authData.token)
      
      // Create user object
      const userData = {
        email: authData.email,
        name: authData.name,
        role: authData.role
      }
      
      // Store user
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
      
      return { 
        success: true,
        user: userData
      }
    } catch (error) {
      let errorMessage = 'Login failed'
      
      if (error.message) {
        errorMessage = error.message
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        errorMessage = 'Cannot connect to server. Please check if the backend is running on port 8080.'
      }
      
      return { 
        success: false, 
        error: errorMessage
      }
    }
  }

  const register = async (name, email, password) => {
    try {
      const response = await authAPI.register({ name, email, password })
      
      const { data } = response
      
      return { 
        success: true, 
        message: data.message || 'Registration successful. Please login with your credentials.'
      }
    } catch (error) {
      let errorMessage = 'Registration failed'
      
      if (error.message) {
        errorMessage = error.message
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        errorMessage = 'Cannot connect to server. Please check if the backend is running on port 8080.'
      }
      
      return { 
        success: false, 
        error: errorMessage
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    isCandidate: user?.role === 'CANDIDATE'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
