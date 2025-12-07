import React from 'react'
import { Link } from 'react-router-dom'
import { 
  TrendingUp, 
  Users, 
  Briefcase, 
  Award,
  Star,
  ArrowRight,
  Target,
  Zap,
  Shield,
  Globe,
  Clock,
  CheckCircle
} from 'lucide-react'

const StatsSection = () => {
  const stats = [
    { 
      number: "10K+", 
      label: "Active Candidates", 
      icon: <Users className="w-6 h-6" />,
      description: "Professionals trust our platform"
    },
    { 
      number: "500+", 
      label: "Partner Companies", 
      icon: <Briefcase className="w-6 h-6" />,
      description: "Top employers hiring now"
    },
    { 
      number: "95%", 
      label: "Success Rate", 
      icon: <Target className="w-6 h-6" />,
      description: "Candidates find their match"
    },
    { 
      number: "24h", 
      label: "Avg Response Time", 
      icon: <Clock className="w-6 h-6" />,
      description: "Quick application processing"
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-primary-50 to-secondary-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-primary-200 text-primary-800 text-sm font-medium mb-6">
            <TrendingUp className="w-4 h-4 mr-2" />
            Platform Statistics
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-4">
            Numbers That <span className="gradient-text">Speak</span>
          </h2>
          <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
            Join thousands who've already transformed their careers through our platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-scale-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Gradient Border Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-2xl mb-6 text-primary-600 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold text-secondary-900 mb-2 group-hover:text-primary-600 transition-colors duration-300">
                  {stat.number}
                </div>
                <div className="text-lg font-semibold text-secondary-900 mb-2">{stat.label}</div>
                <p className="text-sm text-secondary-600">{stat.description}</p>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-primary-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-4 right-4 w-1 h-1 bg-secondary-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100"></div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
            <Shield className="w-5 h-5 text-green-500 mr-2" />
            <span className="text-secondary-700 font-medium">Trusted by leading companies worldwide</span>
            <Globe className="w-5 h-5 text-blue-500 ml-2" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default StatsSection
