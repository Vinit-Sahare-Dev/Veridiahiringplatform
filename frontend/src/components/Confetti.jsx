// Confetti Effect Component
import React, { useEffect, useState } from 'react'
import './Confetti.css'

const Confetti = ({ trigger, duration = 3000 }) => {
  const [particles, setParticles] = useState([])
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    if (trigger) {
      generateConfetti()
      setIsActive(true)
      
      const timer = setTimeout(() => {
        setIsActive(false)
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [trigger, duration])

  const generateConfetti = () => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#48dbfb']
    const newParticles = []
    
    for (let i = 0; i < 100; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: -10,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        speedX: (Math.random() - 0.5) * 2,
        speedY: Math.random() * 3 + 2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10
      })
    }
    
    setParticles(newParticles)
  }

  if (!isActive) return null

  return (
    <div className="confetti-container">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="confetti-particle"
          style={{
            left: `${particle.x}%`,
            backgroundColor: particle.color,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            transform: `rotate(${particle.rotation}deg)`,
            animation: `confetti-fall ${particle.speedY}s linear forwards`,
            '--speedX': `${particle.speedX}px`,
            '--rotationSpeed': `${particle.rotationSpeed}deg`
          }}
        />
      ))}
    </div>
  )
}

export default Confetti
