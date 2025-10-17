<template>
  <div class="container mx-auto px-4 py-12">
    <!-- Bouton retour -->
    <div class="mb-8">
      <NuxtLink to="/activites" class="inline-flex items-center text-lg font-semibold hover:underline" style="color: var(--color-primary);">
        ← Retour aux activités
      </NuxtLink>
    </div>

    <!-- Chargement -->
    <div v-if="isLoading" class="text-center py-12">
      <p class="text-2xl" style="color: var(--color-text);">Chargement de l'activité...</p>
    </div>

    <!-- Erreur -->
    <div v-else-if="loadError" class="card text-center py-12">
      <p class="text-2xl text-red-600 mb-4">Erreur lors du chargement de l'activité</p>
      <NuxtLink to="/activites" class="btn-primary">
        Retour aux activités
      </NuxtLink>
    </div>

    <!-- Détails de l'activité -->
    <div v-else-if="event">
      <!-- En-tête de l'activité -->
      <div class="card mb-8">
        <div class="flex items-start justify-between mb-6">
          <h1 class="text-4xl md:text-5xl font-extrabold" style="color: var(--color-primary);">
            {{ event.name }}
          </h1>
          <span
            class="text-base font-bold px-4 py-2 rounded-full"
            :class="getTypeClass(event.type)"
          >
            {{ getTypeLabel(event.type) }}
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <div>
              <h3 class="text-lg font-bold mb-2" style="color: var(--color-secondary);">📅 Date</h3>
              <p class="text-xl" style="color: var(--color-text);">{{ formatDate(event.date) }}</p>
            </div>
            <div>
              <h3 class="text-lg font-bold mb-2" style="color: var(--color-secondary);">📍 Localisation</h3>
              <p class="text-xl" style="color: var(--color-text);">{{ event.localisation }}</p>
            </div>
          </div>
          <div class="space-y-4">
            <div>
              <h3 class="text-lg font-bold mb-2" style="color: var(--color-secondary);">🚴 Distance</h3>
              <p class="text-xl" style="color: var(--color-text);">{{ event.distance }}</p>
            </div>
            <div>
              <h3 class="text-lg font-bold mb-2" style="color: var(--color-secondary);">👥 Participants</h3>
              <p class="text-xl font-bold" style="color: var(--color-primary);">
                {{ participants.length }} inscrit{{ participants.length > 1 ? 's' : '' }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Gestion des participants -->
      <div class="card mb-8">
        <h2 class="text-3xl font-bold mb-6" style="color: var(--color-secondary);">
          Ajouter un participant
        </h2>

        <form @submit.prevent="handleAddParticipant" class="flex items-end space-x-4">
          <div class="flex-1">
            <label for="participant" class="block text-lg font-semibold mb-2" style="color: var(--color-text);">
              Nom du participant
            </label>
            <input
              id="participant"
              v-model="newParticipantName"
              type="text"
              required
              class="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-amber-500 focus:outline-none"
              placeholder="Ex: Matis Charrier"
            />
          </div>
          <button
            type="submit"
            :disabled="isAddingParticipant"
            class="btn-primary"
          >
            {{ isAddingParticipant ? 'Ajout...' : 'Ajouter' }}
          </button>
        </form>

        <div v-if="addSuccess" class="mt-4 text-green-600 font-semibold">
          ✓ Participant ajouté avec succès !
        </div>
        <div v-if="addError" class="mt-4 text-red-600 font-semibold">
          ✗ Erreur lors de l'ajout du participant
        </div>
      </div>

      <!-- Liste des participants -->
      <div class="card">
        <h2 class="text-3xl font-bold mb-6" style="color: var(--color-secondary);">
          Liste des participants
        </h2>

        <div v-if="isLoadingParticipants" class="text-center py-8">
          <p class="text-lg" style="color: var(--color-text);">Chargement des participants...</p>
        </div>

        <div v-else-if="participants.length === 0" class="text-center py-8">
          <p class="text-lg" style="color: var(--color-text);">
            Aucun participant pour le moment. Soyez le premier à vous inscrire !
          </p>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="(participant, index) in participants"
            :key="participant.id"
            class="flex items-center justify-between p-4 rounded-lg border-2 border-gray-200 hover:border-amber-400 transition-colors"
          >
            <div class="flex items-center space-x-4">
              <span class="text-2xl font-bold" style="color: var(--color-primary);">
                {{ index + 1 }}.
              </span>
              <span class="text-xl font-semibold" style="color: var(--color-text);">
                {{ participant.participant }}
              </span>
            </div>
            <button
              @click="handleDeleteParticipant(participant.id!)"
              :disabled="deletingParticipantId === participant.id"
              class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {{ deletingParticipantId === participant.id ? 'Suppression...' : 'Retirer' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

// Types
interface Event {
  _id?: string
  name: string
  date: string
  localisation: string
  distance: string
  type: 'RANDO' | 'COURSE' | 'ENTRAINEMENT'
}

interface Participant {
  id?: string
  idEvent: string
  participant: string
}

// Composables
const route = useRoute()
const { getEvents, getParticipants, addParticipant, deleteParticipant } = useEvents()

// État
const event = ref<Event | null>(null)
const participants = ref<Participant[]>([])
const isLoading = ref(false)
const loadError = ref(false)
const isLoadingParticipants = ref(false)
const isAddingParticipant = ref(false)
const addSuccess = ref(false)
const addError = ref(false)
const newParticipantName = ref('')
const deletingParticipantId = ref<string | null>(null)

// SEO dynamique
useHead({
  title: () => event.value ? `${event.value.name} - Activités LA HARDE` : 'Activité - LA HARDE',
  meta: [
    {
      name: 'description',
      content: () => event.value
        ? `Détails de l'activité ${event.value.name} - ${event.value.date} à ${event.value.localisation}`
        : 'Détails de l\'activité'
    }
  ]
})

// Fonctions
const loadEvent = async () => {
  isLoading.value = true
  loadError.value = false
  try {
    const eventId = route.params.id as string
    const events = await getEvents()
    event.value = events.find(e => e._id === eventId) || null

    if (!event.value) {
      loadError.value = true
    }
  } catch (error) {
    loadError.value = true
    console.error('Erreur:', error)
  } finally {
    isLoading.value = false
  }
}

const loadParticipants = async () => {
  if (!event.value?.id) return

  isLoadingParticipants.value = true
  try {
    participants.value = await getParticipants(event.value.id)
  } catch (error) {
    console.error('Erreur:', error)
  } finally {
    isLoadingParticipants.value = false
  }
}

const handleAddParticipant = async () => {
  if (!event.value?._id || !newParticipantName.value.trim()) return

  isAddingParticipant.value = true
  addSuccess.value = false
  addError.value = false

  try {
    const newParticipant = await addParticipant({
      idEvent: event.value._id,
      participant: newParticipantName.value.trim()
    })

    participants.value.push(newParticipant)
    newParticipantName.value = ''
    addSuccess.value = true

    setTimeout(() => {
      addSuccess.value = false
    }, 3000)
  } catch (error) {
    addError.value = true
    setTimeout(() => {
      addError.value = false
    }, 3000)
    console.error('Erreur:', error)
  } finally {
    isAddingParticipant.value = false
  }
}

const handleDeleteParticipant = async (participantId: string) => {
  if (!event.value?._id) return

  deletingParticipantId.value = participantId

  try {
    await deleteParticipant(participantId, event.value._id)
    participants.value = participants.value.filter(p => p.id !== participantId)
  } catch (error) {
    console.error('Erreur:', error)
    alert('Erreur lors de la suppression du participant')
  } finally {
    deletingParticipantId.value = null
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
    RANDO: 'Randonnée',
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
onMounted(async () => {
  await loadEvent()
  if (event.value) {
    await loadParticipants()
  }
})

// Surveiller les changements de paramètre de route
watch(() => route.params.id, async (newId) => {
  if (newId) {
    await loadEvent()
    if (event.value) {
      await loadParticipants()
    }
  }
})
</script>
