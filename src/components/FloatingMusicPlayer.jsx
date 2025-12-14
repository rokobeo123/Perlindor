// components/FloatingMusicPlayer.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, Music, SkipBack, SkipForward, AlertCircle } from 'lucide-react'

const BASE_URL = import.meta.env.BASE_URL || '/'

const FloatingMusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [playbackError, setPlaybackError] = useState(null)
  const audioRef = useRef(null)

  const songs = [
    {
      id: 1,
      title: "Còn gì đẹp hơn",
      src: `${BASE_URL}music/cgdh.mp3`
    },
    {
      id: 2,
      title: "Vị nhà-Đen", 
      src: `${BASE_URL}music/vn.mp3`
    },
    {
      id: 3,
      title: "Đi về nhà-Đen",
      src: `${BASE_URL}music/dvn.mp3`
    },
    {
      id : 4,
      title: "Sớm muộn thì",
      src: `${BASE_URL}music/smt.mp3`
    },
    {
      id : 5,
      title: "Nhạc Hoạt Cảnh",
      src: `${BASE_URL}music/nhc.mp3`
    }
  ]

  const currentSong = songs[currentSongIndex]

  const playAudio = useCallback(async () => {
    if (audioRef.current) {
      setPlaybackError(null)
      try {
        await audioRef.current.play()
        setIsPlaying(true)
        setIsExpanded(true)
      } catch (error) {
        console.error("Autoplay/Playback Error:", error)
        if (error.name === "NotAllowedError") {
          setPlaybackError("Tự động phát nhạc bị chặn. Vui lòng bấm Play.")
        } else {
          setPlaybackError("Không thể phát nhạc. Vui lòng thử lại.")
        }
        setIsPlaying(false)
      }
    }
  }, [])

  const pauseAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
      setIsExpanded(false)
    }
  }, [])

  const handleSongEnded = useCallback(() => {
    const nextIndex = (currentSongIndex + 1) % songs.length
    setCurrentSongIndex(nextIndex)
    
    setTimeout(() => {
      if (isPlaying) {
        playAudio()
      }
    }, 300)
  }, [currentSongIndex, isPlaying, songs.length, playAudio])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.7
      audioRef.current.addEventListener('ended', handleSongEnded)
      
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('ended', handleSongEnded)
        }
      }
    }
  }, [handleSongEnded])

  const togglePlay = () => {
    if (isPlaying) {
      pauseAudio()
    } else {
      playAudio()
    }
  }

  const handleNextSong = () => {
    const nextIndex = (currentSongIndex + 1) % songs.length
    setCurrentSongIndex(nextIndex)
    
    if (isPlaying) {
      setTimeout(() => {
        playAudio()
      }, 100)
    } else {
      setIsExpanded(true)
    }
  }

  const handlePrevSong = () => {
    const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length
    setCurrentSongIndex(prevIndex)
    
    if (isPlaying) {
      setTimeout(() => {
        playAudio()
      }, 100)
    } else {
      setIsExpanded(true)
    }
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
          {/* Nút Play/Pause tròn - ĐÃ BỎ BADGE SỐ THỨ TỰ */}
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
            {/* ĐÃ XÓA: <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-pink-400 text-[10px] flex items-center justify-center text-white font-bold"></div> */}
          </motion.button>

          {/* Nội dung mở rộng */}
          {isExpanded && (
            <motion.div
              className="flex-1 flex items-center justify-between px-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Tên bài hát - ĐÃ BỎ DÒNG "Bài 1/3" */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate text-sm">
                  {currentSong.title}
                </p>
                {/* ĐÃ XÓA: <p className="text-xs text-purple-300/70 truncate">Bài {currentSongIndex + 1}/{songs.length}</p> */}
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

        {/* THÔNG BÁO LỖI AUTOPLAY */}
        {playbackError && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-2 p-2 rounded-lg bg-red-800/80 backdrop-blur-md flex items-center gap-2 text-sm text-red-100 max-w-sm ml-auto"
          >
            <AlertCircle size={16} />
            {playbackError}
          </motion.div>
        )}

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
        preload="auto"
        key={currentSong.id}
        onError={(e) => {
          console.error("Audio Load Error:", e.target.error)
          setPlaybackError(`Lỗi tải bài hát: ${currentSong.title}`)
          setIsPlaying(false)
          
          setTimeout(() => {
            console.log("Tự động chuyển bài sau lỗi")
            handleNextSong()
          }, 2000)
        }}
        onLoadStart={() => {
          setPlaybackError(null)
        }}
      />
    </>
  )
}

export default FloatingMusicPlayer
