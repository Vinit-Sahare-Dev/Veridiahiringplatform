import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ArrowRight, Play, Sparkles, Zap, Shield, Globe } from 'lucide-react'

const HeroSection = () => {
  const { isAuthenticated, isCandidate } = useAuth()

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary-100 to-secondary-100 border border-primary-200 text-primary-800 text-sm font-medium mb-8 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 mr-2 text-primary-600" />
            AI-Powered Hiring Platform
            <Sparkles className="w-4 h-4 ml-2 text-primary-600" />
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-secondary-900 mb-6 leading-tight">
            <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Transform Your
            </span>
            <br />
            <span className="text-secondary-900">Career Journey</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-secondary-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Join thousands of professionals who found their dream jobs through our intelligent matching system. 
            Apply once, get matched with perfect opportunities.
          </p>

          {/* Stats Bar */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            {[
              { number: "10K+", label: "Active Candidates", icon: <Globe className="w-5 h-5" /> },
              { number: "500+", label: "Partner Companies", icon: <Zap className="w-5 h-5" /> },
              { number: "95%", label: "Success Rate", icon: <Shield className="w-5 h-5" /> }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center text-3xl font-bold text-primary-600 mb-1">
                  {stat.icon}
                  <span className="ml-2">{stat.number}</span>
                </div>
                <div className="text-sm text-secondary-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/candidate/register"
                  className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/careers"
                  className="inline-flex items-center px-8 py-4 bg-white text-secondary-700 font-semibold rounded-xl shadow-lg hover:shadow-xl border border-secondary-200 hover:border-primary-300 transition-all duration-300"
                >
                  Browse Opportunities
                  <Play className="w-5 h-5 ml-2" />
                </Link>
              </>
            ) : isCandidate ? (
              <Link
                to="/candidate/dashboard"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            ) : (
              <Link
                to="/admin/dashboard"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-accent-600 to-primary-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            )}
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-secondary-500">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-1 text-green-500" />
              Secure Platform
            </div>
            <div className="flex items-center">
              <Zap className="w-4 h-4 mr-1 text-yellow-500" />
              Instant Matches
            </div>
            <div className="flex items-center">
              <Globe className="w-4 h-4 mr-1 text-blue-500" />
              Global Opportunities
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-secondary-300 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-secondary-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
