import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'
import { PrivateRoute, AdminRoute, CandidateRoute } from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Footer from './components/layout/Footer'
import ScrollToTop from './components/ScrollToTop'

// Import pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Careers from './pages/Careers'
import TestPage from './pages/TestPage'
import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'
import AdminApplications from './pages/admin/Applications'
import CandidateDashboard from './pages/candidate/Dashboard'
import CandidateProfile from './pages/candidate/Profile'
import ApplicationForm from './pages/candidate/ApplicationForm'
import CandidateNotifications from './pages/candidate/Notifications'

// Import styles
import './styles/base.css'
import './styles/components.css'
import './styles/layout.css'
import './styles/Navbar.css'
import './styles/HomeEnhanced.css'
import './styles/Professional.css'
import './styles/Applications.css'
import './styles/auth.css'

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <div className="app-layout">
          <AuthProvider>
            <Navbar />
            <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Protected Admin Routes */}
            <Route path="/admin/dashboard" element={
              <AdminRoute>
                <div className="admin-layout">
                  <main className="admin-main">
                    <AdminDashboard />
                  </main>
                </div>
              </AdminRoute>
            } />
            
            <Route path="/admin/applications" element={
              <AdminRoute>
                <div className="admin-layout">
                  <main className="admin-main">
                    <AdminApplications />
                  </main>
                </div>
              </AdminRoute>
            } />
            
            {/* Protected Candidate Routes */}
            <Route path="/candidate/dashboard" element={
              <CandidateRoute>
                <div className="app-layout">
                  <main className="app-main">
                    <CandidateDashboard />
                  </main>
                </div>
              </CandidateRoute>
            } />
            
            <Route path="/candidate/profile" element={
              <CandidateRoute>
                <div className="app-layout">
                  <main className="app-main">
                    <CandidateProfile />
                  </main>
                </div>
              </CandidateRoute>
            } />
            
            <Route path="/candidate/apply" element={
              <CandidateRoute>
                <div className="app-layout">
                  <main className="app-main">
                    <ApplicationForm />
                  </main>
                </div>
              </CandidateRoute>
            } />
            
            <Route path="/candidate/notifications" element={
              <CandidateRoute>
                <div className="app-layout">
                  <main className="app-main">
                    <CandidateNotifications />
                  </main>
                </div>
              </CandidateRoute>
            } />
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
            <Footer />
          </AuthProvider>
        </div>
      </Router>
    </ErrorBoundary>
  )
}

export default App
