/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        mystical: {
          50: '#faf8f7',
          100: '#f3ede8',
          200: '#e8dcd2',
          300: '#d9c4b8',
          400: '#c9a896',
          500: '#b88d73',
          600: '#a8725e',
          700: '#8b5a47',
          800: '#6e473a',
          900: '#573931',
        },
        witchy: {
          50: '#f9f5fe',
          100: '#f3e8fd',
          200: '#e8d5fb',
          300: '#d9b8f6',
          400: '#c599f0',
          500: '#ae7ae8',
          600: '#9559db',
          700: '#7d3fc0',
          800: '#622fa0',
          900: '#4a2176',
        },
      },
      fontFamily: {
        serif: ['Garamond', 'Georgia', 'serif'],
        mystical: ['Cinzel', 'serif'],
      },
      backgroundImage: {
        'gradient-mystical': 'linear-gradient(135deg, #6e473a 0%, #4a2176 100%)',
        'gradient-stars': 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
}
