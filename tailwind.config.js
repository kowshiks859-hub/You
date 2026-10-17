/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          light: '#fdfbf7',
          DEFAULT: '#f7f3e8',
          dark: '#eee8d5',
          cream: '#faf6eb',
        },
        comic: {
          black: '#121212',
          red: '#e52521',
          'red-dark': '#b91c1c',
          blue: '#1d4ed8',
          'blue-dark': '#1e3a8a',
          green: '#15803d',
          'green-light': '#22c55e',
          sand: '#d97706',
          'sand-light': '#fef3c7',
          yellow: '#facc15',
          dark: '#1c1917',
        }
      },
      fontFamily: {
        comic: ['Bangers', 'Impact', 'cursive'],
        body: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        subcomic: ['"Comic Neue"', 'cursive', 'sans-serif'],
      },
      boxShadow: {
        'comic-sm': '2px 2px 0px #000000',
        'comic': '4px 4px 0px #000000',
        'comic-lg': '6px 6px 0px #000000',
        'comic-red': '4px 4px 0px #b91c1c',
        'comic-green': '4px 4px 0px #14532d',
        'comic-blue': '4px 4px 0px #1e3a8a',
        'comic-inner': 'inset 2px 2px 0px rgba(0,0,0,0.2)',
      },
      borderWidth: {
        '3': '3px',
      },
      keyframes: {
        'pop-in': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '70%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'wiggle': {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.03)' },
        },
      },
      animation: {
        'pop-in': 'pop-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'wiggle': 'wiggle 0.5s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
