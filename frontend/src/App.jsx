import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { PublicRoute, PrivateRoute, AdminRoute } from './components/ProtectedRoute'
import Navbar from './components/Navbar'

// Public Pages
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'

// Candidate Pages
import CandidateDashboard from './pages/candidate/Dashboard'
import CandidateProfile from './pages/candidate/Profile'
import ApplicationForm from './pages/candidate/ApplicationForm'

// Admin Pages
import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
              
              {/* Candidate Routes */}
              <Route path="/candidate/dashboard" element={<PrivateRoute><CandidateDashboard /></PrivateRoute>} />
              <Route path="/candidate/profile" element={<PrivateRoute><CandidateProfile /></PrivateRoute>} />
              <Route path="/candidate/apply" element={<PrivateRoute><ApplicationForm /></PrivateRoute>} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
