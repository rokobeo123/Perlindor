import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { DataProvider } from './contexts/DataContext'
import Navigation from './components/Navigation'
import HomePage from './pages/HomePage'
import MemoriesPage from './pages/MemoriesPage'
import GuestbookPage from './pages/GuestbookPage'
import MomentsWallPage from './pages/MomentsWallPage'
import AdminPanel from './pages/AdminPanel'
import AuroraBackground from './components/AuroraBackground'
import FloatingStickers from './components/FloatingStickers'
import FloatingMusicPlayer from './components/FloatingMusicPlayer' // Thêm dòng này

function App() {
  return (
    <DataProvider>
      <Router>
        <div className="relative min-h-screen">
          <AuroraBackground />
          <FloatingStickers />
          <div className="relative z-10">
            <Navigation />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/memories" element={<MemoriesPage />} />
              <Route path="/guestbook" element={<GuestbookPage />} />
              <Route path="/moments-wall" element={<MomentsWallPage />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
          {/* Thêm FloatingMusicPlayer ở đây - sẽ hiển thị trên mọi trang */}
          <FloatingMusicPlayer />
        </div>
      </Router>
    </DataProvider>
  )
}

export default App
