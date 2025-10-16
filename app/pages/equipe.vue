<template>
  <div>
    <!-- Hero Section -->
    <section class="py-16 md:py-24" style="background-color: var(--color-background);">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-5xl md:text-7xl font-extrabold mb-4" style="color: var(--color-primary); line-height: 1.1;">
          L'Équipe LA HARDE
        </h1>
        <p class="text-lg md:text-xl max-w-2xl mx-auto" style="color: var(--color-text);">
          Six coureurs unis par la passion du vélo et l'esprit combatif des sangliers
        </p>
      </div>
    </section>

    <!-- Section Membres de l'équipe -->
    <section class="py-20">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="(member, index) in teamMembers"
            :key="member.id"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <TeamMemberCard :member="member" />
          </div>
        </div>
      </div>
    </section>

    <!-- Section Profils Strava -->
    <section class="py-20" style="background-color: var(--color-primary);">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-4xl md:text-5xl font-bold mb-4" style="color: var(--color-secondary);">
            Suivez-nous sur Strava
          </h2>
          <p class="text-lg max-w-2xl mx-auto" style="color: var(--color-accent); opacity: 0.8;">
            Découvrez nos performances et nos entraînements en temps réel
          </p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <a
            v-for="member in teamMembers"
            :key="member.id"
            :href="member.strava"
            target="_blank"
            rel="noopener noreferrer"
            class="group relative p-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            style="background-color: var(--color-background);"
            :class="{ 'opacity-50 pointer-events-none': !member.strava }"
          >
            <div class="text-center">
              <img
                :src="member.image"
                :alt="member.name"
                class="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-4 transition-all duration-300 group-hover:border-orange-500"
                style="border-color: var(--color-secondary);"
              />
              <h3 class="text-lg font-bold mb-2" style="color: var(--color-primary);">
                {{ member.name }}
              </h3>
              <div v-if="member.strava" class="flex items-center justify-center text-sm" style="color: var(--color-primary);">
                <svg class="w-5 h-5 mr-1" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169"/>
                </svg>
                Profil Strava
              </div>
              <div v-else class="text-sm" style="color: var(--color-text); opacity: 0.5;">
                Bientôt disponible
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- Section Valeurs de l'équipe -->
    <section class="py-20">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-4xl md:text-5xl font-bold mb-4" style="color: var(--color-primary);">
            Nos Valeurs
          </h2>
          <p class="text-lg max-w-2xl mx-auto" style="color: var(--color-text); opacity: 0.8;">
            L'esprit LA HARDE repose sur des piliers solides qui nous guident dans chaque course.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            v-for="value in values"
            :key="value.title"
            class="card p-8 text-center"
          >
            <div class="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center " style="background-color: var(--color-secondary);">
              <component :is="value.icon" class="w-8 h-8" style="color: var(--color-primary);" />
            </div>
            <h3 class="text-2xl font-bold mb-4" style="color: var(--color-secondary);">
              {{ value.title }}
            </h3>
            <p class="text-sm leading-relaxed" style="color: var(--color-accent); opacity: 0.8;">
              {{ value.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20" style="background-color: var(--color-primary);">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-6" style="color: var(--color-secondary);">
          Soutenez LA HARDE
        </h2>
        <p class="text-lg mb-8 max-w-2xl mx-auto" style="color: var(--color-accent); opacity: 0.8;">
          Arborez les couleurs des Sangliers Explosifs et montrez votre soutien à notre équipe.
        </p>
        <NuxtLink to="/boutique" class="btn-primary">
          Visiter la boutique
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, h } from 'vue'
import teamData from '~/data/team.json'

// SEO
useHead({
  title: 'L\'Équipe - LA HARDE',
  meta: [
    {
      name: 'description',
      content: 'Découvrez les membres de l\'équipe cycliste LA HARDE - Les Sangliers Explosifs. Six coureurs unis par la passion et l\'esprit de compétition.'
    }
  ]
})

// Données
const teamMembers = ref(teamData)

const stats = [
  { value: '6', label: 'Coureurs' },
  { value: '3', label: 'Courses majeures' },
  { value: '100+', label: 'Km par jour' },
  { value: '2023', label: 'Année de création' }
]

// Icônes pour les valeurs
const FlashIcon = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  fill: 'none',
  viewBox: '0 0 24 24',
  stroke: 'currentColor'
}, [
  h('path', {
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    d: 'M13 10V3L4 14h7v7l9-11h-7z'
  })
])

const HeartIcon = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  fill: 'none',
  viewBox: '0 0 24 24',
  stroke: 'currentColor'
}, [
  h('path', {
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    d: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
  })
])

const UsersIcon = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  fill: 'none',
  viewBox: '0 0 24 24',
  stroke: 'currentColor'
}, [
  h('path', {
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    d: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
  })
])

const values = [
  {
    title: 'Combativité',
    description: 'Comme des sangliers, nous attaquons avec détermination et ne reculons jamais devant l\'adversité. Chaque course est une bataille à remporter.',
    icon: FlashIcon
  },
  {
    title: 'Passion',
    description: 'Le vélo est notre vie. Cette passion nous pousse à nous dépasser à chaque coup de pédale et à repousser nos limites.',
    icon: HeartIcon
  },
  {
    title: 'Esprit d\'équipe',
    description: 'La force de LA HARDE réside dans notre unité. Ensemble, nous sommes plus forts et capables de réaliser l\'impossible.',
    icon: UsersIcon
  }
]
</script>
