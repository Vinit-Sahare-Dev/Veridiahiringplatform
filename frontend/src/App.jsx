import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { PublicRoute, PrivateRoute, AdminRoute } from './components/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'
import Navbar from './components/Navbar'
import Footer from './components/layout/Footer'

// Public Pages
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Careers from './pages/Careers'

// Candidate Pages
import CandidateDashboard from './pages/candidate/Dashboard'
import CandidateProfile from './pages/candidate/Profile'
import ApplicationForm from './pages/candidate/ApplicationForm'
import CandidateNotifications from './pages/candidate/Notifications'

// Admin Pages
import AdminLogin from './pages/admin/Login'
import AdminLoginDebug from './pages/admin/LoginDebug'
import AdminDashboard from './pages/admin/Dashboard'
import AdminApplications from './pages/admin/Applications'

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                
                {/* Candidate Routes */}
                <Route path="/candidate/dashboard" element={<PrivateRoute><CandidateDashboard /></PrivateRoute>} />
                <Route path="/candidate/profile" element={<PrivateRoute><CandidateProfile /></PrivateRoute>} />
                <Route path="/candidate/apply" element={<PrivateRoute><ApplicationForm /></PrivateRoute>} />
                <Route path="/candidate/notifications" element={<PrivateRoute><CandidateNotifications /></PrivateRoute>} />
                
                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/login-debug" element={<AdminLoginDebug />} />
                <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/admin/applications" element={<AdminRoute><AdminApplications /></AdminRoute>} />
                
                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
