/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FFFFFF',
        forest: '#2B2D42',
        coral: '#FF4D85',
        sage: '#00E5FF',
        sunny: '#FFDE00',
        'forest-light': '#8D99AE',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(27, 67, 50, 0.1)',
      }
    },
  },
  plugins: [],
}
