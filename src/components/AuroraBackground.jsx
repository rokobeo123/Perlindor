import React from 'react'
import { motion } from 'framer-motion'

const AuroraBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient background - TÍM HƠN */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A041A] via-[#150735] to-[#0A041A] opacity-100" />
      
      {/* Thêm lớp tím đậm overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A0B3A]/80 via-transparent to-[#1A0B3A]/60" />
      
      {/* Animated aurora blob 1 - TÍM ĐẬM HƠN */}
      <motion.div
        className="absolute -top-1/2 -left-1/2 w-full h-full rounded-full blur-3xl opacity-60"
        style={{
          background: 'radial-gradient(circle, rgba(166, 123, 203, 0.9) 0%, rgba(138, 92, 185, 0.7) 40%, rgba(110, 61, 167, 0.5) 60%, transparent 80%)'
        }}
        animate={{
          x: [0, 100, 0],
          y: [0, -100, 0],
          scale: [1, 1.3, 1],
          rotate: [0, 90, 0]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Animated aurora blob 2 - TÍM SÁNG HƠN */}
      <motion.div
        className="absolute -bottom-1/2 -right-1/2 w-full h-full rounded-full blur-3xl opacity-60"
        style={{
          background: 'radial-gradient(circle, rgba(201, 167, 245, 0.9) 0%, rgba(177, 133, 235, 0.7) 40%, rgba(153, 99, 225, 0.5) 60%, transparent 80%)'
        }}
        animate={{
          x: [0, -100, 0],
          y: [0, 100, 0],
          scale: [1, 1.4, 1],
          rotate: [0, -90, 0]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Animated aurora blob 3 - HỒNG TÍM */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-3/4 h-3/4 rounded-full blur-3xl opacity-50"
        style={{
          background: 'radial-gradient(circle, rgba(255, 184, 245, 0.8) 0%, rgba(217, 149, 225, 0.6) 40%, rgba(179, 114, 205, 0.4) 60%, transparent 80%)'
        }}
        animate={{
          x: [-50, 50, -50],
          y: [50, -50, 50],
          scale: [1, 1.2, 1],
          rotate: [0, 180, 0]
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Lớp tím overlay thêm để làm đậm hơn */}
      <div className="absolute inset-0 bg-[#1A0B3A]/30" />
      
      {/* Shimmer overlay cho sparkle - giảm opacity để đỡ sáng */}
      <div className="absolute inset-0 aurora-shimmer opacity-15" />
      
      {/* Star-like particles - tăng số lượng */}
      <div className="absolute inset-0">
        {Array.from({ length: 80 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[2px] h-[2px] bg-lavender-200 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 0.8, 0],
              scale: [0, 1.5, 0]
            }}
            transition={{
              duration: Math.random() * 4 + 2,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default AuroraBackground
