import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { applicationAPI } from '../../services/api'
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

const Dashboard = () => {
  const [application, setApplication] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchApplication()
  }, [])

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
    <div className="max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome to Your Dashboard</h1>
              <p className="text-primary-100">Manage your job application and track your progress</p>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="text-center">
                <div className="text-2xl font-bold">{application ? '1' : '0'}</div>
                <div className="text-sm text-primary-100">Applications</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{application ? application.status : 'Not Started'}</div>
                <div className="text-sm text-primary-100">Current Status</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {!application ? (
        /* No Application Yet - Enhanced Design */
        <div className="space-y-8">
          {/* Hero Card */}
          <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-primary-100 rounded-full mb-6">
              <Briefcase className="w-12 h-12 text-primary-600" />
            </div>
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              Start Your Career Journey
            </h2>
            <p className="text-lg text-secondary-600 mb-8 max-w-2xl mx-auto">
              Ready to take the next step? Join our amazing team and build your future at Veridia. 
              Our streamlined application process makes it easy to get started.
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-3xl mx-auto">
              <div className="bg-white rounded-lg p-4">
                <Users className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-secondary-900">500+</div>
                <div className="text-sm text-secondary-600">Employees</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <Star className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-secondary-900">4.8</div>
                <div className="text-sm text-secondary-600">Rating</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <TrendingUp className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-secondary-900">25%</div>
                <div className="text-sm text-secondary-600">Growth Rate</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <Heart className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-secondary-900">95%</div>
                <div className="text-sm text-secondary-600">Satisfaction</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/candidate/apply"
                className="btn-primary text-lg px-8 py-4 inline-flex items-center group"
              >
                <Upload className="w-5 h-5 mr-2" />
                Start Application
                <Target className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/careers"
                className="btn-secondary text-lg px-8 py-4 inline-flex items-center"
              >
                <Briefcase className="w-5 h-5 mr-2" />
                Browse Open Positions
              </Link>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card p-6 text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                <Clock className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">Quick Process</h3>
              <p className="text-secondary-600">Complete your application in just 10 minutes</p>
            </div>
            <div className="card p-6 text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                <Zap className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">Real-time Updates</h3>
              <p className="text-secondary-600">Track your application status instantly</p>
            </div>
            <div className="card p-6 text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                <Award className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">Professional Review</h3>
              <p className="text-secondary-600">Expert evaluation by our HR team</p>
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
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(application.status)}`}>
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
                        <p className="text-sm text-secondary-600">Phone</p>
                        <p className="font-medium">{application.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-secondary-600">Email</p>
                        <p className="font-medium">{application.candidateEmail}</p>
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
                      <p className="text-secondary-700 whitespace-pre-wrap">{application.education}</p>
                    </div>
                  )}

                  {/* Experience */}
                  {application.experience && (
                    <div>
                      <h4 className="font-medium text-secondary-900 mb-3">Experience</h4>
                      <p className="text-secondary-700 whitespace-pre-wrap">{application.experience}</p>
                    </div>
                  )}

                  {/* Portfolio */}
                  {application.portfolioLink && (
                    <div>
                      <h4 className="font-medium text-secondary-900 mb-3">Portfolio</h4>
                      <a
                        href={application.portfolioLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-primary-600 hover:text-primary-700"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        View Portfolio
                      </a>
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
  )
}

export default Dashboard
