/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#11224E',
          DEFAULT: '#11224E',
        },
        accent: {
          orange: '#F87B1B',
          DEFAULT: '#F87B1B',
        },
        secondary: {
          green: '#CBD99B',
          DEFAULT: '#CBD99B',
        },
        light: {
          DEFAULT: '#EEEEEE',
        },
        // Dark mode colors
        dark: {
          bg: '#0A1628',
          card: '#1A2942',
          text: '#E5E7EB',
        }
      },
    },
  },
  plugins: [],
}