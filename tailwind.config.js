/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Hỗ trợ Dark Mode bằng class 'dark'
  theme: {
    extend: {
      colors: {
        background: "var(--bg)",
        card: "var(--surface)",
      },
    },
  },
  plugins: [],
}
