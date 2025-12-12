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
        'pulse-glow': 'pulse 2s ease-in-out infinite',
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
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
