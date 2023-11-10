/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nblack: '#0d0d0d',
        ndarkgray: '#1f1f1f',
        nlightgray: '#d9d9d9',
        nwhite: '#ffffff',
        ndarkred: '#63203d',
        nlightred: '#ed254f'
      }
    },
  },
  plugins: [],
}

