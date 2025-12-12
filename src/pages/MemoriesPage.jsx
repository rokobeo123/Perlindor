import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useData } from '../contexts/DataContext'
import { Image as ImageIcon } from 'lucide-react'

const MemoriesPage = () => {
  const { data } = useData()
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })

  // Format YouTube URL để embed đúng
  const formatYouTubeUrl = (url) => {
    if (!url) return ''
    
    // Nếu là link YouTube thường, chuyển thành embed
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0]
      return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`
    }
    
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0]
      return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`
    }
    
    // Nếu đã là embed URL thì giữ nguyên
    return url
  }

  return (
    <div ref={containerRef} className="min-h-screen pt-24 px-4 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="font-baloo text-5xl md:text-6xl font-bold text-lavender-200 mb-4 flex items-center justify-center gap-3">
            <ImageIcon className="text-pink-200" size={60} />
            Khoảnh Khắc Đáng Nhớ
          </h1>
          <p className="font-pacifico text-2xl text-mint-200">Hành trình của chúng tôi được lưu giữ ✨</p>
        </motion.div>

        {/* Gallery Section */}
        <section className="mb-20">
          <motion.h2
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="section-header mb-12 text-center"
          >
            📸 Thư Viện Ảnh
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.gallery.map((photo, index) => {
              const yOffset = useTransform(
                scrollYProgress,
                [0, 1],
                [0, -50 * (index % 3)]
              )

              return (
                <motion.div
                  key={photo.id}
                  style={{ y: yOffset }}
                  initial={{ opacity: 0, scale: 0.8, rotateZ: Math.random() * 20 - 10 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="relative group"
                >
                  <motion.div
                    whileHover={{ 
                      scale: 1.05, 
                      rotate: 0,
                      boxShadow: '0 0 40px rgba(201, 167, 245, 0.8)'
                    }}
                    className="polaroid glass cursor-pointer"
                  >
                    <div className="relative overflow-hidden rounded-lg">
                      <img
                        src={photo.url}
                        alt={photo.caption}
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-lavender/30 via-pink/30 to-mint/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>

                    <p className="font-pacifico text-center text-midnight mt-3 text-lg">
                      {photo.caption}
                    </p>
                  </motion.div>

                  <motion.div
                    animate={{ 
                      y: [-5, 5, -5],
                      rotate: [-5, 5, -5]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute -top-4 -right-4 text-4xl filter drop-shadow-lg z-10"
                  >
                    {['💜', '⭐', '✨', '🌙', '💫', '🦋'][index % 6]}
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* Video Section - ĐÃ SỬA */}
        <section className="mb-20">
          <motion.h2
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="section-header mb-12 text-center"
          >
            🎬 Video Highlights
          </motion.h2>

          {data.videos.length > 0 ? (
            <div className="relative">
              {/* Video Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.videos.map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative"
                  >
                    <div className="glass-dark rounded-xl p-4 blur-shadow h-full flex flex-col hover:shadow-lg hover:shadow-lavender/20 transition-all duration-300">
                      {/* Video Title - MÀU DỄ ĐỌC */}
                      <h3 className="font-fredoka text-lg text-lavender-50 mb-3 text-center line-clamp-2 min-h-[3rem] flex items-center justify-center">
                        {video.title}
                      </h3>
                      
                      {/* Video Container - SẠCH SẼ */}
                      <div className="relative rounded-lg overflow-hidden bg-dark-lighter flex-grow">
                        <div className="aspect-video relative">
                          {/* Video Frame - KHÔNG CÓ YOUTUBE BRANDING */}
                          <iframe
                            src={formatYouTubeUrl(video.url)}
                            title={video.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full absolute inset-0"
                            style={{ border: 'none' }}
                            loading="lazy"
                            frameBorder="0"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Floating Emoji - GIỮ LẠI NHƯNG TINH TẾ */}
                    <motion.div
                      animate={{ 
                        y: [-3, 3, -3],
                        rotate: [-8, 8, -8]
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="absolute -top-2 -right-2 text-2xl opacity-70"
                    >
                      {['🎬', '📹', '🎥'][index % 3]}
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 glass rounded-xl">
              <div className="text-6xl mb-6 opacity-50">🎥</div>
              <h3 className="font-fredoka text-2xl text-lavender-100 mb-4">
                Chưa có video nào
              </h3>
              <p className="font-nunito text-lg text-mint-100">
                Quản trị viên sẽ thêm video sớm nhất!
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default MemoriesPage
