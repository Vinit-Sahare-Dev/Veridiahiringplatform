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
  ExternalLink
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
      // User hasn't submitted application yet
      console.log('No application found')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'SUBMITTED':
        return <CheckCircle className="w-5 h-5" />
      case 'REVIEWED':
        return <Clock className="w-5 h-5" />
      case 'SHORTLISTED':
        return <AlertCircle className="w-5 h-5" />
      case 'SELECTED':
        return <CheckCircle className="w-5 h-5" />
      case 'REJECTED':
        return <AlertCircle className="w-5 h-5" />
      default:
        return <Clock className="w-5 h-5" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'SUBMITTED':
        return 'status-submitted'
      case 'REVIEWED':
        return 'status-reviewed'
      case 'SHORTLISTED':
        return 'status-shortlisted'
      case 'SELECTED':
        return 'status-selected'
      case 'REJECTED':
        return 'status-rejected'
      default:
        return 'status-submitted'
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
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">Candidate Dashboard</h1>
        <p className="text-secondary-600">Manage your job application and track its progress</p>
      </div>

      {!application ? (
        /* No Application Yet */
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-secondary-100 rounded-full mb-6">
            <FileText className="w-10 h-10 text-secondary-400" />
          </div>
          <h2 className="text-2xl font-bold text-secondary-900 mb-4">
            Start Your Application
          </h2>
          <p className="text-secondary-600 mb-8 max-w-md mx-auto">
            You haven't submitted your application yet. Click below to begin the application process.
          </p>
          <Link
            to="/candidate/apply"
            className="btn-primary text-lg px-8 py-3 inline-flex items-center group"
          >
            <Upload className="w-5 h-5 mr-2" />
            Start Application
          </Link>
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
                  <span className={`status-badge ${getStatusColor(application.status)}`}>
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
