/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0A0A0F",
        surface: "#111118",
        card: "#16161F",
        border: "#1E1E2E",
        lime: "#A8FF3E",
        muted: "#6B7280",
      },
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        heading: ["Syne", "sans-serif"],
      },
    },
  },
  plugins: [],
  }
