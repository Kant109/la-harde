<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <Header :cart-count="cartCount" @toggle-cart="toggleCart" />

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

// Écouter les événements de mise à jour du panier
const handleCartUpdate = () => {
  loadCart()
}

// Lifecycle
onMounted(() => {
  loadCart()

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
