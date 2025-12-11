import React, { useState, useEffect, useRef, useNavigate } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { candidateAPI } from '../../services/api'
import { 
  User, 
  Camera, 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Github, 
  Globe, 
  Save, 
  Briefcase,
  Code,
  ExternalLink,
  Sparkles,
  Plus,
  X,
  GraduationCap,
  Award,
  FileText,
  CheckCircle
} from 'lucide-react'
import '../../styles/Applications.css'

const Profile = () => {
  const { user, logout } = useAuth()
  const fileInputRef = useRef(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profilePhoto: null,
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: '',
    skills: [],
    education: {
      degree: '',
      institution: '',
      graduationYear: '',
      field: ''
    },
    experience: {
      hasExperience: false,
      position: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    },
    projects: []
  })
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [photoUploading, setPhotoUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showSkillPopup, setShowSkillPopup] = useState(false)
  const [lastAddedSkill, setLastAddedSkill] = useState('')

  useEffect(() => {
    if (user) {
      // Load from localStorage if available
      const savedProfile = localStorage.getItem('userProfile')
      const profileData = savedProfile ? JSON.parse(savedProfile) : {}
      
      // Set profile photo with proper priority: localStorage > user data
      const profilePhoto = profileData.profilePhoto || user.profilePhoto || null
      
      setFormData({
        name: user.name || profileData.name || '',
        email: user.email || profileData.email || '',
        profilePhoto: profilePhoto,
        phone: profileData.phone || '',
        location: profileData.location || '',
        linkedin: profileData.linkedin || '',
        github: profileData.github || '',
        portfolio: profileData.portfolio || '',
        skills: profileData.skills || [],
        education: profileData.education || {
          degree: '',
          institution: '',
          graduationYear: '',
          field: ''
        },
        experience: profileData.experience || {
          hasExperience: false,
          position: '',
          company: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          description: ''
        },
        projects: profileData.projects || []
      })
      
      // Set photo preview with proper priority
      const savedPhoto = localStorage.getItem('profilePhoto')
      const photoToUse = profilePhoto || savedPhoto
      console.log('Photo loading debug:', {
        profilePhoto,
        savedPhoto,
        photoToUse,
        profileData: profileData.profilePhoto
      })
      if (photoToUse) {
        setProfilePhotoPreview(photoToUse)
      }
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value, type } = e.target
    const newValue = type === 'checkbox' ? e.target.checked : value
    
    // Handle nested object properties (e.g., "education.degree", "experience.position")
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: newValue
        }
      }))
      // Save to localStorage
      const updatedData = {
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: newValue
        }
      }
      localStorage.setItem('userProfile', JSON.stringify(updatedData))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: newValue
      }))
      // Save to localStorage
      const updatedData = {
        ...formData,
        [name]: newValue
      }
      localStorage.setItem('userProfile', JSON.stringify(updatedData))
    }
    
    setSuccess(false)
  }

  const handleSkillChange = (skill, action) => {
    let newSkills
    if (action === 'add') {
      // Check if skill already exists
      if (formData.skills.includes(skill)) {
        return
      }
      newSkills = [...formData.skills, skill]
      setLastAddedSkill(skill)
      setShowSkillPopup(true)
      
      // Auto-hide popup after 2 seconds
      setTimeout(() => {
        setShowSkillPopup(false)
      }, 2000)
    } else {
      newSkills = formData.skills.filter(s => s !== skill)
    }
    
    setFormData(prev => ({
      ...prev,
      skills: newSkills
    }))
    
    // Save to localStorage
    const updatedData = {
      ...formData,
      skills: newSkills
    }
    localStorage.setItem('userProfile', JSON.stringify(updatedData))
    
    setSuccess(false)
  }

  const addProject = () => {
    const newProjects = [...formData.projects, {
      name: '',
      description: '',
      technologies: '',
      githubUrl: '',
      liveUrl: ''
    }]
    
    setFormData(prev => ({
      ...prev,
      projects: newProjects
    }))
    
    // Save to localStorage
    const updatedData = {
      ...formData,
      projects: newProjects
    }
    localStorage.setItem('userProfile', JSON.stringify(updatedData))
  }

  const updateProject = (index, field, value) => {
    const newProjects = formData.projects.map((project, i) => 
      i === index ? { ...project, [field]: value } : project
    )
    
    setFormData(prev => ({
      ...prev,
      projects: newProjects
    }))
    
    // Save to localStorage
    const updatedData = {
      ...formData,
      projects: newProjects
    }
    localStorage.setItem('userProfile', JSON.stringify(updatedData))
  }

  const removeProject = (index) => {
    const newProjects = formData.projects.filter((_, i) => i !== index)
    
    setFormData(prev => ({
      ...prev,
      projects: newProjects
    }))
    
    // Save to localStorage
    const updatedData = {
      ...formData,
      projects: newProjects
    }
    localStorage.setItem('userProfile', JSON.stringify(updatedData))
  }

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Photo size should be less than 5MB')
        return
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }

      setPhotoUploading(true)
      
      try {
        // Create preview immediately
        const reader = new FileReader()
        reader.onloadend = async () => {
          const previewUrl = reader.result
          setProfilePhotoPreview(previewUrl)
          
          // Update form data with the file
          setFormData({
            ...formData,
            profilePhoto: file
          })
          
          // Auto-upload and save photo immediately
          try {
            const photoFormData = new FormData()
            photoFormData.append('profilePhoto', file)
            
            const response = await candidateAPI.uploadProfilePhoto(photoFormData)
            const photoUrl = response.data.profilePhotoUrl
            
            // Update form data with the uploaded URL
            setFormData(prev => {
              const updatedData = {
                ...prev,
                profilePhoto: photoUrl
              }
              // Save to localStorage immediately with updated data
              localStorage.setItem('userProfile', JSON.stringify(updatedData))
              localStorage.setItem('profilePhoto', photoUrl)
              return updatedData
            })
            
            // Show success feedback
            setSuccess(true)
            setTimeout(() => setSuccess(false), 2000)
            
          } catch (uploadError) {
            console.error('Failed to upload photo:', uploadError)
            // Fallback to localStorage with base64
            setFormData(prev => {
              const updatedData = {
                ...prev,
                profilePhoto: previewUrl
              }
              // Save to both localStorage locations
              localStorage.setItem('userProfile', JSON.stringify(updatedData))
              localStorage.setItem('profilePhoto', previewUrl)
              return updatedData
            })
            
            // Still show success since it's saved locally
            setSuccess(true)
            setTimeout(() => setSuccess(false), 2000)
          }
        }
        reader.readAsDataURL(file)
      } catch (error) {
        console.error('Photo processing error:', error)
        alert('Failed to process photo. Please try again.')
      } finally {
        setPhotoUploading(false)
      }
    }
  }

  const removePhoto = () => {
    setProfilePhotoPreview(null)
    setFormData({
      ...formData,
      profilePhoto: null
    })
    
    // Auto-save removal to localStorage immediately
    const updatedData = {
      ...formData,
      profilePhoto: null
    }
    localStorage.setItem('userProfile', JSON.stringify(updatedData))
    localStorage.removeItem('profilePhoto')
    
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    
    // Show success feedback
    setSuccess(true)
    setTimeout(() => setSuccess(false), 2000)
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
      const photoUrl = response.data.profilePhotoUrl
      // Save to localStorage as backup
      localStorage.setItem('profilePhoto', photoUrl)
      return photoUrl
    } catch (error) {
      console.error('Failed to upload profile photo:', error)
      // If upload fails, save to localStorage as base64 fallback
      const reader = new FileReader()
      return new Promise((resolve) => {
        reader.onloadend = () => {
          const base64data = reader.result
          localStorage.setItem('profilePhoto', base64data)
          resolve(base64data)
        }
        reader.readAsDataURL(formData.profilePhoto)
      })
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
        // Save to localStorage as fallback
        localStorage.setItem('profilePhoto', profilePhotoUrl)
      } else if (formData.profilePhoto && typeof formData.profilePhoto === 'string') {
        profilePhotoUrl = formData.profilePhoto
        // Save to localStorage as fallback
        localStorage.setItem('profilePhoto', profilePhotoUrl)
      }

      // Update profile with all data
      const profileData = {
        name: formData.name,
        email: formData.email,
        profilePhoto: profilePhotoUrl,
        phone: formData.phone,
        location: formData.location,
        linkedin: formData.linkedin,
        github: formData.github,
        portfolio: formData.portfolio,
        skills: formData.skills,
        education: formData.education,
        experience: formData.experience,
        projects: formData.projects
      }

      // Save complete profile to localStorage
      localStorage.setItem('userProfile', JSON.stringify(formData))

      // Try to save to database
      try {
        await candidateAPI.updateProfile(profileData)
        setSuccess(true)
      } catch (dbError) {
        console.error('Database save failed, but localStorage backup created:', dbError)
        setSuccess(true) // Still show success since data is saved locally
      }
      
    } catch (error) {
      console.error('Failed to update profile:', error)
      alert('Failed to update profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="careers-container" style={{marginTop: 0, paddingTop: 0}}>
      {/* Hero Section */}
      <section className="careers-hero" style={{paddingTop: '0.5rem', paddingBottom: '0.25rem'}}>
        <div className="careers-hero-content">
          <div className="careers-hero-badge">
            <Sparkles className="w-4 h-4" />
            Your Profile Settings
          </div>
          
          <h1 className="careers-hero-title">
            Manage Your <span className="text-gradient">Profile</span>
          </h1>
          
          <p className="careers-hero-description">
            Update your personal information and manage your professional profile.
            Keep your details current for better opportunities.
          </p>
        </div>
      </section>

      {/* Main Content - Ultimate Unified Profile */}
      <div className="w-full px-4 py-6">
        <div className="w-full mx-auto">
          {/* Ultimate Profile Card */}
          <div className="profile-card w-full">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-lg">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center">
                  <User className="w-6 h-6 mr-3" />
                  Complete Profile
                </h2>
                <div className="flex items-center space-x-4">
                  {profilePhotoPreview && (
                    <img
                      src={profilePhotoPreview}
                      alt="Profile"
                      className="w-16 h-16 rounded-full border-3 border-white shadow-lg"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Unified Profile Form */}
            <div className="p-6 w-full">
              <form onSubmit={handleSubmit} className="space-y-8 w-full">
                {/* Success Message */}
                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm font-medium">
                    Profile updated successfully!
                  </div>
                )}

                {/* Section 1: Profile Photo */}
                <div className="border-b pb-8">
                  <div className="flex items-center mb-4">
                    <Camera className="w-5 h-5 text-blue-500 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-800">Profile Photo</h3>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      {profilePhotoPreview ? (
                        <div className="relative">
                          <img
                            src={profilePhotoPreview}
                            alt="Profile"
                            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                          />
                          <button
                            onClick={removePhoto}
                            className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                            disabled={photoUploading}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                          <User className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                        id="profile-photo-input"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors font-medium text-sm"
                        disabled={photoUploading}
                      >
                        {photoUploading ? 'Uploading...' : 'Upload Photo'}
                      </button>
                      <p className="text-xs text-gray-500 mt-1">Professional headshot recommended</p>
                    </div>
                  </div>
                </div>

                {/* Section 2: Personal Information */}
                <div className="border-b pb-8">
                  <div className="flex items-center mb-4">
                    <User className="w-5 h-5 text-blue-500 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                        Full Name
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-blue-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all duration-300 text-gray-800 placeholder-gray-400 hover:border-gray-300 text-base"
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                        Email Address
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-blue-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all duration-300 text-gray-800 placeholder-gray-400 hover:border-gray-300 text-base"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 3: Contact Information */}
                <div className="border-b pb-8">
                  <div className="flex items-center mb-4">
                    <Phone className="w-5 h-5 text-blue-500 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-800">Contact Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">
                        Phone
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-blue-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all duration-300 text-gray-800 placeholder-gray-400 hover:border-gray-300 text-base"
                          placeholder="Phone number"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="location" className="block text-sm font-semibold text-gray-700">
                        Location
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin className="h-5 w-5 text-blue-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                        <input
                          id="location"
                          name="location"
                          type="text"
                          value={formData.location}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all duration-300 text-gray-800 placeholder-gray-400 hover:border-gray-300 text-base"
                          placeholder="City, Country"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="space-y-2">
                      <label htmlFor="linkedin" className="block text-sm font-semibold text-gray-700">
                        LinkedIn
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Linkedin className="h-5 w-5 text-blue-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                        <input
                          id="linkedin"
                          name="linkedin"
                          type="url"
                          value={formData.linkedin}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all duration-300 text-gray-800 placeholder-gray-400 hover:border-gray-300 text-base"
                          placeholder="LinkedIn profile"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="github" className="block text-sm font-semibold text-gray-700">
                        GitHub
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Github className="h-5 w-5 text-blue-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                        <input
                          id="github"
                          name="github"
                          type="url"
                          value={formData.github}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all duration-300 text-gray-800 placeholder-gray-400 hover:border-gray-300 text-base"
                          placeholder="GitHub profile"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="portfolio" className="block text-sm font-semibold text-gray-700">
                        Portfolio
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Globe className="h-5 w-5 text-blue-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                        <input
                          id="portfolio"
                          name="portfolio"
                          type="url"
                          value={formData.portfolio}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all duration-300 text-gray-800 placeholder-gray-400 hover:border-gray-300 text-base"
                          placeholder="Portfolio URL"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 4: Skills */}
                <div className="border-b pb-8">
                  <div className="flex items-center mb-4">
                    <Award className="w-5 h-5 text-blue-500 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-800">Skills</h3>
                  </div>
                  
                  <div className="flex gap-3 mb-4">
                    <input
                      type="text"
                      id="skillInput"
                      className="flex-1 px-3 py-3 border border-gray-200 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all duration-300 text-gray-800 placeholder-gray-400 hover:border-gray-300 text-base"
                      placeholder="Add a skill (e.g., JavaScript)"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.target.value.trim()) {
                          handleSkillChange(e.target.value.trim(), 'add')
                          e.target.value = ''
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById('skillInput')
                        if (input.value.trim()) {
                          handleSkillChange(input.value.trim(), 'add')
                          input.value = ''
                        }
                      }}
                      className="px-4 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium text-base"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {formData.skills && formData.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((skill, index) => (
                        <span key={index} className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-base font-medium flex items-center gap-2">
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleSkillChange(skill, 'remove')}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Section 5: Education */}
                <div className="border-b pb-8">
                  <div className="flex items-center mb-4">
                    <GraduationCap className="w-5 h-5 text-blue-500 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-800">Education</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="degree" className="block text-sm font-semibold text-gray-700">
                        Degree
                      </label>
                      <input
                        id="degree"
                        name="education.degree"
                        type="text"
                        value={formData.education.degree}
                        onChange={handleChange}
                        className="w-full px-3 py-3 border border-gray-200 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all duration-300 text-gray-800 placeholder-gray-400 hover:border-gray-300 text-base"
                        placeholder="e.g., Bachelor of Science"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="institution" className="block text-sm font-semibold text-gray-700">
                        Institution
                      </label>
                      <input
                        id="institution"
                        name="education.institution"
                        type="text"
                        value={formData.education.institution}
                        onChange={handleChange}
                        className="w-full px-3 py-3 border border-gray-200 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all duration-300 text-gray-800 placeholder-gray-400 hover:border-gray-300 text-base"
                        placeholder="University name"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="graduationYear" className="block text-sm font-semibold text-gray-700">
                        Graduation Year
                      </label>
                      <input
                        id="graduationYear"
                        name="education.graduationYear"
                        type="text"
                        value={formData.education.graduationYear}
                        onChange={handleChange}
                        className="w-full px-3 py-3 border border-gray-200 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all duration-300 text-gray-800 placeholder-gray-400 hover:border-gray-300 text-base"
                        placeholder="e.g., 2020"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="field" className="block text-sm font-semibold text-gray-700">
                        Field of Study
                      </label>
                      <input
                        id="field"
                        name="education.field"
                        type="text"
                        value={formData.education.field}
                        onChange={handleChange}
                        className="w-full px-3 py-3 border border-gray-200 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all duration-300 text-gray-800 placeholder-gray-400 hover:border-gray-300 text-base"
                        placeholder="e.g., Computer Science"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 6: Work Experience */}
                <div className="border-b pb-8">
                  <div className="flex items-center mb-4">
                    <Briefcase className="w-5 h-5 text-blue-500 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-800">Work Experience</h3>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-4">
                    <input
                      type="checkbox"
                      id="hasExperience"
                      name="experience.hasExperience"
                      checked={formData.experience.hasExperience}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="hasExperience" className="text-sm font-medium text-gray-700">
                      I have work experience
                    </label>
                  </div>

                  {formData.experience.hasExperience && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="position" className="block text-sm font-semibold text-gray-700">
                            Position
                          </label>
                          <input
                            id="position"
                            name="experience.position"
                            type="text"
                            value={formData.experience.position}
                            onChange={handleChange}
                            className="w-full px-3 py-3 border border-gray-200 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all duration-300 text-gray-800 placeholder-gray-400 hover:border-gray-300 text-base"
                            placeholder="Job title"
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="company" className="block text-sm font-semibold text-gray-700">
                            Company
                          </label>
                          <input
                            id="company"
                            name="experience.company"
                            type="text"
                            value={formData.experience.company}
                            onChange={handleChange}
                            className="w-full px-3 py-3 border border-gray-200 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all duration-300 text-gray-800 placeholder-gray-400 hover:border-gray-300 text-base"
                            placeholder="Company name"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="expLocation" className="block text-sm font-semibold text-gray-700">
                            Location
                          </label>
                          <input
                            id="expLocation"
                            name="experience.location"
                            type="text"
                            value={formData.experience.location}
                            onChange={handleChange}
                            className="w-full px-3 py-3 border border-gray-200 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all duration-300 text-gray-800 placeholder-gray-400 hover:border-gray-300 text-base"
                            placeholder="City, State"
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="startDate" className="block text-sm font-semibold text-gray-700">
                            Start Date
                          </label>
                          <input
                            id="startDate"
                            name="experience.startDate"
                            type="text"
                            value={formData.experience.startDate}
                            onChange={handleChange}
                            className="w-full px-3 py-3 border border-gray-200 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all duration-300 text-gray-800 placeholder-gray-400 hover:border-gray-300 text-base"
                            placeholder="e.g., Jan 2020"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="endDate" className="block text-sm font-semibold text-gray-700">
                            End Date
                          </label>
                          <input
                            id="endDate"
                            name="experience.endDate"
                            type="text"
                            value={formData.experience.endDate}
                            onChange={handleChange}
                            disabled={formData.experience.current}
                            className="w-full px-3 py-3 border border-gray-200 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all duration-300 text-gray-800 placeholder-gray-400 hover:border-gray-300 text-base disabled:bg-gray-100 disabled:text-gray-500"
                            placeholder="e.g., Dec 2022"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 mt-7">
                            <input
                              type="checkbox"
                              id="current"
                              name="experience.current"
                              checked={formData.experience.current}
                              onChange={handleChange}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="current" className="text-sm font-medium text-gray-700">
                              Currently working here
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="description" className="block text-sm font-semibold text-gray-700">
                          Description
                        </label>
                        <textarea
                          id="description"
                          name="experience.description"
                          value={formData.experience.description}
                          onChange={handleChange}
                          rows="3"
                          className="w-full px-3 py-3 border border-gray-200 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all duration-300 text-gray-800 placeholder-gray-400 hover:border-gray-300 resize-none text-base"
                          placeholder="Describe your responsibilities and achievements"
                        ></textarea>
                      </div>
                    </div>
                  )}
                </div>

                {/* Section 7: Projects */}
                <div className="border-b pb-8">
                  <div className="flex items-center mb-4">
                    <Code className="w-5 h-5 text-blue-500 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-800">Projects</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {formData.projects.map((project, index) => (
                      <div key={index} className="border border-gray-200 rounded-md p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-base font-semibold text-gray-800">Project {index + 1}</h4>
                          <button
                            type="button"
                            onClick={() => removeProject(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                          <input
                            type="text"
                            placeholder="Project name"
                            value={project.name}
                            onChange={(e) => updateProject(index, 'name', e.target.value)}
                            className="w-full px-3 py-3 border border-gray-200 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all duration-300 text-gray-800 placeholder-gray-400 hover:border-gray-300 text-base"
                          />
                          <textarea
                            placeholder="Project description"
                            value={project.description}
                            onChange={(e) => updateProject(index, 'description', e.target.value)}
                            rows="2"
                            className="w-full px-3 py-3 border border-gray-200 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all duration-300 text-gray-800 placeholder-gray-400 hover:border-gray-300 resize-none text-base"
                          />
                          <input
                            type="text"
                            placeholder="Technologies used"
                            value={project.technologies}
                            onChange={(e) => updateProject(index, 'technologies', e.target.value)}
                            className="w-full px-3 py-3 border border-gray-200 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all duration-300 text-gray-800 placeholder-gray-400 hover:border-gray-300 text-base"
                          />
                          <input
                            type="url"
                            placeholder="Project link (optional)"
                            value={project.link}
                            onChange={(e) => updateProject(index, 'link', e.target.value)}
                            className="w-full px-3 py-3 border border-gray-200 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all duration-300 text-gray-800 placeholder-gray-400 hover:border-gray-300 text-base"
                          />
                        </div>
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      onClick={addProject}
                      className="w-full px-4 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium text-base flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Project
                    </button>
                  </div>
                </div>

                {/* Section 8: Account Information */}
                <div className="pb-8">
                  <div className="flex items-center mb-4">
                    <User className="w-5 h-5 text-blue-500 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-800">Account Information</h3>
                  </div>
                  
                  <div className="bg-gray-50 rounded-md p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Email</p>
                        <p className="text-base text-gray-800">{user?.email || 'Not available'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Member Since</p>
                        <p className="text-base text-gray-800">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Account Type</p>
                        <p className="text-base text-gray-800">Candidate</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-8 py-3 rounded-md hover:bg-blue-600 transition-colors font-medium flex items-center gap-2 text-base"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Complete Profile
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Skill Addition Popup */}
      {showSkillPopup && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50 animate-pulse">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Skill "{lastAddedSkill}" added successfully!</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
