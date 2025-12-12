import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  // ĐẢM BẢO DÒNG NÀY ĐÚNG VÀ CÓ DẤU '/' CUỐI CÙNG
  base: '/Perlindor/', 
})
