/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base colors
        lavender: {
          50: '#F8F4FF',
          100: '#E2D9FF',
          200: '#C9A7F5',
          300: '#B185EB',
          400: '#A67BCB',
        },
        pink: {
          100: '#FFD6F5',
          200: '#FFB8F5',
          300: '#FF9AEB',
        },
        mint: {
          100: '#C7FFF2',
          200: '#7FFFE7',
          300: '#5AF0D9',
        },
        midnight: '#1A0B3A',
        neonYellow: '#FFE47A',
        
        // Dark theme colors
        dark: {
          DEFAULT: '#0A041A',
          lighter: '#1A0B3A',
        }
      },
      fontFamily: {
        baloo: ['Baloo 2', 'cursive'],
        fredoka: ['Fredoka', 'sans-serif'],
        nunito: ['Nunito', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        pacifico: ['Pacifico', 'cursive'],
      },
      animation: {
        'aurora': 'aurora 8s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'flicker': 'flicker 3s ease-in-out infinite',
        'pulse': 'pulse 2s ease-in-out infinite',
        'pulse-glow': 'pulse 2s ease-in-out infinite',
        'slow-spin': 'slow-spin 20s linear infinite',
      },
      keyframes: {
        aurora: {
          '0%, 100%': { transform: 'translateX(0%) translateY(0%) rotate(0deg)', opacity: '0.5' },
          '33%': { transform: 'translateX(30%) translateY(-30%) rotate(120deg)', opacity: '0.8' },
          '66%': { transform: 'translateX(-20%) translateY(20%) rotate(240deg)', opacity: '0.6' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px currentColor, 0 0 10px currentColor' },
          '100%': { boxShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'slow-spin': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '40px',
        '3xl': '64px',
      },
      // Thêm transform để hỗ trợ GPU acceleration
      transform: {
        'gpu': 'translate3d(0, 0, 0)',
      },
      // Thêm will-change utilities
      willChange: {
        'transform': 'transform',
        'opacity': 'opacity',
        'auto': 'auto',
      },
      // Thêm transition timing functions
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      // Thêm box shadow cho glow effects
      boxShadow: {
        'glow-sm': '0 0 10px var(--tw-shadow-color)',
        'glow-md': '0 0 20px var(--tw-shadow-color)',
        'glow-lg': '0 0 30px var(--tw-shadow-color)',
        'glow-xl': '0 0 40px var(--tw-shadow-color)',
      },
    },
  },
  plugins: [],
}
