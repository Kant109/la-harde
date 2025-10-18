<template>
  <div class="container mx-auto px-4 py-12">
    <!-- Bouton retour -->
    <div class="mb-8">
      <NuxtLink to="/activites"
        class="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold uppercase tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-lg"
        style="background-color: var(--color-secondary); color: var(--color-primary);">
        ← Retour aux activités
      </NuxtLink>
    </div>

    <!-- Chargement -->
    <div v-if="isLoading" class="text-center py-12">
      <div class="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse"
        style="background-color: var(--color-accent);">
        <span class="text-4xl">⏳</span>
      </div>
      <p class="text-2xl font-bold" style="color: var(--color-accent);">Chargement de l'activité...</p>
    </div>

    <!-- Erreur -->
    <div v-else-if="loadError" class="relative rounded-2xl border-4 text-center p-12"
      style="background: var(--color-primary); border-color: #ef4444;">
      <div class="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
        style="background-color: rgba(239, 68, 68, 0.2);">
        <span class="text-4xl">❌</span>
      </div>
      <p class="text-2xl font-bold text-red-400 mb-6">Erreur lors du chargement de l'activité</p>
      <NuxtLink to="/activites"
        class="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold uppercase tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-lg"
        style="background-color: var(--color-accent); color: var(--color-primary);">
        Retour aux activités
      </NuxtLink>
    </div>

    <!-- Détails de l'activité -->
    <div v-else-if="event">
      <!-- En-tête de l'activité -->
      <div class="relative rounded-2xl border-4 mb-8"
        style="background: var(--color-primary); border-color: var(--color-secondary);">
        <div class="relative p-6 md:p-8">
          <!-- Badge de type -->
          <div class="mb-6">
            <div class="inline-block px-4 py-2 rounded-full font-bold text-sm uppercase tracking-wider shadow-lg"
              style="background-color: var(--color-accent); color: var(--color-primary);">
              {{ getTypeIcon(event.type) }} {{ getTypeLabel(event.type) }}
            </div>
          </div>

          <!-- Titre -->
          <div class="mb-8">
            <h1 class="text-4xl md:text-5xl font-extrabold leading-tight"
              style="color: var(--color-accent);">
              {{ event.name }}
            </h1>
          </div>

          <!-- Détails de l'événement -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style="background-color: rgba(245, 241, 237, 0.9);">
                  <span class="text-2xl">📅</span>
                </div>
                <div>
                  <div class="text-xs font-bold uppercase tracking-wide opacity-80"
                    style="color: var(--color-secondary);">
                    Date
                  </div>
                  <div class="text-lg font-bold" style="color: var(--color-secondary);">
                    {{ formatDate(event.date) }}
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style="background-color: rgba(245, 241, 237, 0.9);">
                  <span class="text-2xl">📍</span>
                </div>
                <div>
                  <div class="text-xs font-bold uppercase tracking-wide opacity-80"
                    style="color: var(--color-secondary);">
                    Lieu
                  </div>
                  <div class="text-lg font-bold" style="color: var(--color-secondary);">
                    {{ event.localisation }}
                  </div>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style="background-color: rgba(245, 241, 237, 0.9);">
                  <span class="text-2xl">🚴</span>
                </div>
                <div>
                  <div class="text-xs font-bold uppercase tracking-wide opacity-80"
                    style="color: var(--color-secondary);">
                    Distance
                  </div>
                  <div class="text-lg font-bold" style="color: var(--color-secondary);">
                    {{ event.distance }}
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style="background-color: rgba(245, 241, 237, 0.9);">
                  <span class="text-2xl">👥</span>
                </div>
                <div>
                  <div class="text-xs font-bold uppercase tracking-wide opacity-80"
                    style="color: var(--color-secondary);">
                    Participants
                  </div>
                  <div class="text-lg font-bold" style="color: var(--color-accent);">
                    {{ participants.length }} inscrit{{ participants.length > 1 ? 's' : '' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Gestion des participants -->
      <div class="relative rounded-2xl border-4 mb-8"
        style="background: var(--color-primary); border-color: var(--color-secondary);">
        <div class="relative p-6 md:p-8">
          <div class="text-center mb-8">
            <div class="inline-block px-6 py-2 rounded-full mb-4" style="background-color: var(--color-accent);">
              <span class="text-sm font-bold uppercase tracking-wider" style="color: var(--color-primary);">
                Inscription
              </span>
            </div>
            <h2 class="text-3xl font-extrabold" style="color: var(--color-accent);">
              Ajouter un participant
            </h2>
          </div>

          <form @submit.prevent="handleAddParticipant" class="space-y-4 max-w-2xl mx-auto">
            <div class="relative">
              <label for="participant" class="block text-base font-bold mb-3 uppercase tracking-wide"
                style="color: var(--color-accent);">
                👤 Nom du participant *
              </label>
              <input
                id="participant"
                v-model="newParticipantName"
                type="text"
                required
                class="w-full px-5 py-4 rounded-xl text-lg font-semibold"
                style="background-color: rgba(245, 241, 237, 0.95); color: var(--color-accent); border: 3px solid transparent;"
                :style="{ borderColor: newParticipantName ? 'var(--color-accent)' : 'transparent' }"
                placeholder="Ex: Matis Charrier"
              />
            </div>

            <button
              type="submit"
              :disabled="isAddingParticipant"
              class="w-full px-8 py-4 rounded-xl text-xl font-extrabold uppercase tracking-wider transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              style="background-color: var(--color-accent); color: var(--color-primary);">
              {{ isAddingParticipant ? '⏳ Ajout en cours...' : '✨ Ajouter' }}
            </button>

            <div v-if="addSuccess" class="text-center p-4 rounded-lg animate-pulse"
              style="background-color: rgba(34, 197, 94, 0.2);">
              <p class="text-xl font-bold text-green-400">
                ✓ Participant ajouté avec succès !
              </p>
            </div>

            <div v-if="addError" class="text-center p-4 rounded-lg animate-pulse"
              style="background-color: rgba(239, 68, 68, 0.2);">
              <p class="text-xl font-bold text-red-400">
                ✗ Erreur lors de l'ajout du participant
              </p>
            </div>
          </form>
        </div>
      </div>

      <!-- Liste des participants -->
      <div class="relative rounded-2xl border-4"
        style="background: var(--color-primary); border-color: var(--color-secondary);">
        <div class="relative p-6 md:p-8">
          <div class="text-center mb-8">
            <div class="inline-block px-6 py-2 rounded-full mb-4" style="background-color: var(--color-accent);">
              <span class="text-sm font-bold uppercase tracking-wider" style="color: var(--color-primary);">
                Équipe
              </span>
            </div>
            <h2 class="text-3xl font-extrabold" style="color: var(--color-accent);">
              Liste des participants
            </h2>
            <p v-if="participants.length > 0" class="mt-2 text-lg" style="color: var(--color-secondary); opacity: 0.9;">
              {{ participants.length }} cycliste{{ participants.length > 1 ? 's' : '' }} inscrit{{ participants.length > 1 ? 's' : '' }}
            </p>
          </div>

          <div v-if="isLoadingParticipants" class="text-center py-8">
            <p class="text-lg font-semibold" style="color: var(--color-accent);">⏳ Chargement des participants...</p>
          </div>

          <div v-else-if="participants.length === 0" class="text-center py-12">
            <div class="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
              style="background-color: rgba(245, 241, 237, 0.9);">
              <span class="text-4xl">👥</span>
            </div>
            <p class="text-xl font-semibold" style="color: var(--color-secondary);">
              Aucun participant pour le moment
            </p>
            <p class="mt-2 text-base" style="color: var(--color-secondary); opacity: 0.7;">
              Soyez le premier à vous inscrire !
            </p>
          </div>

          <div v-else class="space-y-3 max-w-3xl mx-auto">
            <div
              v-for="(participant, index) in participants"
              :key="participant.id"
              class="flex items-center justify-between p-4 rounded-xl border-3 transition-all duration-300 hover:scale-102 hover:shadow-lg"
              style="background-color: rgba(245, 241, 237, 0.95); border: 3px solid var(--color-secondary);"
            >
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-extrabold text-xl"
                  style="background-color: var(--color-accent); color: var(--color-primary);">
                  {{ index + 1 }}
                </div>
                <span class="text-xl font-bold" style="color: var(--color-accent);">
                  {{ participant.participant }}
                </span>
              </div>
              <button
                @click="handleDeleteParticipant(participant.id!)"
                :disabled="deletingParticipantId === participant.id"
                class="px-5 py-2 rounded-lg font-bold uppercase tracking-wide transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                style="background-color: #ef4444; color: white;"
              >
                {{ deletingParticipantId === participant.id ? '⏳ Suppression...' : '🗑️ Retirer' }}
              </button>
            </div>
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
  if (!event.value?._id) return

  isLoadingParticipants.value = true
  try {
    participants.value = await getParticipants(event.value._id)
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
    RANDO: 'Rando',
    COURSE: 'Course',
    ENTRAINEMENT: 'Entraînement'
  }
  return labels[type] || type
}

const getTypeIcon = (type: string) => {
  const icons: Record<string, string> = {
    RANDO: '🚴',
    COURSE: '🏆',
    ENTRAINEMENT: '💪'
  }
  return icons[type] || '🚴'
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
