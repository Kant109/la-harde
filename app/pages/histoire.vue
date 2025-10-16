<template>
  <div>
    <!-- Hero Section -->
    <section class="relative py-32 overflow-hidden">
      <!-- Background -->
      <div class="absolute inset-0" style="background: linear-gradient(135deg, var(--color-background) 0%, var(--color-primary) 100%);"></div>

      <div class="relative z-10 container mx-auto px-4 text-center">
        <h1 class="text-5xl md:text-6xl font-bold mb-6" style="color: var(--color-secondary);">
          Notre Histoire
        </h1>
        <p class="text-xl md:text-2xl max-w-3xl mx-auto" style="color: var(--color-text); opacity: 0.9;">
          De nos débuts en Touraine aux pavés de Roubaix, revivez les moments forts qui ont forgé la légende de LA HARDE.
        </p>
      </div>

      <!-- Decoration -->
      <div class="absolute top-20 left-20 w-64 h-1 opacity-50 " style="background-color: var(--color-secondary);"></div>
      <div class="absolute bottom-20 right-20 w-64 h-1 opacity-50 " style="background-color: var(--color-secondary); animation-delay: 1.5s;"></div>
    </section>

    <!-- Section Origine -->
    <section class="py-20">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <div class="card p-8 md:p-12 mb-16">
            <div class="flex items-center mb-6">
              <div class="w-16 h-16 rounded-full flex items-center justify-center mr-6 " style="background-color: var(--color-secondary);">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="color: var(--color-background);">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h2 class="text-3xl md:text-4xl font-bold" style="color: var(--color-secondary);">L'Origine des Sangliers</h2>
                <p class="text-sm" style="color: var(--color-secondary); opacity: 0.7;">2023 - Les débuts</p>
              </div>
            </div>

            <div class="space-y-4" style="color: var(--color-secondary); opacity: 0.9;">
              <p class="leading-relaxed">
                Tout a commencé en 2023, lorsque six amis passionnés de cyclisme ont décidé d'unir leurs forces pour créer plus qu'une simple équipe : une véritable harde, comme ces groupes de sangliers qui parcourent les forêts avec force et détermination.
              </p>
              <p class="leading-relaxed">
                Le surnom "Les Sangliers Explosifs" n'est pas venu par hasard. Il reflète parfaitement l'esprit de l'équipe : une attaque explosive, une combativité sans faille, et une capacité à charger ensemble vers la victoire, peu importe les obstacles.
              </p>
              <p class="leading-relaxed">
                Simon, membre fondateur et "sanglier original", a été le catalyseur de cette aventure. Sa vision : créer une équipe où la passion, l'amitié et la performance se mêlent pour repousser les limites du possible.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Timeline des courses -->
    <section class="py-20" style="background-color: var(--color-primary);">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold mb-4" style="color: var(--color-secondary);">
            Nos Grandes Courses
          </h2>
          <p class="text-lg max-w-2xl mx-auto" style="color: var(--color-text); opacity: 0.8;">
            Chaque course est une page de notre histoire, chaque kilomètre une nouvelle légende.
          </p>
        </div>

        <div class="max-w-5xl mx-auto">
          <TimelineEvent
            v-for="(event, index) in raceHistory"
            :key="event.id"
            :event="event"
            :index="index"
          />
        </div>
      </div>
    </section>

    <!-- Section Moments mémorables -->
    <section class="py-20">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-4xl md:text-5xl font-bold mb-4" style="color: var(--color-secondary);">
            Moments Mémorables
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div
            v-for="moment in memorableMoments"
            :key="moment.id"
            class="card p-6"
          >
            <div class="flex items-start space-x-4">
              <div class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style="background-color: var(--color-secondary);">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="color: var(--color-background);">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-bold mb-2" style="color: var(--color-secondary);">
                  {{ moment.title }}
                </h3>
                <p class="text-sm mb-2" style="color: var(--color-accent); filter: brightness(1.5);">
                  {{ moment.date }}
                </p>
                <p class="text-sm leading-relaxed" style="color: var(--color-text); opacity: 0.8;">
                  {{ moment.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section Vision Future -->
    <section class="py-20" style="background-color: var(--color-primary);">
      <div class="container mx-auto px-4 text-center">
        <div class="max-w-3xl mx-auto">
          <h2 class="text-4xl md:text-5xl font-bold mb-6" style="color: var(--color-secondary);">
            L'Avenir de LA HARDE
          </h2>
          <p class="text-lg mb-8 leading-relaxed" style="color: var(--color-text); opacity: 0.9;">
            Notre histoire ne fait que commencer. Avec chaque course, nous écrivons un nouveau chapitre.
            Le Tour de France, les Monuments du cyclisme, les classiques : tous ces objectifs alimentent notre feu intérieur.
            LA HARDE continuera à charger, à attaquer, et à faire vibrer les routes avec la puissance d'un peloton sauvage.
          </p>
          <div class="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
            <NuxtLink to="/equipe" class="btn-primary">
              Rencontrer l'équipe
            </NuxtLink>
            <NuxtLink to="/boutique" class="btn-secondary">
              Rejoindre l'aventure
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import historyData from '~/data/history.json'

// SEO
useHead({
  title: 'Notre Histoire - LA HARDE',
  meta: [
    {
      name: 'description',
      content: 'Découvrez l\'histoire de LA HARDE - Les Sangliers Explosifs, de nos débuts en Touraine aux pavés de Paris-Roubaix. Revivez nos exploits sportifs.'
    }
  ]
})

// Données
const raceHistory = ref(historyData)

const memorableMoments = [
  {
    id: 1,
    title: 'Première Victoire',
    date: 'Septembre 2023',
    description: 'Notre première victoire en course officielle, un moment d\'émotion intense qui a prouvé que LA HARDE était née pour gagner.'
  },
  {
    id: 2,
    title: 'L\'Échappée Légendaire',
    date: 'Avril 2024',
    description: 'Quentin part en échappée matinale et tient 120 km seul en tête. Rattrapé à 2 km de l\'arrivée, mais quelle course !'
  },
  {
    id: 3,
    title: 'Tous Ensemble à l\'Arrivée',
    date: 'Juillet 2024',
    description: 'Pour la première fois, les six membres de l\'équipe franchissent la ligne d\'arrivée ensemble, symbole parfait de notre esprit d\'équipe.'
  },
  {
    id: 4,
    title: 'Record d\'Équipe',
    date: 'Août 2024',
    description: 'Baptiste établit un nouveau record personnel avec une moyenne de 42 km/h sur 100 km, inspirant toute l\'équipe à se dépasser.'
  }
]
</script>
