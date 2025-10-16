<template>
  <Teleport to="body">
    <Transition name="cart">
      <div v-if="isOpen" class="fixed inset-0 z-50 overflow-hidden">
        <!-- Overlay -->
        <div
          class="absolute inset-0 bg-black bg-opacity-75 transition-opacity"
          @click="$emit('close')"
        ></div>

        <!-- Sidebar -->
        <div class="absolute right-0 top-0 bottom-0 w-full max-w-md shadow-2xl overflow-y-auto" style="background-color: var(--color-primary);">
          <div class="p-6">
            <!-- Header -->
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold" style="color: var(--color-secondary);">Votre Panier</h2>
              <button
                @click="$emit('close')"
                class="p-2 rounded-lg transition-all duration-300 hover:scale-110 hover:rotate-90"
                style="background-color: var(--color-secondary);"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="color: var(--color-background);">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Panier vide -->
            <div v-if="items.length === 0" class="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="color: var(--color-secondary); opacity: 0.6;">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p class="text-lg font-semibold" style="color: var(--color-text);">Votre panier est vide</p>
              <button @click="$emit('close')" class="btn-primary mt-6">
                Continuer vos achats
              </button>
            </div>

            <!-- Articles du panier -->
            <div v-else class="space-y-4">
              <div
                v-for="item in items"
                :key="item.id"
                class="flex items-center space-x-4 p-4 rounded-lg"
                style="background-color: var(--color-background);"
              >
                <!-- Image -->
                <img
                  :src="item.image"
                  :alt="item.name"
                  class="w-20 h-20 object-cover rounded"
                  @error="handleImageError"
                />

                <!-- Détails -->
                <div class="flex-grow">
                  <h3 class="font-semibold mb-1" style="color: var(--color-secondary);">{{ item.name }}</h3>
                  <p class="text-sm mb-2 font-medium" style="color: var(--color-text);">
                    {{ formatPrice(item.price) }}
                  </p>

                  <!-- Quantité -->
                  <div class="flex items-center space-x-2">
                    <button
                      @click="$emit('update-quantity', item.id, item.quantity - 1)"
                      class="w-6 h-6 rounded flex items-center justify-center transition-all duration-300 hover:scale-110"
                      style="background-color: var(--color-secondary); color: var(--color-background);"
                    >
                      -
                    </button>
                    <span class="text-sm font-semibold w-8 text-center" style="color: var(--color-text);">
                      {{ item.quantity }}
                    </span>
                    <button
                      @click="$emit('update-quantity', item.id, item.quantity + 1)"
                      class="w-6 h-6 rounded flex items-center justify-center transition-all duration-300 hover:scale-110"
                      style="background-color: var(--color-secondary); color: var(--color-background);"
                    >
                      +
                    </button>
                  </div>
                </div>

                <!-- Supprimer -->
                <button
                  @click="$emit('remove-item', item.id)"
                  class="p-2 rounded-lg transition-all duration-300 hover:scale-110 hover:bg-red-500 hover:bg-opacity-20"
                  style="color: var(--color-secondary);"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Total et checkout -->
            <div v-if="items.length > 0" class="mt-8 pt-6 border-t" style="border-color: rgba(109, 42, 49, 0.5);">
              <div class="flex items-center justify-between mb-6">
                <span class="text-xl font-bold" style="color: var(--color-text);">Total</span>
                <span class="text-2xl font-bold" style="color: var(--color-secondary);">
                  {{ formatPrice(total) }}
                </span>
              </div>

              <button
                @click="handleCheckout"
                class="btn-primary w-full flex items-center justify-center space-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span>Passer commande</span>
              </button>

              <button
                @click="$emit('clear-cart')"
                class="btn-secondary w-full mt-3"
              >
                Vider le panier
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
}

const props = defineProps<{
  isOpen: boolean
  items: CartItem[]
}>()

const emit = defineEmits(['close', 'update-quantity', 'remove-item', 'clear-cart'])

const total = computed(() => {
  return props.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
})

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement
  target.src = 'https://via.placeholder.com/80x80/3B2F2F/CDA434?text=LH'
}

const handleCheckout = () => {
  alert('Merci pour votre commande ! Cette fonctionnalité est en cours de développement.')
  emit('clear-cart')
  emit('close')
}
</script>

<style scoped>
.cart-enter-active,
.cart-leave-active {
  transition: all 0.3s ease;
}

.cart-enter-from,
.cart-leave-to {
  opacity: 0;
}

.cart-enter-from > div:last-child,
.cart-leave-to > div:last-child {
  transform: translateX(100%);
}
</style>
