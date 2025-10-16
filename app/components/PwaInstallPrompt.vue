<template>
  <div
    v-if="showPrompt"
    class="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md bg-white border-2 border-black shadow-lg p-4 z-50"
  >
    <div class="flex items-start justify-between mb-2">
      <h3 class="font-montserrat font-bold text-lg">Installer LA HARDE</h3>
      <button
        @click="dismissPrompt"
        class="text-gray-500 hover:text-black transition-colors"
        aria-label="Fermer"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    <p class="text-sm text-gray-700 mb-4">
      Installez l'application sur votre appareil pour un accès rapide et une expérience optimale.
    </p>
    <div class="flex gap-2">
      <button
        @click="installPwa"
        class="flex-1 bg-black text-white px-4 py-2 font-montserrat font-semibold hover:bg-gray-800 transition-colors"
      >
        Installer
      </button>
      <button
        @click="dismissPrompt"
        class="px-4 py-2 border-2 border-black font-montserrat font-semibold hover:bg-gray-100 transition-colors"
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
    showPrompt.value = true
  })

  // Écouter l'événement appinstalled
  window.addEventListener('appinstalled', () => {
    showPrompt.value = false
    deferredPrompt.value = null
    localStorage.removeItem('pwa-install-dismissed')
  })
})

const installPwa = async () => {
  if (!deferredPrompt.value) {
    return
  }

  deferredPrompt.value.prompt()
  const { outcome } = await deferredPrompt.value.userChoice

  if (outcome === 'accepted') {
    console.log('PWA installation accepted')
  } else {
    console.log('PWA installation declined')
  }

  deferredPrompt.value = null
  showPrompt.value = false
}

const dismissPrompt = () => {
  showPrompt.value = false
  localStorage.setItem('pwa-install-dismissed', new Date().toISOString())
}
</script>
