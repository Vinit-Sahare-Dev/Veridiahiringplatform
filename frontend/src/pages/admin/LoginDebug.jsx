import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, Shield } from 'lucide-react'

const AdminLoginDebug = () => {
  const [formData, setFormData] = useState({
    email: 'admin@veridia.com',
    password: 'admin123'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [debug, setDebug] = useState('')

  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setDebug('')

    try {
      setDebug('Attempting login...')
      
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      setDebug(`Response status: ${response.status}`)
      
      if (response.ok) {
        const data = await response.json()
        setDebug('Login successful! Response: ' + JSON.stringify(data, null, 2))
        
        if (data.token) {
          localStorage.setItem('token', data.token)
          localStorage.setItem('user', JSON.stringify({
            email: data.email,
            name: data.name,
            role: data.role || 'admin'
          }))
          navigate('/admin/dashboard')
        } else {
          setError('No token in response')
        }
      } else {
        const errorText = await response.text()
        setDebug(`Error response: ${errorText}`)
        setError(`Login failed: ${response.status} - ${errorText}`)
      }
    } catch (error) {
      setDebug(`Network error: ${error.message}`)
      setError(`Network error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-secondary-50 to-primary-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-secondary-900">Admin Login (Debug)</h2>
          <p className="text-secondary-600">Test login with detailed debugging</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-secondary-700">Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-secondary-700">Password</label>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
          
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        {debug && (
          <div className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-3 rounded text-sm">
            <pre>{debug}</pre>
          </div>
        )}
        
        <div className="text-center">
          <Link to="/admin/login" className="text-primary-600 hover:text-primary-700">
            Back to normal login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AdminLoginDebug
