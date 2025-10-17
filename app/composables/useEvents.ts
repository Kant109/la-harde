export const useEvents = () => {
  const baseURL = import.meta.env.API_BASE_URL

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
      const response = await $fetch<Event[]>(`${baseURL}/herd/events`)
      return response
    } catch (error) {
      console.error('Erreur lors de la récupération des événements:', error)
      throw error
    }
  }

  // Créer un événement
  const createEvent = async (event: Event): Promise<Event> => {
    try {
      const response = await $fetch<Event>(`${baseURL}/herd/events`, {
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
      const response = await $fetch<Participant[]>(`${baseURL}/herd/participants`, {
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
      const response = await $fetch<Participant>(`${baseURL}/herd/participants`, {
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
      await $fetch(`${baseURL}/herd/participants`, {
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

  return {
    getEvents,
    createEvent,
    getParticipants,
    addParticipant,
    deleteParticipant
  }
}
