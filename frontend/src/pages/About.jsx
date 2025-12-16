import React from 'react'
import { 
  Users, 
  Target, 
  Lightbulb, 
  Heart, 
  Award, 
  Globe, 
  Shield, 
  Zap,
  TrendingUp,
  Briefcase,
  MapPin,
  Mail,
  Phone,
  Clock,
  CheckCircle
} from 'lucide-react'
import '../styles/About.css'

const About = () => {

  const stats = [
    { number: "500+", label: "Companies Trust Us", icon: <Briefcase /> },
    { number: "50K+", label: "Active Candidates", icon: <Users /> },
    { number: "95%", label: "Success Rate", icon: <TrendingUp /> },
    { number: "24/7", label: "Support Available", icon: <Clock /> }
  ]

  const values = [
    {
      icon: <Target />,
      title: "Mission-Driven",
      description: "We're on a mission to transform how companies hire and candidates find their dream jobs."
    },
    {
      icon: <Lightbulb />,
      title: "Innovation First", 
      description: "We leverage cutting-edge technology to create seamless hiring experiences."
    },
    {
      icon: <Heart />,
      title: "People-Centric",
      description: "Every decision we make puts people—both candidates and employers—at the center."
    },
    {
      icon: <Shield />,
      title: "Trust & Security",
      description: "We ensure data privacy and security are never compromised."
    },
    {
      icon: <TrendingUp />,
      title: "Growth Mindset",
      description: "We believe in continuous learning and adapting to stay ahead in the evolving hiring landscape."
    },
    {
      icon: <Globe />,
      title: "Global Impact",
      description: "We're building bridges between talent and opportunities across borders and cultures worldwide."
    }
  ]

  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <div className="about-badge">
            <Award className="w-5 h-5" />
            <span>About Veridia</span>
          </div>
          
          <h1 className="about-title">
            Transforming <span className="highlight">Hiring</span> Through
            <span className="highlight"> Innovation</span>
          </h1>
          
          <p className="about-description">
            We're revolutionizing the hiring landscape by connecting talented individuals 
            with their dream opportunities through cutting-edge technology and human-centered design.
          </p>
        </div>
      </section>

      
      {/* Values Section */}
      <section className="about-values">
        <div className="values-header">
          <h2 className="section-title">Our Core Values</h2>
          <p className="section-subtitle">The principles that guide everything we do</p>
        </div>
        
        <div className="values-grid">
          {values.map((value, index) => (
            <div key={index} className="value-card">
              <div className="value-icon">{value.icon}</div>
              <h3 className="value-title">{value.title}</h3>
              <p className="value-description">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      
      {/* Mission Section */}
      <section className="about-mission">
        <div className="mission-content">
          <div className="mission-icon">
            <Target className="w-16 h-16" />
          </div>
          
          <h2 className="mission-title">Our Mission</h2>
          <p className="mission-description">
            To revolutionize the hiring industry by creating intelligent, human-centered connections 
            between talented individuals and innovative companies, fostering growth and success for all.
          </p>
          
          <div className="mission-points">
            <div className="mission-point">
              <CheckCircle className="w-5 h-5" />
              <span>Streamline the hiring process for companies</span>
            </div>
            <div className="mission-point">
              <CheckCircle className="w-5 h-5" />
              <span>Empower candidates to find their dream jobs</span>
            </div>
            <div className="mission-point">
              <CheckCircle className="w-5 h-5" />
              <span>Leverage AI for better matches</span>
            </div>
            <div className="mission-point">
              <CheckCircle className="w-5 h-5" />
              <span>Build inclusive and diverse workplaces</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="about-contact">
        <div className="contact-content">
          <h2 className="section-title">Get In Touch</h2>
          <p className="section-subtitle">We'd love to hear from you</p>
          
          <div className="contact-visual">
            <img 
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=400&fit=crop"
              alt="Contact us"
              className="contact-image"
            />
          </div>
          
          <div className="contact-grid">
            <div className="contact-item">
              <Mail className="w-6 h-6" />
              <div>
                <h4>Email Us</h4>
                <p>empsyncofficial@gmail.com</p>
              </div>
            </div>
            
            <div className="contact-item">
              <Phone className="w-6 h-6" />
              <div>
                <h4>Call Us</h4>
                <p>+91 9921349614</p>
              </div>
            </div>
            
            <div className="contact-item">
              <MapPin className="w-6 h-6" />
              <div>
                <h4>Visit Us</h4>
                <p>Bangalore, India</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
