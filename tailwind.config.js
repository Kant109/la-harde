/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#DBD2C3',     // Beige clair (sync avec CSS variables)
        secondary: '#6D2A31',   // Bordeaux foncé (sync avec CSS variables)
        accent: '#3A3A3A',      // Gris neutre (sync avec CSS variables)
        background: '#1A1A1A',  // Fond sombre (sync avec CSS variables)
        text: '#F5F5F5',        // Texte clair (sync avec CSS variables)
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
