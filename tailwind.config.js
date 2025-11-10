/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        netflix: {
          red: '#E50914',
          black: '#141414',
          gray: '#2A2A2A',
          lightGray: '#B3B3B3',
        }
      },
      fontFamily: {
        netflix: ['Netflix Sans', 'Helvetica Neue', 'Segoe UI', 'Roboto', 'Ubuntu', 'sans-serif'],
      },
      keyframes: {
        'loading-slide': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        }
      },
      animation: {
        'loading-slide': 'loading-slide 1.5s ease-in-out infinite',
        'shimmer': 'shimmer 2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}

