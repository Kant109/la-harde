<template>
  <div class="relative">
    <!-- Ligne de timeline -->
    <div class="absolute left-8 top-0 bottom-0 w-0.5" style="background-color: var(--color-secondary);"></div>

    <!-- Contenu de l'événement -->
    <div class="flex items-start space-x-6 mb-12">
      <!-- Point sur la timeline -->
      <div class="relative z-10 flex-shrink-0">
        <div class="w-16 h-16 rounded-full flex items-center justify-center " style="background-color: var(--color-secondary);">
          <span class="text-xl font-bold" style="color: var(--color-primary);">{{ event.year }}</span>
        </div>
      </div>

      <!-- Carte de l'événement -->
      <div class="card flex-grow " :style="{ animationDelay: `${index * 0.2}s` }">
        <div class="md:flex">
          <!-- Image -->
          <div class="md:w-1/3">
            <img
              :src="event.image"
              :alt="event.name"
              class="w-full h-full object-cover"
              style="min-height: 250px;"
              @error="handleImageError"
            />
          </div>

          <!-- Contenu -->
          <div class="md:w-2/3 p-6">
            <div class="flex items-start justify-between mb-3">
              <h3 class="text-2xl font-bold" style="color: var(--color-secondary);">{{ event.name }}</h3>
              <span class="text-sm font-semibold px-3 py-1 rounded-full" style="background-color: var(--color-accent); color: var(--color-text);">
                {{ event.year }}
              </span>
            </div>

            <p class="text-sm mb-4" style="color: var(--color-secondary); opacity: 0.8;">
              {{ event.description }}
            </p>

            <!-- Détails de la course -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div class="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="color: var(--color-secondary);">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span class="text-sm" style="color: var(--color-secondary); opacity: 0.8;">{{ event.location }}</span>
              </div>

              <div class="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="color: var(--color-secondary);">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span class="text-sm" style="color: var(--color-secondary); opacity: 0.8;">{{ event.distance }}</span>
              </div>
            </div>

            <!-- Résultat -->
            <div class="flex items-center space-x-2 px-4 py-2 rounded-lg" style="background-color: var(--color-secondary);">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="color: var(--color-primary);">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <span class="font-semibold" style="color: var(--color-primary);">{{ event.result }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface RaceEvent {
  id: number
  name: string
  year: number
  description: string
  image: string
  result: string
  location: string
  distance: string
}

defineProps<{
  event: RaceEvent
  index: number
}>()

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement
  target.src = 'https://via.placeholder.com/600x400/3B2F2F/CDA434?text=' + encodeURIComponent('LA HARDE')
}
</script>
