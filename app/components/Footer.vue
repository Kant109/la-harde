<template>
  <footer class="py-12 mt-20" style="background-color: var(--color-primary);">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Logo et description -->
        <div>
          <div class="flex items-center space-x-3 mb-4">
            <div class="w-14 h-14 flex items-center justify-center">
              <NuxtImg
                src="/images/logo-harde.png"
                alt="LA HARDE"
                class="w-full h-full object-contain"
                width="56"
                height="56"
                format="webp"
              />
            </div>
            <div>
              <h3 class="text-2xl font-extrabold" style="color: var(--color-secondary);">LA HARDE</h3>
              <p class="text-base font-semibold" style="color: var(--color-secondary);">Les Sangliers Explosifs</p>
            </div>
          </div>
          <p class="text-base font-medium leading-relaxed" style="color: var(--color-secondary);">
            La puissance du peloton sauvage. Équipe cycliste professionnelle basée en France.
          </p>
        </div>

        <!-- Navigation -->
        <div>
          <h4 class="text-xl font-extrabold mb-4" style="color: var(--color-secondary);">Navigation</h4>
          <ul class="space-y-3">
            <li v-for="link in navLinks" :key="link.path">
              <NuxtLink
                :to="link.path"
                class="text-base font-semibold transition-all duration-300 hover:translate-x-2 inline-block"
                style="color: var(--color-secondary);"
                @mouseenter="(e) => e.target.style.color = 'var(--color-secondary)'"
                @mouseleave="(e) => e.target.style.color = 'var(--color-secondary)'"
              >
                {{ link.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Réseaux sociaux -->
        <div>
          <h4 class="text-xl font-extrabold mb-4" style="color: var(--color-secondary);">Suivez-nous</h4>
          <div class="flex space-x-4">
            <a
              v-for="social in socials"
              :key="social.name"
              :href="social.url"
              target="_blank"
              rel="noopener noreferrer"
              class="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-12"
              style="background-color: var(--color-secondary);"
              :aria-label="social.name"
            >
              <component :is="social.icon" class="w-6 h-6" style="color: var(--color-background);" />
            </a>
          </div>
        </div>
      </div>

      <!-- Copyright et mentions légales -->
      <div class="mt-12 pt-8 border-t text-center" style="border-color: rgba(109, 42, 49, 0.5);">
        <p class="text-base mb-3 font-semibold" style="color: var(--color-secondary);">
          © 2025 LA HARDE - Les Sangliers Explosifs. Tous droits réservés.
        </p>
        <p class="text-sm font-medium" style="color: var(--color-text);">
          <NuxtLink to="/mentions-legales" class="hover:underline font-bold" style="color: var(--color-secondary);">
            Mentions légales
          </NuxtLink>
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { h } from 'vue'

const navLinks = [
  { name: 'Accueil', path: '/' },
  { name: 'L\'équipe', path: '/equipe' },
  { name: 'Histoire', path: '/histoire' },
  { name: 'Boutique', path: '/boutique' }
]

// Icônes SVG comme composants
const InstagramIcon = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  fill: 'currentColor',
  viewBox: '0 0 24 24'
}, [
  h('path', {
    d: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z'
  })
])

const TwitterIcon = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  fill: 'currentColor',
  viewBox: '0 0 24 24'
}, [
  h('path', {
    d: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z'
  })
])

const YoutubeIcon = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  fill: 'currentColor',
  viewBox: '0 0 24 24'
}, [
  h('path', {
    d: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z'
  })
])

const socials = [
  { name: 'Instagram', url: 'https://instagram.com/laharde', icon: InstagramIcon },
  { name: 'X (Twitter)', url: 'https://x.com/laharde', icon: TwitterIcon },
  { name: 'YouTube', url: 'https://youtube.com/@laharde', icon: YoutubeIcon }
]
</script>
