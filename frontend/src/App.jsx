import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { PublicRoute, PrivateRoute, AdminRoute } from './components/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './components/layout/Layout'

// Public Pages
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Careers from './pages/Careers'

// Candidate Pages
import CandidateDashboard from './pages/candidate/Dashboard'
import CandidateProfile from './pages/candidate/Profile'
import ApplicationForm from './pages/candidate/ApplicationForm'

// Admin Pages
import AdminLogin from './pages/admin/Login'
import AdminLoginDebug from './pages/admin/LoginDebug'
import AdminDashboard from './pages/admin/Dashboard'

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/careers" element={<Layout><Careers /></Layout>} />
            <Route path="/login" element={<Layout><PublicRoute><Login /></PublicRoute></Layout>} />
            <Route path="/register" element={<Layout><PublicRoute><Register /></PublicRoute></Layout>} />
            
            {/* Candidate Routes */}
            <Route path="/candidate/dashboard" element={<Layout><PrivateRoute><CandidateDashboard /></PrivateRoute></Layout>} />
            <Route path="/candidate/profile" element={<Layout><PrivateRoute><CandidateProfile /></PrivateRoute></Layout>} />
            <Route path="/candidate/apply" element={<Layout><PrivateRoute><ApplicationForm /></PrivateRoute></Layout>} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<Layout><AdminLogin /></Layout>} />
            <Route path="/admin/login-debug" element={<Layout><AdminLoginDebug /></Layout>} />
            <Route path="/admin/dashboard" element={<Layout><AdminRoute><AdminDashboard /></AdminRoute></Layout>} />
            
            {/* Fallback */}
            <Route path="*" element={<Layout><Navigate to="/" replace /></Layout>} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
