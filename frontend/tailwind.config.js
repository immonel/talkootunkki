/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'cs-orange': '#EE770C',
        'cs-orange-light': '#F3A055',
        'cs-orange-soft': '#F6BC87'
      },
      fontFamily: {
        'sans': ['Zona Pro Bold', ...defaultTheme.fontFamily.sans]
      }
    },
  },
  plugins: [],
}
