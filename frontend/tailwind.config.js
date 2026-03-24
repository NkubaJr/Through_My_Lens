/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        earth: {
          50: '#fdf8f0',
          100: '#faefd9',
          200: '#f5d9a8',
          300: '#edb96a',
          400: '#e49a3a',
          500: '#c97d20',
          600: '#a85f18',
          700: '#7d4415',
          800: '#5c3212',
          900: '#3d2009',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}