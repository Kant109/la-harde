<template>
  <div class="min-h-screen py-24">
    <div class="container mx-auto px-4">
      <!-- Breadcrumb -->
      <nav class="mb-8">
        <ol class="flex items-center space-x-2 text-base font-semibold">
          <li>
            <NuxtLink to="/" class="hover:underline" style="color: var(--color-text);">Accueil</NuxtLink>
          </li>
          <li style="color: var(--color-text);">/</li>
          <li>
            <NuxtLink to="/boutique" class="hover:underline" style="color: var(--color-text);">Boutique</NuxtLink>
          </li>
          <li style="color: var(--color-text);">/</li>
          <li style="color: var(--color-secondary);" class="font-bold">{{ product?.name }}</li>
        </ol>
      </nav>

      <!-- Product not found -->
      <div v-if="!product" class="text-center py-20">
        <h1 class="text-4xl font-extrabold mb-6" style="color: var(--color-secondary);">Produit non trouvé</h1>
        <NuxtLink to="/boutique" class="btn-primary">Retour à la boutique</NuxtLink>
      </div>

      <!-- Product details -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Image gallery -->
        <div>
          <!-- Main image -->
          <div class="mb-4 rounded-xl overflow-hidden flex items-center justify-center" style="background-color: var(--color-primary); min-height: 500px;">
            <img
              :src="selectedImage"
              :alt="product.name"
              class="w-full h-auto max-h-[600px] object-contain"
              @error="handleImageError"
            />
          </div>

          <!-- Thumbnails -->
          <div class="grid grid-cols-4 gap-4">
            <button
              v-for="(image, index) in product.images"
              :key="index"
              @click="selectedImage = image"
              class="rounded-lg overflow-hidden border-4 transition-all duration-300 hover:scale-105 flex items-center justify-center"
              :class="selectedImage === image ? 'border-[var(--color-secondary)]' : 'border-transparent'"
              style="background-color: var(--color-primary); min-height: 100px;"
            >
              <img
                :src="image"
                :alt="`${product.name} - Image ${index + 1}`"
                class="w-full h-auto max-h-24 object-contain"
                @error="handleImageError"
              />
            </button>
          </div>
        </div>

        <!-- Product info -->
        <div>
          <!-- Category badge -->
          <div class="mb-4">
            <span class="inline-block px-4 py-2 rounded-full text-sm font-bold" style="background-color: var(--color-accent); color: var(--color-text);">
              {{ product.category }}
            </span>
          </div>

          <!-- Product name -->
          <h1 class="text-4xl md:text-5xl font-extrabold mb-4" style="color: var(--color-primary);">
            {{ product.name }}
          </h1>

          <!-- Price -->
          <div class="mb-6">
            <span class="text-5xl font-extrabold" style="color: var(--color-primary);">
              {{ formatPrice(product.price) }}
            </span>
          </div>

          <!-- Stock info -->
          <div class="mb-6">
            <p v-if="product.stock > 0" class="text-lg font-bold flex items-center gap-2" style="color: #4CAF50;">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              En stock ({{ product.stock }} disponibles)
            </p>
            <p v-else class="text-lg font-bold flex items-center gap-2 px-4 py-2 rounded-lg" style="color: #FF6B6B; background-color: rgba(255, 107, 107, 0.15);">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Rupture de stock
            </p>
          </div>

          <!-- Description -->
          <div class="mb-8">
            <h2 class="text-2xl font-extrabold mb-4" style="color: var(--color-primary);">Description</h2>
            <p class="text-lg font-medium leading-relaxed" style="color: var(--color-text);">
              {{ product.fullDescription }}
            </p>
          </div>

          <!-- Size selector -->
          <div v-if="product.sizes && product.sizes.length > 0" class="mb-6">
            <h3 class="text-xl font-extrabold mb-3" style="color: var(--color-primary);">Taille</h3>
            <div class="flex flex-wrap gap-3">
              <button
                v-for="size in product.sizes"
                :key="size"
                @click="selectedSize = size"
                class="px-6 py-3 rounded-lg font-bold text-base transition-all duration-300 hover:scale-105"
                :class="selectedSize === size ? 'scale-105' : ''"
                :style="selectedSize === size
                  ? 'background-color: var(--color-primary); color: var(--color-secondary);'
                  : 'background-color: var(--color-secondary); color: var(--color-text); border: 2px solid var(--color-primary);'"
              >
                {{ size }}
              </button>
            </div>
          </div>

          <!-- Color selector -->
          <div v-if="product.colors && product.colors.length > 1" class="mb-8">
            <h3 class="text-xl font-extrabold mb-3" style="color: var(--color-primary);">Couleur</h3>
            <div class="flex flex-wrap gap-3">
              <button
                v-for="color in product.colors"
                :key="color"
                @click="selectedColor = color"
                class="px-6 py-3 rounded-lg font-bold text-base transition-all duration-300 hover:scale-105"
                :class="selectedColor === color ? 'scale-105' : ''"
                :style="selectedColor === color
                  ? 'background-color: var(--color-primary); color: var(--color-secondary);'
                  : 'background-color: var(--color-secondary); color: var(--color-text); border: 2px solid var(--color-primary);'"
              >
                {{ color }}
              </button>
            </div>
          </div>

          <!-- Quantity selector -->
          <div class="mb-8">
            <h3 class="text-xl font-extrabold mb-3" style="color: var(--color-primary);">Quantité</h3>
            <div class="flex items-center space-x-4">
              <button
                @click="quantity = Math.max(1, quantity - 1)"
                class="w-12 h-12 rounded-lg font-bold text-2xl transition-all duration-300 hover:scale-110"
                style="background-color: var(--color-primary); color: var(--color-secondary);"
              >
                -
              </button>
              <span class="text-3xl font-extrabold w-16 text-center" style="color: var(--color-text);">
                {{ quantity }}
              </span>
              <button
                @click="quantity = Math.min(product.stock, quantity + 1)"
                class="w-12 h-12 rounded-lg font-bold text-2xl transition-all duration-300 hover:scale-110"
                style="background-color: var(--color-primary); color: var(--color-secondary);"
              >
                +
              </button>
            </div>
          </div>

          <!-- Add to cart button -->
          <button
            @click="addToCart"
            :disabled="product.stock === 0"
            class="w-full btn-primary flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed text-xl"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>{{ product.stock === 0 ? 'Rupture de stock' : 'Ajouter au panier' }}</span>
          </button>

          <!-- Back to shop link -->
          <div class="mt-8 text-center">
            <NuxtLink to="/boutique" class="text-lg font-bold hover:underline" style="color: var(--color-primary);">
              ← Retour à la boutique
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import productsData from '~/data/products.json'

const route = useRoute()
const slug = route.params.slug as string

// Find product by slug
const product = computed(() => {
  return productsData.find(p => p.slug === slug)
})

// Selected options
const selectedImage = ref(product.value?.images?.[0] || product.value?.image || '')
const selectedSize = ref(product.value?.sizes?.[0] || '')
const selectedColor = ref(product.value?.colors?.[0] || '')
const quantity = ref(1)

// Update selected image when product changes
watch(() => product.value, (newProduct) => {
  if (newProduct) {
    selectedImage.value = newProduct.images?.[0] || newProduct.image
    selectedSize.value = newProduct.sizes?.[0] || ''
    selectedColor.value = newProduct.colors?.[0] || ''
    quantity.value = 1
  }
})

// SEO
useHead({
  title: computed(() => product.value ? `${product.value.name} - LA HARDE` : 'Produit - LA HARDE'),
  meta: computed(() => [
    {
      name: 'description',
      content: product.value?.description || 'Boutique officielle LA HARDE - Les Sangliers atomiques'
    },
    {
      property: 'og:title',
      content: product.value ? `${product.value.name} - LA HARDE` : 'Produit - LA HARDE'
    },
    {
      property: 'og:description',
      content: product.value?.description || ''
    },
    {
      property: 'og:image',
      content: product.value?.image || '/images/logo-og.png'
    }
  ])
})

// Functions
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement
  target.src = 'https://via.placeholder.com/600x600/3B2F2F/CDA434?text=' + encodeURIComponent('LA HARDE')
}

const addToCart = () => {
  if (!product.value || product.value.stock === 0) return

  console.log('Adding to cart:', {
    product: product.value,
    size: selectedSize.value,
    color: selectedColor.value,
    quantity: quantity.value
  })

  // TODO: Implement cart functionality
  alert(`${quantity.value}x ${product.value.name} ajouté au panier!`)
}
</script>
