'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export const MouseTrail = () => {
  const [trails, setTrails] = useState<{ x: number; y: number; id: string }[]>([])
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newTrail = {
        x: e.clientX,
        y: e.clientY,
        id: `${Date.now()}-${Math.random()}`
      }
      setTrails(prev => [...prev, newTrail].slice(-20))
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <>
      {trails.map((trail) => (
        <motion.div
          key={trail.id}
          className="fixed w-2 h-2 bg-blue-500 rounded-full pointer-events-none"
          initial={{ opacity: 0.8, scale: 1 }}
          animate={{
            opacity: 0,
            scale: 0,
            x: trail.x - 4,
            y: trail.y - 4,
          }}
          transition={{ duration: 1 }}
        />
      ))}
    </>
  )
} 