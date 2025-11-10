<template>
  <div class="container mx-auto px-4 py-12" @click="closeCalendar">
    <div class="mb-12">
      <h1 class="text-5xl md:text-6xl font-extrabold mb-6" style="color: var(--color-primary);">
        Nos Activités
      </h1>
    </div>

    <!-- Bouton pour ouvrir la modale -->
    <div class="mb-12 text-center">
      <button @click="showModal = true"
        class="px-8 py-5 rounded-xl text-xl font-extrabold uppercase tracking-wider transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
        style="background-color: var(--color-primary); color: var(--color-accent);">
        ✨ Créer une nouvelle activité
      </button>
    </div>

    <!-- Modale de création d'activité -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4" @click="closeModal">
          <!-- Overlay -->
          <div class="absolute inset-0 bg-black bg-opacity-70"></div>

          <!-- Contenu de la modale -->
          <div @click.stop class="relative rounded-2xl border-4 w-full max-w-5xl max-h-[90vh] overflow-y-auto"
            style="background: var(--color-primary); border-color: var(--color-secondary);">
            <!-- Bouton de fermeture -->
            <button @click="closeModal"
              class="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-10"
              style="background-color: var(--color-accent); color: var(--color-primary);">
              <span class="text-2xl font-bold">×</span>
            </button>

            <div class="relative p-8 md:p-10">
              <div class="text-center mb-8">
                <div class="inline-block px-6 py-2 rounded-full mb-4" style="background-color: var(--color-accent);">
                  <span class="text-sm font-bold uppercase tracking-wider" style="color: var(--color-primary);">Nouvelle
                    activité</span>
                </div>
                <h2 class="text-4xl font-extrabold" style="color: var(--color-accent);">
                  Créer un événement
                </h2>
                <p class="mt-2 text-lg" style="color: var(--color-secondary); opacity: 0.9;">
                  Planifiez la prochaine sortie de LA HARDE
                </p>
              </div>

              <form @submit.prevent="handleCreateEvent" class="space-y-6 max-w-4xl mx-auto">
                <div class="relative">
                  <label for="name" class="block text-base font-bold mb-3 uppercase tracking-wide"
                    style="color: var(--color-accent);">
                    📝 Nom de l'activité *
                  </label>
                  <input id="name" v-model="newEvent.name" type="text" required
                    class="w-full px-5 py-4 rounded-xl text-lg font-semibold"
                    style="background-color: rgba(245, 241, 237, 0.95); color: var(--color-accent); border: 3px solid transparent;"
                    :style="{ borderColor: newEvent.name ? 'var(--color-accent)' : 'transparent' }"
                    placeholder="Ex: La Roue Tourangelle" />
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="relative calendar-wrapper">
                    <label class="block text-base font-bold mb-3 uppercase tracking-wide" style="color: var(--color-accent);">
                      📅 Date *
                    </label>
                    <button type="button" @click.stop="showCalendar = !showCalendar"
                      class="w-full px-5 py-4 pr-14 rounded-xl text-lg font-semibold cursor-pointer text-left"
                      style="background-color: rgba(245, 241, 237, 0.95); color: var(--color-accent); border: 3px solid transparent;"
                      :style="{ borderColor: newEvent.date ? 'var(--color-accent)' : 'transparent' }">
                      {{ newEvent.date ? formatDatePreview(newEvent.date) : 'Sélectionner une date' }}
                    </button>
                    <div class="absolute right-4 top-16 transform -translate-y-1/2 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" style="color: var(--color-accent);">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>

                    <!-- Calendrier popup -->
                    <div v-if="showCalendar" @click.stop class="calendar-popup absolute mt-2 rounded-xl shadow-2xl p-6"
                      style="background-color: rgba(245, 241, 237, 0.98); border: 3px solid var(--color-accent); z-index: 10000; min-width: 350px;">
                      <div class="calendar-header flex justify-between items-center mb-4">
                        <button type="button" @click="previousMonth"
                          :disabled="isPreviousMonthDisabled"
                          class="px-3 py-1 rounded-lg font-bold transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                          :class="{ 'hover:scale-110': !isPreviousMonthDisabled }"
                          style="color: var(--color-accent); background-color: rgba(205, 164, 52, 0.1);">
                          ←
                        </button>
                        <h4 class="text-xl font-bold" style="color: var(--color-accent);">
                          {{ monthText }}
                        </h4>
                        <button type="button" @click="nextMonth"
                          class="px-3 py-1 rounded-lg font-bold transition-all duration-300 hover:scale-110"
                          style="color: var(--color-accent); background-color: rgba(205, 164, 52, 0.1);">
                          →
                        </button>
                      </div>

                      <div class="calendar-grid grid grid-cols-7 gap-1">
                        <div v-for="day in days" :key="day" class="text-center py-2 font-bold text-sm"
                          style="color: var(--color-accent);">
                          {{ day }}
                        </div>
                        <div v-for="n in startingDayOfWeek" :key="'empty-' + n" class="text-center py-3"></div>
                        <div v-for="date in dates" :key="date.getTime()" @click="isDateDisabled(date) ? null : selectDate(date)"
                          class="text-center py-3 rounded-lg font-semibold transition-all duration-300"
                          :class="{
                            'selected-date': selectedDate && date.getTime() === selectedDate.getTime(),
                            'cursor-pointer hover:scale-110': !isDateDisabled(date),
                            'opacity-30 cursor-not-allowed': isDateDisabled(date)
                          }" style="color: var(--color-accent);">
                          {{ date.getDate() }}
                        </div>
                      </div>
                    </div>

                    <p v-if="newEvent.date" class="mt-2 text-sm font-semibold" style="color: var(--color-accent);">
                      ✓ {{ formatDatePreview(newEvent.date) }}
                    </p>
                  </div>

                  <div class="relative">
                    <label for="type" class="block text-base font-bold mb-3 uppercase tracking-wide"
                      style="color: var(--color-accent);">
                      🏁 Type *
                    </label>
                    <select id="type" v-model="newEvent.type" required
                      class="w-full px-5 py-4 rounded-xl text-lg font-semibold  cursor-pointer"
                      style="background-color: rgba(245, 241, 237, 0.95); color: var(--color-accent); border: 3px solid var(--color-accent);">
                      <option value="RANDO">🚴 Randonnée</option>
                      <option value="COURSE">🏆 Course</option>
                      <option value="ENTRAINEMENT">💪 Entraînement</option>
                    </select>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="relative address-autocomplete-wrapper" @click.stop>
                    <label for="localisation" class="block text-base font-bold mb-3 uppercase tracking-wide"
                      style="color: var(--color-accent);">
                      📍 Localisation *
                    </label>
                    <input
                      id="localisation"
                      v-model="addressSearchQuery"
                      @input="handleAddressSearch"
                      @focus="showAddressSuggestions = true"
                      type="text"
                      required
                      autocomplete="off"
                      class="w-full px-5 py-4 rounded-xl text-lg font-semibold "
                      style="background-color: rgba(245, 241, 237, 0.95); color: var(--color-accent); border: 3px solid transparent;"
                      :style="{ borderColor: newEvent.localisation || addressSearchQuery ? 'var(--color-accent)' : 'transparent' }"
                      placeholder="Ex: 10 rue de la Paix, Tours ou Chinon..." />

                    <!-- Message de chargement -->
                    <div
                      v-if="isSearchingAddresses && addressSearchQuery.length >= 3"
                      class="absolute mt-2 px-5 py-3 rounded-xl shadow-lg"
                      style="background-color: rgba(245, 241, 237, 0.98); border: 3px solid var(--color-accent); z-index: 10000;">
                      <p class="text-sm font-semibold" style="color: var(--color-accent);">
                        🔍 Recherche en cours...
                      </p>
                    </div>

                    <!-- Liste d'autocomplétion -->
                    <div
                      v-else-if="showAddressSuggestions && addressSuggestions.length > 0"
                      @click.stop
                      class="absolute mt-2 rounded-xl shadow-2xl overflow-hidden max-h-96 overflow-y-auto"
                      style="background-color: rgba(245, 241, 237, 0.98); border: 3px solid var(--color-accent); z-index: 10000; width: 100%;">
                      <div
                        v-for="(address, index) in addressSuggestions"
                        :key="index"
                        @click="selectAddress(address)"
                        class="address-suggestion-item px-5 py-3 cursor-pointer transition-all duration-200 border-b border-opacity-20 hover:bg-opacity-80"
                        style="border-color: var(--color-accent);"
                      >
                        <div>
                          <div class="text-base font-bold" style="color: var(--color-accent);">
                            {{ address.label }}
                          </div>
                          <div v-if="address.context" class="text-xs font-semibold opacity-70 mt-1" style="color: var(--color-secondary);">
                            {{ address.context }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="relative">
                    <label for="distance" class="block text-base font-bold mb-3 uppercase tracking-wide"
                      style="color: var(--color-accent);">
                      🚴 Distance *
                    </label>
                    <input id="distance" v-model="newEvent.distance" type="text" required
                      class="w-full px-5 py-4 rounded-xl text-lg font-semibold "
                      style="background-color: rgba(245, 241, 237, 0.95); color: var(--color-accent); border: 3px solid transparent;"
                      :style="{ borderColor: newEvent.distance ? 'var(--color-accent)' : 'transparent' }"
                      placeholder="Ex: 59km" />
                  </div>
                </div>

                <div class="relative">
                  <label for="gpx" class="block text-base font-bold mb-3 uppercase tracking-wide"
                    style="color: var(--color-accent);">
                    🗺️ Fichier GPX (optionnel)
                  </label>
                  <div class="flex flex-col gap-3">
                    <label for="gpx"
                      class="w-full px-5 py-4 rounded-xl text-lg font-semibold cursor-pointer flex items-center justify-center gap-3 transition-all duration-300 hover:scale-102"
                      style="background-color: rgba(245, 241, 237, 0.95); color: var(--color-accent); border: 3px solid transparent;"
                      :style="{ borderColor: gpxFile ? 'var(--color-accent)' : 'transparent' }">
                      <span class="text-2xl">📁</span>
                      <span>{{ gpxFile ? gpxFile.name : 'Choisir un fichier GPX' }}</span>
                    </label>
                    <input
                      id="gpx"
                      type="file"
                      accept=".gpx"
                      @change="handleGpxFileChange"
                      class="hidden"
                    />
                    <p v-if="gpxFile" class="text-sm font-semibold" style="color: var(--color-accent);">
                      ✓ {{ gpxFile.name }} ({{ formatFileSize(gpxFile.size) }})
                    </p>
                  </div>
                </div>

                <div class="pt-4">
                  <button type="submit" :disabled="isCreating"
                    class="w-full px-8 py-5 rounded-xl text-xl font-extrabold uppercase tracking-wider transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    style="background-color: var(--color-accent); color: var(--color-primary);">
                    {{ isCreating ? '⏳ Création en cours...' : '✨ Créer l\'activité' }}
                  </button>
                </div>

                <div v-if="createSuccess" class="text-center p-4 rounded-lg animate-pulse"
                  style="background-color: rgba(34, 197, 94, 0.2);">
                  <p class="text-xl font-bold text-green-400">
                    ✓ Activité créée avec succès !
                  </p>
                </div>

                <div v-if="createError" class="text-center p-4 rounded-lg animate-pulse"
                  style="background-color: rgba(239, 68, 68, 0.2);">
                  <p class="text-xl font-bold text-red-400">
                    ✗ Erreur lors de la création
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Liste des activités -->
    <div>
      <h2 class="text-3xl font-bold mb-6" style="color: var(--color-primary);">
        Prochaines activités
      </h2>

      <!-- État: Erreur -->
      <div v-if="viewState === 'error'" class="card text-center">
        <p class="text-xl text-red-600 mb-4">Erreur lors du chargement des activités</p>
        <ThreeModel model-path="/models/sanglier.glb" />
        <button @click="loadEvents" class="btn-secondary mt-6">
          Réessayer
        </button>
      </div>

      <!-- État: Aucune activité -->
      <div v-else-if="viewState === 'empty'" class="card text-center">
        <p class="text-xl" style="color: var(--color-text);">
          Aucune activité pour le moment. Créez-en une !
        </p>
      </div>

      <!-- État: Chargement et Modèle 3D (même instance) -->
      <div v-else-if="viewState === 'loading' || viewState === 'model'" class="text-center">
        <div class="mb-8">
          <button
            @click="viewState === 'model' ? viewState = 'activities' : null"
            :disabled="viewState === 'loading'"
            class="px-8 py-5 rounded-xl text-xl font-extrabold uppercase tracking-wider transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            style="background-color: var(--color-primary); color: var(--color-accent);">
            {{ viewState === 'loading' ? '⏳ Chargement des activités...' : '🚴 Voir les activités' }}
          </button>
        </div>
        <ThreeModel
          model-path="/models/sanglier.glb"
          :auto-rotate="true"
          :auto-rotate-speed="0.02"
        />
      </div>

      <!-- État: Liste des activités -->
      <Transition name="activities-fade">
        <div v-if="viewState === 'activities'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NuxtLink v-for="event in sortedEvents" :key="event._id" :to="`/race/${event._id}`"
          class="relative rounded-2xl border-4 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group flex flex-col"
          style="background: var(--color-primary); border-color: var(--color-secondary);">
          <div class="relative p-6 flex-1 flex flex-col">
            <!-- Badge de type -->
            <div class="mb-4">
              <div class="inline-block px-4 py-2 rounded-full font-bold text-sm uppercase tracking-wider shadow-lg"
                style="background-color: var(--color-accent); color: var(--color-primary);">
                {{ getTypeIcon(event.type) }} {{ getTypeLabel(event.type) }}
              </div>
            </div>

            <!-- Titre -->
            <div class="mb-6">
              <h3 class="text-2xl md:text-3xl font-extrabold leading-tight"
                style="color: var(--color-accent);">
                {{ event.name }}
              </h3>
            </div>

            <!-- Détails de l'événement -->
            <div class="space-y-3 mb-6 flex-1">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style="background-color: rgba(245, 241, 237, 0.9);">
                  <span class="text-xl">📅</span>
                </div>
                <div>
                  <div class="text-xs font-bold uppercase tracking-wide opacity-80"
                    style="color: var(--color-secondary);">
                    Date
                  </div>
                  <div class="text-base font-bold" style="color: var(--color-secondary);">
                    {{ formatDate(event.date) }}
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style="background-color: rgba(245, 241, 237, 0.9);">
                  <span class="text-xl">📍</span>
                </div>
                <div>
                  <div class="text-xs font-bold uppercase tracking-wide opacity-80"
                    style="color: var(--color-secondary);">
                    Lieu
                  </div>
                  <div class="text-base font-bold" style="color: var(--color-secondary);">
                    {{ event.localisation }}
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style="background-color: rgba(245, 241, 237, 0.9);">
                  <span class="text-xl">🚴</span>
                </div>
                <div>
                  <div class="text-xs font-bold uppercase tracking-wide opacity-80"
                    style="color: var(--color-secondary);">
                    Distance
                  </div>
                  <div class="text-base font-bold" style="color: var(--color-secondary);">
                    {{ event.distance }}km
                  </div>
                </div>
              </div>
            </div>

            <!-- Bouton d'action -->
            <div class="mt-6 pt-4 border-t-2" style="border-color: var(--color-secondary); opacity: 0.3;">
              <div class="flex items-center justify-between">
                <div class="text-sm font-extrabold uppercase tracking-wider group-hover:translate-x-1 transition-transform duration-300"
                  style="color: var(--color-accent);">
                  Voir les détails
                </div>
                <span class="text-xl group-hover:translate-x-1 transition-transform duration-300"
                  style="color: var(--color-accent);">
                  →
                </span>
              </div>
            </div>
          </div>
        </NuxtLink>
        </div>
      </Transition>

      <h2 v-if="viewState === 'activities'" class="text-3xl font-bold m-6" style="color: var(--color-primary);">
        Les anciennes activités
      </h2>

      <Transition name="activities-fade">
        <div v-if="viewState === 'activities'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NuxtLink v-for="event in pastEvents" :key="event._id" :to="`/race/${event._id}`"
          class="relative rounded-2xl border-4 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group flex flex-col"
          style="background: var(--color-primary); border-color: var(--color-secondary);">
          <div class="relative p-6 flex-1 flex flex-col">
            <!-- Badge de type -->
            <div class="mb-4">
              <div class="inline-block px-4 py-2 rounded-full font-bold text-sm uppercase tracking-wider shadow-lg"
                style="background-color: var(--color-accent); color: var(--color-primary);">
                {{ getTypeIcon(event.type) }} {{ getTypeLabel(event.type) }}
              </div>
            </div>

            <!-- Titre -->
            <div class="mb-6">
              <h3 class="text-2xl md:text-3xl font-extrabold leading-tight"
                style="color: var(--color-accent);">
                {{ event.name }}
              </h3>
            </div>

            <!-- Détails de l'événement -->
            <div class="space-y-3 mb-6 flex-1">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style="background-color: rgba(245, 241, 237, 0.9);">
                  <span class="text-xl">📅</span>
                </div>
                <div>
                  <div class="text-xs font-bold uppercase tracking-wide opacity-80"
                    style="color: var(--color-secondary);">
                    Date
                  </div>
                  <div class="text-base font-bold" style="color: var(--color-secondary);">
                    {{ formatDate(event.date) }}
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style="background-color: rgba(245, 241, 237, 0.9);">
                  <span class="text-xl">📍</span>
                </div>
                <div>
                  <div class="text-xs font-bold uppercase tracking-wide opacity-80"
                    style="color: var(--color-secondary);">
                    Lieu
                  </div>
                  <div class="text-base font-bold" style="color: var(--color-secondary);">
                    {{ event.localisation }}
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style="background-color: rgba(245, 241, 237, 0.9);">
                  <span class="text-xl">🚴</span>
                </div>
                <div>
                  <div class="text-xs font-bold uppercase tracking-wide opacity-80"
                    style="color: var(--color-secondary);">
                    Distance
                  </div>
                  <div class="text-base font-bold" style="color: var(--color-secondary);">
                    {{ event.distance }}km
                  </div>
                </div>
              </div>
            </div>

            <!-- Bouton d'action -->
            <div class="mt-6 pt-4 border-t-2" style="border-color: var(--color-secondary); opacity: 0.3;">
              <div class="flex items-center justify-between">
                <div class="text-sm font-extrabold uppercase tracking-wider group-hover:translate-x-1 transition-transform duration-300"
                  style="color: var(--color-accent);">
                  Voir les détails
                </div>
                <span class="text-xl group-hover:translate-x-1 transition-transform duration-300"
                  style="color: var(--color-accent);">
                  →
                </span>
              </div>
            </div>
          </div>
        </NuxtLink>
        </div>
      </Transition>
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

interface Address {
  label: string
  score: number
  housenumber?: string
  street?: string
  postcode?: string
  city?: string
  context?: string
  coordinates: {
    lon: number
    lat: number
  }
}

// Composables
const { getEvents, createEvent } = useEvents()
const { searchAddresses, formatAddress, getShortAddress } = useAddressAutocomplete()
const { sendNotification } = useNotifications()

// État de la vue principale
type ViewState = 'loading' | 'error' | 'empty' | 'model' | 'activities'
const viewState = ref<ViewState>('loading')

// État des données
const events = ref<Event[]>([])

// État des modales et formulaires
const showModal = ref(false)
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

// État pour l'autocomplétion des adresses
const addressSearchQuery = ref('')
const addressSuggestions = ref<Address[]>([])
const showAddressSuggestions = ref(false)
const isSearchingAddresses = ref(false)
let searchTimeout: ReturnType<typeof setTimeout> | null = null

// État pour le fichier GPX
const gpxFile = ref<File | null>(null)
const uploadedGpxId = ref<string | null>(null)

// État du calendrier
const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const months = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
]

const showCalendar = ref(false)
const calendarDate = ref(new Date())
const dates = ref<Date[]>([])
const selectedDate = ref<Date | null>(null)
const startingDayOfWeek = ref(0)
const monthText = ref('')

// Tri des événements par date
const sortedEvents = computed(() => {
  const now = new Date().getTime()
  return [...events.value]
    .filter(event => new Date(event.date).getTime() >= now)
    .sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
})

const pastEvents = computed(() => {
  const now = new Date().getTime()
  return [...events.value]
    .filter(event => new Date(event.date).getTime() < now)
    .sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
})

// Computed pour vérifier si le bouton du mois précédent doit être désactivé
const isPreviousMonthDisabled = computed(() => {
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()
  const calendarMonth = calendarDate.value.getMonth()
  const calendarYear = calendarDate.value.getFullYear()

  // Désactiver si on est sur le mois actuel ou un mois dans le passé
  return (calendarYear < currentYear) || (calendarYear === currentYear && calendarMonth <= currentMonth)
})

// Fonctions
const loadEvents = async () => {
  viewState.value = 'loading'

  try {
    events.value = await getEvents()

    // Attendre 5 secondes pour l'animation du modèle 3D
    setTimeout(() => {
      // Déterminer l'état suivant en fonction des données
      if (events.value.length === 0) {
        viewState.value = 'empty'
      } else {
        viewState.value = 'model'
      }
    }, 5000)
  } catch (error) {
    viewState.value = 'error'
    console.error('Erreur lors du chargement des activités:', error)
  }
}

const handleCreateEvent = async () => {
  isCreating.value = true
  createSuccess.value = false
  createError.value = false

  try {
    // Créer l'événement avec le fichier GPX directement
    const eventData = {
      ...newEvent.value,
      gpx: gpxFile.value || undefined
    }

    const createdEvent = await createEvent(eventData)

    events.value.push(createdEvent)

    // Envoyer une notification automatique
    try {
      await sendNotification(
        'Nouvelle activité',
        `Lieu de RDV: ${createdEvent.localisation} - Distance: ${createdEvent.distance}`,
        {
          url: '/activities/' + createdEvent._id
        }
      )
    } catch (notifError) {
      // Ne pas bloquer si l'envoi de notification échoue
      console.error('Erreur lors de l\'envoi de la notification:', notifError)
    }

    // Réinitialiser le formulaire
    newEvent.value = {
      name: '',
      date: '',
      localisation: '',
      distance: '',
      type: 'RANDO'
    }
    selectedDate.value = null
    gpxFile.value = null
    uploadedGpxId.value = null
    addressSearchQuery.value = ''
    addressSuggestions.value = []

    createSuccess.value = true
    setTimeout(() => {
      createSuccess.value = false
      showModal.value = false
    }, 1500)
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

const formatDatePreview = (dateStr: string) => {
  const date = new Date(dateStr)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  // Comparer les dates
  if (date.toDateString() === today.toDateString()) {
    return "Aujourd'hui"
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return "Demain"
  } else {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date)
  }
}

// Fonctions du calendrier
const getDatesOfMonth = (month: number, year: number) => {
  dates.value = []
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  for (let day = 1; day <= daysInMonth; day++) {
    dates.value.push(new Date(year, month, day))
  }
}

const updateCalendar = () => {
  monthText.value = months[calendarDate.value.getMonth()] + ' ' + calendarDate.value.getFullYear()
  const firstDayOfMonth = new Date(calendarDate.value.getFullYear(), calendarDate.value.getMonth(), 1)
  startingDayOfWeek.value = firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1
}

const previousMonth = () => {
  if (calendarDate.value.getMonth() === 0) {
    calendarDate.value.setFullYear(calendarDate.value.getFullYear() - 1)
    calendarDate.value.setMonth(11)
  } else {
    calendarDate.value.setMonth(calendarDate.value.getMonth() - 1)
  }
  getDatesOfMonth(calendarDate.value.getMonth(), calendarDate.value.getFullYear())
  updateCalendar()
}

const nextMonth = () => {
  if (calendarDate.value.getMonth() === 11) {
    calendarDate.value.setFullYear(calendarDate.value.getFullYear() + 1)
    calendarDate.value.setMonth(0)
  } else {
    calendarDate.value.setMonth(calendarDate.value.getMonth() + 1)
  }
  getDatesOfMonth(calendarDate.value.getMonth(), calendarDate.value.getFullYear())
  updateCalendar()
}

const isDateDisabled = (date: Date): boolean => {
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Réinitialiser l'heure pour comparer uniquement la date
  const compareDate = new Date(date)
  compareDate.setHours(0, 0, 0, 0)

  return compareDate < today
}

const selectDate = (date: Date) => {
  if (isDateDisabled(date)) return

  selectedDate.value = date
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  newEvent.value.date = `${year}-${month}-${day}`
  showCalendar.value = false
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

const closeCalendar = () => {
  showCalendar.value = false
}

const closeModal = () => {
  showModal.value = false
  showCalendar.value = false
}

// Fonctions d'autocomplétion des adresses
const handleAddressSearch = async () => {
  const query = addressSearchQuery.value.trim()

  // Annuler la recherche précédente
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  if (query.length < 3) {
    addressSuggestions.value = []
    showAddressSuggestions.value = false
    return
  }

  // Debounce de 300ms
  searchTimeout = setTimeout(async () => {
    isSearchingAddresses.value = true
    try {
      const results = await searchAddresses(query, 10)
      addressSuggestions.value = results
      showAddressSuggestions.value = results.length > 0
    } catch (error) {
      console.error('Erreur de recherche:', error)
      addressSuggestions.value = []
    } finally {
      isSearchingAddresses.value = false
    }
  }, 300)
}

const selectAddress = (address: Address) => {
  newEvent.value.localisation = formatAddress(address)
  addressSearchQuery.value = formatAddress(address)
  addressSuggestions.value = []
  showAddressSuggestions.value = false
}

// Fonction pour gérer le changement de fichier GPX
const handleGpxFileChange = (e: any) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    gpxFile.value = target.files[0]
  }
}

// Fonction pour formater la taille du fichier
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

// Chargement initial
onMounted(() => {
  loadEvents()
  // Initialiser le calendrier
  getDatesOfMonth(calendarDate.value.getMonth(), calendarDate.value.getFullYear())
  updateCalendar()

  // Fermer les suggestions en cliquant à l'extérieur
  if (typeof window !== 'undefined') {
    document.addEventListener('click', () => {
      showAddressSuggestions.value = false
    })
  }
})
</script>

<style scoped>
/* Conteneur de l'autocomplétion des adresses */
.address-autocomplete-wrapper {
  position: relative;
  z-index: 1;
}

.address-suggestion-item {
  background-color: transparent;
}

.address-suggestion-item:hover {
  background-color: rgba(58, 58, 58, 0.1);
  transform: translateX(4px);
}

.address-suggestion-item:last-child {
  border-bottom: none;
}

/* Conteneur du calendrier avec z-index élevé */
.calendar-wrapper {
  position: relative;
  z-index: 2;
}

/* Popup du calendrier */
.calendar-wrapper>div[v-if] {
  position: absolute !important;
  z-index: 9999 !important;
  min-width: 350px;
  max-width: 400px;
}

/* Grille du calendrier */
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

/* Date sélectionnée */
.calendar-grid .selected-date {
  background-color: var(--color-accent) !important;
  color: var(--color-primary) !important;
  font-weight: bold;
  box-shadow: 0 4px 6px rgba(205, 164, 52, 0.3);
  transform: scale(1.1);
}

/* Hover sur les dates */
.calendar-grid>div:hover:not(.selected-date) {
  background-color: rgba(205, 164, 52, 0.2);
  transform: scale(1.05);
}

/* Jour de la semaine (en-têtes) */
.calendar-grid>div:nth-child(-n+7) {
  font-weight: bold;
  pointer-events: none;
}

/* Animations de la modale */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active > div:last-child,
.modal-leave-active > div:last-child {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from > div:last-child,
.modal-leave-to > div:last-child {
  transform: scale(0.9);
  opacity: 0;
}

/* Animation du bouton "Voir les activités" */
.fade-in-enter-active {
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.fade-in-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-in-enter-to {
  opacity: 1;
  transform: translateY(0);
}

/* Animation de la liste des activités */
.activities-fade-enter-active {
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.activities-fade-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.activities-fade-enter-to {
  opacity: 1;
  transform: translateY(0);
}
</style>
