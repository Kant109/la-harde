export const useNotifications = () => {
  const config = useRuntimeConfig()
  const apiBaseUrl = config.public.apiBaseUrl

  /**
   * Vérifie si les notifications push sont supportées par le navigateur
   */
  const isSupported = (): boolean => {
    if (typeof window === 'undefined') return false
    return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window
  }

  /**
   * Demande la permission pour les notifications
   */
  const requestPermission = async (): Promise<NotificationPermission> => {
    if (!isSupported()) {
      throw new Error('Les notifications push ne sont pas supportées par ce navigateur')
    }

    const permission = await Notification.requestPermission()
    return permission
  }

  /**
   * Récupère le statut actuel de la permission
   */
  const getPermissionStatus = (): NotificationPermission => {
    if (!isSupported()) return 'denied'
    return Notification.permission
  }

  /**
   * S'abonne aux notifications push
   */
  const subscribe = async (): Promise<PushSubscription | null> => {
    if (!isSupported()) {
      throw new Error('Les notifications push ne sont pas supportées')
    }

    try {
      // Demander la permission
      const permission = await requestPermission()
      if (permission !== 'granted') {
        console.log('Permission de notification refusée')
        return null
      }

      // Attendre que le service worker soit prêt
      const registration = await navigator.serviceWorker.ready

      // Vérifier s'il existe déjà un abonnement
      let subscription = await registration.pushManager.getSubscription()

      if (!subscription) {
        // Créer un nouvel abonnement
        // Note: Vous devrez remplacer cette clé VAPID par votre clé publique du backend
        const vapidPublicKey = 'BOPVOJGX6_jBhRV1wgOLM7szwPAzOSswISWGDsv5BGqUeD5EP4lcprYjewQl7SWW7YrekAXR5T1mOyppLR167II' // À remplacer par votre clé VAPID

        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
        })

        // Envoyer l'abonnement au backend
        await saveSubscriptionToBackend(subscription)
      }

      // Sauvegarder l'état dans le localStorage
      localStorage.setItem('notifications-enabled', 'true')

      return subscription
    } catch (error) {
      console.error('Erreur lors de l\'abonnement aux notifications:', error)
      throw error
    }
  }

  /**
   * Se désabonne des notifications push
   */
  const unsubscribe = async (): Promise<boolean> => {
    if (!isSupported()) {
      return false
    }

    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()

      if (subscription) {
        // Désabonner du service
        await subscription.unsubscribe()

        // Informer le backend (optionnel)
        await removeSubscriptionFromBackend(subscription)
      }

      // Mettre à jour le localStorage
      localStorage.setItem('notifications-enabled', 'false')

      return true
    } catch (error) {
      console.error('Erreur lors du désabonnement:', error)
      throw error
    }
  }

  /**
   * Vérifie si l'utilisateur est actuellement abonné
   */
  const isSubscribed = async (): Promise<boolean> => {
    if (!isSupported()) return false

    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      return subscription !== null
    } catch {
      return false
    }
  }

  /**
   * Envoie l'abonnement au backend
   */
  const saveSubscriptionToBackend = async (subscription: PushSubscription): Promise<void> => {
    try {
      await $fetch(`${apiBaseUrl}/obtorta/herd/notifications/subscribe`, {
        method: 'POST',
        body: {
          subscription: subscription.toJSON()
        }
      })
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de l\'abonnement:', error)
      throw error
    }
  }

  /**
   * Supprime l'abonnement du backend
   */
  const removeSubscriptionFromBackend = async (subscription: PushSubscription): Promise<void> => {
    try {
      await $fetch(`${apiBaseUrl}/obtorta/herd/notifications/unsubscribe`, {
        method: 'POST',
        body: {
          subscription: subscription.toJSON()
        }
      })
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'abonnement:', error)
      // Ne pas rejeter l'erreur car le désabonnement local a déjà réussi
    }
  }

  /**
   * Envoie une notification de test
   */
  const sendTestNotification = async (): Promise<void> => {
    try {
      await $fetch(`${apiBaseUrl}/obtorta/herd/notifications/send`, {
        method: 'POST',
        body: {
          title: 'Notification de test',
          body: 'Les notifications sont bien configurées ! 🚴',
          icon: '/pwa-192x192.png',
          badge: '/pwa-64x64.png'
        }
      })
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notification de test:', error)
      throw error
    }
  }

  /**
   * Convertit une clé VAPID en Uint8Array
   */
  const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  return {
    isSupported,
    requestPermission,
    getPermissionStatus,
    subscribe,
    unsubscribe,
    isSubscribed,
    sendTestNotification
  }
}
