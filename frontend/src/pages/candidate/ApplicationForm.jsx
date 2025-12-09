import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { applicationAPI } from '../../services/api'
import { Send, AlertCircle, CheckCircle, Briefcase } from 'lucide-react'
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
      const formDataToSend = new FormData()
      
      // Add form fields
      Object.keys(formData).forEach(key => {
        if (Array.isArray(formData[key])) {
          formDataToSend.append(key, JSON.stringify(formData[key]))
        } else {
          formDataToSend.append(key, formData[key])
        }
      })

      // Add files
      if (resumeFile) {
        formDataToSend.append('resume', resumeFile)
      }
      if (coverLetterFile) {
        formDataToSend.append('coverLetter', coverLetterFile)
      }

      const response = await applicationAPI.submitApplication(formDataToSend)
      
      setSuccess(true)
      setTimeout(() => {
        navigate('/careers', { 
          state: { 
            message: 'Application submitted successfully! We will review your application and contact you soon.' 
          }
        })
      }, 3000)
      
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit application. Please try again.')
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-6 h-6" />
                  Job Application
                </h1>
                <p className="text-blue-100 mt-1">
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
          <div className="px-8 py-4 bg-gray-50 border-b">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4, 5].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step <= currentStep
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {step}
                  </div>
                  {step < totalSteps && (
                    <div
                      className={`w-full h-1 mx-2 ${
                        step < currentStep ? 'bg-blue-600' : 'bg-gray-300'
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
    </div>
  )
}

export default ApplicationForm
