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
  Bell,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import '../../styles/Applications.css'

// Import jobs data from careers page
const jobs = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    department: 'Engineering',
    location: 'Bangalore / Remote',
    type: 'Full-time',
    experience: '5+ years',
    salary: '8 LPA - 12 LPA',
    category: 'engineering',
    level: 'Senior'
  },
  {
    id: 2,
    title: 'Product Manager',
    department: 'Product',
    location: 'Hyderabad / Hybrid',
    type: 'Full-time',
    experience: '3-5 years',
    salary: '6 LPA - 9 LPA',
    category: 'product',
    level: 'Mid-level'
  },
  {
    id: 3,
    title: 'Backend Engineer',
    department: 'Engineering',
    location: 'Pune',
    type: 'Full-time',
    experience: '3-5 years',
    salary: '7 LPA - 10 LPA',
    category: 'engineering',
    level: 'Mid-level'
  },
  {
    id: 4,
    title: 'UX Designer',
    department: 'Design',
    location: 'Bangalore',
    type: 'Full-time',
    experience: '2-4 years',
    salary: '5 LPA - 7 LPA',
    category: 'design',
    level: 'Mid-level'
  },
  {
    id: 5,
    title: 'Data Scientist',
    department: 'Data',
    location: 'Remote / Pune',
    type: 'Full-time',
    experience: '4-6 years',
    salary: '6 LPA - 8 LPA',
    category: 'data',
    level: 'Senior'
  },
  {
    id: 6,
    title: 'Marketing Manager',
    department: 'Marketing',
    location: 'Hyderabad',
    type: 'Full-time',
    experience: '3-5 years',
    salary: '4 LPA - 6 LPA',
    category: 'marketing',
    level: 'Mid-level'
  },
  {
    id: 7,
    title: 'DevOps Engineer',
    department: 'Engineering',
    location: 'Bangalore',
    type: 'Full-time',
    experience: '4-6 years',
    salary: '6 LPA - 8 LPA',
    category: 'engineering',
    level: 'Senior'
  },
  {
    id: 8,
    title: 'Content Strategist',
    department: 'Marketing',
    location: 'Remote',
    type: 'Full-time',
    experience: '2-4 years',
    salary: '3 LPA - 4 LPA',
    category: 'marketing',
    level: 'Mid-level'
  },
  {
    id: 9,
    title: 'Full Stack Developer',
    department: 'Engineering',
    location: 'Bangalore / Hybrid',
    type: 'Full-time',
    experience: '3-5 years',
    salary: '6 LPA - 9 LPA',
    category: 'engineering',
    level: 'Mid-level'
  }
]

const Dashboard = () => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [showConfetti, setShowConfetti] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState(null)

  // Function to get job details by ID
  const getJobById = (jobId) => {
    return jobs.find(job => job.id === parseInt(jobId))
  }

  // Function to clean up job title display
  const getJobTitle = (application) => {
    // First try to get job title from jobs array using jobId
    if (application.jobId) {
      const job = getJobById(application.jobId)
      if (job) {
        return job.title
      }
    }
    
    // Fallback to jobTitle from application, but clean it up
    if (application.jobTitle) {
      const title = application.jobTitle
      // Remove any "#" prefixes and clean up the title
      return title.replace(/^#+\s*/, '').trim()
    }
    
    return 'General Application'
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  // Trigger confetti when any application is accepted
  useEffect(() => {
    const hasAccepted = applications.some(app => app.status === 'ACCEPTED')
    if (hasAccepted) {
      setShowConfetti(true)
      const timer = setTimeout(() => {
        setShowConfetti(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [applications])

  const fetchApplications = async () => {
    try {
      const response = await applicationAPI.getMyApplications()
      setApplications(response.data)
    } catch (error) {
      console.error('Error fetching applications:', error)
      // Check for local storage backup
      const localApplication = localStorage.getItem('applicationSubmitted')
      if (localApplication === 'true') {
        const localData = localStorage.getItem('applicationData')
        if (localData) {
          const parsedData = JSON.parse(localData)
          setApplications([{
            ...parsedData,
            status: 'PENDING',
            candidateEmail: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).email : 'candidate@example.com',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            resumeUrl: 'Resume uploaded locally'
          }])
        }
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
    <div className="careers-container" style={{marginTop: 0, paddingTop: 0}}>
      <Confetti trigger={showConfetti} duration={3000} />
      
      {/* Hero Section */}
      <section className="careers-hero">
        <div className="careers-hero-content">
          <div className="careers-hero-badge">
            <Sparkles className="w-4 h-4" />
            Your Application Dashboard
          </div>
          
          <h1 className="careers-hero-title">
            Welcome to Your <span className="text-gradient">Dashboard</span>
          </h1>
          
          <p className="careers-hero-description text-center max-w-3xl mx-auto">
            Manage your job applications and track your career journey.
            Stay updated on your application status and next steps.
          </p>
          
          <div className="careers-hero-stats flex flex-col sm:flex-row gap-4 justify-center items-center text-center">
            <div className="careers-stat text-center">
              <span className="careers-stat-value">{applications.length}</span>
              <span className="careers-stat-label">Applications</span>
            </div>
            <div className="careers-stat text-center">
              <span className="careers-stat-value">{applications.filter(app => app.status === 'ACCEPTED').length}</span>
              <span className="careers-stat-label">Accepted</span>
            </div>
            <div className="careers-stat text-center">
              <span className="careers-stat-value">{applications.filter(app => app.status === 'SHORTLISTED').length}</span>
              <span className="careers-stat-label">Shortlisted</span>
            </div>
            <div className="careers-stat text-center">
              <span className="careers-stat-value">{applications.filter(app => app.status === 'UNDER_REVIEW').length}</span>
              <span className="careers-stat-label">In Review</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Full Width */}
      <div className="max-w-7xl mx-auto px-0 py-8">
      {applications.length === 0 ? (
        /* No Application Yet - Enhanced Design */
        <div className="space-y-8">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 sm:px-6">
            <Link
              to="/careers"
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 group hover:-translate-y-1 flex flex-col items-center text-center"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <Briefcase className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Browse Jobs</h3>
                  <p className="text-sm text-gray-600">Explore available opportunities</p>
                </div>
              </div>
            </Link>
            
            <Link
              to="/candidate/profile"
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 group hover:-translate-y-1 flex flex-col items-center text-center"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <User className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Update Profile</h3>
                  <p className="text-sm text-gray-600">Keep your information current</p>
                </div>
              </div>
            </Link>
            
            <Link
              to="/candidate/notifications"
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 group hover:-translate-y-1 flex flex-col items-center text-center"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <Bell className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Notifications</h3>
                  <p className="text-sm text-gray-600">Stay updated on your applications</p>
                </div>
              </div>
            </Link>
          </div>
          {/* Hero Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
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
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
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
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
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
        /* Multiple Applications - Full Width Cards View */
        <div className="space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <h2 className="text-4xl font-bold text-gray-800 mb-4 lg:mb-0">Your Applications</h2>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-50 px-6 py-3 rounded-xl border border-blue-200">
                <span className="text-blue-600">Total: </span>
                <span className="font-bold text-blue-800 text-lg">{applications.length} application{applications.length !== 1 ? 's' : ''}</span>
              </div>
              <Link
                to="/careers"
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg inline-flex items-center"
              >
                <Briefcase className="w-5 h-5 mr-2" />
                Browse More Jobs
              </Link>
            </div>
          </div>

          <div className="grid sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {applications.map((app) => (
              <div key={app.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 overflow-hidden group hover:shadow-blue-200 hover:scale-105" 
                   onClick={() => setSelectedApplication(selectedApplication?.id === app.id ? null : app)}>
                {/* Card Header */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 border-b border-blue-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${getStatusColor(app.status).replace('text-', 'bg-').replace('-800', '-100')} shadow-lg border border-white/50`}>
                        {getStatusIcon(app.status)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-white text-lg leading-tight">
                          {getJobTitle(app)}
                        </h3>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-blue-100 font-medium">
                            {app.firstName} {app.lastName}
                          </span>
                          {app.jobId && getJobById(app.jobId) ? (
                            <span className="text-xs text-blue-100 bg-white/20 px-2 py-1 rounded-full border border-white/30">
                              {getJobById(app.jobId).department}
                            </span>
                          ) : app.jobDepartment && (
                            <span className="text-xs text-blue-100 bg-white/20 px-2 py-1 rounded-full border border-white/30">
                              {app.jobDepartment}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  <div className="flex items-center justify-between mt-3">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold border ${getStatusColor(app.status)} shadow-lg bg-white/90`}>
                      {getStatusIcon(app.status)}
                      <span className="ml-1.5">{app.status}</span>
                    </span>
                    <span className="text-xs text-blue-100 font-medium">
                      Applied: {formatDate(app.submittedAt || app.createdAt)}
                    </span>
                  </div>
                </div>
                
                {/* Card Body */}
                <div className="p-4 space-y-3 bg-white">
                  {/* Position Applied For - Compact */}
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <div className="flex items-center space-x-2">
                      <Briefcase className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-gray-600 font-medium">Position Applied</p>
                        <p className="text-sm font-bold text-gray-800 truncate">
                          {getJobTitle(app)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Job Details - Horizontal Layout */}
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    {app.jobId && getJobById(app.jobId) ? (
                      <>
                        <div className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                          <span>{getJobById(app.jobId).location}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1 text-gray-400" />
                          <span>{getJobById(app.jobId).type}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        {app.jobLocation && (
                          <div className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                            <span>{app.jobLocation}</span>
                          </div>
                        )}
                        {app.jobType && (
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1 text-gray-400" />
                            <span>{app.jobType}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Skills Preview - Compact */}
                  {app.skills && (
                    <div className="pt-3 border-t border-gray-100">
                      <div className="flex items-start mb-2">
                        <Briefcase className="w-3 h-3 mr-1 mt-0.5 text-gray-400" />
                        <span className="text-xs font-semibold text-gray-700">Skills</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {app.skills && app.skills.split(',').slice(0, 2).map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium border border-blue-200">
                            {skill.trim()}
                          </span>
                        ))}
                        {app.skills && app.skills.split(',').length > 2 && (
                          <span className="px-2 py-1 bg-gray-50 text-gray-600 rounded text-xs font-medium border border-gray-200">
                            +{app.skills.split(',').length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Resume Indicator - Compact */}
                  {app.resumeUrl && (
                    <div className="pt-3 border-t border-gray-100">
                      <div className="flex items-center text-xs text-green-600 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                        <FileText className="w-3 h-3 mr-1" />
                        <span className="font-medium">Resume attached</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Click to view hint - Compact */}
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-center text-xs text-gray-500 group-hover:text-blue-600 transition-colors">
                      <span>Click to view details</span>
                      <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed View Modal - Full Screen */}
          {selectedApplication && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50">
              <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden shadow-2xl border border-gray-200">
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-8 border-b border-blue-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/40 shadow-2xl`}>
                        {getStatusIcon(selectedApplication.status)}
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold text-white mb-2">
                          {getJobTitle(selectedApplication)}
                        </h3>
                        <p className="text-blue-100 text-lg">
                          {selectedApplication.firstName} {selectedApplication.lastName}
                        </p>
                        {selectedApplication.jobDepartment && (
                          <p className="text-blue-200 text-sm mt-1">{selectedApplication.jobDepartment}</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedApplication(null)}
                      className="text-white/80 hover:text-white hover:bg-white/20 rounded-xl p-3 transition-all transform hover:scale-110"
                    >
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-8 max-h-[70vh] overflow-y-auto bg-gray-50">
                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                      {/* Status */}
                      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <h4 className="font-bold text-gray-800 text-xl mb-4">Application Status</h4>
                        <div className="flex items-center justify-between">
                          <span className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-bold border ${getStatusColor(selectedApplication.status)} bg-white shadow-sm`}>
                            {getStatusIcon(selectedApplication.status)}
                            <span className="ml-3">{selectedApplication.status}</span>
                          </span>
                          <span className="text-gray-600 text-lg">
                            Updated: {formatDate(selectedApplication.updatedAt)}
                          </span>
                        </div>
                      </div>

                      {/* Personal Info */}
                      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <h4 className="font-bold text-gray-800 text-xl mb-4">Personal Information</h4>
                        <div className="space-y-4 text-lg">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Name:</span>
                            <span className="font-medium text-gray-800">{selectedApplication.firstName} {selectedApplication.lastName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Email:</span>
                            <span className="font-medium text-gray-800">{selectedApplication.email}</span>
                          </div>
                          {selectedApplication.phone && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Phone:</span>
                              <span className="font-medium text-gray-800">{selectedApplication.phone}</span>
                            </div>
                          )}
                          {selectedApplication.location && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Location:</span>
                              <span className="font-medium text-gray-800">{selectedApplication.location}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Job Details */}
                      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <h4 className="font-bold text-gray-800 text-xl mb-4">Job Details</h4>
                        <div className="space-y-4 text-lg">
                          {selectedApplication.jobDepartment && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Department:</span>
                              <span className="font-medium text-gray-800">{selectedApplication.jobDepartment}</span>
                            </div>
                          )}
                          {selectedApplication.jobLocation && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Location:</span>
                              <span className="font-medium text-gray-800">{selectedApplication.jobLocation}</span>
                            </div>
                          )}
                          {selectedApplication.jobType && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Type:</span>
                              <span className="font-medium text-gray-800">{selectedApplication.jobType}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      {/* Skills */}
                      {selectedApplication.skills && (
                        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                          <h4 className="font-bold text-gray-800 text-xl mb-4">Skills</h4>
                          <div className="flex flex-wrap gap-3">
                            {selectedApplication.skills && selectedApplication.skills.split(',').map((skill, index) => (
                              <span key={index} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-bold border border-blue-200 shadow-sm">
                                {skill.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Experience */}
                      {selectedApplication.experience && (
                        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                          <h4 className="font-bold text-gray-800 text-xl mb-4">Experience</h4>
                          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-lg">{selectedApplication.experience}</p>
                        </div>
                      )}

                      {/* Education */}
                      {selectedApplication.education && (
                        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                          <h4 className="font-bold text-gray-800 text-xl mb-4">Education</h4>
                          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-lg">{selectedApplication.education}</p>
                        </div>
                      )}

                      {/* Links */}
                      <div className="space-y-4">
                        {selectedApplication.portfolioLink && (
                          <a
                            href={selectedApplication.portfolioLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-2xl text-lg font-bold"
                          >
                            <ExternalLink className="w-5 h-5 mr-3" />
                            View Portfolio
                          </a>
                        )}
                        
                        {selectedApplication.resumeUrl && (
                          <div className="flex items-center justify-center w-full bg-green-50 text-green-600 px-6 py-4 rounded-2xl border border-green-200">
                            <FileText className="w-5 h-5 mr-3" />
                            <span className="font-bold text-lg">Resume attached</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  )
}

export default Dashboard
