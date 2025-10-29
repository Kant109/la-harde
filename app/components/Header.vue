<template>
  <header class="fixed top-0 left-0 right-0 z-50 transition-all duration-300" :class="{ 'bg-opacity-95': scrolled, 'bg-transparent': !scrolled }" style="background-color: var(--color-primary);">
    <nav class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-center">
        <div class="flex items-center justify-between w-full max-w-7xl">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center space-x-3 group flex-shrink-0">
            <div class="w-12 h-12 flex items-center justify-center transition-all duration-300 group-hover:scale-110 flex-shrink-0">
              <NuxtImg
                src="/images/logo-harde.png"
                alt="LA HARDE - Les Sangliers Explosifs"
                class="w-full h-full object-contain"
                width="48"
                height="48"
                loading="eager"
                format="webp"
              />
            </div>
            <div class="hidden md:flex md:flex-col md:justify-center">
              <h1 class="text-2xl font-extrabold" style="color: var(--color-secondary);">LA HARDE</h1>
              <div class="text-sm font-semibold" style="color: var(--color-text); opacity: 0.9;">Les Sangliers Explosifs</div>
            </div>
          </NuxtLink>

          <!-- Navigation Desktop -->
          <ul class="hidden md:flex space-x-8 items-center absolute left-1/2 transform -translate-x-1/2">
            <li v-for="link in navLinks" :key="link.path">
              <NuxtLink
                :to="link.path"
                class="font-bold text-lg transition-all duration-300 hover:scale-110 inline-block"
                :style="{ color: isActive(link.path) ? 'var(--color-secondary)' : 'var(--color-text)' }"
                @mouseenter="(e) => e.target.style.color = 'var(--color-secondary)'"
                @mouseleave="(e) => e.target.style.color = isActive(link.path) ? 'var(--color-secondary)' : 'var(--color-text)'"
              >
                {{ link.name }}
              </NuxtLink>
            </li>
          </ul>

          <!-- Panier et Menu Mobile -->
          <div class="flex items-center gap-2 flex-shrink-0">
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

defineEmits(['toggle-cart'])

const props = defineProps<{
  cartCount: number
}>()

const route = useRoute()
const scrolled = ref(false)
const mobileMenuOpen = ref(false)

const navLinks = [
  { name: 'Accueil', path: '/' },
  { name: 'L\'équipe', path: '/equipe' },
  { name: 'Histoire', path: '/histoire' },
  { name: 'Activités', path: '/activites' },
  { name: 'Vote', path: '/vote' },
  { name: 'Boutique', path: '/boutique' }
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
