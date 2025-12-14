import React, { useEffect, useState } from 'react'

const FloatingStickers = () => {
  const [stickers, setStickers] = useState([])
  const [animate, setAnimate] = useState(false) // Thêm state này

  useEffect(() => {
    // Initialize stickers only on client side
    const initialStickers = [
      { emoji: '💜', size: 'text-4xl' },
      { emoji: '⭐', size: 'text-3xl' },
      { emoji: '✨', size: 'text-2xl' },
      { emoji: '💫', size: 'text-3xl' },
      { emoji: '🌙', size: 'text-4xl' },
      { emoji: '☁️', size: 'text-5xl' },
      { emoji: '🦋', size: 'text-3xl' },
      { emoji: '🌸', size: 'text-2xl' },
      { emoji: '🎀', size: 'text-3xl' },
      { emoji: '💖', size: 'text-4xl' }
    ]
    
    const stickersWithPositions = initialStickers.map(sticker => ({
      ...sticker,
      initialX: typeof window !== 'undefined' ? Math.random() * window.innerWidth : 0,
      initialY: typeof window !== 'undefined' ? Math.random() * window.innerHeight : 0
    }))
    
    setStickers(stickersWithPositions)
  }, [])

  // Nếu không animate, hiển thị static stickers
  if (!animate) {
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {stickers.slice(0, 5).map((sticker, index) => ( // Chỉ hiển thị 5 stickers
          <div
            key={index}
            className={`absolute ${sticker.size} opacity-10`}
            style={{
              left: `${sticker.initialX}px`,
              top: `${sticker.initialY}px`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            {sticker.emoji}
          </div>
        ))}
      </div>
    )
  }

  // Nếu có animate, hiển thị bình thường
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
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight
            ],
            x: [
              sticker.initialX,
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth
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
