import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
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
  const [searchParams] = useSearchParams()
  const jobId = searchParams.get('job') ? parseInt(searchParams.get('job')) : null
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
  }, [jobId])

  const checkExistingApplication = async () => {
    try {
      // Get all applications for the current user
      const response = await applicationAPI.getMyApplications()
      if (response.data && response.data.length > 0) {
        const applications = response.data
        setApplicationHistory(applications)
        
        // Find application for the current job
        const applicationForCurrentJob = applications.find(app => 
          app.jobId && String(app.jobId) === String(jobId)
        )
        
        if (applicationForCurrentJob) {
          // Only set existing application if it's for the current job
          setExistingApplication(applicationForCurrentJob)
          
          setFormData({
            firstName: applicationForCurrentJob.firstName || '',
            lastName: applicationForCurrentJob.lastName || '',
            phone: applicationForCurrentJob.phone || '',
            location: applicationForCurrentJob.location || '',
            linkedinProfile: applicationForCurrentJob.linkedinProfile || '',
            githubProfile: applicationForCurrentJob.githubProfile || '',
            portfolioLink: applicationForCurrentJob.portfolioLink || '',
            skills: applicationForCurrentJob.skills || [],
            education: applicationForCurrentJob.education || [],
            experience: applicationForCurrentJob.experience || [],
            certifications: applicationForCurrentJob.certifications || [],
            availability: applicationForCurrentJob.availability || '',
            expectedSalary: applicationForCurrentJob.expectedSalary || '',
            noticePeriod: applicationForCurrentJob.noticePeriod || '',
            workMode: applicationForCurrentJob.workMode || 'remote'
          })
        } else {
          // No application found for this job
          setExistingApplication(null)
        }
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
      setError('Please fill all required fields')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Create FormData
      const formDataToSend = new FormData()
      
      // Create clean application object with all required fields
      const applicationData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim(),
        location: formData.location.trim(),
        linkedinProfile: formData.linkedinProfile || '',
        githubProfile: formData.githubProfile || '',
        portfolioLink: formData.portfolioLink || '',
        skills: Array.isArray(formData.skills) ? formData.skills.join(', ') : formData.skills,
        education: Array.isArray(formData.education) 
          ? formData.education.map(edu => `${edu.degree} from ${edu.institution}`).join('\n')
          : formData.education,
        experience: Array.isArray(formData.experience)
          ? formData.experience.map(exp => `${exp.position} at ${exp.company}`).join('\n')
          : formData.experience,
        availability: formData.availability,
        expectedSalary: formData.expectedSalary,
        noticePeriod: formData.noticePeriod,
        workMode: formData.workMode,
        jobId: jobId
      }
      
      console.log('Submitting application:', applicationData)
      
      // Append as JSON string
      formDataToSend.append('application', JSON.stringify(applicationData))
      
      // Append files
      if (resumeFile) {
        formDataToSend.append('resume', resumeFile)
      }
      if (coverLetterFile) {
        formDataToSend.append('coverLetter', coverLetterFile)
      }
      
      // Log FormData contents
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0], pair[1])
      }
      
      const response = await applicationAPI.submitApplication(formDataToSend)
      console.log('Success:', response.data)
      
      setSuccess(true)
      setShowSuccessModal(true)
      
      setTimeout(() => {
        navigate('/careers')
      }, 3000)
      
    } catch (error) {
      console.error('Submission error:', error)
      console.error('Error response:', error.response?.data)
      
      if (error.response?.status === 401) {
        setError('Session expired. Please login again.')
        setTimeout(() => navigate('/login'), 2000)
      } else if (error.response?.data?.message) {
        setError(error.response.data.message)
      } else {
        setError('Failed to submit application. Please check your connection and try again.')
      }
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
