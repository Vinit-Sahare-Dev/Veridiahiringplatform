import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  Menu, 
  X, 
  User, 
  Briefcase, 
  LogOut, 
  Settings,
  Bell,
  ChevronDown,
  Search
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import '../styles/Navbar.css'

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin, isCandidate } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const location = useLocation()
  const navigate = useNavigate()
  
  const profileDropdownRef = useRef(null)
  const searchRef = useRef(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false)
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle keyboard navigation
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setMobileMenuOpen(false)
      setProfileDropdownOpen(false)
      setSearchOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      // Navigate to search results or perform search
      navigate(`/careers?search=${encodeURIComponent(searchTerm.trim())}`)
      setSearchOpen(false)
      setSearchTerm('')
    }
  }

  const isActivePath = (path) => {
    return location.pathname === path
  }

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-brand">
          <Link to="/" className="navbar-logo" aria-label="Veridia Home">
            <span className="logo-text">Veridia</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="navbar-nav">
          <Link 
            to="/" 
            className={`nav-link ${isActivePath('/') ? 'active' : ''}`}
            aria-current={isActivePath('/') ? 'page' : undefined}
          >
            Home
          </Link>
          <Link 
            to="/careers" 
            className={`nav-link ${isActivePath('/careers') ? 'active' : ''}`}
            aria-current={isActivePath('/careers') ? 'page' : undefined}
          >
            Careers
          </Link>
          
          {isAuthenticated && isCandidate && (
            <>
              <Link 
                to="/candidate/dashboard" 
                className={`nav-link ${isActivePath('/candidate/dashboard') ? 'active' : ''}`}
                aria-current={isActivePath('/candidate/dashboard') ? 'page' : undefined}
              >
                Dashboard
              </Link>
              <Link 
                to="/candidate/profile" 
                className={`nav-link ${isActivePath('/candidate/profile') ? 'active' : ''}`}
                aria-current={isActivePath('/candidate/profile') ? 'page' : undefined}
              >
                Profile
              </Link>
            </>
          )}
          
          {isAuthenticated && isAdmin && (
            <Link 
              to="/admin/dashboard" 
              className={`nav-link ${isActivePath('/admin/dashboard') ? 'active' : ''}`}
              aria-current={isActivePath('/admin/dashboard') ? 'page' : undefined}
            >
              Admin
            </Link>
          )}
        </div>

        {/* Right side actions */}
        <div className="navbar-actions">
          {/* Search */}
          <div className="search-container" ref={searchRef}>
            <button
              className="search-toggle"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Toggle search"
              aria-expanded={searchOpen}
            >
              <Search className="w-5 h-5" />
            </button>
            
            {searchOpen && (
              <form onSubmit={handleSearch} className="search-form">
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                  aria-label="Search jobs"
                  autoFocus
                />
                <button type="submit" className="search-submit" aria-label="Submit search">
                  <Search className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

          {/* Notifications */}
          {isAuthenticated && (
            <button
              className="notification-button"
              aria-label="View notifications"
              aria-expanded={false}
            >
              <Bell className="w-5 h-5" />
              <span className="notification-badge" aria-label="3 unread notifications">3</span>
            </button>
          )}

          {/* Profile Dropdown */}
          {isAuthenticated ? (
            <div className="profile-dropdown" ref={profileDropdownRef}>
              <button
                className="profile-button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                aria-label="User menu"
                aria-expanded={profileDropdownOpen}
                aria-haspopup="true"
              >
                <div className="profile-avatar">
                  <User className="w-5 h-5" />
                </div>
                <span className="profile-name">{user?.name || 'User'}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {profileDropdownOpen && (
                <div className="dropdown-menu" role="menu">
                  <div className="dropdown-header">
                    <span className="dropdown-name">{user?.name}</span>
                    <span className="dropdown-email">{user?.email}</span>
                  </div>
                  
                  <div className="dropdown-divider" />
                  
                  {isCandidate && (
                    <>
                      <Link
                        to="/candidate/profile"
                        className="dropdown-item"
                        role="menuitem"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                      <Link
                        to="/candidate/notifications"
                        className="dropdown-item"
                        role="menuitem"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <Bell className="w-4 h-4" />
                        Notifications
                      </Link>
                    </>
                  )}
                  
                  {isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      className="dropdown-item"
                      role="menuitem"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      Admin Panel
                    </Link>
                  )}
                  
                  <div className="dropdown-divider" />
                  
                  <button
                    className="dropdown-item dropdown-logout"
                    role="menuitem"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-outline">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-content">
            <Link 
              to="/" 
              className={`mobile-nav-link ${isActivePath('/') ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/careers" 
              className={`mobile-nav-link ${isActivePath('/careers') ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Careers
            </Link>
            
            {isAuthenticated && isCandidate && (
              <>
                <Link 
                  to="/candidate/dashboard" 
                  className={`mobile-nav-link ${isActivePath('/candidate/dashboard') ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/candidate/profile" 
                  className={`mobile-nav-link ${isActivePath('/candidate/profile') ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
              </>
            )}
            
            {isAuthenticated && isAdmin && (
              <Link 
                to="/admin/dashboard" 
                className={`mobile-nav-link ${isActivePath('/admin/dashboard') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin
              </Link>
            )}
            
            {!isAuthenticated && (
              <div className="mobile-auth">
                <Link 
                  to="/login" 
                  className="btn btn-outline mobile-btn"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn btn-primary mobile-btn"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
            
            {isAuthenticated && (
              <button
                className="mobile-logout btn btn-outline mobile-btn"
                onClick={() => {
                  handleLogout()
                  setMobileMenuOpen(false)
                }}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
