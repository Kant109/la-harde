<template>
  <div class="container mx-auto px-4 py-12">
    <!-- Hero Section -->
    <div class="text-center mb-8">
      <h1 class="text-4xl md:text-5xl font-bold mb-4 font-heading">
        Vote pour le Maillot
      </h1>
      <p class="text-lg text-gray-300 mb-2">
        Swipe à droite si tu aimes, à gauche si tu n'aimes pas
      </p>
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

    <!-- Swipe Cards Container -->
    <div v-if="!loading && !error && !showRecap" class="relative mx-auto" style="max-width: 500px; height: 600px;">
      <!-- Stack of cards (showing only top 3 for performance) -->
      <div
        v-for="(option, index) in visibleCards"
        :key="option.id"
        class="absolute inset-0 transition-all duration-300"
        :style="{
          zIndex: visibleCards.length - index,
          transform: `scale(${1 - index * 0.05}) translateY(${index * 10}px)`,
          opacity: index === 0 ? 1 : 0.7
        }"
      >
        <div
          v-if="index === 0"
          class="swipe-card bg-accent border-2 border-gray-700 rounded-2xl overflow-hidden shadow-2xl h-full cursor-grab active:cursor-grabbing"
          :style="{
            transform: `translateX(${dragOffset}px) rotate(${dragOffset / 20}deg)`,
            transition: isDragging ? 'none' : 'transform 0.3s ease-out'
          }"
          @mousedown="startDrag"
          @touchstart="startDrag"
        >
          <!-- Swipe Overlays -->
          <div class="absolute inset-0 z-10 pointer-events-none">
            <!-- Like overlay -->
            <div
              class="absolute inset-0 bg-green-500/80 flex items-center justify-center transition-opacity"
              :style="{ opacity: dragOffset > 0 ? Math.min(dragOffset / 100, 0.8) : 0 }"
            >
              <div class="text-white text-6xl font-bold transform rotate-12">❤️</div>
            </div>
            <!-- Dislike overlay -->
            <div
              class="absolute inset-0 bg-red-500/80 flex items-center justify-center transition-opacity"
              :style="{ opacity: dragOffset < 0 ? Math.min(Math.abs(dragOffset) / 100, 0.8) : 0 }"
            >
              <div class="text-white text-6xl font-bold transform -rotate-12">✖️</div>
            </div>
          </div>

          <!-- Card Content -->
          <div class="relative h-full flex flex-col">
            <!-- Image -->
            <div class="relative flex-1 bg-[#f0f0f0] flex items-center justify-center p-6 select-none">
              <img
                :src="currentImage[option.id] === 'front' ? option.image1 : option.image2"
                :alt="`${option.name} - ${currentImage[option.id] === 'front' ? 'Face' : 'Dos'}`"
                class="w-full h-full object-contain max-h-[450px] pointer-events-none select-none"
              />

              <!-- Flip button -->
              <button
                @click.stop="toggleImage(option.id)"
                class="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-secondary/90 hover:bg-secondary text-white flex items-center justify-center transition-all transform hover:scale-110 z-20"
                :title="currentImage[option.id] === 'front' ? 'Voir le dos' : 'Voir la face'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </button>
            </div>

            <!-- Option Info -->
            <div class="p-6 bg-accent">
              <h2 class="text-2xl font-bold font-heading text-center" style="color: var(--color-primary)">
                {{ option.name }}
              </h2>
            </div>
          </div>
        </div>

        <!-- Background cards (not draggable) -->
        <div v-else class="swipe-card bg-accent border-2 border-gray-700 rounded-2xl overflow-hidden shadow-2xl h-full">
          <div class="relative h-full flex flex-col">
            <div class="relative flex-1 bg-[#f0f0f0] flex items-center justify-center p-6">
              <img
                :src="option.image1"
                :alt="option.name"
                class="w-full h-full object-contain max-h-[450px] opacity-50"
              />
            </div>
            <div class="p-6 bg-accent">
              <h2 class="text-2xl font-bold font-heading text-center" style="color: var(--color-secondary)">
                {{ option.name }}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div v-if="!loading && !error && !showRecap && currentIndex < voteOptions.length" class="flex justify-center items-center gap-8 mt-8">
      <button
        @click="swipeLeft"
        class="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 shadow-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <button
        @click="undo"
        :disabled="userVotes.length === 0"
        class="w-12 h-12 rounded-full bg-gray-600 hover:bg-gray-500 text-white flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
      </button>

      <button
        @click="swipeRight"
        class="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 shadow-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
    </div>

    <!-- Recap Screen -->
    <div v-if="showRecap" class="max-w-2xl mx-auto">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold mb-4 font-heading" style="color: var(--color-secondary)">
          Récapitulatif de tes votes
        </h2>
        <p class="text-gray-300">
          Tu as aimé {{ likedCount }} maillot{{ likedCount > 1 ? 's' : '' }} sur {{ voteOptions.length }}
        </p>
      </div>

      <!-- Liked jerseys -->
      <div v-if="likedCount > 0" class="mb-8">
        <h3 class="text-xl font-bold mb-4 text-green-400">Maillots que tu aimes ❤️</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div
            v-for="vote in userVotes.filter(v => v.liked)"
            :key="vote.optionId"
            class="card p-3"
          >
            <img
              :src="getOptionById(vote.optionId)?.image1"
              :alt="getOptionById(vote.optionId)?.name"
              class="w-full h-32 object-contain mb-2"
            />
            <p class="text-sm text-center font-semibold" style="color: var(--color-secondary)">
              {{ getOptionById(vote.optionId)?.name }}
            </p>
          </div>
        </div>
      </div>

      <!-- Disliked jerseys -->
      <div v-if="dislikedCount > 0" class="mb-8">
        <h3 class="text-xl font-bold mb-4 text-red-400">Maillots que tu n'aimes pas ✖️</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div
            v-for="vote in userVotes.filter(v => !v.liked)"
            :key="vote.optionId"
            class="card p-3 opacity-60"
          >
            <img
              :src="getOptionById(vote.optionId)?.image1"
              :alt="getOptionById(vote.optionId)?.name"
              class="w-full h-32 object-contain mb-2 grayscale"
            />
            <p class="text-sm text-center font-semibold text-gray-400">
              {{ getOptionById(vote.optionId)?.name }}
            </p>
          </div>
        </div>
      </div>

      <!-- Email Form -->
      <div class="mb-8">
        <label for="email" class="block text-sm font-medium mb-2 text-gray-300">
          Adresse email (pour valider ton vote)
        </label>
        <input
          id="email"
          v-model="userEmail"
          type="email"
          placeholder="ton.email@exemple.com"
          class="w-full px-4 py-3 rounded-lg bg-accent border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          :class="{ 'border-red-500': emailError }"
        />
        <p v-if="emailError" class="text-red-400 text-sm mt-1">{{ emailError }}</p>
      </div>

      <!-- Action buttons -->
      <div class="flex gap-4 justify-center mt-8">
        <button
          @click="resetVotes"
          class="btn-secondary px-6 py-3"
        >
          Recommencer
        </button>
        <button
          @click="submitVote"
          :disabled="submitting || likedCount === 0 || !isEmailValid"
          class="btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="submitting">Envoi en cours...</span>
          <span v-else>Valider mes votes</span>
        </button>
      </div>
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

interface SwipeVote {
  optionId: string
  liked: boolean
}

// SEO
useHead({
  title: 'Vote pour le Maillot - La Harde',
  meta: [
    {
      name: 'description',
      content: 'Participe au choix du nouveau maillot de La Harde ! Swipe pour voter sur tes maillots préférés.'
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
  },
  {
    id: '3',
    name: 'Maillot 3',
    image1: '/images/maillots/maillot3-face.png',
    image2: '/images/maillots/maillot3-dos.png',
    votes: 0
  },
  {
    id: '4',
    name: 'Maillot 4',
    image1: '/images/maillots/maillot4-face.png',
    image2: '/images/maillots/maillot4-dos.png',
    votes: 0
  },
  {
    id: '5',
    name: 'Maillot 5',
    image1: '/images/maillots/maillot5-face.png',
    image2: '/images/maillots/maillot5-dos.png',
    votes: 0
  },
  {
    id: '6',
    name: 'Maillot 6',
    image1: '/images/maillots/maillot6-face.png',
    image2: '/images/maillots/maillot6-dos.png',
    votes: 0
  },
  {
    id: '7',
    name: 'Maillot 7',
    image1: '/images/maillots/maillot7-face.png',
    image2: '/images/maillots/maillot7-dos.png',
    votes: 0
  },
  {
    id: '8',
    name: 'Maillot 8',
    image1: '/images/maillots/maillot8-face.png',
    image2: '/images/maillots/maillot8-dos.png',
    votes: 0
  },
  {
    id: '9',
    name: 'Maillot 9',
    image1: '/images/maillots/maillot9-face.png',
    image2: '/images/maillots/maillot9-dos.png',
    votes: 0
  },
  {
    id: '10',
    name: 'Maillot 10',
    image1: '/images/maillots/maillot10-face.png',
    image2: '/images/maillots/maillot10-dos.png',
    votes: 0
  },
  {
    id: '11',
    name: 'Maillot 11',
    image1: '/images/maillots/maillot11-face.png',
    image2: '/images/maillots/maillot11-dos.png',
    votes: 0
  },
  {
    id: '12',
    name: 'Maillot 12',
    image1: '/images/maillots/maillot12-face.png',
    image2: '/images/maillots/maillot12-dos.png',
    votes: 0
  },
  {
    id: '13',
    name: 'Maillot 13',
    image1: '/images/maillots/maillot13-face.png',
    image2: '/images/maillots/maillot13-dos.png',
    votes: 0
  },
  {
    id: '14',
    name: 'Maillot 14',
    image1: '/images/maillots/maillot14-face.png',
    image2: '/images/maillots/maillot14-dos.png',
    votes: 0
  },
  {
    id: '15',
    name: 'Maillot 15',
    image1: '/images/maillots/maillot15-face.png',
    image2: '/images/maillots/maillot15-dos.png',
    votes: 0
  },
])

// State
const userVotes = ref<SwipeVote[]>([])
const currentImage = ref<Record<string, 'front' | 'back'>>({})
const currentIndex = ref(0)
const loading = ref(false)
const error = ref<string | null>(null)
const submitting = ref(false)
const showSuccess = ref(false)
const showRecap = ref(false)
const userEmail = ref('')
const emailError = ref<string | null>(null)

// Drag state
const isDragging = ref(false)
const dragOffset = ref(0)
const startX = ref(0)

// Initialize current images
voteOptions.value.forEach(option => {
  currentImage.value[option.id] = 'front'
})

// Computed
const visibleCards = computed(() => {
  return voteOptions.value.slice(currentIndex.value, currentIndex.value + 3)
})

const likedCount = computed(() => {
  return userVotes.value.filter(v => v.liked).length
})

const dislikedCount = computed(() => {
  return userVotes.value.filter(v => !v.liked).length
})

const isEmailValid = computed(() => {
  if (!userEmail.value) return false
  return validateEmail(userEmail.value)
})

// Functions
const toggleImage = (optionId: string) => {
  currentImage.value[optionId] = currentImage.value[optionId] === 'front' ? 'back' : 'front'
}

const getOptionById = (id: string) => {
  return voteOptions.value.find(opt => opt.id === id)
}

// Swipe functions
const startDrag = (e: MouseEvent | TouchEvent) => {
  isDragging.value = true
  const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX
  if (clientX === undefined) return
  startX.value = clientX

  const moveHandler = (e: MouseEvent | TouchEvent) => {
    if (!isDragging.value) return
    const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX
    if (clientX === undefined) return
    dragOffset.value = clientX - startX.value
  }

  const endHandler = () => {
    if (!isDragging.value) return

    // Threshold for swipe
    if (Math.abs(dragOffset.value) > 100) {
      if (dragOffset.value > 0) {
        swipeRight()
      } else {
        swipeLeft()
      }
    }

    isDragging.value = false
    dragOffset.value = 0

    document.removeEventListener('mousemove', moveHandler)
    document.removeEventListener('mouseup', endHandler)
    document.removeEventListener('touchmove', moveHandler)
    document.removeEventListener('touchend', endHandler)
  }

  document.addEventListener('mousemove', moveHandler)
  document.addEventListener('mouseup', endHandler)
  document.addEventListener('touchmove', moveHandler)
  document.addEventListener('touchend', endHandler)
}

const swipeRight = () => {
  if (currentIndex.value >= voteOptions.value.length) return

  const currentOption = voteOptions.value[currentIndex.value]
  if (!currentOption) return

  userVotes.value.push({
    optionId: currentOption.id,
    liked: true
  })

  currentIndex.value++

  if (currentIndex.value >= voteOptions.value.length) {
    showRecap.value = true
  }
}

const swipeLeft = () => {
  if (currentIndex.value >= voteOptions.value.length) return

  const currentOption = voteOptions.value[currentIndex.value]
  if (!currentOption) return

  userVotes.value.push({
    optionId: currentOption.id,
    liked: false
  })

  currentIndex.value++

  if (currentIndex.value >= voteOptions.value.length) {
    showRecap.value = true
  }
}

const undo = () => {
  if (userVotes.value.length === 0) return

  userVotes.value.pop()
  currentIndex.value--
  showRecap.value = false
}

const resetVotes = () => {
  userVotes.value = []
  currentIndex.value = 0
  showRecap.value = false
  userEmail.value = ''
  emailError.value = null
}

const validateEmail = (email: string): boolean => {
  // Regex RFC 5322 compliant pour validation d'email
  // Force la présence d'au moins un point dans le domaine et d'une extension
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
  return emailRegex.test(email.trim())
}

const submitVote = async () => {
  emailError.value = null

  // Valider l'email
  if (!userEmail.value) {
    emailError.value = 'L\'adresse email est requise'
    return
  }

  if (!validateEmail(userEmail.value)) {
    emailError.value = 'Veuillez entrer une adresse email valide'
    return
  }

  submitting.value = true
  error.value = null

  try {
    // Envoyer les votes au backend
    const config = useRuntimeConfig()
    const votesToSubmit = userVotes.value
      .filter(v => v.liked)
      .map(v => ( v.optionId))

    await $fetch(`${config.public.apiBaseUrl}/obtorta/herd/votes`, {
      method: 'POST',
      body: {
        votes: votesToSubmit,
        email: userEmail.value
      }
    })

    showSuccess.value = true

    // Reset after successful submission
    setTimeout(() => {
      resetVotes()
      showSuccess.value = false
    }, 3000)
  } catch (e) {
    error.value = 'Impossible d\'enregistrer ton vote. Veuillez réessayer.'
    console.error(e)
  } finally {
    submitting.value = false
  }
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
