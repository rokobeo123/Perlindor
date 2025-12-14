import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useData } from '../contexts/DataContext'
import { 
  Heart, MessageCircle, Plus, X, Upload, Loader, 
  Check, AlertCircle, Image, Copy, Send, User,
  ChevronLeft, ChevronRight, MoreVertical, Trash2
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
  
  // Thêm state cho modal xem bài viết
  const [selectedMoment, setSelectedMoment] = useState(null)
  const [newComment, setNewComment] = useState('')
  const [isCommenting, setIsCommenting] = useState(false)
  const [userName, setUserName] = useState('')
  const [showNameInput, setShowNameInput] = useState(false)
  const commentsEndRef = useRef(null)

  const stickers = ['💜', '⭐', '✨', '🌙', '💫', '🦋', '🌸', '🎀', '💖', '☁️']

  // Load tên người dùng từ localStorage khi component mount
  useEffect(() => {
    const savedName = localStorage.getItem('momentsWall_username')
    if (savedName) {
      setUserName(savedName)
    } else {
      setShowNameInput(true)
    }
  }, [])

  // Lưu tên vào localStorage khi thay đổi
  useEffect(() => {
    if (userName.trim()) {
      localStorage.setItem('momentsWall_username', userName.trim())
    }
  }, [userName])

  // Lấy danh sách bài đã like từ localStorage
  const getLikedMoments = () => {
    try {
      const liked = localStorage.getItem('momentsWall_liked')
      return liked ? JSON.parse(liked) : []
    } catch (error) {
      console.error('Error parsing liked moments:', error)
      return []
    }
  }

  // Kiểm tra bài đã like chưa
  const isMomentLiked = (momentId) => {
    const likedMoments = getLikedMoments()
    return likedMoments.includes(momentId)
  }

  // Lấy số lượt like từ localStorage cho một moment cụ thể
  const getLikeCount = (momentId) => {
    try {
      const likedMoments = getLikedMoments()
      // Đếm số lượt like từ tất cả người dùng (trong thực tế cần backend)
      // Tạm thời chỉ tính like của current user
      return likedMoments.includes(momentId) ? 1 : 0
    } catch (error) {
      console.error('Error getting like count:', error)
      return 0
    }
  }

  // Scroll to bottom khi có comment mới
  useEffect(() => {
    if (selectedMoment && commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [selectedMoment?.comments?.length])

  // Upload ảnh
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
    
    if (!userName) {
      setShowNameInput(true)
      alert('Vui lòng nhập tên trước khi đăng bài!')
      return
    }
    
    if (newMoment.image && newMoment.caption) {
      addItem('momentsWall', {
        ...newMoment,
        likes: 0, // Khởi tạo với 0 like
        comments: [],
        createdAt: new Date().toISOString(),
        author: userName
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

  // Xử lý like/unlike với localStorage
  const handleLike = (momentId, e) => {
    e?.stopPropagation()
    
    if (!userName) {
      setShowNameInput(true)
      alert('Vui lòng nhập tên trước khi thích bài viết!')
      return
    }
    
    const likedMoments = getLikedMoments()
    const alreadyLiked = likedMoments.includes(momentId)
    const moment = data.momentsWall.find(m => m.id === momentId)
    
    if (!moment) return
    
    // Đảm bảo moment.likes là số
    const currentLikes = typeof moment.likes === 'number' ? moment.likes : 0
    
    if (alreadyLiked) {
      // BỎ LIKE (unlike)
      const updatedLikedMoments = likedMoments.filter(id => id !== momentId)
      localStorage.setItem('momentsWall_liked', JSON.stringify(updatedLikedMoments))
      
      // Cập nhật trong database
      updateItem('momentsWall', momentId, { 
        likes: Math.max(0, currentLikes - 1)
      })
      
      // Cập nhật selectedMoment nếu đang xem
      if (selectedMoment && selectedMoment.id === momentId) {
        setSelectedMoment(prev => ({
          ...prev,
          likes: Math.max(0, (prev.likes || 0) - 1)
        }))
      }
      
    } else {
      // THÊM LIKE
      likedMoments.push(momentId)
      localStorage.setItem('momentsWall_liked', JSON.stringify(likedMoments))
      
      // Cập nhật trong database
      updateItem('momentsWall', momentId, { 
        likes: currentLikes + 1
      })
      
      // Nếu đang xem modal, cập nhật selectedMoment
      if (selectedMoment && selectedMoment.id === momentId) {
        setSelectedMoment(prev => ({
          ...prev,
          likes: (prev.likes || 0) + 1
        }))
      }
    }
  }

  // Thêm comment
  const handleAddComment = async (momentId) => {
    if (!newComment.trim()) return
    
    if (!userName.trim()) {
      setShowNameInput(true)
      alert('Vui lòng nhập tên trước khi bình luận!')
      return
    }
    
    setIsCommenting(true)
    
    // Tạo comment mới
    const comment = {
      id: Date.now().toString(),
      text: newComment,
      author: userName,
      avatar: getAvatarFromName(userName),
      createdAt: new Date().toISOString(),
      userId: localStorage.getItem('momentsWall_userId') || generateUserId()
    }
    
    const moment = data.momentsWall.find(m => m.id === momentId)
    if (moment) {
      const updatedComments = [...(moment.comments || []), comment]
      updateItem('momentsWall', momentId, { comments: updatedComments })
      
      // Cập nhật selectedMoment
      if (selectedMoment && selectedMoment.id === momentId) {
        setSelectedMoment(prev => ({
          ...prev,
          comments: updatedComments
        }))
      }
    }
    
    setNewComment('')
    setIsCommenting(false)
  }

  // Xóa comment
  const handleDeleteComment = (momentId, commentId) => {
    const moment = data.momentsWall.find(m => m.id === momentId)
    if (!moment) return
    
    const commentToDelete = moment.comments?.find(c => c.id === commentId)
    if (!commentToDelete) return
    
    // Chỉ cho phép xóa comment của chính mình
    const userId = localStorage.getItem('momentsWall_userId')
    if (commentToDelete.userId !== userId) {
      alert('Bạn chỉ có thể xóa comment của chính mình!')
      return
    }
    
    if (window.confirm('Bạn có chắc chắn muốn xóa comment này?')) {
      const updatedComments = moment.comments?.filter(c => c.id !== commentId) || []
      updateItem('momentsWall', momentId, { comments: updatedComments })
      
      // Cập nhật selectedMoment
      if (selectedMoment && selectedMoment.id === momentId) {
        setSelectedMoment(prev => ({
          ...prev,
          comments: updatedComments
        }))
      }
    }
  }

  // Tạo avatar từ tên
  const getAvatarFromName = (name) => {
    const avatars = ['👤', '👨‍💻', '👩‍🎨', '🧑‍🎤', '🧑‍🚀', '👨‍🍳', '👩‍🌾', '🧑‍🔬']
    if (!name) return avatars[0]
    
    // Dùng ký tự đầu để chọn avatar
    const firstChar = name.charCodeAt(0)
    return avatars[firstChar % avatars.length]
  }

  // Tạo userId ngẫu nhiên
  const generateUserId = () => {
    const userId = 'user_' + Math.random().toString(36).substr(2, 9)
    localStorage.setItem('momentsWall_userId', userId)
    return userId
  }

  // Mở modal xem bài viết
  const openMomentModal = (moment) => {
    setSelectedMoment(moment)
    document.body.style.overflow = 'hidden'
  }

  // Đóng modal
  const closeMomentModal = () => {
    setSelectedMoment(null)
    document.body.style.overflow = 'auto'
  }

  // Format thời gian
  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Vừa xong'
    
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffMs = now - date
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMs / 3600000)
      const diffDays = Math.floor(diffMs / 86400000)
      
      if (diffMins < 1) return 'Vừa xong'
      if (diffMins < 60) return `${diffMins} phút trước`
      if (diffHours < 24) return `${diffHours} giờ trước`
      if (diffDays < 7) return `${diffDays} ngày trước`
      return date.toLocaleDateString('vi-VN')
    } catch (error) {
      return 'Vừa xong'
    }
  }

  // Đảm bảo likes luôn là số
  const safeLikes = (moment) => {
    const likes = moment?.likes
    if (typeof likes === 'number') {
      return likes
    }
    if (typeof likes === 'string') {
      const parsed = parseInt(likes, 10)
      return isNaN(parsed) ? 0 : parsed
    }
    return 0
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
      {/* Modal nhập tên */}
      <AnimatePresence>
        {showNameInput && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {}}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative glass rounded-2xl p-8 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="font-fredoka text-2xl text-lavender mb-4 text-center">
                  👋 Chào bạn!
                </h3>
                <p className="font-nunito text-mint mb-6 text-center">
                  Nhập tên của bạn để tham gia bình luận và thả tim
                </p>
                
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Tên của bạn..."
                  className="w-full px-4 py-3 rounded-lg border-2 border-lavender/30 bg-dark/50 text-lavender font-nunito mb-4 outline-none"
                  autoFocus
                />
                
                <button
                  onClick={() => {
                    if (userName.trim()) {
                      setShowNameInput(false)
                    }
                  }}
                  className="w-full bg-gradient-to-r from-lavender to-pink text-white font-fredoka py-3 rounded-full"
                >
                  Bắt đầu
                </button>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto">
        {/* Header với tên người dùng */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-baloo text-6xl font-bold text-lavender neon-text mb-4">
            📌 Moments Wall
          </h1>
          <div className="flex items-center justify-center gap-4 mb-2">
            <p className="font-pacifico text-2xl text-mint">Our daily magic captured</p>
            {userName && (
              <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-lavender/20">
                <div className="w-6 h-6 rounded-full bg-lavender/30 flex items-center justify-center">
                  {getAvatarFromName(userName)}
                </div>
                <span className="font-nunito text-lavender">{userName}</span>
                <button
                  onClick={() => setShowNameInput(true)}
                  className="text-lavender/60 hover:text-lavender"
                  title="Đổi tên"
                >
                  <MoreVertical size={16} />
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Add Moment Button */}
        <div className="flex justify-center mb-12">
          <motion.button
            onClick={() => {
              if (!userName) {
                setShowNameInput(true)
                alert('Vui lòng nhập tên trước khi đăng bài!')
                return
              }
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

        {/* Add Form với glass effect */}
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
              
              {/* PHẦN UPLOAD ẢNH */}
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
              
              {/* Submit Buttons */}
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
            data.momentsWall.slice().reverse().map((moment, index) => { 
              const isLiked = isMomentLiked(moment.id)
              const likesCount = safeLikes(moment) // Sử dụng hàm safeLikes để tránh NaN
              
              return (
                <motion.div
                  key={moment.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="glass rounded-3xl overflow-hidden blur-shadow group relative z-10 cursor-pointer"
                  onClick={() => openMomentModal(moment)}
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
                    <div className="absolute top-4 right-4 text-5xl filter drop-shadow-lg pointer-events-none">
                      {moment.sticker}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full bg-lavender/20 flex items-center justify-center">
                        {getAvatarFromName(moment.author)}
                      </div>
                      <span className="font-nunito text-sm text-lavender/80">
                        {moment.author}
                      </span>
                    </div>
                    
                    <p className="font-nunito text-lg text-lavender mb-4 line-clamp-2">
                      {moment.caption}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleLike(moment.id, e)
                          }}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          className={`flex items-center gap-2 transition-all duration-200 ${
                            isLiked 
                              ? 'text-pink transform scale-110' 
                              : 'text-pink/60 hover:text-pink hover:scale-105'
                          }`}
                          title={isLiked ? 'Bỏ thích' : 'Thích'}
                        >
                          <Heart 
                            size={24} 
                            fill={isLiked ? "currentColor" : "none"}
                            className={isLiked ? 'animate-pulse' : ''}
                          />
                          <span className="font-nunito font-bold">{likesCount}</span>
                        </motion.button>
                        <div className="flex items-center gap-2 text-mint cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation()
                            openMomentModal(moment)
                          }}
                        >
                          <MessageCircle size={24} />
                          <span className="font-nunito font-bold">{moment.comments?.length || 0}</span>
                        </div>
                      </div>
                      {moment.createdAt && (
                        <span className="font-nunito text-sm text-lavender/60">
                          {formatTimeAgo(moment.createdAt)}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })
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
                onClick={() => {
                  if (!userName) {
                    setShowNameInput(true)
                    alert('Vui lòng nhập tên trước khi đăng bài!')
                    return
                  }
                  setShowAddForm(true)
                }}
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

      {/* MODAL XEM BÀI VIẾT */}
      <AnimatePresence>
        {selectedMoment && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMomentModal}
              className="fixed inset-0 bg-black/90 backdrop-blur-md z-50"
            />

            {/* Modal Content */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", damping: 25 }}
                className="relative w-full max-w-6xl max-h-[90vh] bg-dark-lighter rounded-2xl overflow-hidden shadow-2xl pointer-events-auto flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={closeMomentModal}
                  className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/70 hover:bg-black/90 flex items-center justify-center transition-all duration-200"
                >
                  <X size={20} className="text-white" />
                </button>

                <div className="flex flex-col md:flex-row h-full">
                  {/* Left: Image */}
                  <div className="md:w-2/3 bg-black flex items-center justify-center p-4 relative">
                    <img
                      src={selectedMoment.image}
                      alt={selectedMoment.caption}
                      className="max-w-full max-h-[70vh] object-contain rounded-lg"
                    />
                    {/* Sticker trên ảnh */}
                    <div className="absolute top-8 right-8 text-6xl filter drop-shadow-lg pointer-events-none">
                      {selectedMoment.sticker}
                    </div>
                  </div>

                  {/* Right: Comments Section */}
                  <div className="md:w-1/3 flex flex-col border-l border-white/10">
                    {/* Header with caption and likes */}
                    <div className="p-6 border-b border-white/10">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-full bg-lavender/20 flex items-center justify-center text-2xl">
                          {getAvatarFromName(selectedMoment.author)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-nunito font-bold text-lavender">
                            {selectedMoment.author}
                          </h3>
                          <p className="font-nunito text-lavender mt-2">
                            {selectedMoment.caption}
                          </p>
                          {selectedMoment.createdAt && (
                            <span className="font-nunito text-xs text-lavender/60 mt-2 block">
                              {formatTimeAgo(selectedMoment.createdAt)}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Likes count */}
                      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10">
                        <div className="flex items-center gap-2 text-pink">
                          <Heart size={20} fill="currentColor" />
                          <span className="font-nunito font-bold">
                            {safeLikes(selectedMoment)} lượt thích
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-mint">
                          <MessageCircle size={20} />
                          <span className="font-nunito font-bold">
                            {selectedMoment.comments?.length || 0} bình luận
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Comments List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[300px]">
                      {selectedMoment.comments && selectedMoment.comments.length > 0 ? (
                        selectedMoment.comments.map((comment) => {
                          const isOwnComment = comment.userId === localStorage.getItem('momentsWall_userId')
                          
                          return (
                            <div key={comment.id} className="flex gap-3 group">
                              <div className="w-10 h-10 rounded-full bg-lavender/20 flex items-center justify-center text-xl flex-shrink-0">
                                {comment.avatar}
                              </div>
                              <div className="flex-1 relative">
                                <div className="bg-dark/50 rounded-2xl rounded-tl-none p-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <span className="font-nunito font-bold text-lavender text-sm">
                                        {comment.author}
                                      </span>
                                      <span className="font-nunito text-xs text-lavender/60">
                                        {formatTimeAgo(comment.createdAt)}
                                      </span>
                                    </div>
                                    {isOwnComment && (
                                      <button
                                        onClick={() => handleDeleteComment(selectedMoment.id, comment.id)}
                                        className="opacity-0 group-hover:opacity-100 text-lavender/60 hover:text-red-400 transition-opacity"
                                        title="Xóa comment"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    )}
                                  </div>
                                  <p className="font-nunito text-lavender mt-1">
                                    {comment.text}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )
                        })
                      ) : (
                        <div className="text-center py-8">
                          <MessageCircle size={48} className="mx-auto text-lavender/30 mb-4" />
                          <p className="font-nunito text-lavender/60">
                            Chưa có bình luận nào. Hãy là người đầu tiên!
                          </p>
                        </div>
                      )}
                      <div ref={commentsEndRef} />
                    </div>

                    {/* Action Buttons */}
                    <div className="p-4 border-t border-white/10">
                      <div className="flex gap-4 mb-4">
                        <motion.button
                          onClick={(e) => handleLike(selectedMoment.id, e)}
                          whileTap={{ scale: 0.95 }}
                          className={`flex items-center gap-2 transition-all duration-200 ${
                            isMomentLiked(selectedMoment.id) 
                              ? 'text-pink transform scale-105' 
                              : 'text-pink/60 hover:text-pink'
                          }`}
                          title={isMomentLiked(selectedMoment.id) ? 'Bỏ thích' : 'Thích'}
                        >
                          <Heart 
                            size={24} 
                            fill={isMomentLiked(selectedMoment.id) ? "currentColor" : "none"} 
                            className={isMomentLiked(selectedMoment.id) ? 'animate-pulse' : ''}
                          />
                          <span className="font-nunito font-bold">
                            {isMomentLiked(selectedMoment.id) ? 'Đã thích' : 'Thích'}
                          </span>
                        </motion.button>
                      </div>

                      {/* Comment Input */}
                      <div className="flex gap-2">
                        <div className="w-10 h-10 rounded-full bg-lavender/20 flex items-center justify-center text-xl flex-shrink-0">
                          {getAvatarFromName(userName)}
                        </div>
                        <div className="flex-1 flex gap-2">
                          <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Viết bình luận..."
                            className="flex-1 px-4 py-2 rounded-full bg-dark/50 border border-white/10 text-lavender font-nunito outline-none placeholder:text-lavender/40"
                            onKeyPress={(e) => e.key === 'Enter' && handleAddComment(selectedMoment.id)}
                          />
                          <motion.button
                            onClick={() => handleAddComment(selectedMoment.id)}
                            disabled={!newComment.trim() || isCommenting}
                            whileTap={{ scale: 0.95 }}
                            className={`px-4 rounded-full flex items-center gap-2 ${
                              newComment.trim()
                                ? 'bg-lavender text-dark'
                                : 'bg-lavender/30 text-lavender/50'
                            }`}
                          >
                            {isCommenting ? (
                              <Loader className="animate-spin" size={16} />
                            ) : (
                              <Send size={16} />
                            )}
                          </motion.button>
                        </div>
                      </div>
                      
                      {/* Thông báo nhập tên nếu chưa có */}
                      {!userName && (
                        <p className="text-center text-amber-300 text-sm mt-2">
                          <button 
                            onClick={() => setShowNameInput(true)}
                            className="underline"
                          >
                            Nhập tên
                          </button> để bình luận và thả tim
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MomentsWallPage
