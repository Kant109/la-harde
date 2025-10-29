// Service Worker personnalisé pour gérer les notifications push
// Ce fichier sera automatiquement intégré par le plugin PWA de Nuxt

self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push reçu:', event)

  let notificationData = {
    title: 'LA HARDE',
    body: 'Nouvelle notification',
    icon: '/pwa-192x192.png',
    badge: '/pwa-64x64.png',
    vibrate: [200, 100, 200],
    tag: 'laharde-notification',
    requireInteraction: false
  }

  // Si le push contient des données, les utiliser
  if (event.data) {
    try {
      const data = event.data.json()
      notificationData = {
        ...notificationData,
        ...data,
        // S'assurer que les chemins des images sont absolus
        icon: data.icon || notificationData.icon,
        badge: data.badge || notificationData.badge,
        // Ajouter des données personnalisées pour le clic
        data: data.url ? { url: data.url } : undefined
      }
    } catch (error) {
      console.error('[Service Worker] Erreur lors du parsing des données:', error)
    }
  }

  const promiseChain = self.registration.showNotification(
    notificationData.title,
    {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      vibrate: notificationData.vibrate,
      tag: notificationData.tag,
      requireInteraction: notificationData.requireInteraction,
      data: notificationData.data
    }
  )

  event.waitUntil(promiseChain)
})

self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification cliquée:', event.notification.tag)

  event.notification.close()

  // Récupérer l'URL de destination depuis les données de la notification
  const urlToOpen = event.notification.data?.url || '/'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(function(clientList) {
        // Vérifier si une fenêtre est déjà ouverte
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i]
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus()
          }
        }

        // Si aucune fenêtre n'est ouverte avec cette URL, ouvrir une nouvelle fenêtre
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen)
        }
      })
  )
})

self.addEventListener('notificationclose', function(event) {
  console.log('[Service Worker] Notification fermée:', event.notification.tag)
})
