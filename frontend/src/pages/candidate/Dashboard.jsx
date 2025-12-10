import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { applicationAPI } from '../../services/api'
import Confetti from '../../components/Confetti'
import { 
  FileText, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Upload,
  User,
  Briefcase,
  ExternalLink,
  MapPin,
  DollarSign,
  Heart,
  Zap,
  Target,
  Award,
  TrendingUp,
  Star,
  Users,
  Bell
} from 'lucide-react'
import '../../styles/Applications.css'

const Dashboard = () => {
  const [application, setApplication] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    fetchApplication()
  }, [])

  // Trigger confetti when application is accepted
  useEffect(() => {
    if (application && application.status === 'ACCEPTED') {
      setShowConfetti(true)
      // Hide confetti after 3 seconds
      const timer = setTimeout(() => {
        setShowConfetti(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [application])

  const fetchApplication = async () => {
    try {
      const response = await applicationAPI.getMyApplication()
      setApplication(response.data)
    } catch (error) {
      // Check if there's a locally stored application as backup
      const localApplication = localStorage.getItem('applicationSubmitted')
      const localData = localStorage.getItem('applicationData')
      
      if (localApplication === 'true' && localData) {
        console.log('Backend not available, showing locally stored application')
        const parsedData = JSON.parse(localData)
        setApplication({
          ...parsedData,
          status: 'PENDING',
          candidateEmail: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).email : 'candidate@example.com',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          resumeUrl: 'Resume uploaded locally'
        })
      } else {
        console.log('No application found')
      }
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-5 h-5" />
      case 'UNDER_REVIEW':
        return <AlertCircle className="w-5 h-5" />
      case 'SHORTLISTED':
        return <Star className="w-5 h-5" />
      case 'ACCEPTED':
        return <CheckCircle className="w-5 h-5" />
      case 'REJECTED':
        return <AlertCircle className="w-5 h-5" />
      default:
        return <Clock className="w-5 h-5" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'UNDER_REVIEW':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'SHORTLISTED':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-blue-50 mt-0 pt-0">
      <Confetti trigger={showConfetti} duration={3000} />
      <div className="w-full px-4 py-4">
        {/* Header */}
        <div className="mb-8">
          <div className="w-full bg-white rounded-lg shadow-md p-6">
            <div className="w-full bg-blue-600 text-white rounded-lg p-6">
              <div className="flex flex-col lg:flex-row items-center justify-between">
                <div className="text-center lg:text-left mb-4 lg:mb-0">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    Welcome to Your Dashboard
                  </h1>
                  <p className="text-blue-100">
                    Manage your job application and track your career journey
                  </p>
                </div>
                <div className="flex space-x-4">
                  <div className="text-center bg-blue-700 rounded-lg p-3">
                    <div className="text-2xl font-bold text-white">{application ? '1' : '0'}</div>
                    <div className="text-sm text-blue-100">Applications</div>
                  </div>
                  <div className="text-center bg-blue-700 rounded-lg p-3">
                    <div className="text-2xl font-bold text-white">{application ? application.status : 'Not Started'}</div>
                    <div className="text-sm text-blue-100">Current Status</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      {!application ? (
        /* No Application Yet - Enhanced Design */
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="w-full bg-white rounded-lg shadow-md p-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full mb-6">
                <Briefcase className="w-12 h-12 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Start Your Career Journey
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Ready to take the next step? Join our amazing team and build your future at Veridia.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-blue-50 rounded-lg p-4">
                  <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">1000+</div>
                  <div className="text-sm text-gray-600">Employees</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <Star className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">4.9</div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">35%</div>
                  <div className="text-sm text-gray-600">Growth Rate</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <Heart className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">98%</div>
                  <div className="text-sm text-gray-600">Satisfaction</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/candidate/apply"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Start Application
                </Link>
                <Link
                  to="/careers"
                  className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors inline-flex items-center"
                >
                  <Briefcase className="w-5 h-5 mr-2" />
                  Browse Positions
                </Link>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="w-full bg-white rounded-lg shadow-md p-8">
            <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">Why Join Veridia?</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Quick Process</h3>
                <p className="text-gray-600">Streamlined application process with quick response times.</p>
              </div>
              <div className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <Award className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Growth Opportunities</h3>
                <p className="text-gray-600">Continuous learning and clear career advancement paths.</p>
              </div>
              <div className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <Heart className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Great Culture</h3>
                <p className="text-gray-600">Inclusive environment and work-life balance.</p>
              </div>
            </div>
          </div>

          {/* Simple Features */}
          <div className="w-full bg-white rounded-lg shadow-md p-8">
            <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">Career Tools</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mb-3">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-semibold mb-2">Career Path Finder</h4>
                <p className="text-gray-600 text-sm">Discover your ideal career path</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mb-3">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-semibold mb-2">Salary Calculator</h4>
                <p className="text-gray-600 text-sm">Estimate your potential earnings</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mb-3">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-semibold mb-2">Skill Assessment</h4>
                <p className="text-gray-600 text-sm">Test your skills and improve</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Application Exists */
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Application Card */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="card-header">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-secondary-900">Application Details</h3>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(application.status)} ${application.status === 'ACCEPTED' ? 'celebration-text success-pulse' : ''}`}>
                    {getStatusIcon(application.status)}
                    <span className="ml-1">{application.status}</span>
                  </span>
                </div>
              </div>
              <div className="card-body">
                <div className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h4 className="font-medium text-secondary-900 mb-3 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Personal Information
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-secondary-600 mb-1">Phone</label>
                        <input
                          type="tel"
                          value={application.phone}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 cursor-not-allowed"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-600 mb-1">Email</label>
                        <input
                          type="email"
                          value={application.candidateEmail}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 cursor-not-allowed"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  {application.skills && (
                    <div>
                      <h4 className="font-medium text-secondary-900 mb-3 flex items-center">
                        <Briefcase className="w-4 h-4 mr-2" />
                        Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {application.skills.split(',').map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                          >
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {application.education && (
                    <div>
                      <h4 className="font-medium text-secondary-900 mb-3">Education</h4>
                      <textarea
                        value={application.education}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 cursor-not-allowed resize-none"
                        rows={4}
                        readOnly
                      />
                    </div>
                  )}

                  {/* Experience */}
                  {application.experience && (
                    <div>
                      <h4 className="font-medium text-secondary-900 mb-3">Experience</h4>
                      <textarea
                        value={application.experience}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 cursor-not-allowed resize-none"
                        rows={4}
                        readOnly
                      />
                    </div>
                  )}

                  {/* Portfolio */}
                  {application.portfolioLink && (
                    <div>
                      <h4 className="font-medium text-secondary-900 mb-3">Portfolio</h4>
                      <div className="flex items-center space-x-2">
                        <input
                          type="url"
                          value={application.portfolioLink}
                          disabled
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 cursor-not-allowed"
                          readOnly
                        />
                        <a
                          href={application.portfolioLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-2 text-primary-600 hover:text-primary-700 border border-primary-300 rounded-md hover:bg-primary-50"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Visit
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Resume */}
                  {application.resumeUrl && (
                    <div>
                      <h4 className="font-medium text-secondary-900 mb-3">Resume</h4>
                      <div className="flex items-center space-x-2 text-sm text-secondary-600">
                        <FileText className="w-4 h-4" />
                        <span>Resume uploaded successfully</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-secondary-900">Application Status</h3>
              </div>
              <div className="card-body">
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${getStatusColor(application.status).replace('text-', 'bg-').replace('-800', '-100')}`}>
                    {getStatusIcon(application.status)}
                  </div>
                  <p className="text-2xl font-bold text-secondary-900 mb-2">{application.status}</p>
                  <p className="text-sm text-secondary-600">
                    Last updated: {formatDate(application.updatedAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-secondary-900">Timeline</h3>
              </div>
              <div className="card-body">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-secondary-900">Application Submitted</p>
                      <p className="text-sm text-secondary-600">{formatDate(application.createdAt)}</p>
                    </div>
                  </div>
                  {application.updatedAt !== application.createdAt && (
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-secondary-900">Status Updated</p>
                        <p className="text-sm text-secondary-600">{formatDate(application.updatedAt)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-secondary-900">Quick Actions</h3>
              </div>
              <div className="card-body space-y-3">
                <Link
                  to="/candidate/profile"
                  className="btn-secondary w-full text-center"
                >
                  Update Profile
                </Link>
                <Link
                  to="/candidate/notifications"
                  className="btn-secondary w-full text-center flex items-center justify-center"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  View Notifications
                </Link>
                <Link
                  to="/candidate/apply"
                  className="btn-secondary w-full text-center"
                >
                  View Application Form
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

export default Dashboard
