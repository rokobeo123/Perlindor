// Thêm vào đầu file AdminPanel.jsx
import AdminImageUpload from '../components/AdminImageUpload'

// Trong phần render của AdminPanel, thêm tab mới:
const AdminPanel = () => {
  // ... các state và functions hiện tại ...
  
  const [activeTab, setActiveTab] = useState('images') // Thêm tab images
  
  // Thêm vào mảng tabs:
  const tabs = [
    // ... các tab hiện tại ...
    { id: 'images', label: '📷 Upload Ảnh', icon: '🖼️' }
  ]
  
  // Thêm vào phần render content:
  const renderContent = () => {
    switch(activeTab) {
      // ... các case hiện tại ...
      
      case 'images':
        return (
          <div className="space-y-6">
            <div className="glass rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-lavender-200 mb-4">
                📤 Hệ Thống Upload Ảnh
              </h2>
              <p className="text-mint-200 mb-6">
                Upload ảnh bất kỳ kích thước • Hiển thị ngay • Mọi người xem được
              </p>
              
              <AdminImageUpload 
                onImageAdded={(url) => {
                  // Tự động thêm ảnh vào gallery khi upload thành công
                  addItem('gallery', {
                    url: url,
                    caption: 'Ảnh mới upload',
                    uploadedAt: new Date().toISOString()
                  })
                }}
              />
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">🚀</div>
                <div className="text-2xl font-bold text-lavender-200">
                  {data.gallery?.length || 0}
                </div>
                <div className="text-sm text-mint-200">Ảnh trong gallery</div>
              </div>
              
              <div className="glass rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">💾</div>
                <div className="text-2xl font-bold text-lavender-200">
                  {JSON.parse(localStorage.getItem('local_images') || '[]').length}
                </div>
                <div className="text-sm text-mint-200">Ảnh local</div>
              </div>
              
              <div className="glass rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">🌐</div>
                <div className="text-2xl font-bold text-lavender-200">
                  {JSON.parse(localStorage.getItem('public_images') || '[]').length}
                </div>
                <div className="text-sm text-mint-200">Ảnh public</div>
              </div>
              
              <div className="glass rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">⚡</div>
                <div className="text-2xl font-bold text-lavender-200">
                  ∞
                </div>
                <div className="text-sm text-mint-200">Không giới hạn</div>
              </div>
            </div>
            
            {/* Instructions */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-xl font-bold text-lavender-200 mb-4">
                📋 Hướng dẫn nhanh
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-lavender-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-lavender-300">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-mint-200">Chọn ảnh cần upload</p>
                    <p className="text-sm text-lavender-100/80">Bấm vào khung hoặc kéo thả</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-lavender-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-lavender-300">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-mint-200">Chờ upload hoàn tất</p>
                    <p className="text-sm text-lavender-100/80">Tự động public lên internet</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-lavender-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-lavender-300">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-mint-200">Sử dụng link ảnh</p>
                    <p className="text-sm text-lavender-100/80">Copy link và dán vào bất kỳ đâu</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
        
      // ... các case khác ...
    }
  }
  
  // ... phần còn lại của component ...
}

export default AdminPanel
