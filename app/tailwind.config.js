// Tailwind CSS Configuration for QR Generator App
// Dark mode enabled, using Tailwind's neutral color palette

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enable dark mode via .dark class
  content: [
    './components/**/*.{vue,js,ts}',
    './pages/**/*.{vue,js,ts}',
    './composables/**/*.{js,ts}',
    './app.vue',
    './layouts/**/*.{vue,js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        // Use Tailwind's neutral palette for dark mode
        background: {
          DEFAULT: '#171717', // neutral-900
          light: '#262626',   // neutral-800
          dark: '#0a0a0a',    // neutral-950
        },
        surface: {
          DEFAULT: '#262626', // neutral-800
          light: '#404040',   // neutral-700
          dark: '#171717',    // neutral-900
        },
        primary: {
          DEFAULT: '#a3a3a3', // neutral-400
          light: '#d4d4d4',   // neutral-300
          dark: '#525252',    // neutral-600
        },
        accent: {
          DEFAULT: '#f5f5f5', // neutral-100
          dark: '#d4d4d4',    // neutral-300
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
