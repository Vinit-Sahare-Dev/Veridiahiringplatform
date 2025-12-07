import React from 'react'
import { cn } from '../../utils/cn'

const Card = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = "Card"

const CardHeader = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "px-6 py-4 border-b border-gray-200 bg-gray-50/50",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

CardHeader.displayName = "CardHeader"

const CardContent = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "px-6 py-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "px-6 py-4 border-t border-gray-200 bg-gray-50/50",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardContent, CardFooter }
