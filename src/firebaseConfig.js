import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// Bạn có thể xóa getAnalytics nếu không dùng

// Cấu hình Firebase của bạn
const firebaseConfig = {
  apiKey: "AIzaSyDHnx_kYXKHfy3PGtoAvUW1ZYtI9YhBbyA",
  authDomain: "perlindor-sparkling-2025.firebaseapp.com",
  projectId: "perlindor-sparkling-2025",
  storageBucket: "perlindor-sparkling-2025.firebasestorage.app",
  messagingSenderId: "266453576674",
  appId: "1:266453576674:web:e4f4dc4eb51d6a5dbea7bb",
  measurementId: "G-7VBGLEH6KR",
  // Dòng này rất quan trọng cho Realtime Database
  databaseURL: "https://perlindor-sparkling-2025-default-rtdb.asia-southeast1.firebasedatabase.app/" 
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Lấy tham chiếu đến Realtime Database và export
export const db = getDatabase(app); 
