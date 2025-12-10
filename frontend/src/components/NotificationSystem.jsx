// Enhanced Notification System with Confetti
import React, { useState, useEffect } from 'react'
import Confetti from './Confetti'
import './Notifications.css'

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([])
  const [showConfetti, setShowConfetti] = useState(false)

  // Listen for custom events
  useEffect(() => {
    const handleNotification = (event) => {
      const { type, message, title, duration = 5000 } = event.detail
      
      const notification = {
        id: Date.now(),
        type,
        message,
        title,
        timestamp: new Date()
      }
      
      setNotifications(prev => [...prev, notification])
      
      // Trigger confetti for success/acceptance notifications
      if (type === 'success' || type === 'accepted') {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
      }
      
      // Auto-remove notification
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id))
      }, duration)
    }

    window.addEventListener('showNotification', handleNotification)
    return () => window.removeEventListener('showNotification', handleNotification)
  }, [])

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  return (
    <>
      <Confetti trigger={showConfetti} />
      <div className="notification-container">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`notification notification-${notification.type}`}
          >
            <div className="notification-content">
              {notification.title && (
                <div className="notification-title">{notification.title}</div>
              )}
              <div className="notification-message">{notification.message}</div>
            </div>
            <button
              className="notification-close"
              onClick={() => removeNotification(notification.id)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </>
  )
}

// Helper function to trigger notifications
export const showNotification = (type, message, title = '') => {
  window.dispatchEvent(new CustomEvent('showNotification', {
    detail: { type, message, title }
  }))
}

export default NotificationSystem
