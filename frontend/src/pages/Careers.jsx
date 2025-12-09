import React, { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  MapPin, 
  DollarSign, 
  Clock, 
  Briefcase, 
  Users, 
  Heart,
  Zap,
  Target,
  Award,
  Building,
  Calendar,
  Search,
  Filter,
  ChevronRight,
  Star,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Rocket,
  Shield,
  Globe2,
  Brain,
  Lightbulb,
  Bookmark,
  Share2,
  Eye,
  Timer
} from 'lucide-react'
import '../styles/CareersEnhanced.css'

const Careers = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedExperience, setSelectedExperience] = useState('all')
  const [hoveredJob, setHoveredJob] = useState(null)
  const [savedJobs, setSavedJobs] = useState(new Set())
  const [sortBy, setSortBy] = useState('newest')
  const [visibleJobs, setVisibleJobs] = useState(9)
  const navigate = useNavigate()

  const jobs = useMemo(() => [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      location: 'Bangalore / Remote',
      type: 'Full-time',
      experience: '5+ years',
      salary: '$120k - $180k',
      category: 'engineering',
      level: 'Senior',
      description: 'Build amazing user interfaces and help shape the future of our platform. Work with cutting-edge technologies and collaborate with world-class engineers.',
      requirements: ['React', 'TypeScript', 'Node.js', '5+ years experience'],
      responsibilities: ['Develop responsive web applications', 'Collaborate with design team', 'Optimize application performance', 'Mentor junior developers'],
      benefits: ['Stock options', 'Flexible work hours', 'Professional development budget', 'Health insurance'],
      posted: '2 days ago',
      postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      applicants: 45,
      featured: true,
      views: 1250,
      matchScore: 95
    },
    {
      id: 2,
      title: 'Product Manager',
      department: 'Product',
      location: 'Hyderabad / Hybrid',
      type: 'Full-time',
      experience: '3-5 years',
      salary: '$100k - $150k',
      category: 'product',
      level: 'Mid-level',
      description: 'Drive product strategy and work with cross-functional teams to deliver exceptional products that users love.',
      requirements: ['Product strategy', 'Data analysis', 'Leadership', '3+ years experience'],
      responsibilities: ['Define product roadmap', 'Conduct user research', 'Analyze market trends', 'Collaborate with engineering'],
      benefits: ['Performance bonuses', 'Remote work options', 'Learning stipend', 'Gym membership'],
      posted: '1 week ago',
      postedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      applicants: 32,
      featured: true,
      views: 890,
      matchScore: 88
    },
    {
      id: 3,
      title: 'Backend Engineer',
      department: 'Engineering',
      location: 'Pune',
      type: 'Full-time',
      experience: '3-5 years',
      salary: '$100k - $160k',
      category: 'engineering',
      level: 'Mid-level',
      description: 'Design and implement scalable backend systems and APIs that power our platform.',
      requirements: ['Java', 'Spring Boot', 'Microservices', '3+ years experience'],
      responsibilities: ['Build RESTful APIs', 'Design database schemas', 'Implement security measures', 'Optimize system performance'],
      benefits: ['Stock options', 'Flexible schedule', 'Tech conferences', 'Health benefits'],
      posted: '3 days ago',
      postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      applicants: 28,
      featured: false,
      views: 650,
      matchScore: 82
    },
    {
      id: 4,
      title: 'UX Designer',
      department: 'Design',
      location: 'Bangalore',
      type: 'Full-time',
      experience: '2-4 years',
      salary: '$80k - $120k',
      category: 'design',
      level: 'Mid-level',
      description: 'Create beautiful and intuitive user experiences that delight our users.',
      requirements: ['Figma', 'User research', 'Prototyping', '2+ years experience'],
      responsibilities: ['Design user interfaces', 'Conduct usability tests', 'Create design systems', 'Collaborate with developers'],
      benefits: ['Creative freedom', 'Design tools budget', 'Flexible hours', 'Wellness program'],
      posted: '5 days ago',
      postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      applicants: 19,
      featured: false,
      views: 420,
      matchScore: 75
    },
    {
      id: 5,
      title: 'Data Scientist',
      department: 'Data',
      location: 'Remote / Pune',
      type: 'Full-time',
      experience: '4-6 years',
      salary: '$110k - $170k',
      category: 'data',
      level: 'Senior',
      description: 'Apply machine learning and statistical analysis to solve complex business problems.',
      requirements: ['Python', 'Machine Learning', 'Statistics', '4+ years experience'],
      responsibilities: ['Build ML models', 'Analyze datasets', 'Present insights', 'Collaborate with stakeholders'],
      benefits: ['Research budget', 'Conference attendance', 'Flexible work', 'Stock options'],
      posted: '1 day ago',
      postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      applicants: 52,
      featured: true,
      views: 1580,
      matchScore: 92
    },
    {
      id: 6,
      title: 'Marketing Manager',
      department: 'Marketing',
      location: 'Hyderabad',
      type: 'Full-time',
      experience: '3-5 years',
      salary: '$70k - $100k',
      category: 'marketing',
      level: 'Mid-level',
      description: 'Lead marketing campaigns and drive brand growth in the competitive tech landscape.',
      requirements: ['Digital marketing', 'Content strategy', 'Analytics', '3+ years experience'],
      responsibilities: ['Develop marketing strategies', 'Manage campaigns', 'Analyze performance', 'Lead marketing team'],
      benefits: ['Performance bonuses', 'Creative budget', 'Remote options', 'Professional development'],
      posted: '1 week ago',
      postedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      applicants: 24,
      featured: false,
      views: 380,
      matchScore: 78
    },
    {
      id: 7,
      title: 'DevOps Engineer',
      department: 'Engineering',
      location: 'Bangalore',
      type: 'Full-time',
      experience: '4-6 years',
      salary: '$110k - $160k',
      category: 'engineering',
      level: 'Senior',
      description: 'Build and maintain CI/CD pipelines and infrastructure for scalable applications.',
      requirements: ['Docker', 'Kubernetes', 'AWS', '4+ years experience'],
      responsibilities: ['Manage cloud infrastructure', 'Implement CI/CD', 'Monitor systems', 'Automate deployments'],
      benefits: ['Cloud certifications', 'On-call compensation', 'Flexible schedule', 'Stock options'],
      posted: '4 days ago',
      postedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      applicants: 31,
      featured: false,
      views: 720,
      matchScore: 85
    },
    {
      id: 8,
      title: 'Content Strategist',
      department: 'Marketing',
      location: 'Remote',
      type: 'Full-time',
      experience: '2-4 years',
      salary: '$60k - $90k',
      category: 'marketing',
      level: 'Mid-level',
      description: 'Create compelling content strategies that engage and convert our target audience.',
      requirements: ['Content writing', 'SEO', 'Analytics', '2+ years experience'],
      responsibilities: ['Develop content calendar', 'Write blog posts', 'Optimize for SEO', 'Analyze content performance'],
      benefits: ['Remote work', 'Creative freedom', 'Learning budget', 'Flexible hours'],
      posted: '6 days ago',
      postedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      applicants: 15,
      featured: false,
      views: 290,
      matchScore: 71
    },
    {
      id: 9,
      title: 'Full Stack Developer',
      department: 'Engineering',
      location: 'Bangalore / Hybrid',
      type: 'Full-time',
      experience: '3-5 years',
      salary: '$90k - $140k',
      category: 'engineering',
      level: 'Mid-level',
      description: 'Work across the full stack to build features from database to user interface.',
      requirements: ['React', 'Node.js', 'MongoDB', '3+ years experience'],
      responsibilities: ['Develop full-stack features', 'Design APIs', 'Optimize performance', 'Collaborate with teams'],
      benefits: ['Stock options', 'Flexible work', 'Learning budget', 'Health insurance'],
      posted: '2 days ago',
      postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      applicants: 38,
      featured: false,
      views: 980,
      matchScore: 87
    }
  ], [])

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
                           job.requirements.some(req => req.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesCategory = selectedCategory === 'all' || job.category === selectedCategory
      const matchesLocation = selectedLocation === 'all' || 
                             (selectedLocation === 'remote' && job.location.includes('Remote')) ||
                             (selectedLocation === 'bangalore' && job.location.includes('Bangalore')) ||
                             (selectedLocation === 'hyderabad' && job.location.includes('Hyderabad')) ||
                             (selectedLocation === 'pune' && job.location.includes('Pune'))
      const matchesType = selectedType === 'all' || job.type.toLowerCase().includes(selectedType.replace('-', ' '))
      const matchesExperience = selectedExperience === 'all' || 
                               (selectedExperience === 'entry' && job.level === 'Entry Level') ||
                               (selectedExperience === 'mid' && job.level === 'Mid-level') ||
                               (selectedExperience === 'senior' && job.level === 'Senior') ||
                               (selectedExperience === 'lead' && job.level === 'Lead/Principal')
      
      return matchesSearch && matchesCategory && matchesLocation && matchesType && matchesExperience
    })

    // Sort jobs
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.postedDate - a.postedDate
        case 'salary':
          const aSalary = parseInt(a.salary.split('-')[1].replace(/[^0-9]/g, ''))
          const bSalary = parseInt(b.salary.split('-')[1].replace(/[^0-9]/g, ''))
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
              <span className="careers-stat-value">500+</span>
              <span className="careers-stat-label">Employees</span>
            </div>
            <div className="careers-stat">
              <span className="careers-stat-value">4.8★</span>
              <span className="careers-stat-label">Rating</span>
            </div>
            <div className="careers-stat">
              <span className="careers-stat-value">25+</span>
              <span className="careers-stat-label">Countries</span>
            </div>
            <div className="careers-stat">
              <span className="careers-stat-value">92%</span>
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
        
        {filteredJobs.length > 0 ? (
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
                    <Link
                      to={`/candidate/apply?job=${job.id}`}
                      className="careers-job-apply-btn"
                    >
                      Apply Now
                      <ArrowRight className="w-4 h-4" />
                    </Link>
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
                <div className={`benefit-icon ${benefit.gradient}`}>
                  <benefit.icon className="w-8 h-8" />
                </div>
                <h3 className="benefit-title">{benefit.title}</h3>
                <p className="benefit-description">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Listings Section */}
      <section className="careers-listings">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Open Positions</h2>
            <p className="section-subtitle">
              Find your perfect role and help us shape the future of hiring.
            </p>
          </div>

          {/* Filters */}
          <div className="careers-filters">
            <div className="filters-header">
              <Filter className="w-5 h-5" />
              <span>Filter Jobs</span>
            </div>
            
            <div className="filters-grid">
              {/* Search */}
              <div className="filter-group">
                <div className="filter-input-wrapper">
                  <Search className="w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search jobs, skills, or keywords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="filter-input"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="filter-group">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="filter-select"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name} ({category.count})
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Filter */}
              <div className="filter-group">
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="filter-select"
                >
                  {locations.map(location => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Type Filter */}
              <div className="filter-group">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="filter-select"
                >
                  {jobTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Experience Filter */}
              <div className="filter-group">
                <select
                  value={selectedExperience}
                  onChange={(e) => setSelectedExperience(e.target.value)}
                  className="filter-select"
                >
                  {experienceLevels.map(level => (
                    <option key={level.id} value={level.id}>
                      {level.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div className="filter-group">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="filter-select"
                >
                  <option value="newest">Newest First</option>
                  <option value="salary">Highest Salary</option>
                  <option value="applicants">Most Applicants</option>
                  <option value="match">Best Match</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="careers-results">
            <p className="results-count">
              Showing <span>{filteredJobs.length}</span> positions
              {filteredJobs.length !== jobs.length && ` of ${jobs.length}`}
            </p>
            <div className="results-actions">
              <button className="results-action-btn">
                <Bookmark className="w-4 h-4" />
                Saved Jobs ({savedJobs.size})
              </button>
            </div>
          </div>

          {/* Job Cards */}
          <div className="careers-grid">
            {filteredJobs.slice(0, visibleJobs).map((job) => (
              <div 
                key={job.id} 
                className={`job-card ${job.featured ? 'job-card-featured' : ''}`}
                onMouseEnter={() => setHoveredJob(job.id)}
                onMouseLeave={() => setHoveredJob(null)}
              >
                {job.featured && (
                  <div className="job-featured-badge">
                    <Star className="w-3 h-3" />
                    Featured
                  </div>
                )}
                
                <div className="job-header">
                  <div className="job-title-section">
                    <h3 className="job-title">{job.title}</h3>
                    <div className="job-meta">
                      <span className="job-department">{job.department}</span>
                      <span className="job-level">{job.level}</span>
                    </div>
                  </div>
                  
                  <div className="job-actions">
                    <button 
                      onClick={() => toggleSaveJob(job.id)}
                      className={`job-action-btn ${savedJobs.has(job.id) ? 'job-action-saved' : ''}`}
                      title={savedJobs.has(job.id) ? 'Remove from saved' : 'Save job'}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => shareJob(job)}
                      className="job-action-btn"
                      title="Share job"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <p className="job-description">{job.description}</p>
                
                <div className="job-details">
                  <div className="job-detail">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="job-detail">
                    <Clock className="w-4 h-4" />
                    <span>{job.type}</span>
                  </div>
                  <div className="job-detail">
                    <Timer className="w-4 h-4" />
                    <span>{job.experience}</span>
                  </div>
                </div>

                <div className="job-salary">
                  <span className="salary-amount">{job.salary}</span>
                  <div className="job-stats">
                    <div className="job-stat">
                      <Users className="w-3 h-3" />
                      <span>{job.applicants} applied</span>
                    </div>
                    <div className="job-stat">
                      <Eye className="w-3 h-3" />
                      <span>{job.views} views</span>
                    </div>
                  </div>
                </div>

                {job.matchScore && (
                  <div className="job-match">
                    <div className="match-bar">
                      <div 
                        className="match-fill" 
                        style={{ width: `${job.matchScore}%` }}
                      ></div>
                    </div>
                    <span className="match-text">{job.matchScore}% match</span>
                  </div>
                )}

                <div className="job-footer">
                  <button 
                    onClick={() => navigate('/candidate/apply')}
                    className="job-apply-btn"
                  >
                    Apply Now
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="careers-empty">
              <div className="empty-icon">
                <Search className="w-12 h-12" />
              </div>
              <h3 className="empty-title">No positions found</h3>
              <p className="empty-description">
                Try adjusting your search criteria or check back later for new opportunities.
              </p>
              <button 
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('all')
                  setSelectedLocation('all')
                  setSelectedType('all')
                  setSelectedExperience('all')
                }}
                className="empty-reset-btn"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Load More Button */}
          {filteredJobs.length > visibleJobs && (
            <div className="careers-load-more">
              <button
                onClick={() => setVisibleJobs(prev => prev + 6)}
                className="load-more-btn"
              >
                Load More Positions
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="careers-cta">
        <div className="section-container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Join Our Team?</h2>
            <p className="cta-subtitle">
              Take the first step towards an exciting career at Veridia. 
              Browse our open positions and find your perfect match.
            </p>
            <div className="cta-actions">
              <Link to="/register" className="cta-primary-btn">
                Start Your Application
              </Link>
              <button className="cta-secondary-btn">
                Learn About Veridia
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Careers
