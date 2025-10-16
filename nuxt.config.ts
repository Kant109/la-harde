// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    '@nuxt/image',
    '@vite-pwa/nuxt'
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

  css: ['~/assets/css/main.css'],

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'LA HARDE - Les Sangliers Explosifs',
      short_name: 'LA HARDE',
      description: 'Site officiel de l\'équipe cycliste LA HARDE - Les Sangliers Explosifs',
      theme_color: '#3B2F2F',
      background_color: '#F5F1ED',
      display: 'standalone',
      scope: '/',
      start_url: '/',
      icons: [
        {
          src: '/pwa-64x64.png',
          sizes: '64x64',
          type: 'image/png'
        },
        {
          src: '/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/maskable-icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
      maximumFileSizeToCacheInBytes: 5000000, // 5MB
      globPatterns: ['**/*.{js,css,html,png,jpg,jpeg,svg,ico,json,woff,woff2}'],
      cleanupOutdatedCaches: true,
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'gstatic-fonts-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          urlPattern: /^https:\/\/.*/i,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'external-resources',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24 * 7
            }
          }
        }
      ]
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 3600
    },
    devOptions: {
      enabled: true,
      type: 'module'
    }
  }
})
