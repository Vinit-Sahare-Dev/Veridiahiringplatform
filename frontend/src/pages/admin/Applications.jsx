import React, { useState, useEffect } from 'react'
import { applicationAPI } from '../../services/api'
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase,
  Calendar,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  ChevronDown,
  Eye,
  ExternalLink,
  Star,
  TrendingUp,
  UserCheck,
  UserX
} from 'lucide-react'
import '../../styles/Applications.css'

const Applications = () => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchName, setSearchName] = useState('')
  const [searchSkills, setSearchSkills] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [expandedApp, setExpandedApp] = useState(null)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    underReview: 0,
    accepted: 0,
    rejected: 0
  })

  useEffect(() => {
    fetchApplications()
  }, [])

  useEffect(() => {
    const filtered = applications.filter(app => {
      const matchesName = !searchName || 
        app.candidateName?.toLowerCase().includes(searchName.toLowerCase()) ||
        app.firstName?.toLowerCase().includes(searchName.toLowerCase()) ||
        app.lastName?.toLowerCase().includes(searchName.toLowerCase())
      
      const matchesSkills = !searchSkills || 
        app.skills?.toLowerCase().includes(searchSkills.toLowerCase())
      
      const matchesStatus = !filterStatus || app.status === filterStatus
      
      return matchesName && matchesSkills && matchesStatus
    })

    // Calculate stats
    const newStats = {
      total: filtered.length,
      pending: filtered.filter(app => app.status === 'PENDING').length,
      underReview: filtered.filter(app => app.status === 'UNDER_REVIEW').length,
      shortlisted: filtered.filter(app => app.status === 'SHORTLISTED').length,
      accepted: filtered.filter(app => app.status === 'ACCEPTED').length,
      rejected: filtered.filter(app => app.status === 'REJECTED').length
    }
    setStats(newStats)
  }, [applications, searchName, searchSkills, filterStatus])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      console.log('Fetching applications from API...')
      const response = await applicationAPI.getAllApplications()
      console.log('API Response:', response)
      console.log('Applications data:', response.data)
      setApplications(response.data)
    } catch (error) {
      console.error('Error fetching applications:', error)
      console.error('Error response:', error.response)
      console.error('Error status:', error.response?.status)
    } finally {
      setLoading(false)
    }
  }

  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      await applicationAPI.updateApplicationStatus(applicationId, newStatus)
      fetchApplications()
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const downloadResume = async (filename) => {
    try {
      const response = await applicationAPI.downloadResume(filename)
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error('Error downloading resume:', error)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'UNDER_REVIEW': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'SHORTLISTED': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'ACCEPTED': return 'bg-green-100 text-green-800 border-green-200'
      case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING': return <Clock className="w-4 h-4" />
      case 'UNDER_REVIEW': return <AlertCircle className="w-4 h-4" />
      case 'SHORTLISTED': return <Star className="w-4 h-4" />
      case 'ACCEPTED': return <CheckCircle className="w-4 h-4" />
      case 'REJECTED': return <XCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">Job Applications</h1>
        <p className="text-secondary-600">Manage and review all candidate applications</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="card p-4 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mb-2">
            <Users className="w-6 h-6 text-primary-600" />
          </div>
          <div className="text-2xl font-bold text-secondary-900">{stats.total}</div>
          <div className="text-sm text-secondary-600">Total Applications</div>
        </div>
        
        <div className="card p-4 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mb-2">
            <Clock className="w-6 h-6 text-yellow-600" />
          </div>
          <div className="text-2xl font-bold text-secondary-900">{stats.pending}</div>
          <div className="text-sm text-secondary-600">Pending</div>
        </div>
        
        <div className="card p-4 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-2">
            <AlertCircle className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-secondary-900">{stats.underReview}</div>
          <div className="text-sm text-secondary-600">Under Review</div>
        </div>
        
        <div className="card p-4 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-2">
            <Star className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-secondary-900">{stats.shortlisted}</div>
          <div className="text-sm text-secondary-600">Shortlisted</div>
        </div>
        
        <div className="card p-4 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-secondary-900">{stats.accepted}</div>
          <div className="text-sm text-secondary-600">Accepted</div>
        </div>
        
        <div className="card p-4 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-2">
            <XCircle className="w-6 h-6 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-secondary-900">{stats.rejected}</div>
          <div className="text-sm text-secondary-600">Rejected</div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-secondary-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="input-field pl-10"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Briefcase className="h-5 w-5 text-secondary-400" />
              </div>
              <input
                type="text"
                placeholder="Search by skills..."
                value={searchSkills}
                onChange={(e) => setSearchSkills(e.target.value)}
                className="input-field pl-10"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="SHORTLISTED">Shortlisted</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {applications
          .filter(app => {
            const matchesName = !searchName || 
              app.candidateName?.toLowerCase().includes(searchName.toLowerCase()) ||
              app.firstName?.toLowerCase().includes(searchName.toLowerCase()) ||
              app.lastName?.toLowerCase().includes(searchName.toLowerCase())
            
            const matchesSkills = !searchSkills || 
              app.skills?.toLowerCase().includes(searchSkills.toLowerCase())
            
            const matchesStatus = !filterStatus || app.status === filterStatus
            
            return matchesName && matchesSkills && matchesStatus
          })
          .map((application) => (
          <div key={application.id} className="card hover:shadow-lg transition-shadow">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <UserCheck className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-secondary-900">
                        {application.firstName} {application.lastName}
                      </h3>
                      <p className="text-sm text-secondary-600">{application.candidateEmail}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(application.status)}`}>
                    {getStatusIcon(application.status)}
                    <span className="ml-1">{application.status}</span>
                  </span>
                  <button
                    onClick={() => setExpandedApp(expandedApp === application.id ? null : application.id)}
                    className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
                  >
                    <ChevronDown className={`w-5 h-5 text-secondary-600 transition-transform ${expandedApp === application.id ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center space-x-2 text-sm text-secondary-600">
                  <Phone className="w-4 h-4 text-primary-500" />
                  <span>{application.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-secondary-600">
                  <MapPin className="w-4 h-4 text-primary-500" />
                  <span>{application.location || 'Not specified'}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-secondary-600">
                  <Calendar className="w-4 h-4 text-primary-500" />
                  <span>Applied {formatDate(application.createdAt)}</span>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedApp === application.id && (
                <div className="border-t border-secondary-200 pt-4 space-y-4 animate-fade-in">
                  {/* Skills */}
                  <div>
                    <h4 className="text-sm font-medium text-secondary-900 mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {application.skills?.split(', ').map((skill, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs bg-primary-100 text-primary-800">
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Education */}
                  {application.education && (
                    <div>
                      <h4 className="text-sm font-medium text-secondary-900 mb-2">Education</h4>
                      <p className="text-sm text-secondary-600 whitespace-pre-line">{application.education}</p>
                    </div>
                  )}

                  {/* Experience */}
                  {application.experience && (
                    <div>
                      <h4 className="text-sm font-medium text-secondary-900 mb-2">Experience</h4>
                      <p className="text-sm text-secondary-600 whitespace-pre-line">{application.experience}</p>
                    </div>
                  )}

                  {/* Links */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {application.linkedinProfile && (
                      <a href={application.linkedinProfile} target="_blank" rel="noopener noreferrer" 
                         className="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-800">
                        <ExternalLink className="w-4 h-4" />
                        <span>LinkedIn</span>
                      </a>
                    )}
                    {application.githubProfile && (
                      <a href={application.githubProfile} target="_blank" rel="noopener noreferrer" 
                         className="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-800">
                        <ExternalLink className="w-4 h-4" />
                        <span>GitHub</span>
                      </a>
                    )}
                    {application.portfolioLink && (
                      <a href={application.portfolioLink} target="_blank" rel="noopener noreferrer" 
                         className="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-800">
                        <ExternalLink className="w-4 h-4" />
                        <span>Portfolio</span>
                      </a>
                    )}
                  </div>

                  {/* Job Preferences */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-secondary-900">Work Mode:</span>
                      <span className="ml-2 text-secondary-600">{application.workMode || 'Not specified'}</span>
                    </div>
                    <div>
                      <span className="font-medium text-secondary-900">Availability:</span>
                      <span className="ml-2 text-secondary-600">{application.availability || 'Not specified'}</span>
                    </div>
                    <div>
                      <span className="font-medium text-secondary-900">Expected Salary:</span>
                      <span className="ml-2 text-secondary-600">{application.expectedSalary || 'Not specified'}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-secondary-200">
                    {application.resumeUrl && (
                      <button
                        onClick={() => downloadResume(application.resumeUrl.split('/').pop())}
                        className="btn-secondary flex items-center"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Resume
                      </button>
                    )}
                    
                    <div className="flex gap-2 ml-auto">
                      {application.status !== 'UNDER_REVIEW' && (
                        <button
                          onClick={() => updateApplicationStatus(application.id, 'UNDER_REVIEW')}
                          className="btn-secondary"
                        >
                          Mark as Review
                        </button>
                      )}
                      {application.status !== 'SHORTLISTED' && (
                        <button
                          onClick={() => updateApplicationStatus(application.id, 'SHORTLISTED')}
                          className="btn-secondary bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          <Star className="w-4 h-4 mr-2" />
                          Shortlist
                        </button>
                      )}
                      {application.status !== 'ACCEPTED' && (
                        <button
                          onClick={() => updateApplicationStatus(application.id, 'ACCEPTED')}
                          className="btn-primary bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Accept
                        </button>
                      )}
                      {application.status !== 'REJECTED' && (
                        <button
                          onClick={() => updateApplicationStatus(application.id, 'REJECTED')}
                          className="btn-secondary bg-red-600 hover:bg-red-700 text-white"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {applications.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary-100 rounded-full mb-4">
              <Users className="w-8 h-8 text-secondary-400" />
            </div>
            <h3 className="text-lg font-medium text-secondary-900 mb-2">No applications found</h3>
            <p className="text-secondary-600">
              No job applications have been submitted yet.
            </p>
          </div>
        )}

        {applications.length > 0 && applications.filter(app => {
          const matchesName = !searchName || 
            app.candidateName?.toLowerCase().includes(searchName.toLowerCase()) ||
            app.firstName?.toLowerCase().includes(searchName.toLowerCase()) ||
            app.lastName?.toLowerCase().includes(searchName.toLowerCase())
          
          const matchesSkills = !searchSkills || 
            app.skills?.toLowerCase().includes(searchSkills.toLowerCase())
          
          const matchesStatus = !filterStatus || app.status === filterStatus
          
          return matchesName && matchesSkills && matchesStatus
        }).length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary-100 rounded-full mb-4">
              <Search className="w-8 h-8 text-secondary-400" />
            </div>
            <h3 className="text-lg font-medium text-secondary-900 mb-2">No matching applications</h3>
            <p className="text-secondary-600">
              Try adjusting your search criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Applications
