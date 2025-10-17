<template>
  <div class="container mx-auto px-4 py-12">
    <div class="mb-12">
      <h1 class="text-5xl md:text-6xl font-extrabold mb-6" style="color: var(--color-primary);">
        Nos Activités
      </h1>
      <p class="text-xl md:text-2xl font-medium mb-8" style="color: var(--color-text);">
        Gérez et consultez toutes les activités de LA HARDE
      </p>
    </div>

    <!-- Formulaire de création d'activité -->
    <div class="card mb-12">
      <h2 class="text-3xl font-bold mb-6" style="color: var(--color-secondary);">
        Créer une nouvelle activité
      </h2>

      <form @submit.prevent="handleCreateEvent" class="space-y-6">
        <div>
          <label for="name" class="block text-lg font-semibold mb-2" style="color: var(--color-text);">
            Nom de l'activité *
          </label>
          <input
            id="name"
            v-model="newEvent.name"
            type="text"
            required
            class="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-amber-500 focus:outline-none"
            placeholder="Ex: La Roue Tourangelle"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="date" class="block text-lg font-semibold mb-2" style="color: var(--color-text);">
              Date *
            </label>
            <input
              id="date"
              v-model="newEvent.date"
              type="date"
              required
              class="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label for="type" class="block text-lg font-semibold mb-2" style="color: var(--color-text);">
              Type *
            </label>
            <select
              id="type"
              v-model="newEvent.type"
              required
              class="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-amber-500 focus:outline-none"
            >
              <option value="RANDO">Randonnée</option>
              <option value="COURSE">Course</option>
              <option value="ENTRAINEMENT">Entraînement</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="localisation" class="block text-lg font-semibold mb-2" style="color: var(--color-text);">
              Localisation *
            </label>
            <input
              id="localisation"
              v-model="newEvent.localisation"
              type="text"
              required
              class="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-amber-500 focus:outline-none"
              placeholder="Ex: Chinon"
            />
          </div>

          <div>
            <label for="distance" class="block text-lg font-semibold mb-2" style="color: var(--color-text);">
              Distance *
            </label>
            <input
              id="distance"
              v-model="newEvent.distance"
              type="text"
              required
              class="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-amber-500 focus:outline-none"
              placeholder="Ex: 59km"
            />
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <button
            type="submit"
            :disabled="isCreating"
            class="btn-primary"
          >
            {{ isCreating ? 'Création en cours...' : 'Créer l\'activité' }}
          </button>
          <button
            v-if="createSuccess"
            type="button"
            class="text-green-600 font-semibold"
          >
            ✓ Activité créée avec succès !
          </button>
          <button
            v-if="createError"
            type="button"
            class="text-red-600 font-semibold"
          >
            ✗ Erreur lors de la création
          </button>
        </div>
      </form>
    </div>

    <!-- Liste des activités -->
    <div>
      <h2 class="text-3xl font-bold mb-6" style="color: var(--color-secondary);">
        Prochaines activités
      </h2>

      <div v-if="isLoading" class="text-center py-12">
        <p class="text-xl" style="color: var(--color-text);">Chargement des activités...</p>
      </div>

      <div v-else-if="loadError" class="card text-center py-12">
        <p class="text-xl text-red-600 mb-4">Erreur lors du chargement des activités</p>
        <button @click="loadEvents" class="btn-secondary">
          Réessayer
        </button>
      </div>

      <div v-else-if="events.length === 0" class="card text-center py-12">
        <p class="text-xl" style="color: var(--color-text);">
          Aucune activité pour le moment. Créez-en une !
        </p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NuxtLink
          v-for="event in sortedEvents"
          :key="event._id"
          :to="`/activites/${event._id}`"
          class="card cursor-pointer hover:shadow-2xl transition-all duration-300"
        >
          <div class="flex items-start justify-between mb-4">
            <h3 class="text-2xl font-bold" style="color: var(--color-secondary);">
              {{ event.name }}
            </h3>
            <span
              class="text-sm font-bold px-3 py-1 rounded-full"
              :class="getTypeClass(event.type)"
            >
              {{ getTypeLabel(event.type) }}
            </span>
          </div>

          <div class="space-y-2">
            <p class="text-base font-medium" style="color: var(--color-text);">
              <span class="font-bold">📅 Date:</span> {{ formatDate(event.date) }}
            </p>
            <p class="text-base font-medium" style="color: var(--color-text);">
              <span class="font-bold">📍 Lieu:</span> {{ event.localisation }}
            </p>
            <p class="text-base font-medium" style="color: var(--color-text);">
              <span class="font-bold">🚴 Distance:</span> {{ event.distance }}
            </p>
          </div>

          <div class="mt-4 pt-4 border-t border-gray-300">
            <p class="text-sm font-semibold" style="color: var(--color-primary);">
              Cliquez pour voir les détails →
            </p>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// SEO
useHead({
  title: 'Activités - LA HARDE',
  meta: [
    {
      name: 'description',
      content: 'Consultez et gérez toutes les activités de l\'équipe cycliste LA HARDE'
    }
  ]
})

// Types
interface Event {
  _id?: string
  name: string
  date: string
  localisation: string
  distance: string
  type: 'RANDO' | 'COURSE' | 'ENTRAINEMENT'
}

// Composables
const { getEvents, createEvent } = useEvents()

// État
const events = ref<Event[]>([])
const isLoading = ref(false)
const loadError = ref(false)
const isCreating = ref(false)
const createSuccess = ref(false)
const createError = ref(false)

const newEvent = ref<Event>({
  name: '',
  date: '',
  localisation: '',
  distance: '',
  type: 'RANDO'
})

// Tri des événements par date
const sortedEvents = computed(() => {
  return [...events.value].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime()
  })
})

// Fonctions
const loadEvents = async () => {
  isLoading.value = true
  loadError.value = false
  try {
    events.value = await getEvents()
  } catch (error) {
    loadError.value = true
    console.error('Erreur:', error)
  } finally {
    isLoading.value = false
  }
}

const handleCreateEvent = async () => {
  isCreating.value = true
  createSuccess.value = false
  createError.value = false

  try {
    const createdEvent = await createEvent(newEvent.value)
    events.value.push(createdEvent)

    // Réinitialiser le formulaire
    newEvent.value = {
      name: '',
      date: '',
      localisation: '',
      distance: '',
      type: 'RANDO'
    }

    createSuccess.value = true
    setTimeout(() => {
      createSuccess.value = false
    }, 3000)
  } catch (error) {
    createError.value = true
    setTimeout(() => {
      createError.value = false
    }, 3000)
    console.error('Erreur:', error)
  } finally {
    isCreating.value = false
  }
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date)
}

const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    RANDO: 'Rando',
    COURSE: 'Course',
    ENTRAINEMENT: 'Entraînement'
  }
  return labels[type] || type
}

const getTypeClass = (type: string) => {
  const classes: Record<string, string> = {
    RANDO: 'bg-blue-500 text-white',
    COURSE: 'bg-red-500 text-white',
    ENTRAINEMENT: 'bg-green-500 text-white'
  }
  return classes[type] || 'bg-gray-500 text-white'
}

// Chargement initial
onMounted(() => {
  loadEvents()
})
</script>
