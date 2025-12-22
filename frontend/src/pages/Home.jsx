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
  const sectionRefs = useRef({})

  // Smooth scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => window.removeEventListener('scroll', handleScroll)
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

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Senior Engineer",
      content: "Veridia isn't just a job—it's a place where I'm challenged to grow every single day. The team is incredible, and the work we're doing genuinely matters.",
      avatar: "PS"
    },
    {
      name: "Rahul Verma",
      role: "Product Designer", 
      content: "The creative freedom and trust I get here is unmatched. We're building products that users love, and I get to do it alongside amazing people.",
      avatar: "RV"
    },
    {
      name: "Anjali Patel",
      role: "Engineering Manager",
      content: "I've never worked at a place that invests so much in its people's growth. The mentorship and opportunities here are exceptional.",
      avatar: "AP"
    }
  ]

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 8000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section id="hero" className="hero-section">
        <div className="hero-visuals">
          <div className="professional-orb professional-orb-1"></div>
          <div className="professional-orb professional-orb-2"></div>
          <div className="professional-orb professional-orb-3"></div>
        </div>
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles className="w-4 h-4" />
              <span>Now Hiring: Join Our Mission</span>
            </div>
            
            <h1 className="hero-title">
              Build the Future at <span className="hero-highlight">Veridia</span>
            </h1>
            
            <p className="hero-description">
              Join a team of brilliant minds solving meaningful challenges. 
              We're looking for passionate individuals who want to make an impact.
            </p>
            
            <div className="hero-actions">
  <Link to="/careers" className="btn-primary">
    Explore Opportunities
    
  </Link>
  <Link to="/register" className="btn-secondary">
    Join Talent Pool
  </Link>
</div>
          </div>
        </div>
        
        <div className="scroll-indicator">
          <ChevronDown className="w-6 h-6 animate-bounce" />
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
