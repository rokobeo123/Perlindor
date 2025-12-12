import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useData } from '../contexts/DataContext'
import { 
  Lock, Trash2, Edit, X, Plus, Save, Upload, 
  User, AlertCircle, Loader, Image, Check, Copy,
  Video, Link as LinkIcon, Settings, Palette, Eye, EyeOff,
  Type
} from 'lucide-react'
import { adminUploadImage, validateImageFile } from '../services/adminUpload'

const AdminPanel = () => {
  const { data, addItem, updateItem, deleteItem, updateSiteSettings } = useData()
  
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const saved = localStorage.getItem('adminLoggedIn')
    return saved === 'true'
  })
  
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState('members')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({})
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadResult, setUploadResult] = useState(null)
  const [copySuccess, setCopySuccess] = useState(false)

  // State cho upload logo trong siteSettings
  const [logoUploading, setLogoUploading] = useState(false)
  const [logoUploadProgress, setLogoUploadProgress] = useState(0)
  const [logoUploadResult, setLogoUploadResult] = useState(null)

  // LƯU TRẠNG THÁI ĐĂNG NHẬP
  useEffect(() => {
    localStorage.setItem('adminLoggedIn', isLoggedIn.toString())
  }, [isLoggedIn])

  // XÓA TRẠNG THÁI ĐĂNG NHẬP SAU 24H
  useEffect(() => {
    if (isLoggedIn) {
      const timeout = setTimeout(() => {
        setIsLoggedIn(false)
        localStorage.removeItem('adminLoggedIn')
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
      }, 24 * 60 * 60 * 1000)
      
      return () => clearTimeout(timeout)
    }
  }, [isLoggedIn])

  // ================== UPLOAD ẢNH ==================
  const handleImageUpload = async (e, fieldName = 'url') => {
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
        setFormData(prev => ({
          ...prev,
          [fieldName]: result.url
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
      
      const blobUrl = URL.createObjectURL(file)
      setFormData(prev => ({
        ...prev,
        [fieldName]: blobUrl
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

  // ================== UPLOAD LOGO ==================
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const validation = validateImageFile(file)
    if (!validation.valid) {
      alert(validation.error)
      return
    }

    setLogoUploading(true)
    setLogoUploadProgress(0)
    setLogoUploadResult(null)

    const fakeProgress = setInterval(() => {
      setLogoUploadProgress(prev => {
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
      setLogoUploadProgress(100)
      
      if (result.success) {
        setFormData(prev => ({
          ...prev,
          logoUrl: result.url
        }))
        
        setLogoUploadResult({
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
        throw new Error('Upload logo không thành công')
      }
      
    } catch (error) {
      console.error('Upload logo failed:', error)
      
      const blobUrl = URL.createObjectURL(file)
      setFormData(prev => ({
        ...prev,
        logoUrl: blobUrl
      }))
      setLogoUploadResult({
        url: blobUrl,
        isTemporary: true
      })
    } finally {
      setLogoUploading(false)
      setTimeout(() => setLogoUploadProgress(0), 1000)
    }
  }

  // ================== LOGIN ==================
  const handleLogin = (e) => {
    e.preventDefault()
    if (password === 'pld2025') {
      setIsLoggedIn(true)
      setPassword('')
      localStorage.setItem('adminLoginTime', Date.now().toString())
    } else {
      alert('Sai mật khẩu!')
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    localStorage.removeItem('adminLoggedIn')
    localStorage.removeItem('adminLoginTime')
  }

  // ================== START EDIT ==================
  const startEdit = (item) => {
    if (activeTab === 'siteSettings') {
      // Trường hợp chỉnh sửa cài đặt website
      setFormData(data.siteSettings || {})
      setShowAddForm(true)
      setEditingId(null)
      setLogoUploadResult(null)
    } else {
      // Trường hợp chỉnh sửa các mục khác
      setEditingId(item.id)
      setFormData(item)
      setShowAddForm(true)
    }
    setUploadResult(null)
  }

  // ================== FORM SUBMIT ==================
  const handleSubmit = (e) => {
    e.preventDefault()
    
    try {
      if (activeTab === 'siteSettings') {
        updateSiteSettings(formData)
        alert('✅ Cài đặt site đã được cập nhật!')
        setShowAddForm(false)
        setUploadResult(null)
        setLogoUploadResult(null)
      } else if (editingId) {
        updateItem(activeTab, editingId, formData)
        alert('✅ Đã cập nhật thành công!')
        setEditingId(null)
        setShowAddForm(false)
        setUploadResult(null)
      } else {
        addItem(activeTab, formData)
        alert('✅ Đã thêm mới thành công!')
        setShowAddForm(false)
        setUploadResult(null)
      }
      setFormData({})
    } catch (error) {
      alert(`❌ Lỗi: ${error.message}`)
    }
  }

  const cancelEdit = () => {
    if (activeTab === 'siteSettings') {
      setFormData(data.siteSettings || {})
      setLogoUploadResult(null)
    } else {
      setEditingId(null)
      setFormData({})
    }
    setShowAddForm(false)
    setUploadResult(null)
  }

  // ================== FORMAT YOUTUBE URL ==================
  const formatYouTubeUrl = (url) => {
    if (!url) return ''
    
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0]
      return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`
    }
    
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0]
      return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`
    }
    
    return url
  }

  // ================== RENDER FIELD ==================
  const renderField = (field) => {
    const fieldValue = formData[field.name] || ''
    const isImageField = field.name.includes('url') || 
                        field.name.includes('image') || 
                        field.name.includes('avatar')
    const isVideoField = activeTab === 'videos'

    // FIELD LOGO (đặc biệt cho siteSettings)
    if (field.name === 'logoUrl' && activeTab === 'siteSettings') {
      return (
        <div className="space-y-4">
          {/* Upload Button */}
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              disabled={logoUploading}
              className="hidden"
              id="logo-upload"
              value=""
            />
            
            <label
              htmlFor="logo-upload"
              className={`
                flex items-center justify-center gap-3 w-full px-6 py-4 rounded-xl 
                border-2 border-dashed cursor-pointer transition-all duration-300
                ${logoUploading 
                  ? 'border-lavender-300 bg-lavender-300/10 text-lavender-300' 
                  : 'border-lavender-300/40 hover:border-lavender-300 hover:bg-lavender-300/5 text-lavender-300'
                }
              `}
            >
              {logoUploading ? (
                <>
                  <Loader className="animate-spin" size={24} />
                  <span className="font-nunito">
                    Đang upload logo... {logoUploadProgress}%
                  </span>
                </>
              ) : (
                <>
                  <Upload size={24} />
                  <span className="font-nunito">
                    {formData.logoUrl ? 'Chọn logo khác' : 'Chọn logo website'}
                  </span>
                </>
              )}
            </label>
            
            {/* Progress Bar */}
            {logoUploading && (
              <div className="mt-3">
                <div className="h-2 bg-lavender-300/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-lavender-300 to-pink-300"
                    initial={{ width: '0%' }}
                    animate={{ width: `${logoUploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Upload Result */}
          {logoUploadResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg bg-gradient-to-r from-lavender-300/10 to-pink-300/10 border border-lavender-300/20"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="text-mint-300" size={20} />
                    <span className="font-nunito font-bold text-mint-300">
                      {logoUploadResult.isTemporary ? 'Logo tạm thời' : 'Upload logo thành công!'}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      logoUploadResult.isTemporary 
                        ? 'bg-amber-500/20 text-amber-300' 
                        : 'bg-mint-300/20 text-mint-300'
                    }`}>
                      {logoUploadResult.isTemporary ? 'Chỉ hiển thị trên máy này' : 'Mọi người đều xem được'}
                    </span>
                  </div>
                  
                  {/* URL Display */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={logoUploadResult.url}
                        className="flex-1 px-3 py-2 rounded bg-dark/60 text-lavender-100 text-sm truncate border border-lavender-300/20"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(logoUploadResult.url)
                          setCopySuccess(true)
                          setTimeout(() => setCopySuccess(false), 2000)
                        }}
                        className="px-3 py-2 rounded-lg bg-lavender-300/20 hover:bg-lavender-300/30 text-lavender-300 font-nunito text-sm flex items-center gap-1 transition-colors"
                      >
                        <Copy size={14} />
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Thumbnail Preview */}
                {logoUploadResult.thumbnail && (
                  <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-lavender-300/30">
                    <img
                      src={logoUploadResult.thumbnail}
                      alt="Logo preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          )}
          
          {/* Manual URL Input */}
          <div className="mt-4">
            <p className="font-nunito text-sm text-mint-200 mb-2">Hoặc nhập URL logo:</p>
            <input
              type="url"
              value={formData.logoUrl || ''}
              onChange={(e) => setFormData({...formData, logoUrl: e.target.value})}
              placeholder="https://example.com/logo.png"
              className="w-full px-4 py-3 rounded-lg border-2 border-lavender-300/30 focus:border-lavender-300 bg-dark-lighter/80 text-lavender-100 font-nunito outline-none placeholder:text-lavender-300/40 transition-all duration-300"
            />
          </div>
          
          {/* Current Logo Preview */}
          {data.siteSettings?.logoUrl && !formData.logoUrl && !logoUploadResult && (
            <div className="mt-4 p-4 rounded-lg bg-lavender-300/5 border border-lavender-300/20">
              <p className="font-nunito text-sm text-mint-200 mb-2">Logo hiện tại:</p>
              <img
                src={data.siteSettings.logoUrl}
                alt="Current logo"
                className="w-24 h-24 object-contain rounded-lg"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/100/1A0B3A/C9A7F5?text=Logo'
                }}
              />
            </div>
          )}
        </div>
      )
    }

    // FIELD VIDEO
    if (isVideoField) {
      if (field.name === 'url') {
        return (
          <div className="space-y-4">
            <div className="relative">
              <LinkIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-lavender-300/60" size={20} />
              <input
                type="url"
                value={fieldValue}
                onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
                required={field.required}
                placeholder="https://youtube.com/watch?v=... hoặc https://youtu.be/..."
                className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-lavender-300/30 focus:border-lavender-300 bg-dark-lighter/80 text-lavender-100 font-nunito outline-none placeholder:text-lavender-300/40 transition-all duration-300"
              />
            </div>
            
            {/* Video Preview */}
            {fieldValue && fieldValue.includes('youtube') && (
              <div className="mt-4 p-4 rounded-lg bg-lavender-300/5 border border-lavender-300/20">
                <p className="font-nunito text-sm text-mint-200 mb-2 flex items-center gap-2">
                  <Video size={16} />
                  <span className="font-bold">Preview:</span> Video sẽ hiển thị như bên dưới
                </p>
                <div className="aspect-video rounded-lg overflow-hidden bg-dark border border-lavender-300/20">
                  <iframe
                    src={formatYouTubeUrl(fieldValue)}
                    title="Video preview"
                    className="w-full h-full"
                    allowFullScreen
                    frameBorder="0"
                  />
                </div>
              </div>
            )}
          </div>
        )
      } else if (field.name === 'title') {
        return (
          <div className="space-y-2">
            <div className="relative">
              <Type className="absolute left-4 top-1/2 transform -translate-y-1/2 text-lavender-300/60" size={20} />
              <input
                type="text"
                value={fieldValue}
                onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
                required={field.required}
                placeholder="Nhập tiêu đề video..."
                className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-lavender-300/30 focus:border-lavender-300 bg-dark-lighter/80 text-lavender-100 font-nunito outline-none placeholder:text-lavender-300/40 transition-all duration-300"
              />
            </div>
            <p className="font-nunito text-xs text-lavender-300/60">
              Tiêu đề sẽ hiển thị phía trên video
            </p>
          </div>
        )
      }
    }

    // FIELD ẢNH (cho các tab khác)
    if (isImageField && activeTab !== 'siteSettings') {
      return (
        <div className="space-y-4">
          {/* Upload Button */}
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, field.name)}
              disabled={uploading}
              className="hidden"
              id={`file-upload-${field.name}`}
              value=""
            />
            
            <label
              htmlFor={`file-upload-${field.name}`}
              className={`
                flex items-center justify-center gap-3 w-full px-6 py-4 rounded-xl 
                border-2 border-dashed cursor-pointer transition-all duration-300
                ${uploading 
                  ? 'border-lavender-300 bg-lavender-300/10 text-lavender-300' 
                  : 'border-lavender-300/40 hover:border-lavender-300 hover:bg-lavender-300/5 text-lavender-300'
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
                    {fieldValue ? 'Chọn ảnh khác' : `Chọn ${field.label.toLowerCase()}`}
                  </span>
                </>
              )}
            </label>
            
            {/* Progress Bar */}
            {uploading && (
              <div className="mt-3">
                <div className="h-2 bg-lavender-300/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-lavender-300 to-pink-300"
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
              className="p-4 rounded-lg bg-gradient-to-r from-lavender-300/10 to-pink-300/10 border border-lavender-300/20"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="text-mint-300" size={20} />
                    <span className="font-nunito font-bold text-mint-300">
                      {uploadResult.isTemporary ? 'Ảnh tạm thời' : 'Upload thành công!'}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      uploadResult.isTemporary 
                        ? 'bg-amber-500/20 text-amber-300' 
                        : 'bg-mint-300/20 text-mint-300'
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
                        className="flex-1 px-3 py-2 rounded bg-dark/60 text-lavender-100 text-sm truncate border border-lavender-300/20"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(uploadResult.url)
                          setCopySuccess(true)
                          setTimeout(() => setCopySuccess(false), 2000)
                        }}
                        className="px-3 py-2 rounded-lg bg-lavender-300/20 hover:bg-lavender-300/30 text-lavender-300 font-nunito text-sm flex items-center gap-1 transition-colors"
                      >
                        <Copy size={14} />
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Thumbnail Preview */}
                {uploadResult.thumbnail && (
                  <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-lavender-300/30">
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
            <p className="font-nunito text-sm text-mint-200 mb-2">Hoặc nhập URL ảnh:</p>
            <input
              type="url"
              value={fieldValue}
              onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 rounded-lg border-2 border-lavender-300/30 focus:border-lavender-300 bg-dark-lighter/80 text-lavender-100 font-nunito outline-none placeholder:text-lavender-300/40 transition-all duration-300"
            />
          </div>
        </div>
      )
    }

    // FIELD THÔNG THƯỜNG
    if (field.type === 'select') {
      return (
        <select
          value={fieldValue}
          onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
          required={field.required}
          className="w-full px-4 py-3 rounded-lg border-2 border-lavender-300/30 focus:border-lavender-300 bg-dark-lighter/80 text-lavender-100 font-nunito outline-none transition-all duration-300"
        >
          <option value="" className="bg-dark">Chọn...</option>
          {field.options.map(opt => (
            <option key={opt.value} value={opt.value} className="bg-dark">
              {opt.label}
            </option>
          ))}
        </select>
      )
    } else if (field.type === 'textarea') {
      return (
        <textarea
          value={fieldValue}
          onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
          required={field.required}
          rows="4"
          className="w-full px-4 py-3 rounded-lg border-2 border-lavender-300/30 focus:border-lavender-300 bg-dark-lighter/80 text-lavender-100 font-nunito outline-none resize-none placeholder:text-lavender-300/40 transition-all duration-300"
          placeholder={field.placeholder || `Nhập ${field.label.toLowerCase()}...`}
        />
      )
    } else {
      // SỬA PHÒNG THỦ: Đảm bảo input type="file" luôn có value="" dù logic rơi vào đây
      const finalValue = field.type === 'file' ? '' : fieldValue
      
      return (
        <input
          type={field.type}
          value={finalValue}
          onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
          required={field.required}
          placeholder={field.placeholder || `Nhập ${field.label.toLowerCase()}...`}
          className="w-full px-4 py-3 rounded-lg border-2 border-lavender-300/30 focus:border-lavender-300 bg-dark-lighter/80 text-lavender-100 font-nunito outline-none placeholder:text-lavender-300/40 transition-all duration-300"
        />
      )
    }
  }

  // ================== GET FORM FIELDS ==================
  const getFormFields = () => {
    switch(activeTab) {
      case 'siteSettings':
        return [
          { 
            name: 'logoUrl', 
            label: 'Logo Website', 
            type: 'file', 
            required: true,
            accept: 'image/*'
          },
          { 
            name: 'siteName', 
            label: 'Tên Website', 
            type: 'text', 
            required: true,
            placeholder: 'Nhập tên website...'
          },
          { 
            name: 'tagline', 
            label: 'Khẩu Hiệu', 
            type: 'text', 
            required: true,
            placeholder: 'Nhập khẩu hiệu của website...'
          }
        ]
      case 'members':
        return [
          { name: 'name', label: 'Tên thành viên', type: 'text', required: true },
          { name: 'nickname', label: 'Biệt danh', type: 'text', required: true },
          { 
            name: 'avatarUrl', 
            label: 'Ảnh đại diện', 
            type: 'file', 
            required: true,
            accept: 'image/*'
          },
          { name: 'avatar', label: 'Emoji (tùy chọn)', type: 'text', placeholder: '👑, ⭐, ...' },
          { name: 'funFact', label: 'Điều thú vị', type: 'text', required: true },
          { 
            name: 'role', 
            label: 'Vai trò', 
            type: 'select', 
            options: [
              { value: 'lead', label: '👑 Leader' },
              { value: 'member', label: '⭐ Member' }
            ], 
            required: true 
          }
        ]
      case 'gallery':
        return [
          { 
            name: 'url', 
            label: 'Ảnh', 
            type: 'file', 
            required: true,
            accept: 'image/*'
          },
          { name: 'caption', label: 'Chú thích ảnh', type: 'text', required: true }
        ]
      case 'videos':
        return [
          { 
            name: 'url', 
            label: 'Link YouTube', 
            type: 'url', 
            required: true,
            placeholder: 'https://youtube.com/watch?v=... hoặc https://youtu.be/...'
          },
          { 
            name: 'title', 
            label: 'Tiêu đề video', 
            type: 'text',
            required: true,
            placeholder: 'Nhập tiêu đề video...'
          }
        ]
      case 'momentsWall':
        return [
          { 
            name: 'image', 
            label: 'Ảnh khoảnh khắc', 
            type: 'file', 
            required: true,
            accept: 'image/*'
          },
          { name: 'caption', label: 'Chú thích', type: 'text', required: true },
          { name: 'sticker', label: 'Sticker emoji', type: 'text', required: true, placeholder: '💫, ✨, 🌟, ...' }
        ]
      case 'achievements':
        return [
          { name: 'title', label: 'Tiêu đề thành tích', type: 'text', required: true },
          { name: 'category', label: 'Danh mục', type: 'text', required: true },
          { name: 'icon', label: 'Icon emoji', type: 'text', required: true, placeholder: '🏆, 🎨, 🚀, ...' },
          { 
            name: 'color', 
            label: 'Màu sắc', 
            type: 'select', 
            options: [
              { value: 'lavender', label: '💜 Lavender' },
              { value: 'pink', label: '💖 Pink' },
              { value: 'mint', label: '💚 Mint' },
              { value: 'neonYellow', label: '💛 Neon Yellow' }
            ], 
            required: true 
          }
        ]
      case 'guestbook':
        return [
          { name: 'name', label: 'Tên khách', type: 'text', required: true },
          { name: 'message', label: 'Lời nhắn', type: 'textarea', required: true }
        ]
      default:
        return []
    }
  }

  // ================== RENDER FORM ==================
  const renderForm = () => {
    const fields = getFormFields()
    
    return (
      <motion.form
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        onSubmit={handleSubmit}
        className="rounded-2xl p-6 mb-6 space-y-6 admin-edit-form-fix"
      >
        <h3 className="font-fredoka text-2xl text-lavender-100 mb-4 flex items-center gap-2">
          <Palette size={24} />
          {activeTab === 'siteSettings' ? 
            (showAddForm ? 'Chỉnh sửa cài đặt website' : 'Cài đặt website') : 
            editingId ? 'Chỉnh sửa' : 'Thêm mới'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field) => (
            <div 
              key={field.name} 
              className={field.type === 'textarea' || field.type === 'file' || field.type === 'url' ? 'md:col-span-2' : ''}
            >
              <label className="block font-nunito font-semibold text-mint-200 mb-2">
                {field.label} {field.required ? ' *' : ''}
              </label>
              {renderField(field)}
            </div>
          ))}
        </div>

        <div className="flex gap-3 pt-4">
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 bg-gradient-to-r from-lavender-300 to-pink-300 text-dark font-nunito font-bold py-3 rounded-full flex items-center justify-center gap-2 shadow-lg shadow-lavender-300/20 transition-all duration-300 hover:shadow-xl hover:shadow-lavender-300/30"
            disabled={uploading || logoUploading}
          >
            {logoUploading ? (
              <>
                <Loader className="animate-spin" size={20} />
                Đang upload logo...
              </>
            ) : uploading ? (
              <>
                <Loader className="animate-spin" size={20} />
                Đang upload...
              </>
            ) : (
              <>
                <Save size={20} />
                {activeTab === 'siteSettings' ? 'Lưu cài đặt' : editingId ? 'Cập nhật' : 'Tạo mới'}
              </>
            )}
          </motion.button>
          <motion.button
            type="button"
            onClick={cancelEdit}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 border-2 border-lavender-300/40 bg-lavender-300/10 text-lavender-300 font-nunito font-bold py-3 rounded-full flex items-center gap-2 hover:bg-lavender-300/20 transition-all duration-300"
            disabled={uploading || logoUploading}
          >
            <X size={20} />
            Hủy
          </motion.button>
        </div>
        
        {copySuccess && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-sm text-mint-300 animate-pulse"
          >
            ✓ Đã copy link ảnh vào clipboard
          </motion.div>
        )}
      </motion.form>
    )
  }

  // ================== RENDER CONTENT DISPLAY ==================
  const renderContentDisplay = () => {
    if (activeTab === 'siteSettings') {
      return (
        <div className="rounded-2xl p-6 border border-lavender-300/20 admin-content-fix">
          <div className="text-center mb-6">
            <h3 className="font-fredoka text-2xl text-lavender-100 flex items-center justify-center gap-2">
              <Settings size={24} />
              Cài đặt website hiện tại
            </h3>
          </div>
          
          <div className="space-y-8">
            <div className="text-center">
              <p className="font-nunito text-mint-200 text-sm mb-3">Logo website:</p>
              <div className="inline-block relative">
                <img
                  src={data.siteSettings?.logoUrl}
                  alt="Logo"
                  className="w-40 h-40 object-contain rounded-full mx-auto border-4 border-lavender-300/30"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/200/1A0B3A/C9A7F5?text=No+Logo'
                  }}
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-lavender-300/10 to-pink-300/10"></div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="font-nunito text-mint-200 text-sm mb-2">Tên website:</p>
              <h4 className="font-baloo text-3xl font-bold text-lavender-50">
                {data.siteSettings?.siteName}
              </h4>
            </div>
            
            <div className="text-center">
              <p className="font-nunito text-mint-200 text-sm mb-2">Khẩu hiệu:</p>
              <p className="font-pacifico text-2xl text-pink-100">
                {data.siteSettings?.tagline}
              </p>
            </div>
            
            <div className="mt-8 p-4 rounded-lg" style={{
              background: 'rgba(201, 167, 245, 0.05)',
              border: '1px solid rgba(201, 167, 245, 0.2)'
            }}>
              <p className="font-nunito text-sm text-lavender-100 text-center">
                Nhấn nút "Chỉnh sửa" ở phía trên để thay đổi cài đặt website
              </p>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div className="space-y-4">
          {data[activeTab] && data[activeTab].length > 0 ? (
            data[activeTab].map((item, index) => (
              <div key={item.id || index} className="rounded-xl p-4 flex items-start justify-between gap-4 hover:bg-lavender-300/5 transition-all duration-300 border border-lavender-300/10 admin-content-fix">
                <div className="flex items-start gap-4 flex-1">
                  {/* Preview Image */}
                  {(activeTab === 'members' && item.avatarUrl) ? (
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-lavender-300/30">
                      <img 
                        src={item.avatarUrl} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (item.url || item.image) ? (
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-lavender-300/30">
                      <img 
                        src={item.url || item.image} 
                        alt="" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (item.avatar || item.icon || item.sticker) && !item.url && !item.image && !item.avatarUrl ? (
                    <div className="text-3xl text-lavender-300">{item.avatar || item.icon || item.sticker}</div>
                  ) : null}
                  
                  {/* Content */}
                  <div className="flex-1">
                    <h4 className="font-nunito font-bold text-lavender-50 text-lg">
                      {item.name || item.title || item.caption || 'Không có tiêu đề'}
                    </h4>
                    {item.nickname && (
                      <p className="font-pacifico text-pink-200 text-sm mt-1">"{item.nickname}"</p>
                    )}
                    {item.category && (
                      <p className="font-nunito text-mint-200 text-sm mt-1">{item.category}</p>
                    )}
                    <p className="font-nunito text-lavender-200 text-sm mt-2">
                      {item.funFact || item.description || item.message || 'Không có mô tả'}
                    </p>
                    {activeTab === 'members' && item.role && (
                      <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-nunito font-bold bg-lavender-300/20 text-lavender-300">
                        {item.role === 'lead' ? '👑 Leader' : '⭐ Member'}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex gap-2">
                  <motion.button
                    onClick={() => startEdit(item)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-lg border border-mint-300/20 text-mint-300 hover:bg-mint-300/10 transition-all duration-300"
                    title="Chỉnh sửa"
                  >
                    <Edit size={18} />
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      if (window.confirm('Bạn có chắc muốn xóa mục này?')) {
                        deleteItem(activeTab, item.id)
                      }
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-lg border border-pink-300/20 text-pink-300 hover:bg-pink-300/10 transition-all duration-300"
                    title="Xóa"
                  >
                    <Trash2 size={18} />
                  </motion.button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 rounded-2xl border border-lavender-300/20 admin-content-fix">
              <div className="text-5xl mb-4 opacity-50">
                {activeTab === 'members' ? '👥' :
                 activeTab === 'gallery' ? '📸' :
                 activeTab === 'videos' ? '🎥' :
                 activeTab === 'momentsWall' ? '💫' :
                 activeTab === 'achievements' ? '🏆' :
                 activeTab === 'guestbook' ? '📝' : '📭'}
              </div>
              <p className="font-nunito text-lavender-100 text-lg">Chưa có mục nào</p>
              <p className="font-nunito text-mint-200 text-sm mt-2">Hãy thêm mới để bắt đầu!</p>
            </div>
          )}
        </div>
      )
    }
  }

  // ================== LOGIN SCREEN ==================
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 admin-modal-fix">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl p-8 max-w-md w-full blur-shadow border border-lavender-300/20 admin-form-fix"
        >
          <div className="text-center mb-8">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl mb-4 text-lavender-300"
            >
              🔐
            </motion.div>
            <h2 className="font-baloo text-4xl font-bold text-lavender-50 mb-2">
              Admin Login
            </h2>
            <p className="font-nunito text-mint-200">Nhập mật khẩu để vào Admin Panel</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu ✨"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 rounded-full border-2 border-lavender-300/30 focus:border-lavender-300 bg-dark-lighter/80 text-lavender-100 font-nunito text-lg outline-none pr-12 placeholder:text-lavender-300/40 transition-all duration-300 admin-input-fix"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-lavender-300/60 hover:text-lavender-300 transition-colors"
              >
                {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
              </button>
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-gradient-to-r from-lavender-300 to-pink-300 text-dark font-fredoka font-bold text-xl py-4 rounded-full flex items-center justify-center gap-3 shadow-lg shadow-lavender-300/20 transition-all duration-300 hover:shadow-xl hover:shadow-lavender-300/30 admin-button-fix"
            >
              <Lock size={24} />
              Đăng nhập
            </motion.button>
          </form>
          
          <div className="mt-6 pt-6 border-t border-lavender-300/20">
            <p className="font-nunito text-sm text-lavender-100 text-center">
              Hello bạn: <code className="bg-lavender-300/10 px-2 py-1 rounded text-lavender-300">:))</code>
            </p>
          </div>
        </motion.div>
      </div>
    )
  }

  // ================== MAIN ADMIN PANEL ==================
  return (
    <div className="min-h-screen pt-24 px-4 pb-20 admin-modal-fix">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-baloo text-6xl font-bold text-lavender-50 mb-4"
            style={{
              textShadow: '0 0 20px rgba(201, 167, 245, 0.5)'
            }}
          >
            ⚙️ Admin Dashboard
          </h1>
          <p className="font-pacifico text-2xl text-mint-200">Quản lý mọi thứ trên website ✨</p>
          
          {/* Login Status */}
          <div className="mt-4 inline-flex items-center gap-4 p-3 rounded-full admin-content-fix">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-mint-300 animate-pulse"></div>
              <span className="font-nunito text-sm text-mint-200">Đã đăng nhập</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs px-3 py-1 rounded-full border border-lavender-300/40 bg-lavender-300/10 text-lavender-300 hover:bg-lavender-300/20 transition-colors"
            >
              Đăng xuất
            </button>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'siteSettings', label: '⚙️ Cài đặt', icon: '⚙️' },
            { id: 'members', label: '👥 Thành viên', icon: '👥' },
            { id: 'achievements', label: '🏆 Thành tích', icon: '🏆' },
            { id: 'gallery', label: '📸 Gallery', icon: '📸' },
            { id: 'videos', label: '🎬 Videos', icon: '🎬' },
            { id: 'guestbook', label: '📝 Lưu bút', icon: '📝' },
            { id: 'momentsWall', label: '💫 Khoảnh khắc', icon: '💫' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id)
                setShowAddForm(false)
                setEditingId(null)
                setFormData({})
                setUploadResult(null)
                setLogoUploadResult(null)
                setLogoUploading(false)
                setLogoUploadProgress(0)
              }}
              className={`px-6 py-3 rounded-full font-nunito font-bold whitespace-nowrap transition-all duration-300 border-2 admin-tab-active-fix ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-lavender-300/20 to-pink-300/10 border-lavender-300/30 shadow-lg shadow-lavender-300/10 text-lavender-50'
                  : 'border-lavender-300/20 hover:border-lavender-300/40 text-lavender-200 bg-dark-lighter/50'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="rounded-2xl p-6 blur-shadow border border-lavender-300/20 admin-content-fix">
          {/* Header với Add/Edit Button */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-fredoka text-3xl font-bold text-lavender-50 admin-text-fix"
              style={{
                textShadow: '0 0 10px rgba(201, 167, 245, 0.3)'
              }}
            >
              {activeTab === 'siteSettings' ? '⚙️ Cài đặt website' : 
               `${['👥', '🏆', '📸', '🎬', '📝', '💫'][
                 ['members', 'achievements', 'gallery', 'videos', 'guestbook', 'momentsWall'].indexOf(activeTab)
               ]} ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
            </h2>
            
            {activeTab !== 'siteSettings' ? (
              <motion.button
                onClick={() => {
                  setShowAddForm(!showAddForm)
                  setEditingId(null)
                  setFormData({})
                  setUploadResult(null)
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-full font-nunito font-bold flex items-center gap-2 shadow-lg border-2 admin-button-fix ${
                  showAddForm 
                    ? 'bg-gradient-to-r from-pink-300 to-lavender-300 text-dark border-transparent' 
                    : 'bg-gradient-to-r from-lavender-300 to-pink-300 text-dark border-transparent'
                } transition-all duration-300 hover:shadow-xl hover:shadow-lavender-300/30`}
              >
                <Plus size={20} />
                {showAddForm ? 'Đóng form' : 'Thêm mới'}
              </motion.button>
            ) : (
              <motion.button
                onClick={() => {
                  setFormData(data.siteSettings || {})
                  setShowAddForm(!showAddForm)
                  setLogoUploadResult(null)
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-full font-nunito font-bold flex items-center gap-2 shadow-lg border-2 admin-button-fix ${
                  showAddForm 
                    ? 'bg-gradient-to-r from-pink-300 to-lavender-300 text-dark border-transparent' 
                    : 'bg-gradient-to-r from-lavender-300 to-pink-300 text-dark border-transparent'
                } transition-all duration-300 hover:shadow-xl hover:shadow-lavender-300/30`}
              >
                <Edit size={20} />
                {showAddForm ? 'Đóng' : 'Chỉnh sửa'}
              </motion.button>
            )}
          </div>

          {/* Add/Edit Form hoặc Content Display */}
          <div className="admin-form-container">
            {showAddForm ? renderForm() : renderContentDisplay()}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {[
            { label: 'Thành viên', value: data.members?.length || 0, icon: '👥', color: 'text-lavender-300' },
            { label: 'Gallery', value: data.gallery?.length || 0, icon: '📸', color: 'text-pink-300' },
            { label: 'Videos', value: data.videos?.length || 0, icon: '🎬', color: 'text-mint-300' },
            { label: 'Khoảnh khắc', value: data.momentsWall?.length || 0, icon: '💫', color: 'text-yellow-300' },
          ].map(stat => (
            <motion.div
              key={stat.label}
              whileHover={{ scale: 1.05 }}
              className="rounded-xl p-4 text-center border border-lavender-300/20 admin-content-fix"
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className={`text-2xl font-fredoka font-bold ${stat.color}`}>
                {stat.value}
              </div>
              <div className="font-nunito text-sm text-lavender-200 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminPanel
