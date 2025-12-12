// src/services/adminUpload.js

/**
 * Admin Upload Service - Dùng cho mục đích kiểm tra lỗi cú pháp
 */

const IMGBB_API_KEY = '0795b26a330113ad74c3529b022b93a1' // Đảm bảo key nằm trong dấu nháy đơn hoặc kép

// ***************************************************************
// Hàm Upload Chính
// ***************************************************************
export const adminUploadImage = async (file) => {
  console.log('📤 Admin uploading:', file.name)
  
  if (!file) {
    throw new Error('Không có file để upload.')
  }
  
  // Tạm thời trả về blob URL nếu không có key để tránh request lỗi
  if (!IMGBB_API_KEY || IMGBB_API_KEY === 'YOUR_API_KEY') {
    const blobUrl = URL.createObjectURL(file)
    return {
      success: true,
      url: blobUrl,
      isTemporary: true,
      message: 'Ảnh tạm thời (Vui lòng cài đặt ImgBB API Key)'
    }
  }

  // Khởi tạo FormData
  const formData = new FormData()
  formData.append('image', file)
  
  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      // Xử lý lỗi HTTP (400, 500)
      throw new Error(`HTTP Error ${response.status}: ${data.error ? data.error.message : response.statusText}`)
    }

    if (data.success) {
      console.log('✅ Upload thành công:', data.data.url)
      return {
        success: true,
        url: data.data.url,
        thumb: data.data.thumb.url,
      }
    } else {
      // Xử lý lỗi API (success: false)
      throw new Error(data.error.message || 'Upload failed by ImgBB server.')
    }
  } catch (error) {
    console.error('❌ Upload failed:', error)
    
    // Fallback: Tạo blob URL tạm thời
    const blobUrl = URL.createObjectURL(file)
    return {
      success: true,
      url: blobUrl,
      isTemporary: true,
      message: 'Upload thất bại (Lỗi: ' + error.message + ')'
    }
  }
}

// ***************************************************************
// Hàm Validate
// ***************************************************************
export const validateImageFile = (file) => {
  const maxSize = 32 * 1024 * 1024 // 32MB
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif'
  ]

  if (!file) {
    return { valid: false, error: 'Vui lòng chọn một tập tin.' }
  }

  if (file.size > maxSize) {
    return { valid: false, error: `Kích thước file quá lớn. Tối đa là ${Math.floor(maxSize / (1024 * 1024))}MB.` }
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Định dạng file không được hỗ trợ. Chỉ chấp nhận JPG, PNG, GIF, WEBP.' }
  }

  return { valid: true }
}
