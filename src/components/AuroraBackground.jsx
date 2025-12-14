import React, { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'

const AuroraBackground = () => {
  const [isMobile, setIsMobile] = useState(false)
  const animationRef = useRef(null)
  
  // Detect mobile để tối ưu
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    // Cleanup animation frame
    return () => {
      window.removeEventListener('resize', checkMobile)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  // Tối ưu: Giảm số lượng stars trên mobile
  const starCount = isMobile ? 50 : 80

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base gradient background - GIỮ NGUYÊN NHƯ CŨ */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A041A] via-[#150735] to-[#0A041A] opacity-100" />
      
      {/* Tím đậm overlay - GIỮ NGUYÊN */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A0B3A]/80 via-transparent to-[#1A0B3A]/60" />
      
      {/* Animated aurora blob 1 - TÍM ĐẬM - GIẢM NHẸ ĐỘ PHỨC TẠP */}
      <motion.div
        className="absolute -top-1/2 -left-1/2 w-full h-full rounded-full blur-3xl opacity-60"
        style={{
          background: 'radial-gradient(circle, rgba(166, 123, 203, 0.9) 0%, rgba(138, 92, 185, 0.7) 40%, rgba(110, 61, 167, 0.5) 60%, transparent 80%)'
        }}
        animate={!isMobile ? {
          x: [0, 80, 0], // Giảm movement từ 100→80
          y: [0, -80, 0], // Giảm movement từ 100→80
          scale: [1, 1.2, 1], // Giảm từ 1.3→1.2
          rotate: [0, 60, 0] // Giảm từ 90→60
        } : {}}
        transition={{
          duration: 25, // Chậm hơn từ 20→25
          repeat: Infinity,
          ease: "linear" // Thay easeInOut bằng linear (nhẹ hơn)
        }}
      />
      
      {/* Animated aurora blob 2 - TÍM SÁNG - GIẢM NHẸ */}
      <motion.div
        className="absolute -bottom-1/2 -right-1/2 w-full h-full rounded-full blur-3xl opacity-60"
        style={{
          background: 'radial-gradient(circle, rgba(201, 167, 245, 0.9) 0%, rgba(177, 133, 235, 0.7) 40%, rgba(153, 99, 225, 0.5) 60%, transparent 80%)'
        }}
        animate={!isMobile ? {
          x: [0, -80, 0], // Giảm movement
          y: [0, 80, 0], // Giảm movement
          scale: [1, 1.3, 1], // Giảm từ 1.4→1.3
          rotate: [0, -60, 0] // Giảm từ 90→60
        } : {}}
        transition={{
          duration: 30, // Chậm hơn từ 25→30
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Animated aurora blob 3 - HỒNG TÍM - GIẢM ĐỘ PHỨC TẠP NHƯNG GIỮ VẺ ĐẸP */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-3/4 h-3/4 rounded-full blur-3xl opacity-50"
        style={{
          background: 'radial-gradient(circle, rgba(255, 184, 245, 0.8) 0%, rgba(217, 149, 225, 0.6) 40%, rgba(179, 114, 205, 0.4) 60%, transparent 80%)'
        }}
        animate={!isMobile ? {
          x: [-40, 40, -40], // Giảm movement từ 50→40
          y: [40, -40, 40], // Giảm movement từ 50→40
          scale: [1, 1.15, 1], // Giảm từ 1.2→1.15
          rotate: [0, 120, 0] // Giữ nguyên
        } : {}}
        transition={{
          duration: 35, // Chậm hơn từ 30→35
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Lớp tím overlay - GIỮ NGUYÊN */}
      <div className="absolute inset-0 bg-[#1A0B3A]/30" />
      
      {/* Shimmer overlay - GIỮ NGUYÊN */}
      <div className="absolute inset-0 aurora-shimmer opacity-15" />
      
      {/* Star-like particles - TỐI ƯU: Batch rendering */}
      <div className="absolute inset-0">
        {/* Batch 1: Large stars - giảm số lượng */}
        {Array.from({ length: Math.floor(starCount * 0.3) }).map((_, i) => (
          <motion.div
            key={`star-lg-${i}`}
            className="absolute w-[2px] h-[2px] bg-lavender-200 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={!isMobile ? {
              opacity: [0, 0.8, 0],
              scale: [0, 1.5, 0]
            } : {
              opacity: 0.5,
              scale: 1
            }}
            transition={{
              duration: Math.random() * 5 + 3, // Chậm hơn
              repeat: Infinity,
              delay: Math.random() * 6,
              ease: "easeInOut"
            }}
          />
        ))}
        
        {/* Batch 2: Small static stars - không animation */}
        {Array.from({ length: Math.floor(starCount * 0.7) }).map((_, i) => (
          <div
            key={`star-sm-${i}`}
            className="absolute w-[1px] h-[1px] bg-lavender-100/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
      
      {/* Tối ưu GPU - thêm layer composite */}
      <div className="absolute inset-0 transform-gpu will-change-transform" />
    </div>
  )
}

// Giữ nguyên không dùng React.memo để đảm bảo animation chạy mượt
export default AuroraBackground
