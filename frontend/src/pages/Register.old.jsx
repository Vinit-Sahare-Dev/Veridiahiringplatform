import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';
import '../styles/auth.css';
import { Eye, EyeOff, Mail, Lock, User, Briefcase, AlertCircle, CheckCircle, Check } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [agreeToTerms, setAgreeToTerms] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Clear error for this field
    setErrors(prev => ({ ...prev, [e.target.name]: '' }))
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!agreeToTerms) {
      newErrors.terms = 'You must agree to the terms and conditions'
    }
    
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validateForm()
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    
    setLoading(true)
    setErrors({})
    
    try {
      const result = await register(formData.name, formData.email, formData.password)
      
      if (result.success) {
        navigate('/login', { 
          state: { message: result.message || 'Registration successful! Please login with your credentials.' }
        })
      } else {
        setErrors({ general: result.error || 'Registration failed. Please try again.' })
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const passwordStrength = (password) => {
    if (!password) return { strength: 0, text: '', color: '' }
    
    let strength = 0
    if (password.length >= 6) strength++
    if (password.length >= 10) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^a-zA-Z\d]/.test(password)) strength++
    
    const levels = [
      { text: 'Very Weak', color: 'bg-red-500' },
      { text: 'Weak', color: 'bg-orange-500' },
      { text: 'Fair', color: 'bg-yellow-500' },
      { text: 'Good', color: 'bg-blue-500' },
      { text: 'Strong', color: 'bg-green-500' }
    ]
    
    return { strength, ...levels[strength] }
  }

  const strength = passwordStrength(formData.password)

  return (
    <div className="auth-layout">
      <div className="auth-container">
        <div className="auth-card">
          {/* Header Section */}
          <div className="auth-header">
            <div className="auth-logo">
              <Briefcase className="w-8 h-8" />
            </div>
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join Veridia and start your career journey</p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="auth-form">
            {/* Error Message */}
            {errors.general && (
              <div className="auth-alert auth-alert-error">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>{errors.general}</p>
              </div>
            )}

            {/* Name Field */}
            <div className="auth-form-group">
              <label className="auth-label">Full Name</label>
              <div className="auth-input-wrapper">
                <User className="auth-input-icon" />
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={`auth-input ${errors.name ? 'error' : ''}`}
                />
              </div>
              {errors.name && (
                <p className="auth-error-text">{errors.name}</p>
              )}
            </div>

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
                  className={`auth-input ${errors.email ? 'error' : ''}`}
                />
              </div>
              {errors.email && (
                <p className="auth-error-text">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="auth-form-group">
              <label className="auth-label">Password</label>
              <div className="auth-input-wrapper">
                <Lock className="auth-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Create a password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`auth-input ${errors.password ? 'error' : ''}`}
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
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="auth-password-strength">
                  <div className="auth-password-strength-bar">
                    <div 
                      className={`auth-password-strength-fill ${strength.color}`}
                      style={{ width: `${(strength.strength / 5) * 100}%` }}
                    ></div>
                  </div>
                  <p className="auth-password-strength-text">
                    Password strength: <span className="font-medium">{strength.text}</span>
                  </p>
                </div>
              )}
              
              {/* Password Requirements */}
              <div className="auth-password-requirements">
                <div className={`auth-requirement ${formData.password.length >= 6 ? 'auth-requirement-met' : ''}`}>
                  <Check className="w-3 h-3" />
                  At least 6 characters
                </div>
                <div className={`auth-requirement ${/[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password) ? 'auth-requirement-met' : ''}`}>
                  <Check className="w-3 h-3" />
                  Uppercase and lowercase letters
                </div>
                <div className={`auth-requirement ${/\d/.test(formData.password) ? 'auth-requirement-met' : ''}`}>
                  <Check className="w-3 h-3" />
                  At least one number
                </div>
              </div>
              
              {errors.password && (
                <p className="auth-error-text">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="auth-form-group">
              <label className="auth-label">Confirm Password</label>
              <div className="auth-input-wrapper">
                <Lock className="auth-input-icon" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`auth-input ${errors.confirmPassword ? 'error' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="auth-password-toggle"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="auth-error-text">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div>
              <label className="auth-checkbox-label">
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="auth-checkbox"
                />
                <span>
                  I agree to the{' '}
                  <Link to="/terms" className="auth-link">
                    Terms and Conditions
                  </Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="auth-link">
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.terms && (
                <p className="auth-error-text">{errors.terms}</p>
              )}
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
                  <span>Creating Account...</span>
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Already have account */}
          <div className="auth-footer">
            <div className="auth-footer-section">
              <p className="auth-footer-text">
                Already have an account?{' '}
                <Link to="/login" className="auth-footer-link">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-sm text-gray-600 mt-6">
          By registering, you're joining 10,000+ professionals
        </p>
      </div>
    </div>
  )
}

export default Register