import React from 'react'
import { useAuth } from '../contexts/AuthContext'

const TestPage = () => {
  const { user, isAuthenticated, isCandidate, isAdmin } = useAuth()
  
  console.log('TestPage - Auth State:', { user, isAuthenticated, isCandidate, isAdmin })
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Test Page - Debug Info</h1>
        
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold">Authentication Status:</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium">Is Authenticated:</span>
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
              <span className="font-medium">Is Admin:</span>
              <span className={`ml-2 px-2 py-1 rounded ${isAdmin ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {isAdmin ? 'Yes' : 'No'}
              </span>
            </div>
            
            <div>
              <span className="font-medium">User Role:</span>
              <span className="ml-2 px-2 py-1 rounded bg-blue-100 text-blue-800">
                {user?.role || 'Not set'}
              </span>
            </div>
          </div>
          
          {user && (
            <div className="mt-4 p-4 bg-gray-50 rounded">
              <h3 className="font-medium mb-2">User Data:</h3>
              <pre className="text-sm text-gray-600 overflow-auto">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
          )}
          
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm text-yellow-800">
              <strong>Debug Info:</strong> Check browser console for detailed logs.
              If you see this page, routing is working correctly.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestPage
