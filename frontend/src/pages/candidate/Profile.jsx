import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { candidateAPI } from '../../services/api'
import { User, Mail, Save, Briefcase } from 'lucide-react'

const Profile = () => {
  const { user, logout } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email
      })
    }
  }, [user])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setSuccess(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await candidateAPI.updateProfile(formData)
      setSuccess(true)
      // Update user context
      // Note: In a real app, you'd update the auth context here
    } catch (error) {
      console.error('Failed to update profile:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">Profile Settings</h1>
        <p className="text-secondary-600">Manage your personal information and account settings</p>
      </div>

      <div className="space-y-8">
        {/* Profile Information */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-secondary-900 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Personal Information
            </h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-6">
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                  Profile updated successfully!
                </div>
              )}

              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-secondary-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-secondary-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-secondary-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Account Information */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-secondary-900 flex items-center">
              <Briefcase className="w-5 h-5 mr-2" />
              Account Information
            </h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-secondary-200">
                <div>
                  <p className="font-medium text-secondary-900">Account Type</p>
                  <p className="text-sm text-secondary-600">Your role in the system</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  Candidate
                </span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-secondary-200">
                <div>
                  <p className="font-medium text-secondary-900">Member Since</p>
                  <p className="text-sm text-secondary-600">When you joined the platform</p>
                </div>
                <span className="text-sm text-secondary-600">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="card border-red-200">
          <div className="card-header bg-red-50">
            <h3 className="text-lg font-semibold text-red-900">Danger Zone</h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-secondary-900">Sign Out</p>
                  <p className="text-sm text-secondary-600">Sign out of your current session</p>
                </div>
                <button
                  onClick={logout}
                  className="btn-secondary text-red-600 border-red-300 hover:bg-red-50"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
