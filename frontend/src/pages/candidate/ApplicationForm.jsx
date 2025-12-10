import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { applicationAPI } from '../../services/api'
import { Send, AlertCircle, CheckCircle, Briefcase, X, Sparkles, Trophy, Mail, Phone } from 'lucide-react'
import '../../styles/Applications.css'

// Import form components
import PersonalInfoForm from '../../components/forms/PersonalInfoForm'
import SkillsForm from '../../components/forms/SkillsForm'
import EducationForm from '../../components/forms/EducationForm'
import FileUploadForm from '../../components/forms/FileUploadForm'
import JobPreferencesForm from '../../components/forms/JobPreferencesForm'

const ApplicationForm = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    location: '',
    linkedinProfile: '',
    githubProfile: '',
    portfolioLink: '',
    skills: [],
    education: [],
    experience: [],
    certifications: [],
    availability: '',
    expectedSalary: '',
    noticePeriod: '',
    workMode: 'remote'
  })
  const [resumeFile, setResumeFile] = useState(null)
  const [coverLetterFile, setCoverLetterFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [existingApplication, setExistingApplication] = useState(null)
  const [applicationHistory, setApplicationHistory] = useState([])
  const [currentStep, setCurrentStep] = useState(1)
  const [formErrors, setFormErrors] = useState({})

  const totalSteps = 5

  useEffect(() => {
    checkExistingApplication()
  }, [])

  const checkExistingApplication = async () => {
    try {
      // Get all applications for the current user
      const response = await applicationAPI.getMyApplications()
      if (response.data && response.data.length > 0) {
        const applications = response.data
        setApplicationHistory(applications)
        
        // Set the most recent application as the existing one
        const mostRecent = applications[applications.length - 1]
        setExistingApplication(mostRecent)
        
        setFormData({
          firstName: mostRecent.firstName || '',
          lastName: mostRecent.lastName || '',
          phone: mostRecent.phone || '',
          location: mostRecent.location || '',
          linkedinProfile: mostRecent.linkedinProfile || '',
          githubProfile: mostRecent.githubProfile || '',
          portfolioLink: mostRecent.portfolioLink || '',
          skills: mostRecent.skills || [],
          education: mostRecent.education || [],
          experience: mostRecent.experience || [],
          certifications: mostRecent.certifications || [],
          availability: mostRecent.availability || '',
          expectedSalary: mostRecent.expectedSalary || '',
          noticePeriod: mostRecent.noticePeriod || '',
          workMode: mostRecent.workMode || 'remote'
        })
      }
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error('Error checking existing application:', error)
      }
    }
  }

  const handleFormDataChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error for this field
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const validateStep = (step) => {
    const errors = {}

    switch (step) {
      case 1: // Personal Info
        if (!formData.firstName.trim()) errors.firstName = 'First name is required'
        if (!formData.lastName.trim()) errors.lastName = 'Last name is required'
        if (!formData.phone.trim()) errors.phone = 'Phone number is required'
        if (!formData.location.trim()) errors.location = 'Location is required'
        break
      case 2: // Skills
        if (formData.skills.length === 0) errors.skills = 'At least one skill is required'
        break
      case 3: // Education
        if (formData.education.length === 0) errors.education = 'At least one education entry is required'
        break
      case 4: // Files
        if (!resumeFile) errors.resume = 'Resume is required'
        break
      case 5: // Job Preferences
        if (!formData.availability) errors.availability = 'Availability is required'
        if (!formData.workMode) errors.workMode = 'Work mode is required'
        break
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps))
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const validateForm = () => {
    const errors = {}

    // Personal Info
    if (!formData.firstName.trim()) errors.firstName = 'First name is required'
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required'
    if (!formData.phone.trim()) errors.phone = 'Phone number is required'
    if (!formData.location.trim()) errors.location = 'Location is required'

    // Skills
    if (formData.skills.length === 0) errors.skills = 'At least one skill is required'

    // Education
    if (formData.education.length === 0) errors.education = 'At least one education entry is required'

    // Files
    if (!resumeFile) errors.resume = 'Resume is required'

    // Job Preferences
    if (!formData.availability) errors.availability = 'Availability is required'
    if (!formData.workMode) errors.workMode = 'Work mode is required'

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError('')

    try {
      // Test backend connection first
      console.log('Testing backend connection...')
      try {
        const healthCheck = await fetch('http://localhost:8080/api/health')
        if (!healthCheck.ok) {
          throw new Error('Backend health check failed')
        }
        console.log('Backend connection OK')
      } catch (healthError) {
        console.error('Backend health check failed:', healthError)
        setError('Backend server is not running. Please start the backend server on port 8080.')
        return
      }
      
      const formDataToSend = new FormData()
      
      console.log('Form data being submitted:', formData)
      console.log('Resume file:', resumeFile)
      console.log('Cover letter file:', coverLetterFile)
      
      // Create application JSON string as expected by backend
      const applicationJson = JSON.stringify(formData)
      formDataToSend.append('application', applicationJson)
      console.log('Application JSON:', applicationJson)

      // Add files
      if (resumeFile) {
        formDataToSend.append('resume', resumeFile)
      }
      if (coverLetterFile) {
        formDataToSend.append('coverLetter', coverLetterFile)
      }
      
      console.log('FormData entries:')
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0], pair[1])
      }

      const response = await applicationAPI.submitApplication(formDataToSend)
      
      setSuccess(true)
      setShowSuccessModal(true)
      
      // Auto-redirect after 5 seconds
      setTimeout(() => {
        setShowSuccessModal(false)
        navigate('/careers', { 
          state: { 
            message: 'Application submitted successfully! We will review your application and contact you soon.' 
          }
        })
      }, 5000)
      
    } catch (error) {
      console.error('Application submission error:', error)
      console.error('Error response:', error.response)
      console.error('Error status:', error.response?.status)
      console.error('Error data:', error.response?.data)
      console.error('Error message:', error.response?.data?.message)
      console.error('Full error:', JSON.stringify(error.response?.data, null, 2))
      setError(error.response?.data?.message || error.message || 'Failed to submit application. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoForm
            formData={formData}
            onChange={handleFormDataChange}
            errors={formErrors}
          />
        )
      case 2:
        return (
          <SkillsForm
            skills={formData.skills}
            onChange={(skills) => handleFormDataChange('skills', skills)}
            errors={formErrors}
          />
        )
      case 3:
        return (
          <EducationForm
            education={formData.education}
            onChange={(education) => handleFormDataChange('education', education)}
            errors={formErrors}
          />
        )
      case 4:
        return (
          <FileUploadForm
            resumeFile={resumeFile}
            coverLetterFile={coverLetterFile}
            onResumeChange={setResumeFile}
            onCoverLetterChange={setCoverLetterFile}
            errors={formErrors}
          />
        )
      case 5:
        return (
          <JobPreferencesForm
            formData={formData}
            onChange={handleFormDataChange}
            errors={formErrors}
          />
        )
      default:
        return null
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Application Submitted!
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you for applying! We'll review your application and contact you soon.
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to careers page...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                  <Briefcase className="w-8 h-8" />
                  Job Application
                </h1>
                <p className="text-blue-100 mt-2 text-lg">
                  {existingApplication ? 'Update your application' : 'Complete your application in 5 simple steps'}
                </p>
                {existingApplication && (
                  <div className="mt-3 text-sm text-blue-100">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Application #{existingApplication.id}
                      </span>
                      <span>
                        Submitted: {new Date(existingApplication.submittedAt).toLocaleDateString()} at {new Date(existingApplication.submittedAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="mt-1">
                      Status: <span className={`px-2 py-1 rounded text-xs font-medium ${
                        existingApplication.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        existingApplication.status === 'UNDER_REVIEW' ? 'bg-blue-100 text-blue-800' :
                        existingApplication.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                        existingApplication.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {existingApplication.status || 'PENDING'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="text-white">
                Step {currentStep} of {totalSteps}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="px-8 py-6 bg-blue-50 border-b">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              {[1, 2, 3, 4, 5].map((step) => (
                <div key={step} className="flex items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      step <= currentStep
                        ? 'bg-blue-600 text-white shadow-lg scale-110'
                        : 'bg-blue-200 text-blue-800'
                    }`}
                  >
                    {step}
                  </div>
                  {step < totalSteps && (
                    <div
                      className={`flex-1 h-2 mx-2 rounded-full transition-all duration-300 ${
                        step < currentStep ? 'bg-blue-600' : 'bg-blue-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mx-8 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Application Summary */}
          {existingApplication && (
            <div className="mx-8 mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-sm font-medium text-blue-900 mb-2">Application Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-blue-600">Application ID:</span>
                  <span className="ml-2 text-blue-900 font-medium">#{existingApplication.id}</span>
                </div>
                <div>
                  <span className="text-blue-600">Submitted:</span>
                  <span className="ml-2 text-blue-900">{new Date(existingApplication.submittedAt).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-blue-600">Time:</span>
                  <span className="ml-2 text-blue-900">{new Date(existingApplication.submittedAt).toLocaleTimeString()}</span>
                </div>
                <div>
                  <span className="text-blue-600">Status:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                    existingApplication.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    existingApplication.status === 'UNDER_REVIEW' ? 'bg-blue-100 text-blue-800' :
                    existingApplication.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                    existingApplication.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {existingApplication.status || 'PENDING'}
                  </span>
                </div>
              </div>
              {existingApplication.resumeFile && (
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <span className="text-blue-600">Resume:</span>
                  <span className="ml-2 text-blue-900">{existingApplication.resumeFile}</span>
                </div>
              )}
            </div>
          )}

          {/* Application History */}
          {applicationHistory.length > 0 && (
            <div className="mx-8 mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Your Applications ({applicationHistory.length})
              </h3>
              <div className="space-y-3">
                {applicationHistory.map((app, index) => (
                  <div key={app.id || index} className="flex items-center justify-between p-3 bg-white rounded border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-900">Application #{app.id}</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          app.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          app.status === 'UNDER_REVIEW' ? 'bg-blue-100 text-blue-800' :
                          app.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                          app.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {app.status || 'PENDING'}
                        </span>
                        {index === applicationHistory.length - 1 && (
                          <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                            Latest
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        Submitted: {new Date(app.submittedAt).toLocaleDateString()} at {new Date(app.submittedAt).toLocaleTimeString()}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        Position: {app.positionTitle || 'Not specified'}
                      </div>
                      {app.resumeFile && (
                        <div className="text-xs text-gray-600 mt-1">
                          Resume: {app.resumeFile}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">
                        {app.firstName} {app.lastName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {app.email}
                      </div>
                      {index === 0 && (
                        <button
                          onClick={() => {
                            setFormData({
                              firstName: app.firstName || '',
                              lastName: app.lastName || '',
                              phone: app.phone || '',
                              location: app.location || '',
                              linkedinProfile: app.linkedinProfile || '',
                              githubProfile: app.githubProfile || '',
                              portfolioLink: app.portfolioLink || '',
                              skills: app.skills || [],
                              education: app.education || [],
                              experience: app.experience || [],
                              certifications: app.certifications || [],
                              availability: app.availability || '',
                              expectedSalary: app.expectedSalary || '',
                              noticePeriod: app.noticePeriod || '',
                              workMode: app.workMode || 'remote'
                            })
                            setExistingApplication(app)
                          }}
                          className="mt-2 text-xs text-blue-600 hover:text-blue-800"
                        >
                          Use this data
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="px-8 py-6">
            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Application
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-md mx-4 overflow-hidden transform transition-all duration-500 scale-100 animate-pulse">
            {/* Close Button */}
            <button
              onClick={() => {
                setShowSuccessModal(false)
                navigate('/careers')
              }}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
            
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 opacity-90"></div>
            
            {/* Content */}
            <div className="relative z-10 p-8 text-center">
              {/* Success Icon with Animation */}
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-6 shadow-lg transform transition-all duration-500 hover:scale-110">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              
              {/* Sparkles */}
              <div className="absolute top-8 left-8">
                <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
              </div>
              <div className="absolute top-8 right-8">
                <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
              </div>
              <div className="absolute bottom-8 left-12">
                <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
              </div>
              
              {/* Trophy Icon */}
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-4 shadow-md transform transition-all duration-500 hover:rotate-12">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              
              {/* Success Message */}
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Application Submitted!
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Thank you for your interest in joining Veridia. Your application has been successfully submitted and is now under review.
              </p>
              
              {/* Contact Info */}
              <div className="bg-blue-50 rounded-xl p-4 mb-6">
                <p className="text-sm text-blue-800 font-medium mb-2">What happens next?</p>
                <div className="flex items-center justify-center space-x-4 text-xs text-blue-600">
                  <div className="flex items-center">
                    <Mail className="w-3 h-3 mr-1" />
                    Email updates
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-3 h-3 mr-1" />
                    Call within 3-5 days
                  </div>
                </div>
              </div>
              
              {/* Redirect Timer */}
              <div className="text-xs text-gray-500">
                Redirecting to careers page in <span className="font-medium text-blue-600">5 seconds</span>...
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ApplicationForm
