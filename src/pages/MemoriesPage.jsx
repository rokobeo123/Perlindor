import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useData } from '../contexts/DataContext'
import { Image as ImageIcon, X, Download, ArrowLeft, ArrowRight, Maximize2, Minimize2 } from 'lucide-react'

const MemoriesPage = () => {
  const { data } = useData()
  const containerRef = useRef(null)
  
  const [selectedImage, setSelectedImage] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const gallery = useMemo(() => data.gallery || [], [data.gallery])
  const videos = useMemo(() => data.videos || [], [data.videos])

  // Open image - FIXED: không dùng setTimeout
  const openImage = useCallback((photo, index) => {
    setSelectedImage(photo)
    setCurrentImageIndex(index)
    setIsModalOpen(true)
  }, [])

  // Close image - FIXED: đơn giản hóa
  const closeImage = useCallback(() => {
    setIsModalOpen(false)
    // Không dùng setTimeout, để AnimatePresence xử lý
  }, [])

  // Reset khi modal đã đóng hoàn toàn
  useEffect(() => {
    if (!isModalOpen) {
      const timer = setTimeout(() => {
        setSelectedImage(null)
        setIsFullscreen(false)
      }, 100) // Short delay để animation hoàn tất
      return () => clearTimeout(timer)
    }
  }, [isModalOpen])

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev)
  }, [])

  const nextImage = useCallback(() => {
    const nextIndex = (currentImageIndex + 1) % gallery.length
    setSelectedImage(gallery[nextIndex])
    setCurrentImageIndex(nextIndex)
  }, [currentImageIndex, gallery])

  const prevImage = useCallback(() => {
    const prevIndex = (currentImageIndex - 1 + gallery.length) % gallery.length
    setSelectedImage(gallery[prevIndex])
    setCurrentImageIndex(prevIndex)
  }, [currentImageIndex, gallery])

  // Format YouTube URL
  const formatYouTubeUrl = useCallback((url) => {
    if (!url) return ''
    
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0]
      return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0`
    }
    
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0]
      return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0`
    }
    
    return url
  }, [])

  // Gallery Item
  const GalleryItem = React.memo(({ photo, index, onOpen }) => {
    const [isLoaded, setIsLoaded] = useState(false)
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotateZ: Math.random() * 8 - 4 }}
        whileInView={{ opacity: 1, scale: 1, rotateZ: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ 
          delay: Math.min(index * 0.05, 0.3), 
          duration: 0.4,
          type: "spring",
          stiffness: 100
        }}
        className="relative group transform-gpu will-change-transform"
      >
        <motion.div
          whileHover={{ 
            scale: 1.05, 
            rotate: 0,
            boxShadow: '0 0 30px rgba(201, 167, 245, 0.6)'
          }}
          transition={{ duration: 0.2 }}
          className="polaroid glass cursor-pointer overflow-hidden"
          onClick={() => onOpen(photo, index)}
        >
          <div className="relative overflow-hidden rounded-lg h-64">
            <img
              src={photo.url}
              alt={photo.caption}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              loading="lazy"
              onLoad={() => setIsLoaded(true)}
              onError={() => setIsLoaded(true)}
            />
            {!isLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-lavender-200/10 to-pink-300/10 animate-pulse rounded-lg" />
            )}
            <div className="absolute inset-0 bg-gradient-to-br from-lavender-200/10 via-pink-300/10 to-mint-300/10 opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
          </div>

          <p className="font-pacifico text-center text-midnight mt-4 text-lg px-2 pb-2">
            {photo.caption}
          </p>
        </motion.div>

        {/* Floating emoji */}
        <div className="absolute -top-2 -right-2 text-3xl opacity-70 filter drop-shadow-lg z-10">
          {['💜', '⭐', '✨', '🌙', '💫', '🦋'][index % 6]}
        </div>
      </motion.div>
    )
  })

  // Video Item
  const VideoItem = React.memo(({ video, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        delay: Math.min(index * 0.05, 0.2), 
        duration: 0.4 
      }}
      className="group relative transform-gpu"
    >
      <div className="glass rounded-xl p-4 blur-shadow h-full flex flex-col border border-white/10 hover:border-lavender-200/30 transition-all duration-200">
        <h3 className="font-fredoka text-lg text-lavender-200 mb-3 text-center line-clamp-2 min-h-[3rem] flex items-center justify-center">
          {video.title}
        </h3>
        
        <div className="relative rounded-lg overflow-hidden bg-dark-lighter flex-grow">
          <div className="aspect-video relative">
            <iframe
              src={formatYouTubeUrl(video.url)}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full absolute inset-0"
              style={{ border: 'none' }}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </div>
      </div>
      
      <div className="absolute -top-2 -right-2 text-xl opacity-60">
        {['🎬', '📹', '🎥'][index % 3]}
      </div>
    </motion.div>
  ))

  // Ngăn scroll khi modal mở - FIXED: chỉ set/unset một lần
  useEffect(() => {
    const handleScrollLock = () => {
      if (isModalOpen) {
        document.body.style.overflow = 'hidden'
      }
    }
    
    const handleScrollUnlock = () => {
      document.body.style.overflow = 'unset'
    }

    if (isModalOpen) {
      handleScrollLock()
      return () => {
        // Không unlock ngay lập tức, để modal animation hoàn tất
        const timer = setTimeout(handleScrollUnlock, 100)
        return () => clearTimeout(timer)
      }
    }
  }, [isModalOpen])

  return (
    <div ref={containerRef} className="min-h-screen pt-20 px-4 pb-16 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="font-baloo text-4xl md:text-5xl font-bold text-lavender-200 mb-3 flex items-center justify-center gap-3">
            <ImageIcon className="text-pink-300" size={48} />
            Khoảnh Khắc Đáng Nhớ
          </h1>
          <p className="font-pacifico text-xl md:text-2xl text-mint-300">Hành trình của chúng tôi được lưu giữ ✨</p>
        </motion.div>

        {/* Gallery Section */}
        <section className="mb-16">
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="font-fredoka text-3xl md:text-4xl font-bold text-lavender-200 mb-8 text-center"
          >
            📸 Thư Viện Ảnh
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {gallery.map((photo, index) => (
              <GalleryItem
                key={photo.id || index}
                photo={photo}
                index={index}
                onOpen={openImage}
              />
            ))}
          </div>
        </section>

        {/* Video Section */}
        <section className="mb-16">
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="font-fredoka text-3xl md:text-4xl font-bold text-lavender-200 mb-8 text-center"
          >
            🎬 Video Highlights
          </motion.h2>

          {videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video, index) => (
                <VideoItem
                  key={video.id || index}
                  video={video}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 glass rounded-xl border border-white/10">
              <div className="text-5xl mb-4 opacity-40">🎥</div>
              <h3 className="font-fredoka text-xl text-lavender-200 mb-3">
                Chưa có video nào
              </h3>
              <p className="font-nunito text-mint-300">
                Quản trị viên sẽ thêm video sớm nhất!
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Modal - FIXED: Sử dụng AnimatePresence đúng cách */}
      <AnimatePresence onExitComplete={() => {
        // Chỉ reset sau khi animation hoàn tất
        setSelectedImage(null)
        setIsFullscreen(false)
      }}>
        {isModalOpen && selectedImage && (
          <ImageModal
            key="image-modal"
            selectedImage={selectedImage}
            isFullscreen={isFullscreen}
            currentImageIndex={currentImageIndex}
            gallery={gallery}
            onClose={closeImage}
            onNext={nextImage}
            onPrev={prevImage}
            onToggleFullscreen={toggleFullscreen}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// Modal - FIXED: Loại bỏ tất cả các setTimeout không cần thiết
const ImageModal = React.memo(({ 
  selectedImage, 
  isFullscreen,
  currentImageIndex, 
  gallery, 
  onClose, 
  onNext, 
  onPrev,
  onToggleFullscreen
}) => {
  const modalRef = useRef(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const overlayRef = useRef(null)

  const downloadImage = useCallback(async (imageUrl, imageName) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${imageName || 'image'}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }, [])

  // Handle click outside - FIXED: không gọi multiple times
  const handleClickOutside = useCallback((e) => {
    // Chỉ xử lý khi click vào overlay
    if (overlayRef.current === e.target) {
      onClose()
    }
  }, [onClose])

  // Handle keyboard - FIXED: preventDefault để tránh reload
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ngăn hành vi mặc định của phím space
      if (e.key === ' ') {
        e.preventDefault()
      }
      
      switch(e.key) {
        case 'Escape': 
          onClose()
          break
        case 'ArrowRight': 
        case ' ': // Space
          onNext()
          break
        case 'ArrowLeft': 
          onPrev()
          break
        case 'f':
        case 'F':
          onToggleFullscreen()
          break
      }
    }
    
    window.addEventListener('keydown', handleKeyDown, { passive: false })
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, onNext, onPrev, onToggleFullscreen])

  // Reset image loaded state khi ảnh thay đổi
  useEffect(() => {
    setImageLoaded(false)
  }, [selectedImage?.id])

  return (
    <>
      {/* Overlay - FIXED: sử dụng AnimatePresence animation */}
      <motion.div
        ref={overlayRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm"
        onClick={handleClickOutside}
      />

      {/* Modal content - FIXED: sử dụng AnimatePresence đúng cách */}
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ 
            duration: 0.2,
            ease: "easeOut"
          }}
          className={`relative pointer-events-auto ${
            isFullscreen 
              ? 'w-full h-full' 
              : 'w-full max-w-6xl max-h-[90vh] mx-4'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`relative bg-dark-lighter overflow-hidden shadow-2xl ${
            isFullscreen 
              ? 'w-full h-full rounded-none' 
              : 'rounded-xl border border-white/10'
          }`}>
            {/* Controls - Top right */}
            <div className="absolute top-4 right-4 z-20 flex gap-2">
              {/* Fullscreen toggle */}
              <button
                onClick={onToggleFullscreen}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isFullscreen 
                    ? 'bg-white/20 hover:bg-white/30' 
                    : 'bg-black/60 hover:bg-black/80'
                }`}
                title={isFullscreen ? 'Thoát toàn màn hình (F)' : 'Toàn màn hình (F)'}
              >
                {isFullscreen ? (
                  <Minimize2 size={20} className="text-white" />
                ) : (
                  <Maximize2 size={20} className="text-white" />
                )}
              </button>

              {/* Download button */}
              <button
                onClick={() => downloadImage(selectedImage.url, selectedImage.caption)}
                className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center transition-all duration-200"
                title="Tải xuống"
              >
                <Download size={20} className="text-white" />
              </button>

              {/* Close button */}
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center transition-all duration-200"
                title="Đóng (ESC)"
              >
                <X size={20} className="text-white" />
              </button>
            </div>

            {/* Navigation buttons */}
            {gallery.length > 1 && (
              <>
                <button
                  onClick={onPrev}
                  className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                    isFullscreen 
                      ? 'bg-white/20 hover:bg-white/30' 
                      : 'bg-black/60 hover:bg-black/80'
                  }`}
                  title="Ảnh trước (←)"
                >
                  <ArrowLeft size={24} className="text-white" />
                </button>
                <button
                  onClick={onNext}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                    isFullscreen 
                      ? 'bg-white/20 hover:bg-white/30' 
                      : 'bg-black/60 hover:bg-black/80'
                  }`}
                  title="Ảnh tiếp (→ hoặc Space)"
                >
                  <ArrowRight size={24} className="text-white" />
                </button>
              </>
            )}

            {/* Image container - FIXED: đơn giản hóa */}
            <div className={`w-full h-full flex items-center justify-center ${
              isFullscreen ? 'p-2' : 'p-4 md:p-8'
            }`}>
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border-3 border-lavender-200/30 border-t-lavender-200 animate-spin" />
                </div>
              )}
              
              <img
                src={selectedImage.url}
                alt={selectedImage.caption}
                className={`max-w-full max-h-full object-contain transition-opacity duration-200 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  maxHeight: 'calc(90vh - 120px)' // Đảm bảo không vượt quá modal
                }}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageLoaded(true)}
              />
            </div>

            {/* Caption */}
            <div className={`absolute left-0 right-0 ${
              isFullscreen ? 'bottom-4' : 'bottom-0'
            } bg-gradient-to-t from-black/80 via-black/60 to-transparent p-6`}>
              <p className="font-pacifico text-xl md:text-2xl text-white text-center">
                {selectedImage?.caption}
              </p>
              <p className="font-nunito text-sm text-white/70 text-center mt-2">
                Ảnh {currentImageIndex + 1}/{gallery.length}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
})

export default React.memo(MemoriesPage)
