import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';
import '../styles/Login.css';
import { Eye, EyeOff, Mail, Lock, Briefcase, Shield, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message)
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccessMessage('')

    try {
      const result = await login(formData.email, formData.password)
      
      if (result.success) {
        setSuccessMessage('Login successful! Redirecting...')
        setTimeout(() => {
          navigate('/candidate/dashboard')
        }, 1500)
      } else {
        setError(result.error || 'Login failed. Please try again.')
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-layout">
      <div className="auth-container">
        <div className="auth-card">
          {/* Header Section */}
          <div className="auth-header">
            <div className="auth-logo">
              <Briefcase className="w-8 h-8" />
            </div>
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to continue your journey</p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="auth-form">
            {/* Success Message */}
            {successMessage && (
              <div className="auth-alert auth-alert-success">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <p>{successMessage}</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="auth-alert auth-alert-error">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* Email Field */}
            <div className="auth-form-group">
              <label className="auth-label">Email Address</label>
              <div className="auth-input-wrapper">
                <Mail className="auth-input-icon" />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="auth-input"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="auth-form-group">
              <div className="auth-label-row">
                <label className="auth-label">Password</label>
                <Link 
                  to="/forgot-password" 
                  className="auth-link"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="auth-input-wrapper">
                <Lock className="auth-input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="auth-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="auth-password-toggle"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="auth-button"
            >
              {loading ? (
                <>
                  <div className="auth-spinner"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="auth-divider">
            <div className="auth-divider-line"></div>
            <span className="auth-divider-text">or</span>
            <div className="auth-divider-line"></div>
          </div>

          {/* Additional Links */}
          <div className="auth-footer">
            <div className="auth-footer-section">
              <p className="auth-footer-text">
                Don't have an account?{' '}
                <Link to="/register" className="auth-footer-link">
                  Create an account
                </Link>
              </p>
            </div>
            <div className="auth-footer-section">
              <p className="auth-footer-text">
                Are you an admin?{' '}
                <Link to="/admin/login" className="auth-footer-link inline-flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  Admin Login
                </Link>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Login