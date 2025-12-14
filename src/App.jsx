import React, { Suspense, lazy, useState, useEffect } from 'react'
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { DataProvider } from './contexts/DataContext'
import Navigation from './components/Navigation'
import AuroraBackground from './components/AuroraBackground'
import FloatingStickers from './components/FloatingStickers'
import FloatingMusicPlayer from './components/FloatingMusicPlayer'
import LoadingSpinner from './components/LoadingSpinner' // ĐÃ IMPORT RỒI

// Lazy load chỉ các trang lớn
const HomePage = lazy(() => import('./pages/HomePage'))
const MemoriesPage = lazy(() => import('./pages/MemoriesPage'))
const GuestbookPage = lazy(() => import('./pages/GuestbookPage'))
const MomentsWallPage = lazy(() => import('./pages/MomentsWallPage'))
const AdminPanel = lazy(() => import('./pages/AdminPanel'))

// Component để conditionally render background/stickers - XÓA LoadingSpinner ở đây
const ConditionalBackgrounds = () => {
  const location = useLocation()
  const isAdminPage = location.pathname === '/admin'
  
  return (
    <>
      {/* AuroraBackground - luôn hiển thị nhưng tối ưu */}
      <AuroraBackground />
      
      {/* FloatingStickers - không hiển thị ở admin page để giảm lag */}
      {!isAdminPage && <FloatingStickers />}
    </>
  )
}

// XÓA TOÀN BỘ PHẦN NÀY:
// const LoadingSpinner = () => (
//   <div className="flex items-center justify-center min-h-screen">
//     <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
//   </div>
// )

function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Preload các trang quan trọng
    const preloadPages = async () => {
      const preloadPromises = [
        import('./pages/HomePage'),
        import('./pages/MemoriesPage')
      ]
      
      try {
        await Promise.all(preloadPromises)
      } catch (error) {
        console.error('Preload failed:', error)
      } finally {
        setIsLoading(false)
      }
    }

    // Delay loading một chút để ưu tiên render UI
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    preloadPages()
    
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <DataProvider>
      <Router>
        <div className="relative min-h-screen">
          {/* Conditionally render backgrounds */}
          <ConditionalBackgrounds />
          
          <div className="relative z-10">
            <Navigation />
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/memories" element={<MemoriesPage />} />
                <Route path="/guestbook" element={<GuestbookPage />} />
                <Route path="/moments-wall" element={<MomentsWallPage />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Suspense>
          </div>
          
          {/* FloatingMusicPlayer - conditionally render nếu không ở admin */}
          <Routes>
            <Route path="/admin" element={null} />
            <Route path="*" element={<FloatingMusicPlayer />} />
          </Routes>
        </div>
      </Router>
    </DataProvider>
  )
}

export default React.memo(App)
