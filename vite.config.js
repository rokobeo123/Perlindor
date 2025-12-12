import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Tên repository của bạn là Perlindor, nên base path là '/Perlindor/'
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  // BƯỚC FIX QUAN TRỌNG NHẤT: Thêm base path cho GitHub Pages
  base: '/Perlindor/', 
})
