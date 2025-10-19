<template>
  <div class="relative rounded-2xl border-4 overflow-hidden" style="border-color: var(--color-secondary);">
    <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center z-10" style="background-color: rgba(245, 241, 237, 0.95);">
      <div class="text-center">
        <div class="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse"
          style="background-color: var(--color-accent);">
          <span class="text-3xl">📍</span>
        </div>
        <p class="text-lg font-bold" style="color: var(--color-accent);">Chargement de la carte...</p>
      </div>
    </div>

    <div v-if="error" class="p-8 text-center" style="background-color: rgba(245, 241, 237, 0.95);">
      <div class="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
        style="background-color: rgba(239, 68, 68, 0.2);">
        <span class="text-3xl">⚠️</span>
      </div>
      <p class="text-base font-semibold text-red-600">{{ error }}</p>
    </div>

    <div ref="mapContainer" class="w-full" style="height: 400px;"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Props
const props = defineProps<{
  location: string
}>()

// État
const mapContainer = ref<HTMLElement | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)
let map: L.Map | null = null
let marker: L.Marker | null = null

// Fonction pour géocoder une ville française
const geocodeLocation = async (location: string): Promise<{ lat: number; lon: number; displayName: string } | null> => {
  try {
    // Utiliser l'API de géocodage du gouvernement français
    const response = await $fetch<any>(
      `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(location)}&limit=1`
    )

    if (response?.features && response.features.length > 0) {
      const feature = response.features[0]
      const [lon, lat] = feature.geometry.coordinates
      return {
        lat,
        lon,
        displayName: feature.properties.label || location
      }
    }

    // Fallback vers Nominatim si l'API française ne trouve rien
    const nominatimResponse = await $fetch<any[]>(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1&countrycodes=fr`
    )

    if (nominatimResponse && nominatimResponse.length > 0) {
      return {
        lat: parseFloat(nominatimResponse[0].lat),
        lon: parseFloat(nominatimResponse[0].lon),
        displayName: nominatimResponse[0].display_name
      }
    }

    return null
  } catch (err) {
    console.error('Erreur de géocodage:', err)
    return null
  }
}

// Initialiser la carte
const initMap = async () => {
  if (!mapContainer.value || !props.location) return

  isLoading.value = true
  error.value = null

  try {
    // Géocoder la localisation
    const coords = await geocodeLocation(props.location)

    if (!coords) {
      error.value = 'Impossible de localiser cette adresse'
      isLoading.value = false
      return
    }

    // Créer la carte si elle n'existe pas
    if (!map) {
      map = L.map(mapContainer.value).setView([coords.lat, coords.lon], 13)

      // Ajouter les tuiles OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map)
    } else {
      // Mettre à jour la vue
      map.setView([coords.lat, coords.lon], 13)
    }

    // Supprimer l'ancien marqueur s'il existe
    if (marker) {
      marker.remove()
    }

    // Créer un marqueur personnalisé
    const customIcon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div class="marker-pin">
          <div class="marker-icon">📍</div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    })

    // Ajouter le marqueur
    marker = L.marker([coords.lat, coords.lon], { icon: customIcon }).addTo(map)

    // Ajouter une popup avec les informations
    marker.bindPopup(`
      <div style="text-align: center; font-family: 'Montserrat', sans-serif;">
        <div style="font-weight: bold; font-size: 16px; color: #3A3A3A; margin-bottom: 4px;">
          📍 ${props.location}
        </div>
        <div style="font-size: 12px; color: #6D2A31; opacity: 0.8;">
          ${coords.displayName}
        </div>
      </div>
    `).openPopup()

    isLoading.value = false
  } catch (err) {
    console.error('Erreur lors de l\'initialisation de la carte:', err)
    error.value = 'Erreur lors du chargement de la carte'
    isLoading.value = false
  }
}

// Surveiller les changements de localisation
watch(() => props.location, () => {
  if (props.location) {
    initMap()
  }
})

// Initialiser au montage
onMounted(() => {
  if (props.location) {
    initMap()
  }
})
</script>

<style scoped>
/* Styles pour le marqueur personnalisé */
:deep(.custom-marker) {
  background: none;
  border: none;
}

:deep(.marker-pin) {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: bounce 2s infinite;
}

:deep(.marker-icon) {
  font-size: 40px;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Styles pour la popup Leaflet */
:deep(.leaflet-popup-content-wrapper) {
  border-radius: 12px;
  border: 3px solid var(--color-secondary);
  background-color: var(--color-primary);
  padding: 8px;
}

:deep(.leaflet-popup-tip) {
  background-color: var(--color-primary);
  border: 3px solid var(--color-secondary);
  border-top: none;
  border-left: none;
}

:deep(.leaflet-popup-close-button) {
  color: var(--color-accent) !important;
  font-size: 24px !important;
  font-weight: bold !important;
}

:deep(.leaflet-popup-close-button:hover) {
  color: var(--color-secondary) !important;
}
</style>
