import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { 
  Upload, 
  X, 
  Copy, 
  Link, 
  Check, 
  Globe, 
  HardDrive,
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react'
import { uploadImagePublic, savePublicImage, getAllImages } from '../services/imageService'

const AdminImageUpload = ({ onImageAdded }) => {
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState(null)
  const [allImages, setAllImages] = useState(() => getAllImages())
  
  // Xử lý upload file
  const handleUpload = async (file) => {
    if (!file) return
    
    setUploading(true)
    setResult(null)
    
    try {
      console.log('🔄 Đang upload...')
      const uploadResult = await uploadImagePublic(file)
      
      setResult(uploadResult)
      
      // Lưu vào danh sách public images
      if (uploadResult.isPublic) {
        savePublicImage({
          id: Date.now(),
          url: uploadResult.url,
          name: file.name,
          size: file.size,
          uploadedAt: new Date().toISOString()
        })
      }
      
      // Cập nhật danh sách ảnh
      setAllImages(getAllImages())
      
      // Gọi callback nếu có
      if (onImageAdded && uploadResult.url) {
        onImageAdded(uploadResult.url)
      }
      
      console.log('✅ Upload hoàn tất:', uploadResult)
      
    } catch (error) {
      console.error('❌ Lỗi upload:', error)
      setResult({
        success: false,
        error: error.message
      })
    } finally {
      setUploading(false)
    }
  }
  
  // Kéo thả file
  const handleDrop = useCallback((e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      handleUpload(file)
    }
  }, [])
  
  // Chọn file từ input
  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) handleUpload(file)
  }
  
  // Copy URL
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    alert('✅ Đã copy link!')
  }
  
  // Xóa ảnh local
  const deleteImage = (id) => {
    // Implementation depends on your delete function
    alert('Xóa ảnh có ID: ' + id)
    setAllImages(prev => prev.filter(img => img.id !== id))
  }
  
  // Upload Zone
  const renderUploadZone = () => (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => !uploading && document.getElementById('admin-file-input').click()}
      className={`
        relative border-3 border-dashed rounded-2xl p-8 text-center 
        cursor-pointer transition-all duration-300 mb-6
        ${uploading 
          ? 'border-purple-400 bg-purple-500/10' 
          : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50/5'
        }
      `}
    >
      <input
        id="admin-file-input"
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />
      
      <div className="space-y-4">
        <motion.div
          animate={uploading ? { rotate: 360 } : {}}
          transition={uploading ? { duration: 2, repeat: Infinity, ease: "linear" } : {}}
          className="inline-block p-4 rounded-full bg-gray-800"
        >
          {uploading ? (
            <Upload className="text-purple-400" size={32} />
          ) : (
            <Upload className="text-gray-400" size={32} />
          )}
        </motion.div>
        
        <div>
          <h3 className="font-semibold text-lg text-gray-200 mb-2">
            {uploading ? 'Đang upload...' : 'Kéo thả ảnh vào đây'}
          </h3>
          <p className="text-gray-400 text-sm">
            {uploading ? 'Vui lòng chờ...' : 'Hoặc click để chọn file'}
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Hỗ trợ mọi kích thước • Tự động public • Refresh không mất
          </p>
        </div>
      </div>
    </div>
  )
  
  // Result Display
  const renderResult = () => {
    if (!result) return null
    
    if (!result.success) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6"
        >
          <div className="flex items-center gap-3 text-red-400">
            <AlertCircle size={20} />
            <div>
              <p className="font-medium">Upload thất bại!</p>
              <p className="text-sm opacity-80">{result.error}</p>
            </div>
          </div>
        </motion.div>
      )
    }
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6"
      >
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Check className="text-green-400" size={20} />
              <span className="font-medium text-green-400">Upload thành công!</span>
              <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-300">
                {result.isLocal ? 'Local' : 'Public'}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Link size={14} className="text-gray-400" />
                <p className="text-sm text-gray-300 break-all">
                  {result.url.length > 60 ? result.url.substring(0, 60) + '...' : result.url}
                </p>
                <button
                  onClick={() => copyToClipboard(result.url)}
                  className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded"
                >
                  Copy
                </button>
              </div>
              
              {result.isLocal && (
                <p className="text-xs text-yellow-400 flex items-center gap-1">
                  <HardDrive size={12} />
                  Ảnh chỉ hiển thị trên trình duyệt này
                </p>
              )}
              
              {result.isPublic && (
                <p className="text-xs text-green-400 flex items-center gap-1">
                  <Globe size={12} />
                  Mọi người đều xem được
                </p>
              )}
            </div>
          </div>
          
          <div className="w-20 h-20 rounded overflow-hidden border border-gray-700">
            <img 
              src={result.url} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </motion.div>
    )
  }
  
  // Image List
  const renderImageList = () => {
    if (allImages.length === 0) return null
    
    return (
      <div className="mt-8">
        <h3 className="font-semibold text-lg text-gray-200 mb-4 flex items-center gap-2">
          <ImageIcon size={20} />
          Ảnh đã upload ({allImages.length})
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allImages.map((img, index) => (
            <motion.div
              key={img.id || index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group relative rounded-lg overflow-hidden border border-gray-700"
            >
              <div className="aspect-square overflow-hidden bg-gray-900">
                <img
                  src={img.url}
                  alt={img.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  loading="lazy"
                />
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <p className="text-xs text-white truncate">{img.name}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-300">
                      {img.size ? (img.size / 1024 / 1024).toFixed(1) + 'MB' : ''}
                    </span>
                    <button
                      onClick={() => deleteImage(img.id)}
                      className="text-xs bg-red-500/50 hover:bg-red-500 px-2 py-1 rounded"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </div>
              </div>
              
              {img.isLocal && (
                <div className="absolute top-1 right-1">
                  <HardDrive size={12} className="text-yellow-400" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    )
  }
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-100 mb-2">Upload Ảnh</h2>
        <p className="text-gray-400">Up là hiện • Không mất • Mọi người xem được</p>
      </div>
      
      {renderUploadZone()}
      {renderResult()}
      {renderImageList()}
      
      {/* Quick Info */}
      <div className="mt-8 p-4 bg-gray-800/50 rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <Check className="text-green-400" size={20} />
            </div>
            <div>
              <p className="font-medium text-gray-200">Up là hiện</p>
              <p className="text-xs text-gray-400">Ảnh hiển thị ngay sau upload</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Globe className="text-blue-400" size={20} />
            </div>
            <div>
              <p className="font-medium text-gray-200">Mọi người xem được</p>
              <p className="text-xs text-gray-400">Public URL, chia sẻ được</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
              <HardDrive className="text-purple-400" size={20} />
            </div>
            <div>
              <p className="font-medium text-gray-200">Không mất</p>
              <p className="text-xs text-gray-400">Refresh vẫn còn, lưu vĩnh viễn</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminImageUpload
