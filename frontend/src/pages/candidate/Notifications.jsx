import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { applicationAPI } from '../../services/api'
import { 
  Bell, 
  Star, 
  CheckCircle, 
  Calendar, 
  Mail, 
  X,
  Info,
  AlertCircle,
  Sparkles
} from 'lucide-react'
import '../../styles/Applications.css'

const Notifications = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // For now, we'll simulate notifications based on application status
    // In a real app, this would come from a notifications API
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await applicationAPI.getMyApplication()
      const application = response.data
      
      if (application) {
        const notifs = generateNotificationsFromStatus(application)
        setNotifications(notifs)
      }
    } catch (error) {
      console.log('No application found')
    } finally {
      setLoading(false)
    }
  }

  const generateNotificationsFromStatus = (application) => {
    const notifs = []
    const now = new Date()
    
    // Application submitted notification
    notifs.push({
      id: 1,
      type: 'info',
      title: 'Application Submitted',
      message: 'Your application has been successfully submitted and is under review.',
      timestamp: application.createdAt,
      icon: <Info className="w-5 h-5" />,
      read: true
    })

    // Status-based notifications
    if (application.status === 'SHORTLISTED') {
      notifs.push({
        id: 2,
        type: 'success',
        title: 'Congratulations! You are Shortlisted',
        message: 'You have been shortlisted for the next round of interviews. Our HR team will contact you soon.',
        timestamp: application.updatedAt,
        icon: <Star className="w-5 h-5" />,
        read: false
      })
    } else if (application.status === 'UNDER_REVIEW') {
      notifs.push({
        id: 3,
        type: 'info',
        title: 'Application Under Review',
        message: 'Your application is currently being reviewed by our hiring team.',
        timestamp: application.updatedAt,
        icon: <AlertCircle className="w-5 h-5" />,
        read: false
      })
    } else if (application.status === 'ACCEPTED') {
      notifs.push({
        id: 4,
        type: 'success',
        title: 'Congratulations! You are Accepted',
        message: 'You have been selected for the position! Welcome to Veridia!',
        timestamp: application.updatedAt,
        icon: <CheckCircle className="w-5 h-5" />,
        read: false
      })
    } else if (application.status === 'REJECTED') {
      notifs.push({
        id: 5,
        type: 'error',
        title: 'Application Status Update',
        message: 'Your application was not selected at this time. We encourage you to apply for future positions.',
        timestamp: application.updatedAt,
        icon: <X className="w-5 h-5" />,
        read: false
      })
    }

    return notifs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })))
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200 text-green-800'
      case 'error': return 'bg-red-50 border-red-200 text-red-800'
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      default: return 'bg-blue-50 border-blue-200 text-blue-800'
    }
  }

  const getIconColor = (type) => {
    switch (type) {
      case 'success': return 'text-green-600'
      case 'error': return 'text-red-600'
      case 'warning': return 'text-yellow-600'
      default: return 'text-blue-600'
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="careers-container" style={{marginTop: 0, paddingTop: 0}}>
      {/* Hero Section */}
      <section className="careers-hero">
        <div className="careers-hero-content">
          <div className="careers-hero-badge">
            <Sparkles className="w-4 h-4" />
            Your Notifications
          </div>
          
          <h1 className="careers-hero-title">
            Stay <span className="text-gradient">Updated</span>
          </h1>
          
          <p className="careers-hero-description">
            Track your application status and receive important updates.
            Never miss an opportunity with real-time notifications.
          </p>
          
          <div className="careers-hero-stats">
            <div className="careers-stat">
              <span className="careers-stat-value">{notifications.length}</span>
              <span className="careers-stat-label">Total</span>
            </div>
            <div className="careers-stat">
              <span className="careers-stat-value">{unreadCount}</span>
              <span className="careers-stat-label">Unread</span>
            </div>
            <div className="careers-stat">
              <span className="careers-stat-value">{notifications.filter(n => n.read).length}</span>
              <span className="careers-stat-label">Read</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full mb-6">
              <Bell className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No Notifications Yet</h3>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              You don't have any notifications yet. We'll notify you when there are updates to your application.
            </p>
            <Link
              to="/careers"
              className="inline-flex items-center bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors mt-6"
            >
              Browse Jobs
              <AlertCircle className="w-4 h-4 ml-2" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden ${
                  notification.read ? 'opacity-75' : 'border-l-4 border-l-blue-500'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                      notification.type === 'success' ? 'bg-green-100' :
                      notification.type === 'error' ? 'bg-red-100' :
                      notification.type === 'warning' ? 'bg-yellow-100' :
                      'bg-blue-100'
                    }`}>
                      <div className={`w-5 h-5 ${
                        notification.type === 'success' ? 'text-green-600' :
                        notification.type === 'error' ? 'text-red-600' :
                        notification.type === 'warning' ? 'text-yellow-600' :
                        'text-blue-600'
                      }`}>
                        {notification.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {notification.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">
                            {formatDate(notification.timestamp)}
                          </span>
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                              title="Mark as read"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        {notification.message}
                      </p>
                      {!notification.read && (
                        <div className="mt-3">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                            New
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tips Section */}
      <div className="card mt-8 bg-secondary-50">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
            <Mail className="w-5 h-5 mr-2" />
            Email Notifications
          </h3>
          <p className="text-secondary-600 mb-4">
            You'll also receive email notifications for important updates to your application status. 
            Make sure to check your email regularly, including your spam folder.
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-purple-600 mr-2" />
              <span>Shortlisted candidates receive interview details</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
              <span>Accepted candidates receive offer information</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Notifications
