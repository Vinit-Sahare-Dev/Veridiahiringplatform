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
  Briefcase,
  BarChart3,
  Activity,
  Target,
  Shield
} from 'lucide-react'
import '../../styles/AdminDashboard.css'

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
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'UNDER_REVIEW':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-4 h-4" />
      case 'UNDER_REVIEW':
        return <AlertCircle className="w-4 h-4" />
      case 'ACCEPTED':
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
    pending: applications.filter(app => app.status === 'PENDING').length,
    underReview: applications.filter(app => app.status === 'UNDER_REVIEW').length,
    shortlisted: applications.filter(app => app.status === 'SHORTLISTED').length,
    accepted: applications.filter(app => app.status === 'ACCEPTED').length,
    rejected: applications.filter(app => app.status === 'REJECTED').length
  }

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-header">
        <h1 className="admin-title">
          <Shield className="w-8 h-8 text-blue-600" />
          Admin Dashboard
        </h1>
        <p className="admin-subtitle">Manage job applications and track candidate progress</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon total">
            <Users className="w-5 h-5" />
          </div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Applications</div>
        </div>
        <div className="stat-card pending">
          <div className="stat-icon pending">
            <Clock className="w-5 h-5" />
          </div>
          <div className="stat-value">{stats.pending}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card under-review">
          <div className="stat-icon under-review">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="stat-value">{stats.underReview}</div>
          <div className="stat-label">Under Review</div>
        </div>
        <div className="stat-card shortlisted">
          <div className="stat-icon shortlisted">
            <Target className="w-5 h-5" />
          </div>
          <div className="stat-value">{stats.shortlisted}</div>
          <div className="stat-label">Shortlisted</div>
        </div>
        <div className="stat-card accepted">
          <div className="stat-icon accepted">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div className="stat-value">{stats.accepted}</div>
          <div className="stat-label">Accepted</div>
        </div>
        <div className="stat-card rejected">
          <div className="stat-icon rejected">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="stat-value">{stats.rejected}</div>
          <div className="stat-label">Rejected</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3 className="quick-actions-header">
          <Activity className="w-5 h-5" />
          Quick Actions
        </h3>
        <div className="quick-actions-grid">
          <Link to="/admin/applications" className="action-btn primary">
            <FileText className="w-4 h-4" />
            View All Applications
          </Link>
          <button className="action-btn secondary">
            <BarChart3 className="w-4 h-4" />
            Export Reports
          </button>
          <button className="action-btn secondary">
            <Users className="w-4 h-4" />
            Send Bulk Emails
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filters-grid">
          <div className="search-input">
            <Search className="search-icon w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
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

      {/* Applications Table */}
      <div className="applications-section">
        <div className="applications-header">
          <h3 className="applications-title">
            <Users className="w-5 h-5" />
            Applications
          </h3>
          <span className="applications-count">{filteredApplications.length}</span>
        </div>
        <div className="table-container">
          <table className="applications-table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Contact</th>
                <th>Location</th>
                <th>Work Mode</th>
                <th>Skills</th>
                <th>Status</th>
                <th>Applied</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((application) => (
                <tr key={application.id}>
                  <td>
                    <div className="candidate-info">
                      <div className="candidate-name">{application.candidateName}</div>
                      <div className="candidate-id">ID: #{application.id}</div>
                    </div>
                  </td>
                  <td>
                    <div className="contact-info">
                      <div className="contact-primary">{application.phone}</div>
                      <div className="contact-secondary">{application.candidateEmail}</div>
                    </div>
                  </td>
                  <td>{application.location || 'Not specified'}</td>
                  <td>
                    <span className={`work-mode-badge ${application.workMode}`}>
                      {application.workMode || 'Not specified'}
                    </span>
                  </td>
                  <td>
                    <div className="max-w-xs truncate">
                      {application.skills || 'N/A'}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${application.status.toLowerCase().replace('_', '-')}`}>
                      {getStatusIcon(application.status)}
                      {application.status}
                    </span>
                  </td>
                  <td>{formatDate(application.createdAt)}</td>
                  <td>
                    <div className="actions-cell">
                      <select
                        value={application.status}
                        onChange={(e) => updateApplicationStatus(application.id, e.target.value)}
                        disabled={updatingId === application.id}
                        className="status-select"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="UNDER_REVIEW">Under Review</option>
                        <option value="SHORTLISTED">Shortlisted</option>
                        <option value="ACCEPTED">Accepted</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                      
                      {application.resumeUrl && (
                        <button
                          onClick={() => downloadResume(application.resumeUrl, application.candidateName)}
                          className="action-btn-small"
                          title="Download Resume"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                      
                      <button className="action-btn-small" title="View Details">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredApplications.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="empty-title">No applications found</h3>
              <p className="empty-description">
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
