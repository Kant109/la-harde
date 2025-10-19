export const useCityAutocomplete = () => {
  // Types
  interface City {
    nom: string
    code: string
    codeDepartement: string
    codeRegion: string
    population: number
  }

  /**
   * Recherche des villes françaises via l'API geo.api.gouv.fr
   * @param query - Le texte de recherche
   * @param limit - Nombre maximum de résultats (par défaut 5)
   * @returns Promise<City[]> - Liste des villes correspondantes
   */
  const searchCities = async (query: string, limit: number = 5): Promise<City[]> => {
    if (!query || query.length < 2) {
      return []
    }

    try {
      const response = await $fetch<City[]>(
        `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(query)}&fields=nom,code,codeDepartement,codeRegion,population&limit=${limit}&boost=population`
      )
      return response
    } catch (error) {
      console.error('Erreur lors de la recherche de villes:', error)
      return []
    }
  }

  /**
   * Formate le nom de la ville avec son département
   * @param city - L'objet ville
   * @returns string - Nom formaté (ex: "Tours (37)")
   */
  const formatCityName = (city: City): string => {
    return `${city.nom} (${city.codeDepartement})`
  }

  return {
    searchCities,
    formatCityName
  }
}
