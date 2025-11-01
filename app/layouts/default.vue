<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <Header
      :cart-count="cartCount"
      :notifications-enabled="notificationsEnabled"
      @toggle-cart="toggleCart"
      @toggle-notifications="toggleNotifications"
    />

    <!-- Main Content -->
    <main class="flex-grow pt-20">
      <slot />
    </main>

    <!-- Footer -->
    <Footer />

    <!-- Cart Sidebar -->
    <CartSidebar
      :is-open="isCartOpen"
      :items="cartItems"
      @close="toggleCart"
      @update-quantity="updateQuantity"
      @remove-item="removeItem"
      @clear-cart="clearCart"
    />

    <!-- PWA Install Prompt -->
    <PwaInstallPrompt />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
}

// État du panier
const isCartOpen = ref(false)
const cartItems = ref<CartItem[]>([])

// État des notifications
const notificationsEnabled = ref(false)
const notificationLoading = ref(false)

// Composable pour les notifications
const { isSupported, subscribe, unsubscribe, isSubscribed, sendTestNotification } = useNotifications()

// Compteur d'articles
const cartCount = computed(() => {
  return cartItems.value.reduce((total, item) => total + item.quantity, 0)
})

// Fonctions
const toggleCart = () => {
  isCartOpen.value = !isCartOpen.value
}

const loadCart = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('laharde-cart')
    if (saved) {
      cartItems.value = JSON.parse(saved)
    }
  }
}

const saveCart = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('laharde-cart', JSON.stringify(cartItems.value))
  }
}

const updateQuantity = (productId: number, newQuantity: number) => {
  if (newQuantity <= 0) {
    removeItem(productId)
    return
  }

  const item = cartItems.value.find(item => item.id === productId)
  if (item) {
    item.quantity = newQuantity
    saveCart()
  }
}

const removeItem = (productId: number) => {
  cartItems.value = cartItems.value.filter(item => item.id !== productId)
  saveCart()
}

const clearCart = () => {
  cartItems.value = []
  saveCart()
}

// Fonctions pour les notifications
const toggleNotifications = async () => {
  if (notificationLoading.value) return

  if (!isSupported()) {
    alert('Les notifications push ne sont pas supportées par votre navigateur.')
    return
  }

  notificationLoading.value = true

  try {
    if (notificationsEnabled.value) {
      // Désactiver les notifications
      const success = await unsubscribe()
      if (success) {
        notificationsEnabled.value = false
        console.log('Notifications désactivées')
      }
    } else {
      // Activer les notifications
      const subscription = await subscribe()
      if (subscription) {
        notificationsEnabled.value = true
        console.log('Notifications activées')
      }
    }
  } catch (error) {
    console.error('Erreur lors de la gestion des notifications:', error)
    alert('Une erreur est survenue lors de la configuration des notifications.')
  } finally {
    notificationLoading.value = false
  }
}

const checkNotificationStatus = async () => {
  if (!isSupported()) return

  try {
    const subscribed = await isSubscribed()
    notificationsEnabled.value = subscribed

    // Vérifier aussi le localStorage pour la cohérence
    const savedState = localStorage.getItem('notifications-enabled')
    if (savedState !== null) {
      notificationsEnabled.value = savedState === 'true'
    }
  } catch (error) {
    console.error('Erreur lors de la vérification du statut des notifications:', error)
  }
}

// Écouter les événements de mise à jour du panier
const handleCartUpdate = () => {
  loadCart()
}

// Lifecycle
onMounted(() => {
  loadCart()
  checkNotificationStatus()

  if (typeof window !== 'undefined') {
    window.addEventListener('cart-updated', handleCartUpdate)
  }
})

// Cleanup
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    window.removeEventListener('cart-updated', handleCartUpdate)
  })
}
</script>
