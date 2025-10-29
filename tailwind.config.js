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
        primary: '#F4442E',     // Beige clair (sync avec CSS variables)
        secondary: '#FC9E4F',   // Bordeaux foncé (sync avec CSS variables)
        accent: '#EDD382',      // Gris neutre (sync avec CSS variables)
        background: '#1A1A1A',  // Fond sombre (sync avec CSS variables)
        text: '#F2F3AE',        // Texte clair (sync avec CSS variables)
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        heading: ['Montserrat', 'fantasy'],
      },
    },
  },
  plugins: [],
}
