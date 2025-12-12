// components/FloatingMusicPlayer.jsx
import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, Music, SkipBack, SkipForward } from 'lucide-react'

const FloatingMusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const audioRef = useRef(null)

  // Danh sách bài hát từ thư mục public/music/
  const songs = [
    {
      id: 1,
      title: "Còn gì đẹp hơn",
      src: "/music/cgdh.mp3"
    },
    {
      id: 2,
      title: "Vị nhà-Đen", 
      src: "/music/vn.mp3"
    },
    {
      id: 3,
      title: "Đi về nhà-Đen",
      src: "/music/dvn.mp3"
    }
  ]

  const currentSong = songs[currentSongIndex]

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.7
      audioRef.current.onended = () => {
        handleNextSong()
      }
    }
  }, [])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        // Thu nhỏ ngay lập tức khi dừng
        setIsExpanded(false)
      } else {
        audioRef.current.play()
        // Mở rộng ngay lập tức khi phát
        setIsExpanded(true)
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleNextSong = () => {
    const nextIndex = (currentSongIndex + 1) % songs.length
    setCurrentSongIndex(nextIndex)
    setIsPlaying(true)
    setIsExpanded(true)
  }

  const handlePrevSong = () => {
    const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length
    setCurrentSongIndex(prevIndex)
    setIsPlaying(true)
    setIsExpanded(true)
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        {/* Player hình "viên thuốc" */}
        <motion.div
          className="relative flex items-center overflow-hidden"
          animate={{
            width: isExpanded ? 350 : 64,
            height: 64,
            borderRadius: 32,
          }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 200,
          }}
          style={{
            background: isPlaying
              ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.25) 0%, rgba(139, 92, 246, 0.2) 100%)'
              : 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            boxShadow: isPlaying
              ? '0 8px 32px rgba(168, 85, 247, 0.25)'
              : '0 4px 20px rgba(168, 85, 247, 0.15)'
          }}
        >
          {/* Nút Play/Pause tròn */}
          <motion.button
            onClick={togglePlay}
            className="relative w-14 h-14 rounded-full ml-1 flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Vòng xoay gradient */}
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                background: isPlaying
                  ? 'linear-gradient(135deg, #a855f7 0%, #8b5cf6 50%, #d946ef 100%)'
                  : 'linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%)',
                rotate: isPlaying ? 360 : 0
              }}
              transition={{
                background: { duration: 0.3 },
                rotate: {
                  duration: 8,
                  repeat: isPlaying ? Infinity : 0,
                  ease: "linear"
                }
              }}
            />
            
            {/* Hình tròn bên trong với icon */}
            <div className="absolute inset-2 rounded-full bg-gray-900 flex items-center justify-center">
              {isPlaying ? (
                <Pause size={18} className="text-purple-300" />
              ) : (
                <Music size={18} className="text-purple-300" />
              )}
            </div>
          </motion.button>

          {/* Nội dung mở rộng - chỉ hiện khi phát nhạc */}
          {isExpanded && (
            <motion.div
              className="flex-1 flex items-center justify-between px-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Tên bài hát */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate text-sm">
                  {currentSong.title}
                </p>
              </div>

              {/* Nút điều khiển */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrevSong}
                  className="p-1.5 text-purple-300 hover:text-white transition-colors rounded-full hover:bg-purple-500/20"
                  title="Bài trước"
                >
                  <SkipBack size={16} />
                </button>
                <button
                  onClick={handleNextSong}
                  className="p-1.5 text-purple-300 hover:text-white transition-colors rounded-full hover:bg-purple-500/20"
                  title="Bài tiếp"
                >
                  <SkipForward size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Glow effect khi đang phát */}
        {isPlaying && (
          <motion.div
            className="absolute -inset-2 rounded-full pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              background: "radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, rgba(168, 85, 247, 0) 70%)"
            }}
          />
        )}
      </div>

      {/* Audio element */}
      <audio
        ref={audioRef}
        src={currentSong.src}
        preload="metadata"
        key={currentSong.id}
        onPlay={() => {
          setIsPlaying(true)
          setIsExpanded(true)
        }}
        onPause={() => {
          setIsPlaying(false)
          setIsExpanded(false)
        }}
      />
    </>
  )
}

export default FloatingMusicPlayer
