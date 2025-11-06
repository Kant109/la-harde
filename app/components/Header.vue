<template>
  <header class="fixed top-0 left-0 right-0 z-50 transition-all duration-300" :class="{ 'bg-opacity-95': scrolled, 'bg-transparent': !scrolled }" style="background-color: var(--color-primary);">
    <nav class="container mx-auto px-4 py-4">
      <div class="relative flex items-center justify-between w-full max-w-7xl mx-auto px-4">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center space-x-3 group flex-shrink-0 min-w-0 z-10">
          <div class="w-12 h-12 flex items-center justify-center transition-all duration-300 group-hover:scale-110 flex-shrink-0">
            <NuxtImg
              src="/images/logo-harde.png"
              alt="LA HARDE - Les Sangliers atomiques"
              class="w-full h-full object-contain"
              width="48"
              height="48"
              loading="eager"
              format="webp"
            />
          </div>
          <div class="hidden lg:flex lg:flex-col lg:justify-center min-w-0">
            <h1 class="text-2xl font-extrabold whitespace-nowrap" style="color: var(--color-secondary);">LA HARDE</h1>
            <div class="text-sm font-semibold whitespace-nowrap" style="color: var(--color-text); opacity: 0.9;">Les Sangliers atomiques</div>
          </div>
        </NuxtLink>

        <!-- Navigation Desktop - Centré par rapport à l'écran -->
        <ul class="hidden md:flex space-x-4 lg:space-x-8 items-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <li v-for="link in navLinks" :key="link.path" class="flex-shrink-0">
            <NuxtLink
              :to="link.path"
              class="font-bold text-base lg:text-lg transition-all duration-300 hover:scale-110 inline-block whitespace-nowrap"
              :style="{ color: isActive(link.path) ? 'var(--color-secondary)' : 'var(--color-text)' }"
              @mouseenter="(e) => e.target.style.color = 'var(--color-secondary)'"
              @mouseleave="(e) => e.target.style.color = isActive(link.path) ? 'var(--color-secondary)' : 'var(--color-text)'"
            >
              {{ link.name }}
            </NuxtLink>
          </li>
        </ul>

        <!-- Notifications, Panier et Menu Mobile -->
        <div class="flex items-center gap-2 flex-shrink-0 z-10">
          <!-- Bouton Notifications -->
          <button
            @click="$emit('toggle-notifications')"
            class="relative p-2 rounded-lg transition-all duration-300 hover:scale-110"
            :style="{ backgroundColor: notificationsEnabled ? 'var(--color-secondary)' : 'var(--color-accent)' }"
            :title="notificationsEnabled ? 'Désactiver les notifications' : 'Activer les notifications'"
          >
            <svg v-if="notificationsEnabled" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="color: var(--color-primary);">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="color: var(--color-primary);">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01" />
            </svg>
            <!-- Badge pour indiquer qu'elles sont activées -->
            <span
              v-if="notificationsEnabled"
              class="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse"
              style="background-color: #22c55e;"
            ></span>
          </button>

          <!-- Bouton Panier -->
          <button
            @click="$emit('toggle-cart')"
            class="relative p-2 rounded-lg transition-all duration-300 hover:scale-110"
            style="background-color: var(--color-secondary);"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="color: var(--color-primary);">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span
              v-if="cartCount > 0"
              class="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
              style="background-color: var(--color-accent); color: var(--color-text);"
            >
              {{ cartCount }}
            </span>
          </button>

          <!-- Menu Mobile -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 rounded-lg"
            style="color: var(--color-secondary);"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu Dropdown -->
      <div v-if="mobileMenuOpen" class="md:hidden mt-4 py-4 rounded-lg" style="background-color: var(--color-background);">
        <ul class="space-y-4">
          <li v-for="link in navLinks" :key="link.path">
            <NuxtLink
              :to="link.path"
              @click="mobileMenuOpen = false"
              class="block px-4 py-3 font-bold text-lg transition-all duration-300"
              :style="{ color: isActive(link.path) ? 'var(--color-secondary)' : 'var(--color-text)' }"
            >
              {{ link.name }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

defineEmits(['toggle-cart', 'toggle-notifications'])

const props = defineProps<{
  cartCount: number
  notificationsEnabled: boolean
}>()

const route = useRoute()
const scrolled = ref(false)
const mobileMenuOpen = ref(false)

const navLinks = [
  { name: 'Accueil', path: '/' },
  { name: 'L\'équipe', path: '/equipe' },
  { name: 'Histoire', path: '/histoire' },
  { name: 'Activités', path: '/activites' },
  { name: 'Boutique', path: '/boutique' },
  { name: 'Vote maillot 2026', path: '/vote' },
	{ name: 'Club House', path: '/club-house' }
]

const isActive = (path: string) => {
  return route.path === path
}

const handleScroll = () => {
  scrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
