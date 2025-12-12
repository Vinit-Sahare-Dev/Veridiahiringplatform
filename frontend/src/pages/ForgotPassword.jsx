import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import '../styles/Login.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Call your forgot password API
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Password reset link sent! Please check your email.');
        setSubmitted(true);
      } else {
        setError(data.message || 'Failed to send reset link. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-container">
        <div className="auth-card">
          {/* Header Section */}
          <div className="auth-header">
            <Link to="/login" className="auth-back-link">
              <ArrowLeft className="w-5 h-5" />
              Back to Login
            </Link>
            <div className="auth-logo">
              <Mail className="w-12 h-12" />
            </div>
            <h1 className="auth-title">Forgot Password</h1>
            <p className="auth-subtitle">
              Enter your email address and we'll send you a link to reset your password
            </p>
          </div>

          {/* Form Section */}
          {!submitted ? (
            <form onSubmit={handleSubmit} className="auth-form">
              {/* Success Message */}
              {success && (
                <div className="auth-alert auth-alert-success">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <p>{success}</p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="auth-alert auth-alert-error">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              {/* Email Field */}
              <div className="auth-form-group">
                <label className="auth-label">Email Address</label>
                <div className="auth-input-wrapper">
                  <Mail className="auth-input-icon" />
                  <input
                    type="email"
                    placeholder="Enter your registered email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="auth-input"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="auth-button"
              >
                {loading ? (
                  <>
                    <div className="auth-spinner"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          ) : (
            /* Success State */
            <div className="auth-success-state">
              <div className="auth-success-icon">
                <CheckCircle className="w-16 h-16" />
              </div>
              <h2 className="auth-success-title">Check Your Email</h2>
              <p className="auth-success-message">
                We've sent a password reset link to:<br />
                <strong>{email}</strong>
              </p>
              <div className="auth-success-instructions">
                <h4>Next Steps:</h4>
                <ul>
                  <li>Check your inbox for the reset email</li>
                  <li>Click the link in the email to reset your password</li>
                  <li>The link will expire in 24 hours</li>
                  <li>Check your spam folder if you don't see it</li>
                </ul>
              </div>
              <div className="auth-success-actions">
                <button
                  onClick={() => navigate('/login')}
                  className="auth-button auth-button-secondary"
                >
                  Back to Login
                </button>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setSuccess('');
                  }}
                  className="auth-button auth-button-outline"
                >
                  Send Again
                </button>
              </div>
            </div>
          )}

          {/* Help Section */}
          <div className="auth-help-section">
            <div className="auth-help-content">
              <h4>Need Help?</h4>
              <p>
                If you don't receive the email within a few minutes, please:
              </p>
              <ul>
                <li>Check your spam or junk folder</li>
                <li>Make sure you entered the correct email address</li>
                <li>Contact support at empsyncofficial@gmail.com</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;