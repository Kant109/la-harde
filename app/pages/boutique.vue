<template>
  <div>
    <!-- Hero Section -->
    <section class="relative py-32 overflow-hidden">
      <!-- Background -->
      <div class="absolute inset-0" style="background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-background) 100%);"></div>

      <div class="relative z-10 container mx-auto px-4 text-center">
        <h1 class="text-5xl md:text-6xl font-extrabold mb-6" style="color: var(--color-secondary);">
          Boutique Officielle
        </h1>
        <p class="text-xl md:text-2xl max-w-3xl mx-auto font-medium" style="color: var(--color-text);">
          Arborez fièrement les couleurs de LA HARDE avec notre collection officielle.
          Devenez un Sanglier Explosif !
        </p>
      </div>

      <!-- Shopping badge -->
      <div class="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 px-6 py-3 rounded-full" style="background-color: var(--color-secondary);">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="color: var(--color-background);">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="font-bold text-base" style="color: var(--color-background);">Livraison gratuite dès 50€</span>
      </div>
    </section>

    <!-- Filtres -->
    <section class="py-8" style="background-color: var(--color-primary);">
      <div class="container mx-auto px-4">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <!-- Catégories -->
          <div class="flex flex-wrap gap-3">
            <button
              v-for="category in categories"
              :key="category"
              @click="selectedCategory = category"
              class="px-6 py-3 rounded-lg font-bold text-base transition-all duration-300 hover:scale-105"
              :style="{
                backgroundColor: selectedCategory === category ? 'var(--color-secondary)' : 'var(--color-accent)',
                color: selectedCategory === category ? 'var(--color-primary)' : 'var(--color-text)',
                border: selectedCategory === category ? '3px solid var(--color-secondary)' : '2px solid rgba(109, 42, 49, 0.3)',
                boxShadow: selectedCategory === category ? '0 4px 12px rgba(109, 42, 49, 0.4)' : 'none'
              }"
            >
              {{ category }}
            </button>
          </div>

          <!-- Compteur produits -->
          <div class="text-base font-semibold" style="color: var(--color-text);">
            {{ filteredProducts.length }} produit(s)
          </div>
        </div>
      </div>
    </section>

    <!-- Grille de produits -->
    <section class="py-20">
      <div class="container mx-auto px-4">
        <div v-if="filteredProducts.length === 0" class="text-center py-12">
          <p class="text-2xl font-medium" style="color: var(--color-text);">
            Aucun produit dans cette catégorie
          </p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ProductCard
            v-for="product in filteredProducts"
            :key="product.id"
            :product="product"
            @add-to-cart="addToCart"
          />
        </div>
      </div>
    </section>

    <!-- Section Avantages -->
    <section class="py-20" style="background-color: var(--color-primary);">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            v-for="advantage in advantages"
            :key="advantage.title"
            class="text-center"
          >
            <div class="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center " style="background-color: var(--color-secondary);">
              <component :is="advantage.icon" class="w-10 h-10" style="color: var(--color-background);" />
            </div>
            <h3 class="text-2xl font-extrabold mb-3" style="color: var(--color-secondary);">
              {{ advantage.title }}
            </h3>
            <p class="text-base font-medium" style="color: var(--color-text);">
              {{ advantage.description }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h } from 'vue'
import productsData from '~/data/products.json'

// SEO
useHead({
  title: 'Boutique Officielle - LA HARDE',
  meta: [
    {
      name: 'description',
      content: 'Boutique officielle de l\'équipe cycliste LA HARDE. Maillots, accessoires et équipements aux couleurs des Sangliers Explosifs. Livraison gratuite dès 50€.'
    }
  ]
})

// Données
const products = ref(productsData)
const selectedCategory = ref('Tous')

const categories = computed(() => {
  const cats = ['Tous', ...new Set(products.value.map(p => p.category))]
  return cats
})

const filteredProducts = computed(() => {
  if (selectedCategory.value === 'Tous') {
    return products.value
  }
  return products.value.filter(p => p.category === selectedCategory.value)
})

// Fonctions
const addToCart = (product: any) => {
  // Récupérer le panier depuis localStorage
  const cart = JSON.parse(localStorage.getItem('laharde-cart') || '[]')

  // Vérifier si le produit existe déjà
  const existingItem = cart.find((item: any) => item.id === product.id)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({ ...product, quantity: 1 })
  }

  // Sauvegarder dans localStorage
  localStorage.setItem('laharde-cart', JSON.stringify(cart))

  // Dispatch event pour notifier le layout
  window.dispatchEvent(new CustomEvent('cart-updated'))

  // Feedback visuel
  alert(`${product.name} ajouté au panier !`)
}

// Icônes pour les avantages
const TruckIcon = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  fill: 'none',
  viewBox: '0 0 24 24',
  stroke: 'currentColor'
}, [
  h('path', {
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    d: 'M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0'
  })
])

const ShieldIcon = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  fill: 'none',
  viewBox: '0 0 24 24',
  stroke: 'currentColor'
}, [
  h('path', {
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    d: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
  })
])

const RefreshIcon = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  fill: 'none',
  viewBox: '0 0 24 24',
  stroke: 'currentColor'
}, [
  h('path', {
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    d: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
  })
])

const advantages = [
  {
    title: 'Livraison Rapide',
    description: 'Livraison gratuite dès 50€ d\'achat. Recevez votre commande en 3-5 jours ouvrés.',
    icon: TruckIcon
  },
  {
    title: 'Qualité Garantie',
    description: 'Tous nos produits sont de qualité professionnelle, testés et approuvés par l\'équipe.',
    icon: ShieldIcon
  },
  {
    title: 'Retours Faciles',
    description: '30 jours pour changer d\'avis. Retours gratuits, sans questions.',
    icon: RefreshIcon
  }
]
</script>
