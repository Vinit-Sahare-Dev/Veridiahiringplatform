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
import '../styles/HomeEnhanced.css'

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
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  const companyValues = [
    {
      icon: <Target className="value-icon" />,
      title: "Mission-Driven",
      description: "We're building technology that matters and solving real-world challenges that impact millions."
    },
    {
      icon: <Users className="value-icon" />,
      title: "People First",
      description: "Our team is our greatest asset. We foster an environment where everyone can thrive and grow."
    },
    {
      icon: <Rocket className="value-icon" />,
      title: "Innovation Culture",
      description: "We encourage bold ideas and provide the resources to turn them into reality."
    }
  ]

  const openPositions = [
    {
      title: "Senior Frontend Engineer",
      department: "Engineering",
      location: "Remote / San Francisco",
      type: "Full-time",
      icon: <Code className="position-icon" />
    },
    {
      title: "Product Designer",
      department: "Design",
      location: "Remote / New York",
      type: "Full-time", 
      icon: <Palette className="position-icon" />
    },
    {
      title: "Data Analyst",
      department: "Analytics",
      location: "Remote / London",
      type: "Full-time",
      icon: <BarChart3 className="position-icon" />
    }
  ]

  const teamStats = [
    { value: "500+", label: "Team Members Worldwide" },
    { value: "25+", label: "Countries Represented" },
    { value: "4.8★", label: "Employee Satisfaction" },
    { value: "92%", label: "Retention Rate" }
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Senior Engineer",
      content: "Veridia isn't just a job—it's a place where I'm challenged to grow every single day. The team is incredible, and the work we're doing genuinely matters.",
      avatar: "SC"
    },
    {
      name: "Marcus Rodriguez",
      role: "Product Designer", 
      content: "The creative freedom and trust I get here is unmatched. We're building products that users love, and I get to do it alongside amazing people.",
      avatar: "MR"
    },
    {
      name: "Emily Watson",
      role: "Engineering Manager",
      content: "I've never worked at a place that invests so much in its people's growth. The mentorship and opportunities here are exceptional.",
      avatar: "EW"
    }
  ]

  return (
    <div className={`home-container ${isLoaded ? 'loaded' : ''}`}>
      {/* Hero Section */}
      <section id="hero" className="hero-section" style={{ transform: `translateY(${scrollY * 0.3}px)` }}>
        <div className="hero-background">
          <div className="hero-gradient"></div>
          <div className="hero-particles">
            {[...Array(20)].map((_, i) => (
              <div key={i} className={`particle particle-${i + 1}`}></div>
            ))}
          </div>
        </div>
        
        <div className="hero-content">
          <div className="section-container">
            <div className="hero-grid">
              <div className="hero-text">
                <div className="hero-badge">
                  <Sparkles className="w-4 h-4" />
                  <span>Building the Future of Work</span>
                </div>
                
                <h1 className="hero-title">
                  Join the Team That's 
                  <span className="hero-highlight">Changing Everything</span>
                </h1>
                
                <p className="hero-description">
                  At Veridia, we're not just building products—we're creating the future of how people work, connect, and grow. Join our global team of innovators, creators, and problem-solvers.
                </p>
                
                <div className="hero-actions">
                  {isAuthenticated && isCandidate ? (
                    <Link to="/candidate/apply" className="btn-primary btn-large">
                      Apply Now
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  ) : (
                    <>
                      <Link to="/careers" className="btn-primary btn-large">
                        Explore Opportunities
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Link>
                      <Link to="/register" className="btn-secondary btn-large">
                        Join Our Talent Pool
                      </Link>
                    </>
                  )}
                </div>
                
                <div className="hero-stats">
                  <div className="stat-item">
                    <span className="stat-value">500+</span>
                    <span className="stat-label">Team Members</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">25+</span>
                    <span className="stat-label">Countries</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">4.8★</span>
                    <span className="stat-label">Satisfaction</span>
                  </div>
                </div>
              </div>
              
              <div className="hero-visual">
                <div className="hero-card">
                  <div className="card-header">
                    <div className="card-avatar">
                      <Users className="w-8 h-8" />
                    </div>
                    <div className="card-info">
                      <h3>Join Our Team</h3>
                      <p>Discover amazing opportunities</p>
                    </div>
                  </div>
                  <div className="card-content">
                    <div className="feature-item">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Competitive compensation</span>
                    </div>
                    <div className="feature-item">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Flexible work arrangements</span>
                    </div>
                    <div className="feature-item">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Global impact opportunities</span>
                    </div>
                  </div>
                  <div className="card-footer">
                    <button className="btn-learn-more">
                      <Play className="w-4 h-4" />
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="scroll-indicator">
          <ChevronDown className="w-6 h-6 animate-bounce" />
        </div>
      </section>
        
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles className="badge-icon" />
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
                className="btn-primary"
              >
              
                Explore Opportunities
                <ArrowRight className="btn-arrow" />
              </button>
              <button 
                onClick={() => scrollToSection('values')}
                className="btn-secondary"
              >
                Learn About Veridia
              </button>
            </div>
            
            <div className="hero-stats">
              {teamStats.map((stat, index) => (
                <div key={index} className="stat-card">
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions Preview */}
      <section id="positions" className="positions-section">
        <div className="positions-container">
          <div className="positions-header">
            <h2 className="positions-title">
              Current <span className="highlight-text">Opportunities</span>
            </h2>
            <p className="positions-subtitle">
              We're looking for talented individuals to join our growing team
            </p>
          </div>
          
          <div className="positions-grid">
            {openPositions.map((position, index) => (
              <div key={index} className="position-card">
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
                  <MapPin className="location-icon" />
                  <span>{position.location}</span>
                </div>
                
                <button 
                  onClick={() => navigate('/careers')}
                  className="position-apply-btn"
                >
                  Apply Now
                  <ArrowRight className="btn-arrow" />
                </button>
              </div>
            ))}
          </div>
          
          <div className="positions-cta">
            <Link to="/careers" className="view-all-btn">
              View All Open Positions
              <ArrowRight className="btn-arrow" />
            </Link>
          </div>
        </div>
      </section>

      {/* Company Values */}
      <section id="values" className="values-section">
        <div className="values-container">
          <div className="values-header">
            <h2 className="values-title">
              Why <span className="highlight-text">Veridia</span>
            </h2>
            <p className="values-subtitle">
              Discover what makes us different and why our team loves working here
            </p>
          </div>
          
          <div className="values-grid">
            {companyValues.map((value, index) => (
              <div key={index} className="value-card">
                <div className="value-icon-wrapper">
                  {value.icon}
                </div>
                <h3 className="value-title">{value.title}</h3>
                <p className="value-description">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Testimonials */}
      <section id="testimonials" className="testimonials-section">
        <div className="testimonials-container">
          <div className="testimonials-header">
            <h2 className="testimonials-title">
              Life at <span className="highlight-text">Veridia</span>
            </h2>
            <p className="testimonials-subtitle">
              Hear directly from our team members about their experience
            </p>
          </div>
          
          <div className="testimonials-container">
            <div className="testimonial-card active">
              <div className="testimonial-content">
                <MessageSquare className="quote-icon" />
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
            
            <div className="testimonial-dots">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`dot ${index === activeTestimonial ? 'active' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2 className="cta-title">
              Ready to Join Our Team?
            </h2>
            <p className="cta-subtitle">
              Take the first step towards an incredible career journey
            </p>
            <div className="cta-actions">
              <Link to="/register" className="cta-primary-btn">
                Start Your Application
                <ArrowRight className="btn-arrow" />
              </Link>
              <Link to="/careers" className="cta-secondary-btn">
                Browse All Roles
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
