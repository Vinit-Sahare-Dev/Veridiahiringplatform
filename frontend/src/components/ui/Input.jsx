import React from 'react'
import { cn } from '../../utils/cn'

const Input = React.forwardRef(({
  className,
  type = 'text',
  error = false,
  label,
  helperText,
  icon,
  ...props
}, ref) => {
  const baseClasses = "block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
  const errorClasses = error ? "border-red-300 focus:ring-red-500" : ""
  const iconClasses = icon ? "pl-10" : ""
  
  const classes = cn(
    baseClasses,
    errorClasses,
    iconClasses,
    className
  )

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={classes}
          ref={ref}
          {...props}
        />
      </div>
      {helperText && (
        <p className={cn(
          "mt-1 text-sm",
          error ? "text-red-600" : "text-gray-500"
        )}>
          {helperText}
        </p>
      )}
    </div>
  )
})

Input.displayName = "Input"

export default Input
