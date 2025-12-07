import React, { useState, useEffect } from 'react'
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
  Lightbulb
} from 'lucide-react'

const Careers = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [hoveredJob, setHoveredJob] = useState(null)
  const [animatedStats, setAnimatedStats] = useState(false)
  const [visibleJobs, setVisibleJobs] = useState(6)
  const navigate = useNavigate()

  useEffect(() => {
    setAnimatedStats(true)
  }, [])

  const jobs = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      location: 'Bangalore / Remote',
      type: 'Full-time',
      experience: '5+ years',
      salary: '$120k - $180k',
      category: 'engineering',
      description: 'Build amazing user interfaces and help shape the future of our platform.',
      requirements: ['React', 'TypeScript', 'Node.js', '5+ years experience'],
      posted: '2 days ago',
      applicants: 45,
      featured: true
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
      description: 'Drive product strategy and work with cross-functional teams to deliver exceptional products.',
      requirements: ['Product strategy', 'Data analysis', 'Leadership', '3+ years experience'],
      posted: '1 week ago',
      applicants: 32,
      featured: true
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
      description: 'Design and implement scalable backend systems and APIs.',
      requirements: ['Java', 'Spring Boot', 'Microservices', '3+ years experience'],
      posted: '3 days ago',
      applicants: 28,
      featured: false
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
      description: 'Create beautiful and intuitive user experiences.',
      requirements: ['Figma', 'User research', 'Prototyping', '2+4 years experience'],
      posted: '5 days ago',
      applicants: 19,
      featured: false
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
      description: 'Apply machine learning and statistical analysis to solve complex problems.',
      requirements: ['Python', 'Machine Learning', 'Statistics', '4+ years experience'],
      posted: '1 day ago',
      applicants: 52,
      featured: true
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
      description: 'Lead marketing campaigns and drive brand growth.',
      requirements: ['Digital marketing', 'Content strategy', 'Analytics', '3+ years experience'],
      posted: '1 week ago',
      applicants: 24,
      featured: false
    }
  ]

  const categories = [
    { id: 'all', name: 'All Positions', count: jobs.length },
    { id: 'engineering', name: 'Engineering', count: jobs.filter(j => j.category === 'engineering').length },
    { id: 'product', name: 'Product', count: jobs.filter(j => j.category === 'product').length },
    { id: 'design', name: 'Design', count: jobs.filter(j => j.category === 'design').length },
    { id: 'data', name: 'Data', count: jobs.filter(j => j.category === 'data').length },
    { id: 'marketing', name: 'Marketing', count: jobs.filter(j => j.category === 'marketing').length }
  ]

  const locations = [
    { id: 'all', name: 'All Locations' },
    { id: 'remote', name: 'Remote' },
    { id: 'bangalore', name: 'Bangalore' },
    { id: 'hyderabad', name: 'Hyderabad' },
    { id: 'pune', name: 'Pune' }
  ]

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || job.category === selectedCategory
    const matchesLocation = selectedLocation === 'all' || 
                           (selectedLocation === 'remote' && job.location.includes('Remote')) ||
                           (selectedLocation === 'bangalore' && job.location.includes('Bangalore')) ||
                           (selectedLocation === 'hyderabad' && job.location.includes('Hyderabad')) ||
                           (selectedLocation === 'pune' && job.location.includes('Pune'))
    
    return matchesSearch && matchesCategory && matchesLocation
  })

  const benefits = [
    { icon: Heart, title: 'Health & Wellness', description: 'Comprehensive medical, dental, and vision insurance', gradient: 'from-pink-500 to-rose-500' },
    { icon: Clock, title: 'Flexible Work', description: 'Remote-first culture with flexible hours', gradient: 'from-blue-500 to-cyan-500' },
    { icon: DollarSign, title: 'Competitive Salary', description: 'Top-tier compensation and equity packages', gradient: 'from-green-500 to-emerald-500' },
    { icon: Award, title: 'Professional Growth', description: '$2000 yearly learning and development budget', gradient: 'from-purple-500 to-violet-500' },
    { icon: Users, title: 'Team Culture', description: 'Collaborative and inclusive work environment', gradient: 'from-orange-500 to-amber-500' },
    { icon: Zap, title: 'Innovation Time', description: 'Monthly hack days and innovation sprints', gradient: 'from-yellow-500 to-orange-500' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary-600 to-secondary-600 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-medium mb-6 animate-pulse">
              <Sparkles className="w-4 h-4 mr-2" />
              Now Hiring: Join Our Amazing Team
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-slide-up">
              Build Your Career at <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-primary-100">Veridia</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto animate-slide-up" style={{animationDelay: '200ms'}}>
              Join our team of innovators, creators, and problem-solvers. 
              Together, we're building the future of hiring technology.
            </p>
            <div className="flex flex-wrap justify-center gap-4 animate-slide-up" style={{animationDelay: '400ms'}}>
              <div className="flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/30 hover:bg-white/30 transition-all duration-300">
                <Building className="w-5 h-5" />
                <span>500+ Employees</span>
              </div>
              <div className="flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/30 hover:bg-white/30 transition-all duration-300">
                <Star className="w-5 h-5" />
                <span>4.8 Rating</span>
              </div>
              <div className="flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/30 hover:bg-white/30 transition-all duration-300">
                <MapPin className="w-5 h-5" />
                <span>Indian Locations</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-4">Why Join Veridia?</h2>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            We offer competitive benefits and a culture that supports your growth and well-being.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="card p-6 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group cursor-pointer">
              <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${benefit.gradient} rounded-full mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <benefit.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2 group-hover:text-primary-600 transition-colors">{benefit.title}</h3>
              <p className="text-secondary-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Job Listings Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-4">Open Positions</h2>
          <p className="text-lg text-secondary-600">
            Find your perfect role and help us shape the future of hiring.
          </p>
        </div>

        {/* Filters */}
        <div className="card mb-8">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-secondary-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>

              {/* Location Filter */}
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="input-field"
              >
                {locations.map(location => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Job Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.slice(0, visibleJobs).map((job) => (
            <div 
              key={job.id} 
              className={`card hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group relative overflow-hidden ${
                job.featured ? 'ring-2 ring-primary-500' : ''
              }`}
              onMouseEnter={() => setHoveredJob(job.id)}
              onMouseLeave={() => setHoveredJob(null)}
            >
              {job.featured && (
                <div className="absolute -top-2 -right-2 z-10">
                  <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                    <Star className="w-3 h-3 inline mr-1" />
                    Featured
                  </div>
                </div>
              )}
              
              {/* Background Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 transition-opacity duration-300 ${
                hoveredJob === job.id ? 'opacity-100' : 'opacity-0'
              }`}></div>
              
              <div className="p-6 relative z-10">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-secondary-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {job.title}
                  </h3>
                  <p className="text-secondary-600 text-sm line-clamp-2">{job.description}</p>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-secondary-600">
                    <Briefcase className="w-4 h-4 text-primary-500" />
                    <span>{job.department}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-secondary-600">
                    <MapPin className="w-4 h-4 text-primary-500" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-secondary-600">
                    <Clock className="w-4 h-4 text-primary-500" />
                    <span>{job.type}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-secondary-100">
                  <div className="text-sm">
                    <span className="text-primary-600 font-semibold">{job.salary}</span>
                    <span className="text-secondary-500 ml-2">• {job.experience}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-secondary-500">
                    <Users className="w-3 h-3" />
                    <span>{job.applicants} applied</span>
                  </div>
                </div>

                <div className="mt-4">
                  <button 
                    onClick={() => navigate('/candidate/apply')}
                    className="w-full btn-primary group-hover:shadow-lg transition-all duration-300 flex items-center justify-center group-hover:scale-105"
                  >
                    Apply Now
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary-100 rounded-full mb-4 animate-pulse">
              <Search className="w-8 h-8 text-secondary-400" />
            </div>
            <h3 className="text-lg font-medium text-secondary-900 mb-2">No positions found</h3>
            <p className="text-secondary-600">
              Try adjusting your search criteria or check back later for new opportunities.
            </p>
          </div>
        )}

        {/* Load More Button */}
        {filteredJobs.length > visibleJobs && (
          <div className="text-center mt-12">
            <button
              onClick={() => setVisibleJobs(prev => prev + 3)}
              className="btn-primary px-8 py-3 inline-flex items-center group"
            >
              Load More Positions
              <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Join Our Team?</h2>
          <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
            Take the first step towards an exciting career at Veridia. 
            Browse our open positions and find your perfect match.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary bg-white text-primary-600 hover:bg-gray-50 px-8 py-3">
              Start Your Application
            </Link>
            <button className="btn-secondary border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3">
              Learn About Veridia
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Careers
