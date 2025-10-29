<template>
  <div class="container mx-auto px-4 py-12">
    <!-- Hero Section -->
    <div class="text-center mb-12">
      <h1 class="text-4xl md:text-5xl font-bold mb-4 font-heading">
        Vote pour le Maillot 🏃‍♂️
      </h1>
      <p class="text-lg text-gray-300 mb-6">
        Tu as <span class="text-2xl font-bold text-primary">{{ remainingPoints }}</span> points à répartir comme tu le souhaites
      </p>
      <div class="bg-secondary/20 border border-secondary rounded-lg p-4 max-w-2xl mx-auto">
        <p class="text-sm text-gray-300">
          Répartis tes 5 points entre les différents maillots. Tu peux mettre tous tes points sur un seul maillot ou les répartir comme tu le souhaites !
        </p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p class="mt-4 text-gray-400">Chargement des options...</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="text-center py-12">
      <p class="text-red-400 mb-4">{{ error }}</p>
    </div>

    <!-- Vote Options -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="option in voteOptions"
        :key="option.id"
        class="card p-4 transition-all duration-300 flex flex-col"
        :class="{ 'ring-2 ring-primary': userVotes[option.id] > 0 }"
      >
        <!-- Image with flip button -->
        <div class="relative rounded-lg border border-gray-700 bg-[#f0f0f0] flex items-center justify-center p-4 mb-4 min-h-[400px]">
          <img
            :src="currentImage[option.id] === 'front' ? option.image1 : option.image2"
            :alt="`${option.name} - ${currentImage[option.id] === 'front' ? 'Face' : 'Dos'}`"
            class="w-full h-auto max-h-[380px] object-contain transition-opacity duration-300"
          />

          <!-- Flip button -->
          <button
            @click="toggleImage(option.id)"
            class="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-secondary/80 hover:bg-secondary text-white flex items-center justify-center transition-all transform hover:scale-110"
            :title="currentImage[option.id] === 'front' ? 'Voir le dos' : 'Voir la face'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </button>
        </div>

        <!-- Option Info -->
        <div class="mb-4 flex-grow">
          <h2 class="text-xl font-bold mb-1 font-heading text-center" style="color: var(--color-secondary)">{{ option.name }}</h2>
        </div>

        <!-- Vote Controls -->
        <div class="bg-accent/20 rounded-lg p-3">
          <div class="flex items-center justify-center space-x-3">
            <button
              @click="decrementVote(option.id)"
              :disabled="!userVotes[option.id] || userVotes[option.id] === 0"
              class="w-8 h-8 rounded-full bg-secondary text-white font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-secondary/80 transition-all transform active:scale-95"
            >
              -
            </button>

            <div class="text-center min-w-[60px]">
              <div class="text-2xl font-bold text-primary" style="color: var(--color-secondary)">
                {{ userVotes[option.id] || 0 }}
              </div>
              <div class="text-xs text-gray-400" style="color: var(--color-secondary)">
                {{ userVotes[option.id] === 1 ? 'point' : 'points' }}
              </div>
            </div>

            <button
              @click="incrementVote(option.id)"
              :disabled="remainingPoints === 0"
              class="w-8 h-8 rounded-full bg-secondary text-white font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-secondary/80 transition-all transform active:scale-95"
            >
              +
            </button>
          </div>

          <div v-if="showResults" class="text-center pt-2 border-t border-gray-600">
            <div class="text-xs text-gray-400">Total des votes</div>
            <div class="text-lg font-bold text-primary">{{ option.votes }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Submit Button -->
    <div v-if="!loading && !error" class="mt-8 text-center">
      <button
        @click="submitVote"
        :disabled="remainingPoints !== 0 || submitting"
        class="btn-primary text-lg px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="submitting">Envoi en cours...</span>
        <span v-else-if="remainingPoints !== 0">
          Il te reste {{ remainingPoints }} {{ remainingPoints === 1 ? 'point' : 'points' }} à distribuer
        </span>
        <span v-else>Valider mon vote</span>
      </button>

      <button
        v-if="Object.values(userVotes).some(v => v > 0)"
        @click="resetVotes"
        class="btn-secondary ml-4 text-lg px-8 py-4"
      >
        Réinitialiser
      </button>
    </div>

    <!-- Success Message -->
    <Teleport to="body">
      <div
        v-if="showSuccess"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        @click="showSuccess = false"
      >
        <div class="bg-accent border-2 border-primary rounded-lg p-8 max-w-md mx-4 transform transition-all animate-bounce-in">
          <div class="text-center">
            <div class="text-6xl mb-4">🎉</div>
            <h3 class="text-2xl font-bold mb-2 text-primary">Vote enregistré !</h3>
            <p class="text-gray-300 mb-6">
              Merci d'avoir participé au vote pour le maillot de La Harde !
            </p>
            <button @click="showSuccess = false" class="btn-primary">
              Fermer
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Toggle Results Button -->
    <div v-if="!loading && !error" class="mt-8 text-center">
      <button
        @click="toggleResults"
        class="text-sm text-gray-400 hover:text-primary transition-colors underline"
      >
        {{ showResults ? 'Masquer les résultats' : 'Voir les résultats' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface VoteOption {
  id: string
  name: string
  image1: string
  image2: string
  votes: number
}

interface UserVote {
  optionId: string
  points: number
}

// SEO
useHead({
  title: 'Vote pour le Maillot - La Harde',
  meta: [
    {
      name: 'description',
      content: 'Participe au choix du nouveau maillot de La Harde ! Répartis tes 5 points entre les différentes options.'
    }
  ]
})

// Hardcoded vote options
const voteOptions = ref<VoteOption[]>([
  {
    id: '1',
    name: 'Maillot 1',
    image1: '/images/maillots/maillot1-face.png',
    image2: '/images/maillots/maillot1-dos.png',
    votes: 0
  },
  {
    id: '2',
    name: 'Maillot 2',
    image1: '/images/maillots/maillot2-face.png',
    image2: '/images/maillots/maillot2-dos.png',
    votes: 0
  }
])

// State
const userVotes = ref<Record<string, number>>({})
const currentImage = ref<Record<string, 'front' | 'back'>>({})
const loading = ref(false)
const error = ref<string | null>(null)
const submitting = ref(false)
const showSuccess = ref(false)
const showResults = ref(false)

const TOTAL_POINTS = 5

// Initialize user votes and current images
voteOptions.value.forEach(option => {
  userVotes.value[option.id] = 0
  currentImage.value[option.id] = 'front'
})

// Computed
const remainingPoints = computed(() => {
  const usedPoints = Object.values(userVotes.value).reduce((sum, points) => sum + points, 0)
  return TOTAL_POINTS - usedPoints
})

// Functions
const toggleImage = (optionId: string) => {
  currentImage.value[optionId] = currentImage.value[optionId] === 'front' ? 'back' : 'front'
}

const incrementVote = (optionId: string) => {
  if (remainingPoints.value > 0) {
    userVotes.value[optionId] = (userVotes.value[optionId] || 0) + 1
  }
}

const decrementVote = (optionId: string) => {
  if (userVotes.value[optionId] > 0) {
    userVotes.value[optionId]--
  }
}

const resetVotes = () => {
  Object.keys(userVotes.value).forEach(key => {
    userVotes.value[key] = 0
  })
}

const submitVote = async () => {
  if (remainingPoints.value !== 0) {
    return
  }

  submitting.value = true
  error.value = null

  try {
    const votes: UserVote[] = Object.entries(userVotes.value)
      .filter(([_, points]) => points > 0)
      .map(([optionId, points]) => ({ optionId, points }))

    // TODO: Implement API call to submit votes
    const config = useRuntimeConfig()
    await $fetch(`${config.public.apiBaseUrl}/obtorta/herd/votes`, {
      method: 'POST',
      body: { votes }
    })

    showSuccess.value = true

    // Reset votes after successful submission
    resetVotes()
  } catch (e) {
    error.value = 'Impossible d\'enregistrer ton vote. Veuillez réessayer.'
    console.error(e)
  } finally {
    submitting.value = false
  }
}

const toggleResults = () => {
  showResults.value = !showResults.value
}
</script>

<style scoped>
@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-bounce-in {
  animation: bounce-in 0.5s ease-out;
}
</style>
