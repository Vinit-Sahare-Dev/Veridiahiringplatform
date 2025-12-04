import React from 'react'
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
  Target
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
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 text-primary-800 text-sm font-medium mb-6">
              <Award className="w-4 h-4 mr-2" />
              Now Hiring: Join Our Amazing Team
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-secondary-900 mb-6">
              Build Your Career at
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800"> Veridia</span>
            </h1>
            <p className="text-xl text-secondary-600 mb-8 max-w-2xl mx-auto">
              Join a team of innovators and creators. We're looking for talented individuals who want to make a difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated && isCandidate ? (
                <Link
                  to="/candidate/apply"
                  className="btn-primary text-lg px-8 py-3 inline-flex items-center justify-center group"
                >
                  Apply Now
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="btn-primary text-lg px-8 py-3 inline-flex items-center justify-center group"
                  >
                    Start Your Application
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/login"
                    className="btn-secondary text-lg px-8 py-3 inline-flex items-center justify-center"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mb-4 text-primary-600">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-secondary-900 mb-1">{stat.number}</div>
                <div className="text-sm text-secondary-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-secondary-900 mb-4">
              Why Choose Veridia?
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              We offer a streamlined hiring process designed to find the best talent and provide an exceptional experience.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="card p-8 text-center hover:shadow-lg transition-shadow duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-6 text-primary-600">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-4">{feature.title}</h3>
                <p className="text-secondary-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-secondary-900 mb-4">
              Simple Application Process
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Get started in minutes with our streamlined application process.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { step: "1", title: "Register", description: "Create your account in seconds" },
              { step: "2", title: "Fill Application", description: "Complete the application form" },
              { step: "3", title: "Upload Resume", description: "Attach your resume file" },
              { step: "4", title: "Track Status", description: "Monitor your application progress" }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-600 text-white rounded-full text-lg font-bold mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-secondary-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-secondary-600">{item.description}</p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-6 left-full w-full h-0.5 bg-secondary-200 -ml-4" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-12 text-center text-white max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Join Our Team?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Take the first step towards an exciting career at Veridia.
            </p>
            <Link
              to={isAuthenticated && isCandidate ? "/candidate/apply" : "/register"}
              className="inline-flex items-center bg-white text-primary-600 font-semibold px-8 py-3 rounded-lg hover:bg-secondary-50 transition-colors group"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
