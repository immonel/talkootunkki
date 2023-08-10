/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
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
