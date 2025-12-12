// CHỈ CẬP NHẬT PHẦN VIDEO FIELD TRONG AdminPanel.jsx
// Tìm phần getFormFields và sửa field videos:

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
      placeholder: 'Tiêu đề video (tối đa 50 ký tự)'
    }
  ]

// Và trong renderField, thêm phần hướng dẫn cho video:
if (isVideoField) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="url"
          value={fieldValue}
          onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
          required={field.required}
          placeholder={field.placeholder || "https://youtube.com/watch?v=..."}
          className="w-full px-4 py-3 rounded-lg glass border-2 border-lavender/30 focus:border-lavender bg-transparent text-lavender font-nunito outline-none"
        />
      </div>
      
      {/* Video Preview */}
      {fieldValue && fieldValue.includes('youtube') && (
        <div className="mt-4 p-4 rounded-lg bg-lavender/10 border border-lavender/20">
          <p className="font-nunito text-sm text-mint mb-2 flex items-center gap-2">
            <span className="font-bold">Preview video sẽ hiển thị:</span>
          </p>
          <div className="aspect-video rounded-lg overflow-hidden bg-midnight mt-2">
            <iframe
              src={formatYouTubeUrl(fieldValue)}
              title="Video preview"
              className="w-full h-full"
              allowFullScreen
            />
          </div>
          <p className="font-nunito text-xs text-lavender-100 mt-2">
            Video sẽ tự động điều chỉnh kích thước và căn giữa
          </p>
        </div>
      )}
    </div>
  )
}

// Thêm hàm formatYouTubeUrl vào component:
const formatYouTubeUrl = (url) => {
  if (!url) return ''
  
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0]
    return `https://www.youtube.com/embed/${videoId}`
  }
  
  if (url.includes('youtube.com/watch?v=')) {
    const videoId = url.split('v=')[1]?.split('&')[0]
    return `https://www.youtube.com/embed/${videoId}`
  }
  
  return url
}
