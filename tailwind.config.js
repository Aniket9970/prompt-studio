/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#FFFEFB',
        surface: '#F7F8FC',
        'text-primary': '#1A1A18',
        'text-secondary': '#6B6D75',
        border: '#E8E9F0',
        accent: {
          DEFAULT: '#8AAAFF',
          hover: '#B8C9FF',
          muted: 'rgba(138, 170, 255, 0.1)',
        },
        'brand-dark': {
          DEFAULT: '#1A1A18',
          hover: '#3A3A42',
        },
      },
      fontFamily: {
        display: ['Epilogue', '"Clash Display"', 'sans-serif'],
        sans: ['Satoshi', 'sans-serif'],
      },
      boxShadow: {
        card: '0px 2px 4px rgba(0, 0, 0, 0.04), 0px 1px 1px rgba(0, 0, 0, 0.01)',
        'card-hover': '0px 8px 16px -4px rgba(0, 0, 0, 0.08), 0px 4px 6px -2px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
}
