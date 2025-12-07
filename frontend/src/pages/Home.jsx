import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import HeroSection from '../components/HeroSection'
import StatsSection from '../components/StatsSection'
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
  User
} from 'lucide-react'

const Home = () => {
  const { isAuthenticated, isCandidate } = useAuth()

  const features = [
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: "Easy Application Process",
      description: "Submit your application with just a few clicks. Upload your resume and fill out the form seamlessly."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Real-time Status Tracking",
      description: "Track your application status in real-time. Get notified instantly when your status changes."
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Professional Review",
      description: "Your applications are reviewed by our professional HR team with years of experience."
    }
  ]

  const stats = [
    { number: "500+", label: "Applications Processed", icon: <TrendingUp className="w-5 h-5" /> },
    { number: "50+", label: "Candidates Hired", icon: <Users className="w-5 h-5" /> },
    { number: "95%", label: "Satisfaction Rate", icon: <Star className="w-5 h-5" /> },
    { number: "24h", label: "Average Response Time", icon: <Target className="w-5 h-5" /> }
  ]

  return (
    <div className="animate-fade-in">
      <HeroSection />
      <StatsSection />
                  {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-secondary-900 mb-4">
              Why Choose <span className="gradient-text">Veridia</span>
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Experience a modern hiring platform designed for both candidates and employers
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card hover-lift animate-scale-in" style={{animationDelay: `${index * 200}ms`}}>
                <div className="card-body text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6 text-primary-600">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-secondary-900 mb-4">{feature.title}</h3>
                  <p className="text-secondary-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-secondary-50 to-primary-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-secondary-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Get started in minutes with our streamlined application process.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { step: "1", title: "Register", description: "Create your account in seconds", icon: <User className="w-6 h-6" /> },
              { step: "2", title: "Apply", description: "Fill out the application form", icon: <Briefcase className="w-6 h-6" /> },
              { step: "3", title: "Upload", description: "Attach your resume and documents", icon: <Upload className="w-6 h-6" /> },
              { step: "4", title: "Track", description: "Monitor your application progress", icon: <TrendingUp className="w-6 h-6" /> }
            ].map((item, index) => (
              <div key={index} className="text-center animate-slide-up" style={{animationDelay: `${index * 150}ms`}}>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-6 text-primary-600">
                  {item.icon}
                </div>
                <div className="text-2xl font-bold text-primary-600 mb-2">{item.step}</div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">{item.title}</h3>
                <p className="text-secondary-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of professionals who've found their dream jobs through Veridia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/candidate/register" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
              Get Started Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link to="/careers" className="btn-secondary bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600">
              View Opportunities
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
