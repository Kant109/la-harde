export const useAddressAutocomplete = () => {
  // Types
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

  interface AddressFeature {
    type: string
    geometry: {
      type: string
      coordinates: [number, number]
    }
    properties: {
      label: string
      score: number
      housenumber?: string
      street?: string
      postcode?: string
      city?: string
      context?: string
    }
  }

  interface AddressResponse {
    type: string
    features: AddressFeature[]
  }

  /**
   * Recherche d'adresses françaises via l'API adresse.data.gouv.fr
   * @param query - Le texte de recherche (peut être une rue, une adresse complète, ou une ville)
   * @param limit - Nombre maximum de résultats (par défaut 8)
   * @returns Promise<Address[]> - Liste des adresses correspondantes
   */
  const searchAddresses = async (query: string, limit: number = 8): Promise<Address[]> => {
    if (!query || query.length < 3) {
      return []
    }

    try {
      const response = await $fetch<AddressResponse>(
        `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=${limit}`
      )

      return response.features.map(feature => ({
        label: feature.properties.label,
        score: feature.properties.score,
        housenumber: feature.properties.housenumber,
        street: feature.properties.street,
        postcode: feature.properties.postcode,
        city: feature.properties.city,
        context: feature.properties.context,
        coordinates: {
          lon: feature.geometry.coordinates[0],
          lat: feature.geometry.coordinates[1]
        }
      }))
    } catch (error) {
      console.error('Erreur lors de la recherche d\'adresses:', error)
      return []
    }
  }

  /**
   * Formate une adresse pour l'affichage
   * @param address - L'objet adresse
   * @returns string - Adresse formatée
   */
  const formatAddress = (address: Address): string => {
    return address.label
  }

  /**
   * Obtient une version courte de l'adresse (ville + code postal)
   * @param address - L'objet adresse
   * @returns string - Version courte
   */
  const getShortAddress = (address: Address): string => {
    if (address.city && address.postcode) {
      return `${address.city} (${address.postcode})`
    }
    return address.city || address.label
  }

  return {
    searchAddresses,
    formatAddress,
    getShortAddress
  }
}
