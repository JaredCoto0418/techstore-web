/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Comentadas temporalmente hasta que se agreguen los archivos de fuentes
        // 'LexendDeca-Black': ['LexendDeca-Black', 'sans-serif'],
        // 'LexendDeca-Bold': ['LexendDeca-Bold', 'sans-serif'],
        // 'LexendDeca-ExtraBold': ['LexendDeca-ExtraBold', 'sans-serif'],
        // 'LexendDeca-Light': ['LexendDeca-Light', 'sans-serif'],
        // 'LexendDeca-Medium': ['LexendDeca-Medium', 'sans-serif'],
        // 'LexendDeca-Regular': ['LexendDeca-Regular', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 

