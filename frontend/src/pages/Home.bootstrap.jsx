import React, { useEffect, useState, useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  Briefcase, 
  Users, 
  ArrowRight, 
  Star,
  TrendingUp,
  Shield,
  Globe,
  User,
  Rocket,
  Sparkles,
  Heart,
  Clock,
  MapPin,
  Building2,
  Coffee,
  Target,
  Zap,
  Award,
  CheckCircle,
  MessageSquare,
  Code,
  Palette,
  BarChart3,
  Play,
  ChevronDown
} from 'lucide-react'
import '../styles/HomeEnhanced.bootstrap.css'

const Home = () => {
  const { isAuthenticated, isCandidate } = useAuth()
  const navigate = useNavigate()
  const [scrollY, setScrollY] = useState(0)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const sectionRefs = useRef({})

  // Smooth scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    // Trigger load animation
    setTimeout(() => setIsLoaded(true), 100)
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])

  const scrollToSection = useCallback((sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  // Data
  const teamStats = [
    { value: '500+', label: 'Team Members' },
    { value: '25+', label: 'Countries' },
    { value: '4.8★', label: 'Satisfaction' },
    { value: '15+', label: 'Years Experience' }
  ]

  const openPositions = [
    {
      title: 'Senior Frontend Developer',
      type: 'Full-time',
      department: 'Engineering',
      location: 'San Francisco, CA',
      icon: <Code className="w-6 h-6 text-blue-600" />
    },
    {
      title: 'Product Designer',
      type: 'Full-time',
      department: 'Design',
      location: 'New York, NY',
      icon: <Palette className="w-6 h-6 text-purple-600" />
    },
    {
      title: 'Data Analyst',
      type: 'Full-time',
      department: 'Analytics',
      location: 'Remote',
      icon: <BarChart3 className="w-6 h-6 text-green-600" />
    }
  ]

  const companyValues = [
    {
      title: 'Innovation First',
      description: 'We embrace cutting-edge technology and creative solutions to solve complex challenges.',
      icon: <Rocket className="w-6 h-6" />
    },
    {
      title: 'Collaborative Spirit',
      description: 'Great things happen when talented people work together towards common goals.',
      icon: <Users className="w-6 h-6" />
    },
    {
      title: 'Growth Mindset',
      description: 'We believe in continuous learning and personal development for everyone.',
      icon: <TrendingUp className="w-6 h-6" />
    },
    {
      title: 'Customer Focus',
      description: 'Our success is measured by the success and satisfaction of our customers.',
      icon: <Heart className="w-6 h-6" />
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Senior Developer',
      content: 'Working at Veridia has been transformative. The team culture, technical challenges, and growth opportunities exceeded my expectations.',
      avatar: 'SC'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Product Manager',
      content: 'The collaborative environment and focus on innovation make this an amazing place to build products that matter.',
      avatar: 'MR'
    },
    {
      name: 'Emily Johnson',
      role: 'UX Designer',
      content: 'I love how Veridia values design thinking and gives us the freedom to create meaningful user experiences.',
      avatar: 'EJ'
    }
  ]

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section id="hero" className="hero-section">
        <div className="container-fluid">
          <div className="row align-items-center min-vh-100">
            <div className="col-lg-6">
              <div className="hero-content">
                <div className="hero-badge">
                  <Sparkles className="w-4 h-4" />
                  <span>Now Hiring: Join Our Mission</span>
                </div>
                
                <h1 className="hero-title">
                  Build the Future at <span className="brand-text">Veridia</span>
                </h1>
                
                <p className="hero-subtitle">
                  Join a team of brilliant minds solving meaningful challenges. 
                  We're looking for passionate individuals who want to make an impact.
                </p>
                
                <div className="hero-actions">
                  <button 
                    onClick={() => navigate('/careers')}
                    className="btn-hero btn-primary-hero"
                  >
                    Explore Opportunities
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => scrollToSection('values')}
                    className="btn-hero btn-secondary-hero"
                  >
                    Learn About Veridia
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="hero-visual">
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="text-center p-4">
                      <div className="hero-stat-card">
                        <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                        <h3 className="h4">500+</h3>
                        <p className="mb-0">Team Members</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="text-center p-4">
                      <div className="hero-stat-card">
                        <Globe className="w-8 h-8 text-green-600 mx-auto mb-3" />
                        <h3 className="h4">25+</h3>
                        <p className="mb-0">Countries</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="text-center p-4">
                      <div className="hero-stat-card">
                        <Star className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
                        <h3 className="h4">4.8★</h3>
                        <p className="mb-0">Satisfaction</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="text-center p-4">
                      <div className="hero-stat-card">
                        <Award className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                        <h3 className="h4">15+</h3>
                        <p className="mb-0">Years Experience</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container-fluid">
          <div className="row g-4">
            {teamStats.map((stat, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <div className="stat-card">
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions Preview */}
      <section id="positions" className="positions-section">
        <div className="container-fluid">
          <div className="positions-header">
            <h2 className="positions-title">
              Current <span className="text-primary">Opportunities</span>
            </h2>
            <p className="positions-subtitle">
              We're looking for talented individuals to join our growing team
            </p>
          </div>
          
          <div className="row g-4">
            {openPositions.map((position, index) => (
              <div key={index} className="col-lg-4 col-md-6">
                <div className="position-card">
                  <div className="position-header">
                    <div className="position-icon-wrapper">
                      {position.icon}
                    </div>
                    <div className="position-meta">
                      <span className="position-type">{position.type}</span>
                      <span className="position-department">{position.department}</span>
                    </div>
                  </div>
                  
                  <h3 className="position-title">{position.title}</h3>
                  <div className="position-location">
                    <MapPin className="w-4 h-4" />
                    <span>{position.location}</span>
                  </div>
                  
                  <button 
                    onClick={() => navigate('/careers')}
                    className="position-apply-btn"
                  >
                    Apply Now
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-5">
            <Link to="/careers" className="btn btn-primary btn-lg">
              View All Open Positions
              <ArrowRight className="w-4 h-4 ms-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Company Values */}
      <section id="values" className="values-section">
        <div className="container-fluid">
          <div className="values-header">
            <h2 className="values-title">
              Why <span className="text-primary">Veridia</span>
            </h2>
            <p className="values-subtitle">
              Discover what makes us different and why our team loves working here
            </p>
          </div>
          
          <div className="row g-4">
            {companyValues.map((value, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <div className="value-card">
                  <div className="value-icon-wrapper">
                    {value.icon}
                  </div>
                  <h3 className="value-title">{value.title}</h3>
                  <p className="value-description">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Testimonials */}
      <section id="testimonials" className="testimonials-section">
        <div className="container-fluid">
          <div className="testimonials-header">
            <h2 className="testimonials-title">
              Life at <span className="text-primary">Veridia</span>
            </h2>
            <p className="testimonials-subtitle">
              Hear directly from our team members about their experience
            </p>
          </div>
          
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="testimonial-card">
                <div className="testimonial-content">
                  <MessageSquare className="quote-icon w-8 h-8 text-primary mb-3" />
                  <p className="testimonial-text">
                    {testimonials[activeTestimonial].content}
                  </p>
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    {testimonials[activeTestimonial].avatar}
                  </div>
                  <div className="author-info">
                    <div className="author-name">{testimonials[activeTestimonial].name}</div>
                    <div className="author-role">{testimonials[activeTestimonial].role}</div>
                  </div>
                </div>
              </div>
              
              {/* Testimonial Indicators */}
              <div className="d-flex justify-content-center mt-4 gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`btn btn-sm rounded-circle ${index === activeTestimonial ? 'btn-primary' : 'btn-outline-secondary'}`}
                    style={{ width: '12px', height: '12px', padding: '0' }}
                    onClick={() => setActiveTestimonial(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container-fluid">
          <h2 className="cta-title">Ready to Join Our Team?</h2>
          <p className="cta-subtitle">
            Take the next step in your career and become part of something extraordinary
          </p>
          
          <div className="cta-actions">
            <Link to="/careers" className="cta-primary-btn">
              Explore Opportunities
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/register" className="cta-secondary-btn">
              Create Profile
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
