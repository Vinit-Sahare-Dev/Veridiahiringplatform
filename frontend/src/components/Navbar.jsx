import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { LogOut, User, Briefcase, Shield, Home } from 'lucide-react'

const Navbar = () => {
  const { user, isAuthenticated, logout, isAdmin, isCandidate } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-white shadow-sm border-b border-secondary-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-secondary-900">Veridia</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                isActive('/') ? 'text-primary-600' : 'text-secondary-600 hover:text-secondary-900'
              }`}
            >
              <Home className="w-4 h-4 inline mr-1" />
              Home
            </Link>

            {isCandidate && (
              <>
                <Link
                  to="/candidate/dashboard"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/candidate/dashboard') ? 'text-primary-600' : 'text-secondary-600 hover:text-secondary-900'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/candidate/apply"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/candidate/apply') ? 'text-primary-600' : 'text-secondary-600 hover:text-secondary-900'
                  }`}
                >
                  Apply Now
                </Link>
                <Link
                  to="/candidate/profile"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/candidate/profile') ? 'text-primary-600' : 'text-secondary-600 hover:text-secondary-900'
                  }`}
                >
                  Profile
                </Link>
              </>
            )}

            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className={`text-sm font-medium transition-colors ${
                  isActive('/admin/dashboard') ? 'text-primary-600' : 'text-secondary-600 hover:text-secondary-900'
                }`}
              >
                <Shield className="w-4 h-4 inline mr-1" />
                Admin Dashboard
              </Link>
            )}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-sm">
                  <User className="w-4 h-4 text-secondary-500" />
                  <span className="text-secondary-700">{user?.name}</span>
                  {isAdmin && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Admin</span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-sm text-secondary-600 hover:text-secondary-900 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-secondary-600 hover:text-secondary-900 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
