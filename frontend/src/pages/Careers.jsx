import React, { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { jobAPI, applicationAPI } from '../services/api'
import { 
  Briefcase, 
  MapPin, 
  Users, 
  Clock, 
  DollarSign,
  Building,
  Calendar,
  ChevronRight,
  Star,
  TrendingUp,
  Sparkles,
  Rocket,
  Shield,
  Search,
  Filter,
  X,
  CheckCircle,
  Brain,
  Target,
  Lightbulb,
  Globe2,
  Heart,
  Award,
  Zap,
  Bookmark,
  Share2
} from 'lucide-react'
import '../styles/CareersEnhanced.css'
import '../styles/AppliedBadge.css'

const Careers = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedExperience, setSelectedExperience] = useState('all')
  const [hoveredJob, setHoveredJob] = useState(null)
  const [savedJobs, setSavedJobs] = useState(new Set())
  const [appliedJobs, setAppliedJobs] = useState(new Set())
  const [sortBy, setSortBy] = useState('newest')
  const [visibleJobs, setVisibleJobs] = useState(9)
  const [user, setUser] = useState(null)
  const [jobs, setJobs] = useState([])
  const [jobsLoading, setJobsLoading] = useState(true)
  const navigate = useNavigate()

  // Fetch jobs from API
  const fetchJobs = async () => {
    try {
      setJobsLoading(true)
      console.log('Fetching jobs from API...')
      const response = await jobAPI.getAllJobs()
      
      if (response.data && Array.isArray(response.data)) {
        console.log('Jobs received:', response.data)
        // Add postedDate for sorting if not present
        const jobsWithDates = response.data.map(job => ({
          ...job,
          postedDate: job.createdAt ? new Date(job.createdAt) : new Date(),
          matchScore: Math.floor(Math.random() * 30) + 70 // Random match score for demo
        }))
        setJobs(jobsWithDates)
      } else {
        console.warn('No jobs data received')
        setJobs([])
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
      setJobs([])
    } finally {
      setJobsLoading(false)
    }
  }

  // Fetch jobs on component mount
  useEffect(() => {
    fetchJobs()
  }, [])

  // Check authentication and fetch applied jobs
  useEffect(() => {
    const checkAuthAndFetchApplications = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          // Get user info
          const userResponse = await fetch('/api/candidate/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          
          if (userResponse.ok) {
            const userData = await userResponse.json()
            setUser(userData)
            
            // Fetch all applications to check which jobs user has applied to
            const appsResponse = await fetch('/api/application/my-applications', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            })
            
            if (appsResponse.ok) {
              const applications = await appsResponse.json()
              console.log('Applications received:', applications)
              console.log('Applications length:', applications.length)
              if (applications.length > 0) {
                console.log('First application:', applications[0])
                console.log('First application jobId:', applications[0].jobId)
              }
              const appliedJobIds = new Set(applications.map(app => String(app.jobId)).filter(id => id))
              console.log('Applied job IDs:', appliedJobIds)
              console.log('Applied job IDs size:', appliedJobIds.size)
              setAppliedJobs(appliedJobIds)
            } else {
              console.log('Failed to fetch applications:', appsResponse.status)
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error)
        }
      }
    }
    
    checkAuthAndFetchApplications()
  }, [])

  // Check if user has applied to a specific job
  const checkJobApplication = async (jobId) => {
    const token = localStorage.getItem('token')
    if (!token) return false
    
    try {
      const response = await fetch(`/api/application/check-job-application/${jobId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        return data.hasApplied
      }
      return false
    } catch (error) {
      console.error('Error checking job application:', error)
      return false
    }
  }

  const categories = useMemo(() => [
    { id: 'all', name: 'All Positions', count: jobs.length, icon: Briefcase },
    { id: 'engineering', name: 'Engineering', count: jobs.filter(j => j.category === 'engineering').length, icon: Brain },
    { id: 'product', name: 'Product', count: jobs.filter(j => j.category === 'product').length, icon: Target },
    { id: 'design', name: 'Design', count: jobs.filter(j => j.category === 'design').length, icon: Lightbulb },
    { id: 'data', name: 'Data', count: jobs.filter(j => j.category === 'data').length, icon: Globe2 },
    { id: 'marketing', name: 'Marketing', count: jobs.filter(j => j.category === 'marketing').length, icon: Rocket }
  ], [jobs])

  const locations = useMemo(() => [
    { id: 'all', name: 'All Locations' },
    { id: 'remote', name: 'Remote' },
    { id: 'bangalore', name: 'Bangalore' },
    { id: 'hyderabad', name: 'Hyderabad' },
    { id: 'pune', name: 'Pune' }
  ], [])

  const jobTypes = useMemo(() => [
    { id: 'all', name: 'All Types' },
    { id: 'full-time', name: 'Full-time' },
    { id: 'part-time', name: 'Part-time' },
    { id: 'contract', name: 'Contract' },
    { id: 'internship', name: 'Internship' }
  ], [])

  const experienceLevels = useMemo(() => [
    { id: 'all', name: 'All Levels' },
    { id: 'entry', name: 'Entry Level (0-2 years)' },
    { id: 'mid', name: 'Mid Level (2-5 years)' },
    { id: 'senior', name: 'Senior (5+ years)' },
    { id: 'lead', name: 'Lead/Principal (8+ years)' }
  ], [])

  const filteredJobs = useMemo(() => {
    let filtered = jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (Array.isArray(job.requirements) 
                             ? job.requirements.some(req => req.toLowerCase().includes(searchTerm.toLowerCase()))
                             : job.requirements.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesCategory = selectedCategory === 'all' || job.category === selectedCategory
      const matchesLocation = selectedLocation === 'all' || 
                             (selectedLocation === 'remote' && job.location.includes('Remote')) ||
                             (selectedLocation === 'bangalore' && job.location.includes('Bangalore')) ||
                             (selectedLocation === 'hyderabad' && job.location.includes('Hyderabad')) ||
                             (selectedLocation === 'pune' && job.location.includes('Pune'))
      const matchesType = selectedType === 'all' || job.type.toLowerCase().includes(selectedType.replace('-', ' '))
      const matchesExperience = selectedExperience === 'all' || 
                               (selectedExperience === 'entry' && job.experience === 'Entry Level') ||
                               (selectedExperience === 'mid' && job.experience === 'Mid-level') ||
                               (selectedExperience === 'senior' && job.experience === 'Senior') ||
                               (selectedExperience === 'lead' && job.experience === 'Lead/Principal')
      
      return matchesSearch && matchesCategory && matchesLocation && matchesType && matchesExperience
    })

    // Sort jobs
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.postedDate - a.postedDate
        case 'salary':
          const aSalary = parseFloat(a.salary.split('LPA')[1].split('-')[1].trim())
          const bSalary = parseFloat(b.salary.split('LPA')[1].split('-')[1].trim())
          return bSalary - aSalary
        case 'applicants':
          return b.applicants - a.applicants
        case 'match':
          return b.matchScore - a.matchScore
        default:
          return 0
      }
    })

    return filtered
  }, [jobs, searchTerm, selectedCategory, selectedLocation, selectedType, selectedExperience, sortBy])

  const toggleSaveJob = (jobId) => {
    const newSavedJobs = new Set(savedJobs)
    if (newSavedJobs.has(jobId)) {
      newSavedJobs.delete(jobId)
    } else {
      newSavedJobs.add(jobId)
    }
    setSavedJobs(newSavedJobs)
  }

  const shareJob = (job) => {
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: job.description,
        url: window.location.href
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const benefits = [
    { icon: Heart, title: 'Health & Wellness', description: 'Comprehensive medical, dental, and vision insurance', gradient: 'from-pink-500 to-rose-500' },
    { icon: Clock, title: 'Flexible Work', description: 'Remote-first culture with flexible hours', gradient: 'from-blue-500 to-cyan-500' },
    { icon: DollarSign, title: 'Competitive Salary', description: 'Top-tier compensation and equity packages', gradient: 'from-green-500 to-emerald-500' },
    { icon: Award, title: 'Professional Growth', description: '$2000 yearly learning and development budget', gradient: 'from-purple-500 to-violet-500' },
    { icon: Users, title: 'Team Culture', description: 'Collaborative and inclusive work environment', gradient: 'from-orange-500 to-amber-500' },
    { icon: Zap, title: 'Innovation Time', description: 'Monthly hack days and innovation sprints', gradient: 'from-yellow-500 to-orange-500' }
  ]

  return (
    <div className="careers-container">
      {/* Hero Section */}
      <section className="careers-hero">
        <div className="careers-hero-content">
          <div className="careers-hero-badge">
            <Sparkles className="w-4 h-4" />
            Now Hiring: Join Our Amazing Team
          </div>
          
          <h1 className="careers-hero-title">
            Build Your Career at <span className="text-gradient">Veridia</span>
          </h1>
          
          <p className="careers-hero-description">
            Join our team of innovators, creators, and problem-solvers. 
            Together, we're building the future of hiring technology.
          </p>
          
          <div className="careers-hero-stats">
            <div className="careers-stat">
              <span className="careers-stat-value">200+</span>
              <span className="careers-stat-label">Employees</span>
            </div>
            <div className="careers-stat">
              <span className="careers-stat-value">4.8★</span>
              <span className="careers-stat-label">Rating</span>
            </div>
            <div className="careers-stat">
              <span className="careers-stat-value">10+</span>
              <span className="careers-stat-label">Countries</span>
            </div>
            <div className="careers-stat">
              <span className="careers-stat-value">95%</span>
              <span className="careers-stat-label">Retention</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="careers-filters">
        <div className="careers-filters-content">
          <div className="careers-filters-grid">
            <div className="careers-search-container">
              <Search className="careers-search-icon w-5 h-5" />
              <input
                type="text"
                placeholder="Search jobs, skills, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="careers-search-input"
              />
            </div>
            
            <div>
              <label className="careers-filter-label">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="careers-filter-select"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} ({cat.count})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="careers-filter-label">Location</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="careers-filter-select"
              >
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="careers-filter-label">Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="careers-filter-select"
              >
                {jobTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="careers-filter-label">Experience</label>
              <select
                value={selectedExperience}
                onChange={(e) => setSelectedExperience(e.target.value)}
                className="careers-filter-select"
              >
                {experienceLevels.map(level => (
                  <option key={level.id} value={level.id}>
                    {level.name}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              onClick={() => setSortBy(sortBy === 'newest' ? 'salary' : 'newest')}
              className="careers-sort-btn"
            >
              <Filter className="w-4 h-4" />
              Sort by {sortBy === 'newest' ? 'Salary' : 'Newest'}
            </button>
          </div>
        </div>
      </section>

      {/* Jobs Section */}
      <section className="careers-jobs-section">
        <div className="careers-jobs-header">
          <h2 className="careers-jobs-title">
            {filteredJobs.length} Open Positions
          </h2>
          <div className="careers-jobs-count">
            {filteredJobs.length} jobs found
          </div>
        </div>
        
        {jobsLoading ? (
          <div className="careers-loading-state">
            <div className="careers-loading-spinner">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="careers-loading-text">Loading available positions...</p>
          </div>
        ) : filteredJobs.length > 0 ? (
          <>
            <div className="careers-jobs-grid">
              {filteredJobs.slice(0, visibleJobs).map((job) => (
                <div key={job.id} className="careers-job-card">
                  <div className="careers-job-header">
                    <div>
                      <h3 className="careers-job-title">{job.title}</h3>
                      <p className="careers-job-department">{job.department}</p>
                    </div>
                    <div className="careers-job-actions">
                      <button
                        onClick={() => toggleSaveJob(job.id)}
                        className={`careers-job-action-btn ${savedJobs.has(job.id) ? 'saved' : ''}`}
                        title="Save job"
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => shareJob(job)}
                        className="careers-job-action-btn"
                        title="Share job"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="careers-job-meta">
                    <div className="careers-job-meta-item">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </div>
                    <div className="careers-job-meta-item">
                      <Briefcase className="w-4 h-4" />
                      {job.type}
                    </div>
                    <div className="careers-job-meta-item">
                      <Clock className="w-4 h-4" />
                      {job.experience}
                    </div>
                  </div>
                  
                  <div className="careers-job-badges">
                    <span className="careers-job-badge type">{job.type}</span>
                    <span className="careers-job-badge level">{job.level}</span>
                    <span className="careers-job-badge location">{job.location.includes('Remote') ? 'Remote' : 'On-site'}</span>
                  </div>
                  
                  <p className="careers-job-description">{job.description}</p>
                  
                  <div className="careers-job-footer">
                    <div className="careers-job-salary">{job.salary}</div>
                    {(() => {
                      console.log(`Checking job ${job.id}, appliedJobs contains:`, appliedJobs.has(String(job.id)))
                      return appliedJobs.has(String(job.id)) ? (
                      <div className="careers-job-applied-badge">
                        <span className="applied-text">Applied</span>
                      </div>
                    ) : (
                      <Link
                        to={`/candidate/apply?job=${job.id}`}
                        className="careers-job-apply-btn"
                      >
                        Apply Now
                      </Link>
                    )
                    })()}
                  </div>
                </div>
              ))}
            </div>
            
            {filteredJobs.length > visibleJobs && (
              <div className="careers-load-more">
                <button
                  onClick={() => setVisibleJobs(prev => prev + 6)}
                  className="careers-load-more-btn"
                >
                  Load More Jobs
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="careers-empty-state">
            <div className="careers-empty-icon">
              <Briefcase className="w-8 h-8" />
            </div>
            <h3 className="careers-empty-title">No jobs found</h3>
            <p className="careers-empty-description">
              Try adjusting your filters or search terms to find more opportunities.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}

export default Careers
