import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { applicationAPI } from '../../services/api'
import { 
  Users, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  TrendingUp,
  UserCheck,
  Briefcase
} from 'lucide-react'

const AdminDashboard = () => {
  const [applications, setApplications] = useState([])
  const [filteredApplications, setFilteredApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  useEffect(() => {
    fetchApplications()
  }, [])

  useEffect(() => {
    filterApplications()
  }, [applications, searchTerm, statusFilter])

  const fetchApplications = async () => {
    try {
      const response = await applicationAPI.getAllApplications()
      setApplications(response.data)
    } catch (error) {
      console.error('Failed to fetch applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterApplications = () => {
    let filtered = applications

    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.candidateEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (app.skills && app.skills.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (statusFilter) {
      filtered = filtered.filter(app => app.status === statusFilter)
    }

    setFilteredApplications(filtered)
  }

  const updateApplicationStatus = async (applicationId, newStatus) => {
    setUpdatingId(applicationId)
    try {
      await applicationAPI.updateApplicationStatus(applicationId, newStatus)
      fetchApplications()
    } catch (error) {
      console.error('Failed to update status:', error)
    } finally {
      setUpdatingId(null)
    }
  }

  const downloadResume = async (resumeUrl, candidateName) => {
    try {
      const filename = resumeUrl.split('/').pop()
      const response = await applicationAPI.downloadResume(filename)
      
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${candidateName.replace(/\s+/g, '_')}_resume.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to download resume:', error)
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'SUBMITTED':
        return <FileText className="w-4 h-4" />
      case 'REVIEWED':
        return <Clock className="w-4 h-4" />
      case 'SHORTLISTED':
        return <AlertCircle className="w-4 h-4" />
      case 'SELECTED':
        return <CheckCircle className="w-4 h-4" />
      case 'REJECTED':
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const stats = {
    total: applications.length,
    submitted: applications.filter(app => app.status === 'SUBMITTED').length,
    reviewed: applications.filter(app => app.status === 'REVIEWED').length,
    shortlisted: applications.filter(app => app.status === 'SHORTLISTED').length,
    selected: applications.filter(app => app.status === 'SELECTED').length,
    rejected: applications.filter(app => app.status === 'REJECTED').length
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">Admin Dashboard</h1>
        <p className="text-secondary-600">Manage job applications and track candidate progress</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-secondary-900">{stats.total}</div>
          <div className="text-sm text-secondary-600">Total</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.submitted}</div>
          <div className="text-sm text-secondary-600">Submitted</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.reviewed}</div>
          <div className="text-sm text-secondary-600">Reviewed</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.shortlisted}</div>
          <div className="text-sm text-secondary-600">Shortlisted</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.selected}</div>
          <div className="text-sm text-secondary-600">Selected</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          <div className="text-sm text-secondary-600">Rejected</div>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-secondary-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name, email, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>
            <div className="md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field"
              >
                <option value="">All Status</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="REVIEWED">Reviewed</option>
                <option value="SHORTLISTED">Shortlisted</option>
                <option value="SELECTED">Selected</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="card overflow-hidden">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-secondary-900 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Applications ({filteredApplications.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-50 border-b border-secondary-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Candidate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Skills
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Applied
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-secondary-200">
              {filteredApplications.map((application) => (
                <tr key={application.id} className="hover:bg-secondary-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-secondary-900">
                        {application.candidateName}
                      </div>
                      <div className="text-sm text-secondary-500">
                        ID: #{application.id}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-secondary-900">{application.phone}</div>
                    <div className="text-sm text-secondary-500">{application.candidateEmail}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-secondary-900 max-w-xs truncate">
                      {application.skills || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`status-badge ${getStatusColor(application.status)}`}>
                      {getStatusIcon(application.status)}
                      <span className="ml-1">{application.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                    {formatDate(application.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {/* Status Update Dropdown */}
                      <select
                        value={application.status}
                        onChange={(e) => updateApplicationStatus(application.id, e.target.value)}
                        disabled={updatingId === application.id}
                        className="text-sm border border-secondary-300 rounded px-2 py-1 disabled:opacity-50"
                      >
                        <option value="SUBMITTED">Submitted</option>
                        <option value="REVIEWED">Reviewed</option>
                        <option value="SHORTLISTED">Shortlisted</option>
                        <option value="SELECTED">Selected</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                      
                      {/* Download Resume */}
                      {application.resumeUrl && (
                        <button
                          onClick={() => downloadResume(application.resumeUrl, application.candidateName)}
                          className="text-secondary-600 hover:text-secondary-900"
                          title="Download Resume"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                      
                      {/* View Details */}
                      <button
                        className="text-secondary-600 hover:text-secondary-900"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredApplications.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary-100 rounded-full mb-4">
                <FileText className="w-8 h-8 text-secondary-400" />
              </div>
              <h3 className="text-lg font-medium text-secondary-900 mb-2">No applications found</h3>
              <p className="text-secondary-600">
                {searchTerm || statusFilter ? 'Try adjusting your filters' : 'No applications have been submitted yet'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
