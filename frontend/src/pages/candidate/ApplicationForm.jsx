import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { applicationAPI } from '../../services/api'
import { 
  Upload, 
  FileText, 
  Send, 
  AlertCircle,
  CheckCircle,
  User,
  Phone,
  Briefcase,
  GraduationCap,
  Link as LinkIcon
} from 'lucide-react'

const ApplicationForm = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    phone: '',
    skills: '',
    education: '',
    experience: '',
    portfolioLink: ''
  })
  const [resumeFile, setResumeFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [existingApplication, setExistingApplication] = useState(null)

  useEffect(() => {
    checkExistingApplication()
  }, [])

  const checkExistingApplication = async () => {
    try {
      const response = await applicationAPI.getMyApplication()
      setExistingApplication(response.data)
    } catch (error) {
      // No existing application
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Please upload a PDF file')
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB')
        return
      }
      setResumeFile(file)
      setError('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.phone.trim()) {
      setError('Phone number is required')
      return
    }
    
    if (!resumeFile) {
      setError('Please upload your resume')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      const submissionData = new FormData()
      submissionData.append('application', JSON.stringify({
        phone: formData.phone,
        skills: formData.skills,
        education: formData.education,
        experience: formData.experience,
        portfolioLink: formData.portfolioLink
      }))
      submissionData.append('resume', resumeFile)
      
      await applicationAPI.submitApplication(submissionData)
      setSuccess(true)
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/candidate/dashboard')
      }, 2000)
      
    } catch (error) {
      setError(error.response?.data || 'Failed to submit application')
    } finally {
      setLoading(false)
    }
  }

  if (existingApplication) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <div className="card-body text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-secondary-900 mb-4">
              Application Already Submitted
            </h2>
            <p className="text-secondary-600 mb-8">
              You have already submitted your application. You can view and manage it from your dashboard.
            </p>
            <button
              onClick={() => navigate('/candidate/dashboard')}
              className="btn-primary"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <div className="card-body text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-secondary-900 mb-4">
              Application Submitted Successfully!
            </h2>
            <p className="text-secondary-600 mb-8">
              Thank you for your interest in Veridia. Your application has been received and will be reviewed by our team.
            </p>
            <p className="text-sm text-secondary-500">
              Redirecting to your dashboard...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">Job Application</h1>
        <p className="text-secondary-600">Please fill out the form below to submit your application</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-secondary-900 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Personal Information
            </h3>
          </div>
          <div className="card-body">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-secondary-700 mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-secondary-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-secondary-900 flex items-center">
              <Briefcase className="w-5 h-5 mr-2" />
              Skills & Expertise
            </h3>
          </div>
          <div className="card-body">
            <label htmlFor="skills" className="block text-sm font-medium text-secondary-700 mb-2">
              Technical Skills
            </label>
            <textarea
              id="skills"
              name="skills"
              rows={3}
              value={formData.skills}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., JavaScript, React, Node.js, Python, Data Analysis..."
            />
            <p className="text-sm text-secondary-500 mt-1">
              Separate skills with commas
            </p>
          </div>
        </div>

        {/* Education */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-secondary-900 flex items-center">
              <GraduationCap className="w-5 h-5 mr-2" />
              Education
            </h3>
          </div>
          <div className="card-body">
            <label htmlFor="education" className="block text-sm font-medium text-secondary-700 mb-2">
              Educational Background
            </label>
            <textarea
              id="education"
              name="education"
              rows={4}
              value={formData.education}
              onChange={handleChange}
              className="input-field"
              placeholder="Bachelor of Science in Computer Science, University Name (2018-2022)..."
            />
          </div>
        </div>

        {/* Experience */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-secondary-900 flex items-center">
              <Briefcase className="w-5 h-5 mr-2" />
              Work Experience
            </h3>
          </div>
          <div className="card-body">
            <label htmlFor="experience" className="block text-sm font-medium text-secondary-700 mb-2">
              Professional Experience
            </label>
            <textarea
              id="experience"
              name="experience"
              rows={4}
              value={formData.experience}
              onChange={handleChange}
              className="input-field"
              placeholder="Software Engineer at Tech Company (2022-Present)..."
            />
            <p className="text-sm text-secondary-500 mt-1">
              Optional: Include relevant work experience
            </p>
          </div>
        </div>

        {/* Portfolio */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-secondary-900 flex items-center">
              <LinkIcon className="w-5 h-5 mr-2" />
              Portfolio
            </h3>
          </div>
          <div className="card-body">
            <label htmlFor="portfolioLink" className="block text-sm font-medium text-secondary-700 mb-2">
              Portfolio/Website Link
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LinkIcon className="h-5 w-5 text-secondary-400" />
              </div>
              <input
                id="portfolioLink"
                name="portfolioLink"
                type="url"
                value={formData.portfolioLink}
                onChange={handleChange}
                className="input-field pl-10"
                placeholder="https://yourportfolio.com"
              />
            </div>
            <p className="text-sm text-secondary-500 mt-1">
              Optional: Link to your portfolio, GitHub, or LinkedIn
            </p>
          </div>
        </div>

        {/* Resume Upload */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-secondary-900 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Resume Upload
            </h3>
          </div>
          <div className="card-body">
            <div className="border-2 border-dashed border-secondary-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors">
              <input
                type="file"
                id="resume"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="resume" className="cursor-pointer">
                {resumeFile ? (
                  <div className="space-y-2">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="font-medium text-secondary-900">{resumeFile.name}</p>
                    <p className="text-sm text-secondary-600">Click to change file</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-12 h-12 text-secondary-400 mx-auto" />
                    <p className="font-medium text-secondary-900">Upload your resume</p>
                    <p className="text-sm text-secondary-600">PDF format, max 10MB</p>
                    <button
                      type="button"
                      className="btn-secondary"
                    >
                      Choose File
                    </button>
                  </div>
                )}
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/candidate/dashboard')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Submit Application
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ApplicationForm
