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
        btp: {
          orange: '#F97316',
          'orange-dark': '#EA580C',
          navy: '#0F172A',
          'navy-light': '#1E293B',
          gold: '#EAB308',
          emerald: '#10B981',
          accent: '#0284C7',
        }
      }
    },
  },
  plugins: [],
}
