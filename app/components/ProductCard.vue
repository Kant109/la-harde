<template>
  <div class="card">
    <NuxtLink :to="`/produits/${product.slug}`">
      <!-- Image produit -->
      <div class="relative overflow-hidden h-56">
        <img
          :src="product.image"
          :alt="product.name"
          class="w-full h-full object-cover transition-all duration-500 hover:scale-110"
          @error="handleImageError"
        />

      <!-- Badge catégorie -->
      <div class="absolute top-4 right-4 px-4 py-2 rounded-full text-sm font-bold" style="background-color: var(--color-accent); color: var(--color-text);">
        {{ product.category }}
      </div>

      <!-- Badge stock faible -->
      <div v-if="product.stock < 30" class="absolute top-4 left-4 px-4 py-2 rounded-full text-sm font-bold" style="background-color: var(--color-secondary); color: var(--color-background);">
        Stock limité
      </div>
      </div>
    </NuxtLink>

    <!-- Contenu -->
    <div class="p-6">
      <NuxtLink :to="`/produits/${product.slug}`">
        <h3 class="text-2xl font-extrabold mb-3 hover:underline" style="color: var(--color-secondary);">{{ product.name }}</h3>
      </NuxtLink>
      <p class="text-base mb-4 line-clamp-2 font-medium" style="color: var(--color-text);">
        {{ product.description }}
      </p>

      <!-- Prix et bouton -->
      <div class="flex items-center justify-between gap-4">
        <span class="text-3xl font-extrabold" style="color: var(--color-secondary);">
          {{ formatPrice(product.price) }}
        </span>
      </div>

      <!-- Stock disponible -->
      <p class="text-sm mt-3 font-semibold" style="color: var(--color-text);">
        {{ product.stock }} en stock
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Product {
  id: number
  name: string
  price: number
  description: string
  image: string
  category: string
  stock: number
}

defineProps<{
  product: Product
}>()

defineEmits(['add-to-cart'])

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement
  target.src = 'https://via.placeholder.com/400x300/3B2F2F/CDA434?text=' + encodeURIComponent('LA HARDE')
}
</script>
