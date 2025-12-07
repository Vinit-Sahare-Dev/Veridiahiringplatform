import React from 'react'
import { cn } from '../../utils/cn'

const LoadingSpinner = ({ 
  size = 'md', 
  className = '', 
  text = 'Loading...' 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="flex flex-col items-center space-y-2">
        <div className={cn('animate-spin rounded-full border-2 border-gray-300 border-t-blue-600', sizes[size])} />
        {text && (
          <span className="text-sm text-gray-600 animate-pulse">{text}</span>
        )}
      </div>
    </div>
  )
}

export default LoadingSpinner
