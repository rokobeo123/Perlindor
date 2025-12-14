import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useData } from '../contexts/DataContext'
import { Heart, MessageCircle, Send, MoreVertical, Trash2, Edit, X, Check } from 'lucide-react'

const GuestbookPage = () => {
  const { data, addItem, updateItem, deleteItem } = useData()
  const [newEntry, setNewEntry] = useState({ name: '', message: '' })
  const [userName, setUserName] = useState('')
  const [showNameInput, setShowNameInput] = useState(false)
  const [editingEntry, setEditingEntry] = useState(null)
  const [editText, setEditText] = useState('')

  // Load tên người dùng từ localStorage khi component mount
  useEffect(() => {
    const savedName = localStorage.getItem('guestbook_username')
    if (savedName) {
      setUserName(savedName)
      setNewEntry(prev => ({ ...prev, name: savedName }))
    } else {
      setShowNameInput(true)
    }
  }, [])

  // Lưu tên vào localStorage khi thay đổi
  useEffect(() => {
    if (userName.trim()) {
      localStorage.setItem('guestbook_username', userName.trim())
      setNewEntry(prev => ({ ...prev, name: userName.trim() }))
    }
  }, [userName])

  // Lấy userId từ localStorage hoặc tạo mới
  const getUserId = () => {
    let userId = localStorage.getItem('guestbook_userId')
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substr(2, 9)
      localStorage.setItem('guestbook_userId', userId)
    }
    return userId
  }

  // Lấy danh sách entry đã like từ localStorage
  const getLikedEntries = () => {
    try {
      const liked = localStorage.getItem('guestbook_liked')
      return liked ? JSON.parse(liked) : []
    } catch (error) {
      console.error('Error parsing liked entries:', error)
      return []
    }
  }

  // Kiểm tra entry đã like chưa
  const isEntryLiked = (entryId) => {
    const likedEntries = getLikedEntries()
    return likedEntries.includes(entryId)
  }

  // Kiểm tra xem entry có phải của người dùng hiện tại không
  const isOwnEntry = (entry) => {
    const userId = getUserId()
    return entry.userId === userId
  }

  // Xử lý like/unlike
  const handleLike = (entryId) => {
    if (!userName) {
      setShowNameInput(true)
      alert('Vui lòng nhập tên trước khi thích tin nhắn!')
      return
    }
    
    const likedEntries = getLikedEntries()
    const alreadyLiked = likedEntries.includes(entryId)
    const entry = data.guestbook.find(e => e.id === entryId)
    
    if (!entry) return
    
    // Đảm bảo entry.likes là số
    const currentLikes = typeof entry.likes === 'number' ? entry.likes : 0
    
    if (alreadyLiked) {
      // BỎ LIKE (unlike)
      const updatedLikedEntries = likedEntries.filter(id => id !== entryId)
      localStorage.setItem('guestbook_liked', JSON.stringify(updatedLikedEntries))
      
      updateItem('guestbook', entryId, { 
        likes: Math.max(0, currentLikes - 1)
      })
    } else {
      // THÊM LIKE
      likedEntries.push(entryId)
      localStorage.setItem('guestbook_liked', JSON.stringify(likedEntries))
      
      updateItem('guestbook', entryId, { 
        likes: currentLikes + 1
      })
    }
  }

  // Xử lý xóa entry
  const handleDeleteEntry = (entryId) => {
    const entry = data.guestbook.find(e => e.id === entryId)
    if (!entry) return
    
    if (!isOwnEntry(entry)) {
      alert('Bạn chỉ có thể xóa bài viết của chính mình!')
      return
    }
    
    if (window.confirm('Bạn có chắc chắn muốn xóa tin nhắn này?')) {
      deleteItem('guestbook', entryId)
    }
  }

  // Xử lý bắt đầu chỉnh sửa
  const handleStartEdit = (entry) => {
    if (!isOwnEntry(entry)) {
      alert('Bạn chỉ có thể chỉnh sửa bài viết của chính mình!')
      return
    }
    
    setEditingEntry(entry.id)
    setEditText(entry.message)
  }

  // Xử lý lưu chỉnh sửa
  const handleSaveEdit = (entryId) => {
    if (editText.trim()) {
      updateItem('guestbook', entryId, { 
        message: editText.trim(),
        updatedAt: new Date().toISOString()
      })
      setEditingEntry(null)
      setEditText('')
    }
  }

  // Hủy chỉnh sửa
  const handleCancelEdit = () => {
    setEditingEntry(null)
    setEditText('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!userName) {
      setShowNameInput(true)
      alert('Vui lòng nhập tên trước khi gửi tin nhắn!')
      return
    }
    
    if (newEntry.message.trim()) {
      addItem('guestbook', {
        name: userName,
        message: newEntry.message.trim(),
        date: new Date().toISOString().split('T')[0],
        likes: 0,
        createdAt: new Date().toISOString(),
        userId: getUserId() // Lưu userId để xác định chủ sở hữu
      })
      setNewEntry(prev => ({ ...prev, message: '' }))
    } else {
      alert('Vui lòng nhập nội dung tin nhắn!')
    }
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
  const safeLikes = (entry) => {
    const likes = entry?.likes
    if (typeof likes === 'number') {
      return likes
    }
    if (typeof likes === 'string') {
      const parsed = parseInt(likes, 10)
      return isNaN(parsed) ? 0 : parsed
    }
    return 0
  }

  return (
    <div className="min-h-screen pt-24 px-4 pb-20">
      {/* Modal nhập tên */}
      <AnimatePresence>
        {showNameInput && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
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
                  Nhập tên của bạn để tham gia vào guestbook
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

      <div className="max-w-4xl mx-auto">
        {/* Header với tên người dùng */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-baloo text-6xl font-bold text-lavender neon-text mb-4">
            ✍️ Guestbook
          </h1>
          <div className="flex items-center justify-center gap-4 mb-2">
            <p className="font-pacifico text-2xl text-mint">Leave your mark on our journey</p>
            {userName && (
              <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-lavender/20">
                <div className="w-6 h-6 rounded-full bg-lavender/30 flex items-center justify-center">
                  {userName.charAt(0).toUpperCase()}
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

        {/* New Entry Form với glass effect */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="glass rounded-3xl p-8 mb-12 blur-shadow"
        >
          <div className="space-y-4">
            {/* Tên đã được lưu tự động */}
            <div className="flex items-center justify-between mb-2">
              <label className="font-nunito text-mint font-bold">Tên của bạn:</label>
              {!userName && (
                <button
                  type="button"
                  onClick={() => setShowNameInput(true)}
                  className="text-sm text-amber-300 hover:text-amber-200 underline"
                >
                  Nhập tên
                </button>
              )}
            </div>
            
            <div className={`px-6 py-4 rounded-full border-2 ${
              userName 
                ? 'border-lavender/30 text-lavender' 
                : 'border-amber-400/30 text-amber-400'
            } bg-transparent font-nunito text-lg`}>
              {userName ? userName : 'Vui lòng nhập tên của bạn...'}
            </div>

            <textarea
              placeholder="Your Message 💜 (Tin nhắn của bạn...)"
              value={newEntry.message}
              onChange={(e) => setNewEntry({ ...newEntry, message: e.target.value })}
              rows="4"
              className="w-full px-6 py-4 rounded-3xl glass border-2 border-lavender/30 focus:border-lavender bg-transparent text-lavender font-nunito text-lg outline-none resize-none transition-all duration-300"
              required
            />
            
            <motion.button
              type="submit"
              disabled={!userName}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`w-full font-fredoka font-bold text-xl py-4 rounded-full flex items-center justify-center gap-3 ${
                userName 
                  ? 'bg-gradient-to-r from-lavender to-pink text-white shadow-lg shadow-lavender/50' 
                  : 'bg-gray-500 text-gray-300 cursor-not-allowed'
              }`}
            >
              <Send size={24} />
              Send Message
            </motion.button>
          </div>
        </motion.form>

        {/* Entries với floating stickers và blur effects */}
        <div className="space-y-6">
          {data.guestbook && data.guestbook.length > 0 ? (
            data.guestbook.slice().reverse().map((entry, index) => {
              const isLiked = isEntryLiked(entry.id)
              const likesCount = safeLikes(entry)
              const isOwn = isOwnEntry(entry)
              const isEditing = editingEntry === entry.id
              
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-3xl p-6 relative overflow-hidden group blur-shadow"
                >
                  {/* Aurora glow background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-lavender/10 via-pink/10 to-mint/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-pacifico text-2xl text-lavender">{entry.name}</h3>
                          {isOwn && (
                            <span className="text-xs px-2 py-1 rounded-full bg-lavender/20 text-lavender">
                              Bạn
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-1">
                          <p className="font-nunito text-sm text-mint">{entry.date}</p>
                          {entry.createdAt && (
                            <span className="font-nunito text-xs text-lavender/60">
                              {formatTimeAgo(entry.createdAt)}
                            </span>
                          )}
                          {entry.updatedAt && (
                            <span className="font-nunito text-xs text-amber-400">
                              (Đã chỉnh sửa)
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {/* Like button */}
                        <motion.button
                          onClick={() => handleLike(entry.id)}
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

                        {/* Action buttons for own entries */}
                        {isOwn && (
                          <div className="flex items-center gap-1 ml-2">
                            {isEditing ? (
                              <>
                                <motion.button
                                  onClick={() => handleSaveEdit(entry.id)}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="p-1 rounded-full bg-green-500/20 text-green-400 hover:bg-green-500/30"
                                  title="Lưu"
                                >
                                  <Check size={16} />
                                </motion.button>
                                <motion.button
                                  onClick={handleCancelEdit}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="p-1 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30"
                                  title="Hủy"
                                >
                                  <X size={16} />
                                </motion.button>
                              </>
                            ) : (
                              <>
                                <motion.button
                                  onClick={() => handleStartEdit(entry)}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="p-1 rounded-full bg-lavender/20 text-lavender hover:bg-lavender/30 opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Chỉnh sửa"
                                >
                                  <Edit size={16} />
                                </motion.button>
                                <motion.button
                                  onClick={() => handleDeleteEntry(entry.id)}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="p-1 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Xóa"
                                >
                                  <Trash2 size={16} />
                                </motion.button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Message content - editable if editing */}
                    {isEditing ? (
                      <div className="space-y-3">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          rows="3"
                          className="w-full px-4 py-3 rounded-xl border-2 border-lavender/50 bg-dark/50 text-lavender font-nunito outline-none resize-none"
                          autoFocus
                        />
                        <p className="text-xs text-amber-300">
                          Chỉnh sửa tin nhắn của bạn...
                        </p>
                      </div>
                    ) : (
                      <p className="font-nunito text-lg text-mint leading-relaxed whitespace-pre-wrap">
                        {entry.message}
                      </p>
                    )}
                  </div>

                  {/* Floating sticker */}
                  <motion.div
                    animate={{ y: [-5, 5, -5], rotate: [-10, 10, -10] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute bottom-4 right-4 text-3xl opacity-50 pointer-events-none"
                  >
                    {['💜', '⭐', '✨', '🌙'][index % 4]}
                  </motion.div>
                </motion.div>
              )
            })
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass rounded-3xl p-12 text-center"
            >
              <div className="text-8xl mb-6">📝</div>
              <h3 className="font-fredoka text-3xl text-lavender mb-4">
                Chưa có tin nhắn nào
              </h3>
              <p className="font-nunito text-lg text-mint mb-6">
                Hãy là người đầu tiên để lại lời nhắn!
              </p>
              <motion.button
                onClick={() => {
                  if (!userName) {
                    setShowNameInput(true)
                    alert('Vui lòng nhập tên trước khi gửi tin nhắn!')
                    return
                  }
                  document.querySelector('textarea')?.focus()
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass px-8 py-3 rounded-full text-lavender font-nunito font-bold border-2 border-lavender hover:bg-lavender hover:text-dark transition-all duration-300"
              >
                Viết tin nhắn đầu tiên
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default GuestbookPage
