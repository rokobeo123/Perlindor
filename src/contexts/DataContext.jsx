import React, { createContext, useState, useContext, useEffect } from 'react'
import { ref, onValue, set, push, remove, update } from 'firebase/database'
import { db } from '../firebaseConfig' 

const DataContext = createContext()

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) throw new Error('useData must be used within DataProvider')
  return context
}

// Giữ lại cấu trúc initialData
const initialData = {
  siteSettings: {
    logoUrl: 'https://images.unsplash.com/photo-1614854262340-ab1ca7d079c7?w=200',
    siteName: 'Purple Aurora Memories',
    tagline: 'Where Dreams Shine Bright ✨'
  },
  members: [], 
  achievements: [],
  gallery: [],
  videos: [],
  guestbook: [],
  momentsWall: []
}

// Hàm helper để chuyển đổi Object Firebase thành Array (FIX LỖI)
const objectToArray = (obj) => {
  if (!obj) return [];
  // Object.keys(obj) lấy ra các ID key Firebase (-NxYt...)
  // Map qua các key và trả về một mảng chứa item với ID được gắn vào
  return Object.keys(obj).map(key => ({
    ...obj[key],
    id: key, 
  }));
};

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(initialData)
  const [loading, setLoading] = useState(true)

  // --------------------------------------------------------------------------------
  // 1. LẮNG NGHE VÀ ĐỒNG BỘ DỮ LIỆU TỨC THÌ (REAL-TIME LISTENER)
  // --------------------------------------------------------------------------------
  useEffect(() => {
    const dataRef = ref(db, '/') 
    
    // onValue sẽ tự động lắng nghe thay đổi và cập nhật data
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const dbData = snapshot.val()
      
      if (dbData) {
        // BƯỚC SỬA LỖI QUAN TRỌNG: CHUYỂN ĐỔI Object thành Array
        const processedData = {
            ...dbData,
            // Áp dụng chuyển đổi cho tất cả các danh mục là list
            members: objectToArray(dbData.members),
            achievements: objectToArray(dbData.achievements),
            gallery: objectToArray(dbData.gallery),
            videos: objectToArray(dbData.videos),
            guestbook: objectToArray(dbData.guestbook),
            momentsWall: objectToArray(dbData.momentsWall),
        }

        // Hợp nhất dữ liệu đã xử lý với cấu trúc ban đầu
        setData(prev => ({
            ...initialData,
            ...processedData,
        }))
      } else {
        // Khởi tạo DB nếu trống (chỉ chạy lần đầu)
        setData(initialData)
        set(dataRef, initialData)
      }
      setLoading(false)
    }, (error) => {
      console.error("Firebase Realtime Read Failed: ", error)
      setLoading(false)
    })

    // Dừng lắng nghe khi component unmount
    return () => unsubscribe()
  }, []) 

  // --------------------------------------------------------------------------------
  // 2. CÁC HÀM CRUD (GHI DỮ LIỆU VÀO FIREBASE)
  // --------------------------------------------------------------------------------

  const updateSiteSettings = async (updates) => {
    try {
      await update(ref(db, 'siteSettings'), updates)
    } catch (error) {
      console.error('Lỗi cập nhật cài đặt:', error)
      throw new Error('Lỗi cập nhật cài đặt. Vui lòng kiểm tra kết nối.')
    }
  }

  const addItem = async (category, item) => {
    try {
      const listRef = ref(db, category)
      const newRef = push(listRef) 
      
      await set(newRef, { 
        ...item, 
        id: newRef.key, 
        date: item.date || new Date().toISOString().split('T')[0]
      })
    } catch (error) {
      console.error(`Lỗi thêm mới ${category}:`, error) 
      throw new Error('Lỗi thêm mới. Vui lòng kiểm tra kết nối.')
    }
  }

  const updateItem = async (category, id, updates) => {
    try {
      // FIX LỖI: Cần tham chiếu đến item cụ thể: category/id
      const itemRef = ref(db, `${category}/${id}`) 
      await update(itemRef, updates)
    } catch (error) {
      console.error(`Lỗi cập nhật ${category} ID ${id}:`, error)
      throw new Error('Lỗi cập nhật. Vui lòng kiểm tra kết nối.')
    }
  }

  const deleteItem = async (category, id) => {
    try {
      // FIX LỖI: Cần tham chiếu đến item cụ thể: category/id
      const itemRef = ref(db, `${category}/${id}`)
      await remove(itemRef)
    } catch (error) {
      console.error(`Lỗi xóa ${category} ID ${id}:`, error)
      throw new Error('Lỗi xóa. Vui lòng kiểm tra kết nối.')
    }
  }

  // --------------------------------------------------------------------------------
  // 3. RENDER DATA PROVIDER
  // --------------------------------------------------------------------------------
  return (
    <DataContext.Provider value={{ 
      data, 
      loading, 
      addItem, 
      updateItem, 
      deleteItem, 
      updateSiteSettings 
    }}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center pt-24">
            <div className="text-center">
                <div className="text-4xl text-lavender-300 animate-bounce mb-4">
                    ✨
                </div>
                <p className="font-nunito text-lg text-lavender-100">Đang tải dữ liệu Real-time...</p>
            </div>
        </div>
      ) : children}
    </DataContext.Provider>
  )
}
