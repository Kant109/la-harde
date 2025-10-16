// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    '@nuxt/image'
  ],

  googleFonts: {
    families: {
      Montserrat: [400, 600, 700, 800],
      Roboto: [400, 500, 700]
    }
  },

  app: {
    head: {
      title: 'LA HARDE - Les Sangliers Explosifs',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Site officiel de l\'équipe cycliste LA HARDE - Les Sangliers Explosifs. Découvrez nos coureurs, notre histoire et notre boutique officielle.'
        },
        { name: 'keywords', content: 'cyclisme, équipe cycliste, LA HARDE, Sangliers Explosifs, vélo' },
        { property: 'og:title', content: 'LA HARDE - Les Sangliers Explosifs' },
        { property: 'og:description', content: 'Site officiel de l\'équipe cycliste LA HARDE - Les Sangliers Explosifs' },
        { property: 'og:image', content: '/images/logo-og.png' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'LA HARDE - Les Sangliers Explosifs' },
        { name: 'twitter:description', content: 'Site officiel de l\'équipe cycliste LA HARDE - Les Sangliers Explosifs' },
        { name: 'twitter:image', content: '/images/logo-og.png' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/images/logo-harde.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/images/logo-harde.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/images/logo-harde.png' },
        { rel: 'shortcut icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  css: ['~/assets/css/main.css']
})
