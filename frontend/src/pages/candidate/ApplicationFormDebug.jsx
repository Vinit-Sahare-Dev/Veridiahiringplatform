import React from 'react'
import { useAuth } from '../../contexts/AuthContext'

const ApplicationFormDebug = () => {
  const { user, isAuthenticated, isCandidate, isAdmin } = useAuth()
  
  console.log('ApplicationFormDebug - Component mounted')
  console.log('ApplicationFormDebug - Auth State:', { user, isAuthenticated, isCandidate, isAdmin })
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <h1 className="text-2xl font-bold text-white">Application Form (Debug Version)</h1>
            <p className="text-blue-100 mt-1">This is a debug version to test routing</p>
          </div>
          
          {/* Debug Info */}
          <div className="p-8">
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
              <h2 className="text-lg font-semibold text-blue-900 mb-2">Authentication Status</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Authenticated:</span>
                  <span className={`ml-2 px-2 py-1 rounded ${isAuthenticated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {isAuthenticated ? 'Yes' : 'No'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Is Candidate:</span>
                  <span className={`ml-2 px-2 py-1 rounded ${isCandidate ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {isCandidate ? 'Yes' : 'No'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">User Role:</span>
                  <span className="ml-2 px-2 py-1 rounded bg-blue-100 text-blue-800">
                    {user?.role || 'Not set'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">User Email:</span>
                  <span className="ml-2 text-gray-700">
                    {user?.email || 'Not set'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Test Form */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Test Application Form</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input type="text" className="w-full p-2 border border-gray-300 rounded" placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input type="text" className="w-full p-2 border border-gray-300 rounded" placeholder="Doe" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" className="w-full p-2 border border-gray-300 rounded" placeholder="john@example.com" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="tel" className="w-full p-2 border border-gray-300 rounded" placeholder="+1234567890" />
              </div>
              
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
                Test Submit (Debug)
              </button>
            </div>
            
            {/* Instructions */}
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-sm text-yellow-800">
                <strong>Debug Instructions:</strong><br/>
                1. Check browser console for detailed logs<br/>
                2. Verify authentication status above<br/>
                3. If not authenticated as candidate, login/register first<br/>
                4. If this page loads, routing is working correctly
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApplicationFormDebug
