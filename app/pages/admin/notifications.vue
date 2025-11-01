<template>
  <div class="min-h-screen py-20 px-4">
    <div class="container mx-auto max-w-2xl">
      <!-- Vérification de la clé d'accès -->
      <div v-if="!isAuthenticated" class="bg-accent/10 rounded-lg p-8 shadow-xl">
        <h1 class="text-3xl font-heading font-bold mb-6 text-center" style="color: var(--color-primary);">
          Accès Administrateur
        </h1>
        <p class="mb-6 text-center" style="color: var(--color-text);">
          Entrez la clé d'accès pour accéder à l'envoi de notifications
        </p>

        <div class="space-y-4">
          <div>
            <input
              v-model="accessKey"
              type="password"
              placeholder="Clé d'accès"
              class="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
              style="background-color: var(--color-background); color: var(--color-text); border: 2px solid var(--color-accent);"
              @keyup.enter="verifyAccessKey"
            />
          </div>

          <button
            @click="verifyAccessKey"
            class="w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
            style="background-color: var(--color-secondary); color: var(--color-primary);"
          >
            Vérifier
          </button>

          <p v-if="errorMessage" class="text-red-500 text-center text-sm">
            {{ errorMessage }}
          </p>
        </div>
      </div>

      <!-- Interface d'envoi de notifications -->
      <div v-else class="space-y-6">
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-heading font-bold" style="color: var(--color-primary);">
            Envoyer une notification
          </h1>
          <button
            @click="logout"
            class="py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-300 hover:scale-105"
            style="background-color: var(--color-accent); color: var(--color-primary);"
          >
            Déconnexion
          </button>
        </div>

        <div class="bg-accent/10 rounded-lg p-8 shadow-xl space-y-6">
          <!-- Titre de la notification -->
          <div>
            <label class="block mb-2 font-semibold" style="color: var(--color-primary);">
              Titre de la notification
            </label>
            <input
              v-model="notification.title"
              type="text"
              placeholder="Ex: Nouvelle sortie dimanche !"
              class="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
              style="background-color: var(--color-background); color: var(--color-text); border: 2px solid var(--color-accent);"
            />
          </div>

          <!-- Corps de la notification -->
          <div>
            <label class="block mb-2 font-semibold" style="color: var(--color-primary);">
              Message
            </label>
            <textarea
              v-model="notification.body"
              rows="4"
              placeholder="Ex: Rendez-vous à 8h pour une sortie de 80km..."
              class="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 resize-none"
              style="background-color: var(--color-background); color: var(--color-text); border: 2px solid var(--color-accent);"
            />
          </div>

          <!-- URL optionnelle -->
          <div>
            <label class="block mb-2 font-semibold" style="color: var(--color-primary);">
              URL de destination (optionnel)
            </label>
            <input
              v-model="notification.url"
              type="text"
              placeholder="Ex: /activites"
              class="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
              style="background-color: var(--color-background); color: var(--color-text); border: 2px solid var(--color-accent);"
            />
            <p class="mt-2 text-sm" style="color: var(--color-text);">
              L'utilisateur sera redirigé vers cette URL en cliquant sur la notification
            </p>
          </div>

          <!-- Prévisualisation -->
          <div class="border-2 rounded-lg p-4" style="border-color: var(--color-accent);">
            <p class="text-sm font-semibold mb-3" style="color: var(--color-primary);">
              Aperçu de la notification
            </p>
            <div class="flex items-start space-x-3 bg-background/50 p-3 rounded">
              <NuxtImg
                src="/pwa-64x64.png"
                alt="Icon"
                class="w-10 h-10"
              />
              <div class="flex-1">
                <p class="font-bold text-sm mb-1" style="color: var(--color-text);">
                  {{ notification.title || 'Titre de la notification' }}
                </p>
                <p class="text-sm" style="color: var(--color-text);">
                  {{ notification.body || 'Message de la notification' }}
                </p>
                <p v-if="notification.url" class="text-xs mt-1" style="color: var(--color-accent);">
                  🔗 {{ notification.url }}
                </p>
              </div>
            </div>
          </div>

          <!-- Boutons d'action -->
          <div class="flex space-x-4">
            <button
              @click="sendNotification"
              :disabled="!canSend || isSending"
              class="flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              style="background-color: var(--color-secondary); color: var(--color-primary);"
            >
              {{ isSending ? 'Envoi en cours...' : 'Envoyer à tous' }}
            </button>
          </div>

          <!-- Message de succès/erreur -->
          <div v-if="sendMessage" class="text-center p-4 rounded-lg" :class="sendSuccess ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'">
            {{ sendMessage }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBaseUrl

// État d'authentification
const isAuthenticated = ref(false)
const accessKey = ref('')
const errorMessage = ref('')

// État de la notification
const notification = ref({
  title: '',
  body: '',
  url: ''
})

const isSending = ref(false)
const sendMessage = ref('')
const sendSuccess = ref(false)

// Vérifier si on peut envoyer (titre et message remplis)
const canSend = computed(() => {
  return notification.value.title.trim() !== '' && notification.value.body.trim() !== ''
})

// Vérification de la clé d'accès
const verifyAccessKey = async () => {
  errorMessage.value = ''

  if (!accessKey.value) {
    errorMessage.value = 'Veuillez entrer une clé d\'accès'
    return
  }

  // Hash SHA-256 de la clé entrée
  const encoder = new TextEncoder()
  const data = encoder.encode(accessKey.value)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

  // Récupérer le hash de la clé attendue depuis les variables d'environnement
  const expectedHash = config.public.adminKeyHash

  if (hashHex === expectedHash) {
    isAuthenticated.value = true
    // Sauvegarder l'état dans sessionStorage (valide uniquement pour la session)
    sessionStorage.setItem('admin-notifications-auth', 'true')
  } else {
    errorMessage.value = 'Clé d\'accès invalide'
    accessKey.value = ''
  }
}

// Envoyer la notification à tous
const sendNotification = async () => {
  if (!canSend.value || isSending.value) return

  isSending.value = true
  sendMessage.value = ''
  sendSuccess.value = false

  try {
    await $fetch(`${apiBaseUrl}/obtorta/herd/notifications/send`, {
      method: 'POST',
      body: {
        title: notification.value.title,
        body: notification.value.body,
        url: notification.value.url || undefined,
        icon: '/pwa-192x192.png',
        badge: '/pwa-64x64.png'
      }
    })

    sendMessage.value = 'Notification envoyée avec succès !'
    sendSuccess.value = true

    // Réinitialiser le formulaire après 2 secondes
    setTimeout(() => {
      notification.value = { title: '', body: '', url: '' }
      sendMessage.value = ''
    }, 2000)
  } catch (error) {
    console.error('Erreur lors de l\'envoi:', error)
    sendMessage.value = 'Erreur lors de l\'envoi de la notification'
    sendSuccess.value = false
  } finally {
    isSending.value = false
  }
}

// Déconnexion
const logout = () => {
  isAuthenticated.value = false
  accessKey.value = ''
  sessionStorage.removeItem('admin-notifications-auth')
  notification.value = { title: '', body: '', url: '' }
  sendMessage.value = ''
}

// Vérifier si l'utilisateur était déjà authentifié
onMounted(() => {
  const wasAuthenticated = sessionStorage.getItem('admin-notifications-auth')
  if (wasAuthenticated === 'true') {
    isAuthenticated.value = true
  }
})

// SEO
useHead({
  title: 'Administration - Notifications - LA HARDE',
  meta: [
    { name: 'description', content: 'Interface d\'administration pour l\'envoi de notifications' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
