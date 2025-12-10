import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { candidateAPI } from '../../services/api'
import { User, Mail, Save, Briefcase, Camera, Upload, X } from 'lucide-react'
import '../../styles/Applications.css'

const Profile = () => {
  const { user, logout } = useAuth()
  const fileInputRef = useRef(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profilePhoto: null
  })
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [photoUploading, setPhotoUploading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        profilePhoto: user.profilePhoto || null
      })
      // Set initial photo preview if user has a profile photo
      if (user.profilePhoto) {
        setProfilePhotoPreview(user.profilePhoto)
      }
    }
  }, [user])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setSuccess(false)
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (JPG, PNG, etc.)')
        return
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Image size should be less than 5MB')
        return
      }

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePhotoPreview(reader.result)
        setFormData({
          ...formData,
          profilePhoto: file
        })
        setSuccess(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const removePhoto = () => {
    setProfilePhotoPreview(null)
    setFormData({
      ...formData,
      profilePhoto: null
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    setSuccess(false)
  }

  const uploadProfilePhoto = async () => {
    if (!formData.profilePhoto || formData.profilePhoto instanceof File === false) {
      return null
    }

    setPhotoUploading(true)
    const photoFormData = new FormData()
    photoFormData.append('profilePhoto', formData.profilePhoto)

    try {
      const response = await candidateAPI.uploadProfilePhoto(photoFormData)
      return response.data.profilePhotoUrl
    } catch (error) {
      console.error('Failed to upload profile photo:', error)
      throw error
    } finally {
      setPhotoUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Upload profile photo first if there's a new one
      let profilePhotoUrl = null
      if (formData.profilePhoto && formData.profilePhoto instanceof File) {
        profilePhotoUrl = await uploadProfilePhoto()
      } else if (formData.profilePhoto && typeof formData.profilePhoto === 'string') {
        profilePhotoUrl = formData.profilePhoto
      }

      // Update profile with photo URL
      const profileData = {
        name: formData.name,
        email: formData.email,
        profilePhoto: profilePhotoUrl
      }

      await candidateAPI.updateProfile(profileData)
      setSuccess(true)
      
      // Update user context with new photo
      // Note: In a real app, you'd update the auth context here
    } catch (error) {
      console.error('Failed to update profile:', error)
      alert('Failed to update profile. Please try again.')
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
            {/* Profile Photo Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-6">
                <h3 className="text-xl font-semibold flex items-center">
                  <Camera className="w-6 h-6 mr-3" />
                  Profile Photo
                </h3>
              </div>
              <div className="p-8">
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                  {/* Profile Photo Preview */}
                  <div className="relative group">
                    {profilePhotoPreview ? (
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
                        <img
                          src={profilePhotoPreview}
                          alt="Profile"
                          className="relative w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-300"
                        />
                        <button
                          onClick={removePhoto}
                          className="absolute -top-3 -right-3 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-all duration-300 shadow-lg hover:shadow-xl group-hover:scale-110"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
                        <div className="relative w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-300">
                          <User className="w-16 h-16 text-blue-500" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Upload Controls */}
                  <div className="flex-1 text-center md:text-left">
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold mb-2 text-gray-800">Professional Profile Picture</h4>
                      <p className="text-gray-600">
                        Upload a professional photo that represents you well. JPG, PNG formats only. Max size: 5MB.
                      </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                        id="profile-photo-input"
                      />
                      
                      <label
                        htmlFor="profile-photo-input"
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer inline-flex items-center"
                      >
                        <Upload className="w-5 h-5 mr-2" />
                        {profilePhotoPreview ? 'Change Photo' : 'Upload Photo'}
                      </label>
                      
                      {photoUploading && (
                        <div className="flex items-center text-blue-600 font-medium">
                          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-3"></div>
                          Uploading...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

        {/* Enhanced Profile Information */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-6">
            <h3 className="text-xl font-semibold flex items-center">
              <User className="w-6 h-6 mr-3" />
              Personal Information
            </h3>
          </div>
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {success && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl text-sm font-medium shadow-md animate-pulse">
                  Profile updated successfully!
                </div>
              )}

              {/* Enhanced Name Field */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                  Full Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-blue-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-gray-800 placeholder-gray-400 hover:border-gray-300"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              {/* Enhanced Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-blue-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-gray-800 placeholder-gray-400 hover:border-gray-300"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Enhanced Submit Button */}
              <button
                type="submit"
                disabled={loading || photoUploading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none inline-flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-6 h-6 mr-3" />
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
