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
  Shield,
  Plus,
  Edit2,
  Trash2,
  X
} from 'lucide-react'
import '../../styles/AdminDashboard.css'

const AdminDashboard = () => {
  const [applications, setApplications] = useState([])
  const [filteredApplications, setFilteredApplications] = useState([])
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [jobFilter, setJobFilter] = useState('all')
  const [showJobForm, setShowJobForm] = useState(false)
  const [editingJob, setEditingJob] = useState(null)
  const [jobForm, setJobForm] = useState({
    title: '',
    department: '',
    location: '',
    type: '',
    experience: '',
    salary: '',
    category: '',
    description: '',
    requirements: '',
    featured: false
  })
  const [updatingId, setUpdatingId] = useState(null)

  useEffect(() => {
    fetchApplications()
    fetchJobs()
  }, [])

  useEffect(() => {
    filterApplications()
  }, [applications, searchTerm, statusFilter, jobFilter])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const response = await applicationAPI.getAllApplications()
      setApplications(response.data)
      setFilteredApplications(response.data)
    } catch (error) {
      console.error('Failed to fetch applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchJobs = async () => {
    try {
      console.log('Fetching jobs from /api/jobs/admin/all...')
      const response = await fetch('/api/jobs/admin/all')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log('Jobs fetched:', data)
      setJobs(data)
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
      // Set empty array to prevent infinite loading
      setJobs([])
    }
  }

  const handleAddJob = () => {
    setEditingJob(null)
    setJobForm({
      title: '',
      department: '',
      location: '',
      type: '',
      experience: '',
      salary: '',
      category: '',
      description: '',
      requirements: '',
      featured: false
    })
    setShowJobForm(true)
  }

  const handleEditJob = (job) => {
    setEditingJob(job)
    setJobForm({
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      experience: job.experience,
      salary: job.salary,
      category: job.category,
      description: job.description,
      requirements: job.requirements,
      featured: job.featured
    })
    setShowJobForm(true)
  }

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      try {
        const response = await fetch(`/api/jobs/admin/${jobId}`, { method: 'DELETE' })
        if (response.ok) {
          fetchJobs()
          fetchApplications()
        } else {
          const errorData = await response.json()
          console.error('Failed to delete job:', errorData)
          alert('Error: ' + (errorData || 'Failed to delete job'))
        }
      } catch (error) {
        console.error('Failed to delete job:', error)
        alert('Error: Failed to delete job')
      }
    }
  }

  const handleSaveJob = async () => {
    try {
      const url = editingJob ? `/api/jobs/admin/${editingJob.id}` : '/api/jobs/admin/create'
      const method = editingJob ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...jobForm,
          posted: "true",
          applicants: editingJob ? editingJob.applicants : 0
        })
      })
      
      if (response.ok) {
        setShowJobForm(false)
        fetchJobs()
        fetchApplications()
      } else {
        const errorData = await response.json()
        console.error('Failed to save job:', errorData)
        alert('Error: ' + (errorData || 'Failed to save job'))
      }
    } catch (error) {
      console.error('Failed to save job:', error)
      alert('Error: Failed to save job')
    }
  }

  const filterApplications = () => {
    let filtered = applications || []

    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.candidateName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.candidateEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (app.skills && app.skills.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (app.jobTitle && app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter)
    }

    if (jobFilter && jobFilter !== 'all') {
      filtered = filtered.filter(app => app.jobTitle === jobFilter)
    }

    setFilteredApplications(filtered)
  }

  // Get unique job titles for filter dropdown
  const getUniqueJobTitles = () => {
    const jobTitles = [...new Set(applications.map(app => app.jobTitle).filter(Boolean))]
    return jobTitles.sort()
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
    rejected: applications.filter(app => app.status === 'REJECTED').length,
    uniqueJobs: getUniqueJobTitles().length,
    topJob: getUniqueJobTitles()[0] || 'N/A'
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
        <div className="admin-header-content">
          <div>
            <h1 className="admin-title">
              <Shield className="w-8 h-8 mr-3" style={{ display: 'inline-block', verticalAlign: 'middle' }} />
              Admin Dashboard
            </h1>
            <p className="admin-subtitle">Manage job postings, applications, and track hiring progress</p>
          </div>
          <div className="admin-header-stats">
            <div className="header-stat-item">
              <div className="header-stat-value">{applications.length}</div>
              <div className="header-stat-label">Total Applications</div>
            </div>
            <div className="header-stat-item">
              <div className="header-stat-value">{getUniqueJobTitles().length}</div>
              <div className="header-stat-label">Job Positions</div>
            </div>
            <div className="header-stat-item">
              <div className="header-stat-value">{stats.pending}</div>
              <div className="header-stat-label">Pending Review</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon total">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Applications</div>
            <div className="stat-detail">All time submissions</div>
          </div>
        </div>
        <div className="stat-card pending">
          <div className="stat-icon pending">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="stat-value">{stats.pending}</div>
            <div className="stat-label">Pending</div>
            <div className="stat-detail">Awaiting review</div>
          </div>
        </div>
        <div className="stat-card under-review">
          <div className="stat-icon under-review">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="stat-value">{stats.underReview}</div>
            <div className="stat-label">Under Review</div>
            <div className="stat-detail">In progress</div>
          </div>
        </div>
        <div className="stat-card accepted">
          <div className="stat-icon accepted">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="stat-value">{stats.accepted}</div>
            <div className="stat-label">Accepted</div>
            <div className="stat-detail">Successful hires</div>
          </div>
        </div>
        <div className="stat-card shortlisted">
          <div className="stat-icon shortlisted">
            <Target className="w-5 h-5" />
          </div>
          <div className="stat-value">{stats.shortlisted}</div>
          <div className="stat-label">Shortlisted</div>
        </div>
        <div className="stat-card rejected">
          <div className="stat-icon rejected">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="stat-value">{stats.rejected}</div>
          <div className="stat-label">Rejected</div>
        </div>
        <div className="stat-card jobs">
          <div className="stat-icon jobs">
            <Briefcase className="w-5 h-5" />
          </div>
          <div className="stat-value">{stats.uniqueJobs}</div>
          <div className="stat-label">Job Posts</div>
        </div>
        <div className="stat-card top-job">
          <div className="stat-icon top-job">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="stat-value">{stats.topJob}</div>
          <div className="stat-label">Top Job</div>
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

      {/* Job Management */}
      <div className="job-management-section">
        <div className="section-header">
          <h3 className="section-title">
            <Briefcase className="w-5 h-5" />
            Job Management
          </h3>
          <button className="add-job-btn" onClick={handleAddJob}>
            <Plus className="w-4 h-4" />
            Add New Job
          </button>
        </div>
        
        <div className="jobs-grid">
          {jobs.length === 0 ? (
            <div className="no-jobs-message">
              <div className="no-jobs-icon">
                <Briefcase className="w-12 h-12" />
              </div>
              <h3>No Jobs Posted Yet</h3>
              <p>Start by adding your first job posting using the "Add New Job" button above.</p>
            </div>
          ) : (
            jobs.map(job => (
              <div key={job.id} className="job-card">
                <div className="job-header">
                  <h4 className="job-title">{job.title}</h4>
                  <div className="job-actions">
                    <button className="job-action-btn edit" onClick={() => handleEditJob(job)}>
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="job-action-btn delete" onClick={() => handleDeleteJob(job.id)}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="job-details">
                  <div className="job-info">
                    <span className="job-department">{job.department}</span>
                    <span className="job-location">{job.location}</span>
                    <span className="job-type">{job.type}</span>
                  </div>
                  <div className="job-meta">
                    <span className="job-salary">{job.salary}</span>
                    <span className="job-experience">{job.experience}</span>
                  </div>
                  <div className="job-stats">
                    <span className="applicants-count">{job.applicants || 0} applicants</span>
                    {job.featured && <span className="featured-badge">Featured</span>}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Job Form Modal */}
      {showJobForm && (
        <div className="job-form-modal">
          <div className="job-form-content">
            <div className="job-form-header">
              <h3>{editingJob ? 'Edit Job' : 'Add New Job'}</h3>
              <button className="close-btn" onClick={() => setShowJobForm(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="job-form-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Job Title</label>
                  <input
                    type="text"
                    value={jobForm.title}
                    onChange={(e) => setJobForm({...jobForm, title: e.target.value})}
                    placeholder="e.g. Senior Software Engineer"
                  />
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <input
                    type="text"
                    value={jobForm.department}
                    onChange={(e) => setJobForm({...jobForm, department: e.target.value})}
                    placeholder="e.g. Engineering"
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={jobForm.location}
                    onChange={(e) => setJobForm({...jobForm, location: e.target.value})}
                    placeholder="e.g. Remote, On-site, Hybrid"
                  />
                </div>
                <div className="form-group">
                  <label>Job Type</label>
                  <select
                    value={jobForm.type}
                    onChange={(e) => setJobForm({...jobForm, type: e.target.value})}
                  >
                    <option value="">Select Type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Experience</label>
                  <input
                    type="text"
                    value={jobForm.experience}
                    onChange={(e) => setJobForm({...jobForm, experience: e.target.value})}
                    placeholder="e.g. 3+ years"
                  />
                </div>
                <div className="form-group">
                  <label>Salary Range</label>
                  <input
                    type="text"
                    value={jobForm.salary}
                    onChange={(e) => setJobForm({...jobForm, salary: e.target.value})}
                    placeholder="e.g. $80k - $120k"
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <input
                    type="text"
                    value={jobForm.category}
                    onChange={(e) => setJobForm({...jobForm, category: e.target.value})}
                    placeholder="e.g. Engineering"
                  />
                </div>
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={jobForm.featured}
                      onChange={(e) => setJobForm({...jobForm, featured: e.target.checked})}
                    />
                    Featured Job
                  </label>
                </div>
              </div>
              <div className="form-group full-width">
                <label>Job Description</label>
                <textarea
                  value={jobForm.description}
                  onChange={(e) => setJobForm({...jobForm, description: e.target.value})}
                  placeholder="Describe the role and responsibilities..."
                  rows={4}
                />
              </div>
              <div className="form-group full-width">
                <label>Requirements</label>
                <textarea
                  value={jobForm.requirements}
                  onChange={(e) => setJobForm({...jobForm, requirements: e.target.value})}
                  placeholder="List the required skills and qualifications..."
                  rows={4}
                />
              </div>
            </div>
            <div className="job-form-footer">
              <button className="btn-secondary" onClick={() => setShowJobForm(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSaveJob}>
                {editingJob ? 'Update Job' : 'Create Job'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="filters-section">
        <div className="filters-grid">
          <div className="search-input">
            <Search className="search-icon w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email, skills, or job title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={jobFilter}
            onChange={(e) => setJobFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Job Posts</option>
            {getUniqueJobTitles().map(jobTitle => (
              <option key={jobTitle} value={jobTitle}>{jobTitle}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
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
                <th>Job Post</th>
                <th>Contact</th>
                <th>Work Mode</th>
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
                    <div className="job-post-info">
                      <div className="job-title">{application.jobTitle || 'Not specified'}</div>
                      <div className="job-department">{application.department || 'General'}</div>
                    </div>
                  </td>
                  <td>
                    <div className="contact-info">
                      <div className="contact-primary">{application.phone}</div>
                      <div className="contact-secondary">{application.candidateEmail}</div>
                    </div>
                  </td>
                  <td>
                    <span className={`work-mode-badge ${application.workMode}`}>
                      {application.workMode || 'Not specified'}
                    </span>
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
