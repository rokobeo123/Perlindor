import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useData } from '../contexts/DataContext'
import { 
  Heart, MessageCircle, Plus, X, Upload, Loader, 
  Check, AlertCircle, Image, Copy
} from 'lucide-react' 
import { adminUploadImage, validateImageFile } from '../services/adminUpload' 

const MomentsWallPage = () => {
  const { data, addItem, updateItem } = useData()
  const [showAddForm, setShowAddForm] = useState(false)
  const [newMoment, setNewMoment] = useState({ 
    image: '', 
    caption: '', 
    sticker: '💜' 
  })
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadResult, setUploadResult] = useState(null)
  const [copySuccess, setCopySuccess] = useState(false)
  const [uploadError, setUploadError] = useState(null)

  const stickers = ['💜', '⭐', '✨', '🌙', '💫', '🦋', '🌸', '🎀', '💖', '☁️']

  // --- LOGIC UPLOAD ẢNH GIỐNG ADMIN PANEL ---
  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const validation = validateImageFile(file)
    if (!validation.valid) {
      alert(validation.error)
      return
    }

    setUploading(true)
    setUploadProgress(0)
    setUploadResult(null)
    setUploadError(null)

    // Hiệu ứng progress bar giả
    const fakeProgress = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(fakeProgress)
          return 90
        }
        return prev + 10
      })
    }, 300)

    try {
      const result = await adminUploadImage(file)
      
      clearInterval(fakeProgress)
      setUploadProgress(100)
      
      if (result.success) {
        setNewMoment(prev => ({
          ...prev,
          image: result.url
        }))
        
        setUploadResult({
          url: result.url,
          thumbnail: result.thumb || result.url,
          size: result.size,
          isTemporary: result.isTemporary || false
        })
        
        if (navigator.clipboard) {
          navigator.clipboard.writeText(result.url)
          setCopySuccess(true)
          setTimeout(() => setCopySuccess(false), 3000)
        }
        
      } else {
        throw new Error('Upload không thành công')
      }
      
    } catch (error) {
      console.error('Upload failed:', error)
      setUploadError('Upload thất bại: ' + error.message)
      
      // Tạo URL tạm thời nếu upload fail
      const blobUrl = URL.createObjectURL(file)
      setNewMoment(prev => ({
        ...prev,
        image: blobUrl
      }))
      setUploadResult({
        url: blobUrl,
        isTemporary: true
      })
    } finally {
      setUploading(false)
      setTimeout(() => setUploadProgress(0), 1000)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (uploading) {
      alert('Vui lòng đợi ảnh upload xong!')
      return
    }
    
    if (newMoment.image && newMoment.caption) {
      addItem('momentsWall', {
        ...newMoment,
        likes: 0,
        comments: []
      })
      
      // Reset form
      setNewMoment({ 
        image: '', 
        caption: '', 
        sticker: '💜' 
      })
      setUploadResult(null)
      setUploadError(null)
      setCopySuccess(false)
      setShowAddForm(false)
      alert('✅ Moment đã được thêm thành công! ✨')
    } else {
      alert('❌ Vui lòng upload ảnh và điền chú thích!')
    }
  }

  const handleLike = (id) => {
    const moment = data.momentsWall.find(m => m.id === id)
    if (moment) {
      updateItem('momentsWall', id, { likes: moment.likes + 1 })
    }
  }

  const resetForm = () => {
    setNewMoment({ image: '', caption: '', sticker: '💜' })
    setUploadResult(null)
    setUploadError(null)
    setUploadProgress(0)
    setCopySuccess(false)
  }

  return (
    <div className="min-h-screen pt-24 px-4 pb-20 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-baloo text-6xl font-bold text-lavender neon-text mb-4">
            📌 Moments Wall
          </h1>
          <p className="font-pacifico text-2xl text-mint">Our daily magic captured</p>
        </motion.div>

        {/* Add Moment Button */}
        <div className="flex justify-center mb-12">
          <motion.button
            onClick={() => {
              setShowAddForm(!showAddForm)
              if (showAddForm) {
                resetForm()
              }
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass px-8 py-4 rounded-full font-fredoka font-bold text-xl text-lavender border-2 border-lavender hover:bg-lavender hover:text-midnight transition-all duration-300 flex items-center gap-3 relative z-20"
          >
            {showAddForm ? <X size={24} /> : <Plus size={24} />}
            {showAddForm ? 'Đóng form' : 'Thêm khoảnh khắc mới'}
          </motion.button>
        </div>

        {/* Add Form with glass effect */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-3xl p-8 mb-12 blur-shadow relative z-20"
          >
            <h2 className="font-fredoka text-3xl text-lavender mb-6 text-center">
              ✨ Thêm khoảnh khắc mới
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* PHẦN UPLOAD ẢNH - GIỐNG ADMIN PANEL */}
              <div>
                <label className="block font-nunito font-semibold text-mint mb-2">
                  Ảnh khoảnh khắc *
                </label>
                
                {/* Upload Button */}
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                    id="moment-image-upload"
                  />
                  
                  <label
                    htmlFor="moment-image-upload"
                    className={`
                      flex items-center justify-center gap-3 w-full px-6 py-4 rounded-xl 
                      border-2 border-dashed cursor-pointer transition-all duration-300
                      ${uploading 
                        ? 'border-lavender bg-lavender/10 text-lavender' 
                        : 'border-lavender/40 hover:border-lavender hover:bg-lavender/5 text-lavender'
                      }
                    `}
                  >
                    {uploading ? (
                      <>
                        <Loader className="animate-spin" size={24} />
                        <span className="font-nunito">
                          Đang upload... {uploadProgress}%
                        </span>
                      </>
                    ) : (
                      <>
                        <Upload size={24} />
                        <span className="font-nunito">
                          {newMoment.image ? 'Chọn ảnh khác' : 'Chọn ảnh khoảnh khắc'}
                        </span>
                      </>
                    )}
                  </label>
                  
                  {/* Progress Bar */}
                  {uploading && (
                    <div className="mt-3">
                      <div className="h-2 bg-lavender/20 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-lavender to-pink"
                          initial={{ width: '0%' }}
                          animate={{ width: `${uploadProgress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Upload Result */}
                {uploadResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 rounded-lg bg-gradient-to-r from-lavender/10 to-pink/10 border border-lavender/20"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Check className="text-mint" size={20} />
                          <span className="font-nunito font-bold text-mint">
                            {uploadResult.isTemporary ? 'Ảnh tạm thời' : 'Upload thành công!'}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            uploadResult.isTemporary 
                              ? 'bg-amber-500/20 text-amber-300' 
                              : 'bg-mint/20 text-mint'
                          }`}>
                            {uploadResult.isTemporary ? 'Chỉ hiển thị trên máy này' : 'Mọi người đều xem được'}
                          </span>
                        </div>
                        
                        {/* URL Display */}
                        <div className="mb-3">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              readOnly
                              value={uploadResult.url}
                              className="flex-1 px-3 py-2 rounded bg-dark/60 text-lavender text-sm truncate border border-lavender/20"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(uploadResult.url)
                                setCopySuccess(true)
                                setTimeout(() => setCopySuccess(false), 2000)
                              }}
                              className="px-3 py-2 rounded-lg bg-lavender/20 hover:bg-lavender/30 text-lavender font-nunito text-sm flex items-center gap-1 transition-colors"
                            >
                              <Copy size={14} />
                              Copy
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Thumbnail Preview */}
                      {uploadResult.thumbnail && (
                        <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-lavender/30">
                          <img
                            src={uploadResult.thumbnail}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
                
                {/* Manual URL Input */}
                <div className="mt-4">
                  <p className="font-nunito text-sm text-mint mb-2">Hoặc nhập URL ảnh:</p>
                  <input
                    type="url"
                    value={newMoment.image}
                    onChange={(e) => setNewMoment({...newMoment, image: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 rounded-lg border-2 border-lavender/30 focus:border-lavender bg-dark-lighter/80 text-lavender font-nunito outline-none placeholder:text-lavender/40 transition-all duration-300"
                  />
                </div>
                
                {uploadError && (
                  <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    <p className="font-nunito text-sm text-red-300 flex items-center gap-2">
                      <AlertCircle size={16} />
                      {uploadError}
                    </p>
                  </div>
                )}
              </div>
              
              {/* PHẦN CHÚ THÍCH (CAPTION) */}
              <div>
                <label className="block font-nunito font-semibold text-mint mb-2">
                  Chú thích *
                </label>
                <input
                  type="text"
                  placeholder="Điều gì đặc biệt trong khoảnh khắc này? 💜"
                  value={newMoment.caption}
                  onChange={(e) => setNewMoment({ ...newMoment, caption: e.target.value })}
                  className="w-full px-6 py-4 rounded-lg glass border-2 border-lavender/30 focus:border-lavender bg-dark-lighter/80 text-lavender font-nunito text-lg outline-none"
                  required
                />
              </div>
              
              {/* PHẦN CHỌN STICKER */}
              <div>
                <label className="block font-nunito font-semibold text-mint mb-2">Chọn sticker:</label>
                <div className="flex gap-3 flex-wrap justify-center">
                  {stickers.map(sticker => (
                    <button
                      key={sticker}
                      type="button"
                      onClick={() => setNewMoment({ ...newMoment, sticker })}
                      className={`text-4xl p-3 rounded-lg transition-all duration-200 ${
                        newMoment.sticker === sticker  
                          ? 'bg-lavender/30 transform scale-110 border-2 border-lavender'  
                          : 'hover:bg-lavender/10 border-2 border-transparent'
                      }`}
                    >
                      {sticker}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Submit Buttons - ĐÃ SỬA MÀU CHỮ */}
<div className="flex gap-3 pt-4">
  <motion.button
    type="submit"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    disabled={uploading || !newMoment.image} 
    className={`flex-1 bg-gradient-to-r from-lavender to-pink text-white font-fredoka font-bold text-xl py-4 rounded-full shadow-lg shadow-lavender/20 transition-all duration-300 hover:shadow-xl hover:shadow-lavender/30 ${
      (uploading || !newMoment.image) ? 'opacity-50 cursor-not-allowed' : ''
    }`}
  >
    {uploading ? (
      <>
        <Loader className="animate-spin inline mr-2" size={20} />
        Đang upload...
      </>
    ) : (
      'Đăng khoảnh khắc ✨'
    )}
  </motion.button>
  
  <motion.button
    type="button"
    onClick={resetForm}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    disabled={uploading}
    className="px-8 border-2 border-lavender/40 bg-lavender/10 text-lavender font-nunito font-bold py-4 rounded-full flex items-center gap-2 hover:bg-lavender/20 transition-all duration-300"
  >
    <X size={20} />
    Hủy
  </motion.button>
</div>
            </form>
            
            {/* Preview */}
            {newMoment.image && (
              <div className="mt-8 pt-8 border-t border-lavender/20">
                <h3 className="font-nunito text-lavender mb-4 text-center font-bold">Preview:</h3>
                <div className="glass rounded-2xl p-4 max-w-xs mx-auto">
                  <div className="relative h-48 overflow-hidden rounded-lg mb-4">
                    <img
                      src={newMoment.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 text-4xl">
                      {newMoment.sticker}
                    </div>
                  </div>
                  <p className="font-nunito text-lavender text-center">
                    {newMoment.caption || 'Your caption will appear here'}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Moments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.momentsWall && data.momentsWall.length > 0 ? (
            data.momentsWall.slice().reverse().map((moment, index) => ( 
              <motion.div
                key={moment.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass rounded-3xl overflow-hidden blur-shadow group relative z-10"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={moment.image}
                    alt={moment.caption}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-lavender/20 via-pink/20 to-mint/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Floating sticker */}
                  <motion.div
                    animate={{ rotate: [-5, 5, -5], scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute top-4 right-4 text-5xl filter drop-shadow-lg"
                  >
                    {moment.sticker}
                  </motion.div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="font-nunito text-lg text-lavender mb-4">
                    {moment.caption}
                  </p>
                  <div className="flex items-center justify-between">
                    <motion.button
                      onClick={() => handleLike(moment.id)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      className="flex items-center gap-2 text-pink"
                    >
                      <Heart size={24} fill="currentColor" />
                      <span className="font-nunito font-bold">{moment.likes}</span>
                    </motion.button>
                    <div className="flex items-center gap-2 text-mint">
                      <MessageCircle size={24} />
                      <span className="font-nunito font-bold">{moment.comments?.length || 0}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="md:col-span-2 lg:col-span-3 glass rounded-3xl p-12 text-center"
            >
              <div className="text-8xl mb-6">📌</div>
              <h3 className="font-fredoka text-3xl text-lavender mb-4">
                Chưa có khoảnh khắc nào
              </h3>
              <p className="font-nunito text-lg text-mint mb-6">
                Hãy là người đầu tiên chia sẻ khoảnh khắc đặc biệt!
              </p>
              <motion.button
                onClick={() => setShowAddForm(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass px-8 py-3 rounded-full text-lavender font-nunito font-bold border-2 border-lavender hover:bg-lavender hover:text-dark transition-all duration-300"
              >
                Tạo khoảnh khắc đầu tiên
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MomentsWallPage
