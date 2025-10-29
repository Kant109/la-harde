<template>
  <div>
    <!-- Hero Section -->
    <section class="relative min-h-screen flex items-center justify-center overflow-hidden">
      <!-- Background avec overlay -->
      <div class="absolute inset-0">
        <img
          src="/images/backgound-hero.jpg"
          alt="Équipe cycliste LA HARDE"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0" style="background: linear-gradient(to bottom, rgba(0,0,0,0.4), var(--color-background));"></div>
      </div>

      <!-- Contenu Hero -->
      <div class="relative z-10 container mx-auto px-4 text-center">
        <h1 class="text-6xl md:text-8xl font-extrabold mb-6" style="color: var(--color-primary);">
          LA HARDE
        </h1>
        <p class="text-3xl md:text-5xl mb-6 font-bold" style="color: var(--color-primary);">
          Les Sangliers atomiques
        </p>
        <p class="text-2xl md:text-3xl mb-12 font-medium" style="color: var(--color-primary);">
          La puissance du peloton sauvage
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
          <NuxtLink to="/equipe" class="btn-primary">
            Découvrir l'équipe
          </NuxtLink>
          <NuxtLink to="/histoire" class="btn-secondary">
            Notre histoire
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Section Mise en avant de l'équipe -->
    <section class="py-20">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-5xl md:text-6xl font-extrabold mb-6" style="color: var(--color-primary);">
            Nos Guerriers du Bitume
          </h2>
          <p class="text-xl md:text-2xl max-w-2xl mx-auto font-medium" style="color: var(--color-primary);">
            Une passion, un objectif : dominer les routes avec la force d'un peloton sauvage.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <TeamMemberCard
            v-for="member in featuredMembers"
            :key="member.id"
            :member="member"
          />
        </div>

        <div class="text-center">
          <NuxtLink to="/equipe" class="btn-primary">
            Voir toute l'équipe
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Section Dernières courses -->
    <section class="py-20" style="background-color: var(--color-primary);">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-5xl md:text-6xl font-extrabold mb-6" style="color: var(--color-secondary);">
            Nos Exploits Récents
          </h2>
          <p class="text-xl md:text-2xl max-w-2xl mx-auto font-medium" style="color: var(--color-accent);">
            De la Touraine à Roubaix, LA HARDE marque son territoire sur toutes les courses.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div
            v-for="race in recentRaces"
            :key="race.id"
            class="card cursor-pointer"
          >
            <div class="h-48 overflow-hidden">
              <img
                :src="race.image"
                :alt="race.name"
                class="w-full h-full object-cover transition-all duration-500 hover:scale-110"
                @error="handleImageError"
              />
            </div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-2xl font-extrabold" style="color: var(--color-secondary);">{{ race.name }}</h3>
                <span class="text-base font-bold px-3 py-1 rounded-full" style="background-color: var(--color-accent); color: var(--color-text);">
                  {{ race.year }}
                </span>
              </div>
              <p class="text-base mb-3 font-medium" style="color: var(--color-accent);">
                {{ race.description.substring(0, 100) }}...
              </p>
              <p class="text-base font-bold" style="color: var(--color-secondary);">
                {{ race.result }}
              </p>
            </div>
          </div>
        </div>

        <div class="text-center">
          <NuxtLink to="/histoire" class="btn-primary">
            Découvrir notre histoire
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Section Boutique -->
    <section class="py-20">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-5xl md:text-6xl font-extrabold mb-6" style="color: var(--color-primary);">
            Boutique Officielle
          </h2>
          <p class="text-xl md:text-2xl max-w-2xl mx-auto font-medium" style="color: var(--color-text);">
            Arborez les couleurs des Sangliers atomiques avec notre collection officielle.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <ProductCard
            v-for="product in featuredProducts"
            :key="product.id"
            :product="product"
            @add-to-cart="addToCart"
          />
        </div>

        <div class="text-center">
          <NuxtLink to="/boutique" class="btn-primary">
            Voir tous les produits
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import teamData from '~/data/team.json'
import historyData from '~/data/history.json'
import productsData from '~/data/products.json'

// SEO
useHead({
  title: 'LA HARDE - Les Sangliers atomiques | Équipe Cycliste Professionnelle',
  meta: [
    {
      name: 'description',
      content: 'Site officiel de l\'équipe cycliste LA HARDE - Les Sangliers atomiques. Découvrez nos coureurs, nos exploits et notre boutique officielle.'
    }
  ]
})

// Données
const featuredMembers = ref(teamData.slice(0, 3))
const recentRaces = ref(historyData)
const featuredProducts = ref(productsData.slice(0, 3))

// Fonctions
const addToCart = (product: any) => {
  // Cette fonction sera gérée par le layout principal
  console.log('Add to cart:', product)
}

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement
  target.src = 'https://via.placeholder.com/600x400/3B2F2F/CDA434?text=' + encodeURIComponent('LA HARDE')
}

const config = useRuntimeConfig()

onBeforeMount(() => {
  console.log('API Base URL:', config.public.apiBaseUrl)
  fetch(config.public.apiBaseUrl + '/obtorta/herd/wakeup')
    .then(() => console.log('Wake up request sent'))
    .catch(err => console.error('Wake up request failed:', err))
})
</script>
