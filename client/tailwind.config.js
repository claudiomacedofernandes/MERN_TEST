module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false,
  theme: {
    extend: {
      keyframes: {
        'pulse-50-100': {
          '0%': { opacity: '1.0' },
          '50%': { opacity: '0.7' },
          '100%': { opacity: '1.0' },
        },
      },
      animation: {
        'pulse-50-100': 'pulse-50-100 2s ease-in-out infinite',
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['disabled'],
      cursor: ['disabled'],
    },
  },
  plugins: [],
}