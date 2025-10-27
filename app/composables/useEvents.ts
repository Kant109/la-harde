export const useEvents = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl

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
    _id?: string
    idEvent: string
    participant: string
  }

  // Récupérer tous les événements
  const getEvents = async (): Promise<Event[]> => {
    try {
      const response = await $fetch<Event[]>(`${baseURL}/obtorta/herd/events`)
      return response
    } catch (error) {
      console.error('Erreur lors de la récupération des événements:', error)
      throw error
    }
  }

  // Créer un événement
  const createEvent = async (event: Event): Promise<Event> => {
    try {
      const response = await $fetch<Event>(`${baseURL}/obtorta/herd/events`, {
        method: 'POST',
        body: event
      })
      return response
    } catch (error) {
      console.error('Erreur lors de la création de l\'événement:', error)
      throw error
    }
  }

  // Récupérer les participants d'un événement
  const getParticipants = async (eventId: string): Promise<Participant[]> => {
    try {
      const response = await $fetch<Participant[]>(`${baseURL}/obtorta/herd/participants`, {
        params: { event: eventId }
      })
      return response
    } catch (error) {
      console.error('Erreur lors de la récupération des participants:', error)
      throw error
    }
  }

  // Ajouter un participant à un événement
  const addParticipant = async (participant: Participant): Promise<Participant> => {
    try {
      const response = await $fetch<Participant>(`${baseURL}/obtorta/herd/participants`, {
        method: 'POST',
        body: participant
      })
      return response
    } catch (error) {
      console.error('Erreur lors de l\'ajout du participant:', error)
      throw error
    }
  }

  // Supprimer un participant d'un événement
  const deleteParticipant = async (participantId: string, eventId: string): Promise<void> => {
    try {
      await $fetch(`${baseURL}/obtorta/herd/participants`, {
        method: 'DELETE',
        params: {
          participant: participantId,
          event: eventId
        }
      })
    } catch (error) {
      console.error('Erreur lors de la suppression du participant:', error)
      throw error
    }
  }

  // Uploader un fichier GPX
  const uploadGpx = async (eventId: string, file: File): Promise<any> => {
    try {
      const formData = new FormData()
      formData.append('gpx', file)
      formData.append('eventId', eventId)

      const response = await $fetch(`${baseURL}/obtorta/herd/gpx`, {
        method: 'POST',
        body: formData
      })
      return response
    } catch (error) {
      console.error('Erreur lors de l\'upload du GPX:', error)
      throw error
    }
  }

  // Récupérer le GPX d'un événement
  const getGpx = async (eventId: string): Promise<string | null> => {
    try {
      const response = await $fetch<{ gpx?: string }>(`${baseURL}/obtorta/herd/gpx`, {
        params: { eventId }
      })
      return response.gpx || null
    } catch (error) {
      console.error('Erreur lors de la récupération du GPX:', error)
      return null
    }
  }

  return {
    getEvents,
    createEvent,
    getParticipants,
    addParticipant,
    deleteParticipant,
    uploadGpx,
    getGpx
  }
}
