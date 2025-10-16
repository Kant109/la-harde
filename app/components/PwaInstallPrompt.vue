<template>
  <div
    v-if="showPrompt"
    class="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md rounded-xl shadow-2xl p-6 z-50 animate-slide-up"
    style="background-color: var(--color-primary); border: 3px solid var(--color-secondary);"
  >
    <div class="flex items-start justify-between mb-3">
      <h3 class="font-extrabold text-xl" style="color: var(--color-secondary);">Installer LA HARDE</h3>
      <button
        @click="dismissPrompt"
        class="transition-all duration-300 hover:scale-110"
        style="color: var(--color-secondary);"
        aria-label="Fermer"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    <p class="text-sm mb-4" style="color: var(--color-accent);">
      Installez l'application sur votre appareil pour un accès rapide et une expérience optimale.
    </p>
    <div class="flex gap-3">
      <button
        @click="installPwa"
        class="flex-1 px-4 py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg"
        style="background-color: var(--color-secondary); color: var(--color-primary);"
      >
        Installer
      </button>
      <button
        @click="dismissPrompt"
        class="px-4 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
        style="background-color: var(--color-accent); color: var(--color-text);"
      >
        Plus tard
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const showPrompt = ref(false)
const deferredPrompt = ref(null)

onMounted(() => {
  // Ne pas afficher si déjà installé
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return
  }

  // Vérifier si l'utilisateur a déjà refusé l'installation
  const dismissed = localStorage.getItem('pwa-install-dismissed')
  if (dismissed) {
    const dismissedDate = new Date(dismissed)
    const now = new Date()
    const daysSinceDismiss = (now - dismissedDate) / (1000 * 60 * 60 * 24)

    // Réafficher après 7 jours
    if (daysSinceDismiss < 7) {
      return
    }
  }

  // Écouter l'événement beforeinstallprompt
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt.value = e

    // Afficher le prompt après 3 secondes
    setTimeout(() => {
      showPrompt.value = true
    }, 3000)
  })

  // Écouter l'événement appinstalled
  window.addEventListener('appinstalled', () => {
    showPrompt.value = false
    deferredPrompt.value = null
    localStorage.removeItem('pwa-install-dismissed')
    console.log('PWA installed successfully!')
  })
})

const installPwa = async () => {
  if (!deferredPrompt.value) {
    console.warn('No install prompt available')
    return
  }

  try {
    deferredPrompt.value.prompt()
    const { outcome } = await deferredPrompt.value.userChoice

    if (outcome === 'accepted') {
      console.log('PWA installation accepted')
    } else {
      console.log('PWA installation declined')
      localStorage.setItem('pwa-install-dismissed', new Date().toISOString())
    }
  } catch (error) {
    console.error('Error during PWA installation:', error)
  }

  deferredPrompt.value = null
  showPrompt.value = false
}

const dismissPrompt = () => {
  showPrompt.value = false
  localStorage.setItem('pwa-install-dismissed', new Date().toISOString())
}
</script>

<style scoped>
@keyframes slide-up {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}
</style>
