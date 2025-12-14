// components/LoadingSpinner.jsx
import React from 'react'

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#0A041A] to-[#1A0B3A] z-50">
      <div className="text-center">
        <div className="relative inline-block">
          <div className="w-16 h-16 border-4 border-purple-300/20 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-purple-400 rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 font-nunito text-purple-200 animate-pulse">Đang tải...</p>
      </div>
    </div>
  )
}

export default LoadingSpinner
