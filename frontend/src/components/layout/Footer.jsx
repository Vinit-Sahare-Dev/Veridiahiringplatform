import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, Mail, Phone, MapPin, Linkedin, Twitter, Github, Heart, ChevronRight, Users, Shield, BookOpen, Award, Globe, Zap } from 'lucide-react'

const Footer = () => {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setTimeout(() => {
        setIsSubscribed(false)
        setEmail('')
      }, 3000)
    }
  }

  return (
    <footer className="footer">
      {/* Main Footer Content */}
      <div className="footer-container">
        <div className="footer-content">
          {/* Company Column */}
          <div className="footer-column">
            <div className="footer-brand">
              <div className="brand-logo">
                <Briefcase className="w-6 h-6" />
              </div>
              <span className="brand-name">Veridia</span>
            </div>
            <p className="footer-description">
              Revolutionizing the hiring landscape with intelligent matching technology. 
              We connect exceptional talent with forward-thinking companies, creating 
              meaningful career journeys that drive innovation and growth.
            </p>
            <div className="social-links">
              <a href="https://www.linkedin.com/company/veridia-io" className="social-link" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://twitter.com/veridia" className="social-link" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://github.com/veridia" className="social-link" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Platform Column */}
          <div className="footer-column">
            <h3 className="footer-heading">Platform</h3>
            <ul className="footer-links">
              <li>
                <Link to="/" className="footer-link">
                  <ChevronRight className="w-3 h-3" />
                  Home
                </Link>
              </li>
              <li>
                <Link to="/careers" className="footer-link">
                  <ChevronRight className="w-3 h-3" />
                  Browse Careers
                </Link>
              </li>
              <li>
                <Link to="/candidate/dashboard" className="footer-link">
                  <ChevronRight className="w-3 h-3" />
                  Candidate Portal
                </Link>
              </li>
              <li>
                <Link to="/admin/dashboard" className="footer-link">
                  <ChevronRight className="w-3 h-3" />
                  Employer Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className="footer-column">
            <h3 className="footer-heading">Resources</h3>
            <ul className="footer-links">
              <li>
                <a href="#about" className="footer-link">
                  <ChevronRight className="w-3 h-3" />
                  About Us
                </a>
              </li>
              <li>
                <a href="#blog" className="footer-link">
                  <ChevronRight className="w-3 h-3" />
                  Career Blog
                </a>
              </li>
              <li>
                <a href="#guides" className="footer-link">
                  <ChevronRight className="w-3 h-3" />
                  Career Guides
                </a>
              </li>
              <li>
                <a href="#faq" className="footer-link">
                  <ChevronRight className="w-3 h-3" />
                  FAQ
                </a>
              </li>
            </ul>
            
                      </div>

          {/* Support Column */}
          <div className="footer-column">
            <h3 className="footer-heading">Support</h3>
            <ul className="footer-links">
              <li>
                <a href="#contact" className="footer-link">
                  <ChevronRight className="w-3 h-3" />
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#help" className="footer-link">
                  <ChevronRight className="w-3 h-3" />
                  Help Center
                </a>
              </li>
              <li>
                <a href="#privacy" className="footer-link">
                  <ChevronRight className="w-3 h-3" />
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="footer-link">
                  <ChevronRight className="w-3 h-3" />
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="footer-column newsletter-column">
            <h3 className="footer-heading">Stay Updated</h3>
            <p className="newsletter-description">
              Get the latest job opportunities and career insights delivered to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="newsletter-input"
                required
              />
              <button type="submit" className="newsletter-btn">
                Subscribe
              </button>
            </form>
            {isSubscribed && (
              <p className="newsletter-success">
                ✓ Successfully subscribed!
              </p>
            )}
          </div>
        </div>

        </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <div className="footer-bottom-content">
            <div className="copyright" style={{textAlign: 'center'}}>
              <p>&copy; 2025 Veridia Technologies Inc. All rights reserved.</p>
              <p className="footer-tagline">
                Built with love by <a href="https://github.com/Vinit-Sahare-Dev" target="_blank" rel="noopener noreferrer" className="author-link">Vinit Sahare</a> for the future of work
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
