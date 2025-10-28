<template>
  <div>
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

    <!-- Boutons d'actions GPX -->
    <div v-if="hasGpxData" class="mt-4 flex flex-wrap justify-center gap-4">
      <button
        @click="downloadGpx"
        class="px-6 py-3 rounded-xl font-bold uppercase tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-lg inline-flex items-center gap-2"
        style="background-color: var(--color-accent); color: var(--color-primary);">
        <span class="text-xl">📥</span>
        Télécharger le parcours GPX
      </button>

      <button
        @click="openGPS"
        class="px-6 py-3 rounded-xl font-bold uppercase tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-lg inline-flex items-center gap-2"
        style="background-color: var(--color-secondary); color: var(--color-primary);">
        <span class="text-xl">🧭</span>
        Naviguer vers le départ
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

// Import Leaflet uniquement côté client
let L: any = null
if (process.client) {
  L = (await import('leaflet')).default
  await import('leaflet/dist/leaflet.css')
}

// Props
const props = defineProps<{
  location: string
  eventId?: string
  gpxData?: any // Données GPX de l'événement
}>()

// État
const mapContainer = ref<HTMLElement | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)
const gpxContent = ref<string | null>(null)
const hasGpxData = ref(false)
const startPoint = ref<{ lat: number; lon: number } | null>(null)
let map: any = null
let marker: any = null
let gpxLayer: any = null

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

// Fonction pour convertir les données GPX du buffer en string
const convertGpxBufferToString = (gpxData: any): string | null => {
  try {
    if (!gpxData || !gpxData.file || !gpxData.file.data || gpxData.file.data.length === 0) {
      return null
    }

    // Convertir le Buffer en string
    const buffer = new Uint8Array(gpxData.file.data)
    const decoder = new TextDecoder('utf-8')
    return decoder.decode(buffer)
  } catch (err) {
    console.error('Erreur lors de la conversion du GPX:', err)
    return null
  }
}

// Fonction pour parser et afficher le GPX
const parseAndDisplayGpx = async (gpxContentString: string) => {
  if (!L || !map) return

  try {
    // Stocker le contenu GPX pour le téléchargement
    gpxContent.value = gpxContentString
    hasGpxData.value = true

    // Parser le GPX
    const parser = new DOMParser()
    const gpxDoc = parser.parseFromString(gpxContentString, 'text/xml')

    // Extraire les points de trace
    const trackPoints = gpxDoc.querySelectorAll('trkpt')

    if (trackPoints.length === 0) {
      console.warn('Aucun point de trace trouvé dans le GPX')
      return
    }

    // Convertir les points en coordonnées Leaflet
    const latLngs: [number, number][] = []
    trackPoints.forEach((point) => {
      const lat = parseFloat(point.getAttribute('lat') || '0')
      const lon = parseFloat(point.getAttribute('lon') || '0')
      latLngs.push([lat, lon])
    })

    // Stocker le point de départ pour la navigation GPS
    if (latLngs.length > 0) {
      startPoint.value = { lat: latLngs[0][0], lon: latLngs[0][1] }
    }

    // Supprimer l'ancien tracé s'il existe
    if (gpxLayer) {
      gpxLayer.remove()
    }

    // Créer une polyligne pour le tracé GPX
    gpxLayer = L.polyline(latLngs, {
      color: '#3B2077',
      weight: 4,
      opacity: 0.8,
      smoothFactor: 1
    }).addTo(map)

    // Ajuster la vue pour afficher tout le tracé
    map.fitBounds(gpxLayer.getBounds(), { padding: [50, 50] })

    // Déplacer le marqueur au début de la trace GPX si il existe
    if (marker && latLngs.length > 0) {
      const startPointCoords = latLngs[0]
      marker.setLatLng(startPointCoords)

      // Mettre à jour la popup avec les informations du point de départ
      marker.bindPopup(`
        <div style="text-align: center; font-family: 'Montserrat', sans-serif;">
          <div style="font-weight: bold; font-size: 16px; color: #3A3A3A; margin-bottom: 4px;">
            🚴 Départ
          </div>
          <div style="font-size: 12px; color: #6D2A31; opacity: 0.8;">
            ${props.location}
          </div>
        </div>
      `).openPopup()
    }
  } catch (err) {
    console.error('Erreur lors du parsing du GPX:', err)
  }
}

// Fonction pour télécharger le fichier GPX
const downloadGpx = () => {
  if (!gpxContent.value) return

  try {
    // Créer un blob avec le contenu GPX
    const blob = new Blob([gpxContent.value], { type: 'application/gpx+xml' })
    const url = window.URL.createObjectURL(blob)

    // Créer un lien de téléchargement
    const link = document.createElement('a')
    link.href = url
    link.download = `parcours-${props.location.replace(/\s+/g, '-').toLowerCase()}.gpx`

    // Déclencher le téléchargement
    document.body.appendChild(link)
    link.click()

    // Nettoyer
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (err) {
    console.error('Erreur lors du téléchargement du GPX:', err)
  }
}

// Fonction pour ouvrir l'application GPS
const openGPS = () => {
  if (!startPoint.value) return

  const { lat, lon } = startPoint.value

  // Détection du système d'exploitation
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream
  const isAndroid = /android/i.test(userAgent)

  if (isIOS) {
    // iOS : Essayer Waze en premier, puis Apple Maps, puis Google Maps
    const wazeUrl = `waze://?ll=${lat},${lon}&navigate=yes`
    const appleMapsUrl = `maps://maps.apple.com/?daddr=${lat},${lon}&dirflg=d`
    const googleMapsUrl = `https://maps.google.com/maps?daddr=${lat},${lon}&dir_action=navigate`

    // Créer un iframe invisible pour tester Waze
    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    iframe.src = wazeUrl
    document.body.appendChild(iframe)

    // Vérifier après un court délai si Waze s'est ouvert
    let appOpened = false
    const timeout = setTimeout(() => {
      if (!appOpened) {
        // Waze n'est pas installé, essayer Apple Maps
        document.body.removeChild(iframe)

        // Tentative d'ouverture d'Apple Maps
        window.location.href = appleMapsUrl

        // Fallback vers Google Maps après un délai
        setTimeout(() => {
          window.open(googleMapsUrl, '_blank')
        }, 500)
      }
    }, 1000)

    // Détecter si l'utilisateur quitte la page (app s'est ouverte)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        appOpened = true
        clearTimeout(timeout)
        document.body.removeChild(iframe)
        document.removeEventListener('visibilitychange', handleVisibilityChange)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Cleanup au cas où
    setTimeout(() => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe)
      }
    }, 2000)

  } else if (isAndroid) {
    // Android : Intent pour ouvrir Waze ou Google Maps
    const url = `geo:${lat},${lon}?q=${lat},${lon}(Point de départ)`
    window.location.href = url
  } else {
    // Desktop ou autre : Ouvre Google Maps dans le navigateur
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}&travelmode=driving`, '_blank')
  }
}

// Initialiser la carte
const initMap = async () => {
  // Vérifier que nous sommes côté client et que Leaflet est chargé
  if (!process.client || !L || !mapContainer.value || !props.location) return

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

    // Charger le tracé GPX si des données GPX sont fournies
    if (props.gpxData) {
      const gpxString = convertGpxBufferToString(props.gpxData)
      if (gpxString) {
        await parseAndDisplayGpx(gpxString)
      }
    }

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

// Surveiller les changements de gpxData pour recharger le GPX
watch(() => props.gpxData, async () => {
  if (props.gpxData && map) {
    const gpxString = convertGpxBufferToString(props.gpxData)
    if (gpxString) {
      await parseAndDisplayGpx(gpxString)
    }
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
