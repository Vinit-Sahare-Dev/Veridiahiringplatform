import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  Briefcase, 
  Users, 
  CheckCircle, 
  ArrowRight, 
  Star,
  TrendingUp,
  Award,
  Target,
  Zap,
  Shield,
  Globe,
  Upload,
  User,
  Rocket,
  Sparkles,
  Code2,
  Heart,
  MessageCircle,
  Clock,
  MapPin
} from 'lucide-react'
import '../styles/HomeEnhanced.css'

const Home = () => {
  const { isAuthenticated, isCandidate } = useAuth()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    const handleScroll = () => setScrollY(window.scrollY)
    
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const features = [
    {
      icon: <Rocket className="icon-md" />,
      title: "Lightning Fast Application",
      description: "Complete your entire application in under 10 minutes with our streamlined, AI-powered form assistant."
    },
    {
      icon: <MessageCircle className="icon-md" />,
      title: "Real-time Communication",
      description: "Get instant updates on your application status and communicate directly with our hiring team."
    },
    {
      icon: <Shield className="icon-md" />,
      title: "Secure & Professional",
      description: "Your data is protected with enterprise-grade security. Every application gets professional review."
    }
  ]

  const stats = [
    { number: "10,000+", label: "Applications Processed", icon: <TrendingUp className="icon-sm" /> },
    { number: "500+", label: "Candidates Hired", icon: <Users className="icon-sm" /> },
    { number: "98%", label: "Satisfaction Rate", icon: <Star className="icon-sm" /> },
    { number: "2h", label: "Average Response Time", icon: <Clock className="icon-sm" /> }
  ]

  return (
    <div style={{ minHeight: '100vh', paddingTop: '80px', backgroundColor: '#f9fafb' }}>
      {/* Hero Section */}
      <section className="hero-section" style={{
        background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.15) 0%, transparent 50%)`,
        transform: `translateY(${scrollY * 0.5}px)`
      }}>
        <div className="hero-background">
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>
        
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles className="badge-icon" />
              <span>AI-Powered Hiring Platform</span>
            </div>
            
            <h1 className="hero-title">
              Transform Your Career at <span className="gradient-text">Veridia</span>
            </h1>
            
            <p className="hero-subtitle">
              Join thousands of professionals who've discovered their dream jobs through our intelligent, 
              streamlined hiring process. Your next career adventure starts here.
            </p>
            
            <div className="hero-stats">
              {stats.map((stat, index) => (
                <div key={index} className="hero-stat">
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-content">
                    <div className="stat-number">{stat.number}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="hero-buttons">
              <Link to="/register" className="hero-primary-btn">
                <Zap className="btn-icon" />
                Start Your Journey
                <ArrowRight className="btn-arrow" />
              </Link>
              <Link to="/careers" className="hero-secondary-btn">
                <Briefcase className="btn-icon" />
                Explore Opportunities
              </Link>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="floating-card card-1">
              <Code2 className="card-icon" />
              <span>Developer Roles</span>
            </div>
            <div className="floating-card card-2">
              <Heart className="card-icon" />
              <span>Great Culture</span>
            </div>
            <div className="floating-card card-3">
              <MapPin className="card-icon" />
              <span>Remote First</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <div className="features-header">
            <h2 className="features-title">
              Why Choose <span className="gradient-text">Veridia</span>
            </h2>
            <p className="features-subtitle">
              Experience a modern hiring platform designed for both candidates and employers
            </p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon-container">
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="process-section">
        <div className="process-container">
          <div className="process-header">
            <h2 className="process-title">
              How It Works
            </h2>
            <p className="process-subtitle">
              Get started in minutes with our streamlined application process.
            </p>
          </div>
          <div className="process-grid">
            {[
              { step: "1", title: "Register", description: "Create your account in seconds", icon: <User className="icon-md" /> },
              { step: "2", title: "Apply", description: "Fill out the application form", icon: <Briefcase className="icon-md" /> },
              { step: "3", title: "Upload", description: "Attach your resume and documents", icon: <Upload className="icon-md" /> },
              { step: "4", title: "Track", description: "Monitor your application progress", icon: <TrendingUp className="icon-md" /> }
            ].map((item, index) => (
              <div key={index} className="process-step">
                <div className="process-icon-container">
                  {item.icon}
                </div>
                <div className="process-step-number">{item.step}</div>
                <h3 className="process-step-title">{item.title}</h3>
                <p className="process-step-description">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">Ready to Start Your Journey?</h2>
          <p className="cta-subtitle">
            Join thousands of professionals who've found their dream jobs through Veridia.
          </p>
          <div className="cta-buttons">
            <Link to="/register" className="cta-primary-button">
              Get Started Now
              <ArrowRight className="cta-button-icon" />
            </Link>
            <Link to="/careers" className="cta-secondary-button">
              View Opportunities
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
