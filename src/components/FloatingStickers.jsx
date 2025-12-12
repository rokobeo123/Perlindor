import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

// Floating stickers with random positions and animations - FIXED WINDOW ISSUE
const FloatingStickers = () => {
  const [stickers, setStickers] = useState([])

  useEffect(() => {
    // Initialize stickers only on client side
    const initialStickers = [
      { emoji: '💜', size: 'text-4xl', delay: 0, duration: 8 },
      { emoji: '⭐', size: 'text-3xl', delay: 1, duration: 10 },
      { emoji: '✨', size: 'text-2xl', delay: 2, duration: 7 },
      { emoji: '💫', size: 'text-3xl', delay: 0.5, duration: 9 },
      { emoji: '🌙', size: 'text-4xl', delay: 1.5, duration: 11 },
      { emoji: '☁️', size: 'text-5xl', delay: 2.5, duration: 12 },
      { emoji: '🦋', size: 'text-3xl', delay: 3, duration: 8 },
      { emoji: '🌸', size: 'text-2xl', delay: 1, duration: 9 },
      { emoji: '🎀', size: 'text-3xl', delay: 2, duration: 10 },
      { emoji: '💖', size: 'text-4xl', delay: 0, duration: 8 }
    ]
    
    // Only set positions if window is available
    const stickersWithPositions = initialStickers.map(sticker => ({
      ...sticker,
      initialX: typeof window !== 'undefined' ? Math.random() * window.innerWidth : 0,
      initialY: typeof window !== 'undefined' ? Math.random() * window.innerHeight : 0
    }))
    
    setStickers(stickersWithPositions)
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {stickers.map((sticker, index) => (
        <motion.div
          key={index}
          className={`absolute ${sticker.size} filter blur-[0.5px] pointer-events-none`}
          initial={{
            x: sticker.initialX,
            y: sticker.initialY,
            opacity: 0.2,
            scale: 0.8
          }}
          animate={{
            y: [
              sticker.initialY,
              typeof window !== 'undefined' ? Math.random() * window.innerHeight : sticker.initialY,
              typeof window !== 'undefined' ? Math.random() * window.innerHeight : sticker.initialY
            ],
            x: [
              sticker.initialX,
              typeof window !== 'undefined' ? Math.random() * window.innerWidth : sticker.initialX,
              typeof window !== 'undefined' ? Math.random() * window.innerWidth : sticker.initialX
            ],
            rotate: [0, 180, 360],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: sticker.duration,
            delay: sticker.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {sticker.emoji}
        </motion.div>
      ))}
    </div>
  )
}

export default FloatingStickers
