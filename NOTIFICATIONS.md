# Système de Notifications Push

Ce document explique comment utiliser et configurer le système de notifications push de LA HARDE.

## Vue d'ensemble

Le système de notifications push permet d'envoyer des notifications aux utilisateurs même lorsqu'ils ne sont pas sur le site. Il utilise :
- L'API Push du navigateur
- Le service worker PWA de Nuxt
- Un endpoint backend pour envoyer les notifications

## Architecture

### Frontend

1. **Composable `useNotifications`** ([app/composables/useNotifications.ts](app/composables/useNotifications.ts))
   - Gère l'abonnement/désabonnement aux notifications
   - Communique avec le backend pour enregistrer les abonnements
   - Vérifie le support du navigateur

2. **Header** ([app/components/Header.vue](app/components/Header.vue))
   - Bouton pour activer/désactiver les notifications
   - Indicateur visuel de l'état (cloche avec badge vert)

3. **Layout** ([app/layouts/default.vue](app/layouts/default.vue))
   - Gère l'état global des notifications
   - Vérifie le statut au chargement de la page

4. **Service Worker** ([public/sw-notification-handler.js](public/sw-notification-handler.js))
   - Écoute les événements push
   - Affiche les notifications
   - Gère les clics sur les notifications

### Backend

L'endpoint `/notifications/send` doit accepter les requêtes POST avec le format suivant :

```json
{
  "title": "Titre de la notification",
  "body": "Corps de la notification",
  "icon": "/pwa-192x192.png",
  "badge": "/pwa-64x64.png",
  "url": "/activites"
}
```

## Configuration

### 1. Obtenir les clés VAPID

Les clés VAPID (Voluntary Application Server Identification) sont nécessaires pour les notifications push.

Vous devez générer ces clés sur votre backend et les configurer :

```javascript
// Backend - Exemple avec Node.js et web-push
const webpush = require('web-push')

// Générer les clés VAPID (à faire une seule fois)
const vapidKeys = webpush.generateVAPIDKeys()
console.log('Public Key:', vapidKeys.publicKey)
console.log('Private Key:', vapidKeys.privateKey)
```

### 2. Configurer le composable

Dans [app/composables/useNotifications.ts](app/composables/useNotifications.ts), remplacez la ligne :

```typescript
const vapidPublicKey = 'YOUR_VAPID_PUBLIC_KEY'
```

Par votre clé publique VAPID :

```typescript
const vapidPublicKey = 'BPx...' // Votre clé publique VAPID
```

### 3. Configurer le backend

Le backend doit implémenter trois endpoints :

#### POST `/obtorta/herd/notifications/subscribe`
Enregistre un nouvel abonnement push.

**Body:**
```json
{
  "subscription": {
    "endpoint": "https://...",
    "keys": {
      "p256dh": "...",
      "auth": "..."
    }
  }
}
```

#### POST `/obtorta/herd/notifications/unsubscribe`
Supprime un abonnement push.

**Body:**
```json
{
  "subscription": {
    "endpoint": "https://...",
    "keys": {
      "p256dh": "...",
      "auth": "..."
    }
  }
}
```

#### POST `/obtorta/herd/notifications/send`
Envoie une notification à tous les abonnés (ou à un abonné spécifique).

**Body:**
```json
{
  "title": "Nouvelle activité",
  "body": "Une nouvelle sortie vélo est programmée ce weekend !",
  "icon": "/pwa-192x192.png",
  "badge": "/pwa-64x64.png",
  "url": "/activites"
}
```

### Exemple d'implémentation backend (Node.js)

```javascript
const webpush = require('web-push')

// Configurer web-push avec vos clés VAPID
webpush.setVapidDetails(
  'mailto:contact@laharde.fr',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
)

// Stocker les abonnements (utilisez une vraie DB en production)
const subscriptions = new Map()

// Endpoint pour s'abonner
app.post('/obtorta/herd/notifications/subscribe', (req, res) => {
  const subscription = req.body.subscription

  // Sauvegarder l'abonnement
  subscriptions.set(subscription.endpoint, subscription)

  res.status(201).json({ message: 'Abonnement enregistré' })
})

// Endpoint pour se désabonner
app.post('/obtorta/herd/notifications/unsubscribe', (req, res) => {
  const subscription = req.body.subscription

  // Supprimer l'abonnement
  subscriptions.delete(subscription.endpoint)

  res.status(200).json({ message: 'Abonnement supprimé' })
})

// Endpoint pour envoyer une notification
app.post('/obtorta/herd/notifications/send', async (req, res) => {
  const { title, body, icon, badge, url } = req.body

  const notificationPayload = JSON.stringify({
    title,
    body,
    icon,
    badge,
    url
  })

  // Envoyer à tous les abonnés
  const sendPromises = Array.from(subscriptions.values()).map(subscription =>
    webpush.sendNotification(subscription, notificationPayload)
      .catch(err => {
        console.error('Erreur lors de l\'envoi:', err)
        // Si l'abonnement n'est plus valide, le supprimer
        if (err.statusCode === 410) {
          subscriptions.delete(subscription.endpoint)
        }
      })
  )

  await Promise.all(sendPromises)

  res.status(200).json({ message: 'Notifications envoyées' })
})
```

## Utilisation

### Pour l'utilisateur final

1. Cliquer sur l'icône de cloche dans le header
2. Accepter la permission de notification dans le navigateur
3. Une notification de test est automatiquement envoyée
4. Un badge vert indique que les notifications sont activées

Pour désactiver :
1. Re-cliquer sur l'icône de cloche
2. Les notifications sont désactivées

### Pour les développeurs

#### Envoyer une notification depuis le backend

```javascript
// Exemple d'utilisation de l'endpoint
fetch('https://votre-api.com/obtorta/herd/notifications/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'Nouvelle activité',
    body: 'La Roue Tourangelle - Ce dimanche 15h',
    icon: '/pwa-192x192.png',
    badge: '/pwa-64x64.png',
    url: '/activites'
  })
})
```

#### Utiliser le composable dans un composant

```vue
<script setup>
const { subscribe, unsubscribe, isSubscribed, sendTestNotification } = useNotifications()

const enableNotifications = async () => {
  try {
    await subscribe()
    console.log('Notifications activées')
  } catch (error) {
    console.error('Erreur:', error)
  }
}
</script>
```

## Cas d'usage

### 1. Notification de nouvelle activité
Quand une nouvelle sortie vélo est créée :

```javascript
await fetch('/obtorta/herd/notifications/send', {
  method: 'POST',
  body: JSON.stringify({
    title: '🚴 Nouvelle sortie !',
    body: event.name + ' - ' + formatDate(event.date),
    url: '/race/' + event._id
  })
})
```

### 2. Notification de vote pour maillot
Quand le vote pour un nouveau maillot est ouvert :

```javascript
await fetch('/obtorta/herd/notifications/send', {
  method: 'POST',
  body: JSON.stringify({
    title: '🏁 Votez pour le nouveau maillot !',
    body: 'Le vote est ouvert, donnez votre avis',
    url: '/vote'
  })
})
```

### 3. Notification de produit en stock
Quand un produit en rupture revient en stock :

```javascript
await fetch('/obtorta/herd/notifications/send', {
  method: 'POST',
  body: JSON.stringify({
    title: '✨ Produit disponible !',
    body: 'Le maillot officiel est de retour en stock',
    url: '/boutique'
  })
})
```

## Débogage

### Vérifier le statut du service worker

```javascript
navigator.serviceWorker.getRegistrations().then(registrations => {
  console.log('Service Workers:', registrations)
})
```

### Vérifier l'abonnement actuel

```javascript
navigator.serviceWorker.ready.then(registration => {
  registration.pushManager.getSubscription().then(subscription => {
    console.log('Abonnement actuel:', subscription)
  })
})
```

### Tester une notification locale

```javascript
if ('Notification' in window && Notification.permission === 'granted') {
  new Notification('Test', {
    body: 'Notification de test',
    icon: '/pwa-192x192.png'
  })
}
```

## Support navigateurs

Les notifications push sont supportées par :
- ✅ Chrome/Edge (Desktop & Android)
- ✅ Firefox (Desktop & Android)
- ✅ Safari (macOS 16.1+, iOS 16.4+)
- ❌ Internet Explorer (non supporté)

## Sécurité

- Les notifications nécessitent HTTPS (sauf en développement sur localhost)
- L'utilisateur doit explicitement donner la permission
- Les clés VAPID doivent rester privées côté serveur
- Validez toujours les abonnements avant d'envoyer des notifications

## Troubleshooting

### Les notifications ne s'affichent pas

1. Vérifier que HTTPS est activé (sauf en dev)
2. Vérifier les permissions du navigateur
3. Vérifier que le service worker est bien enregistré
4. Regarder les logs du service worker dans DevTools

### L'abonnement échoue

1. Vérifier que la clé VAPID publique est correcte
2. Vérifier que le service worker est actif
3. Vérifier la connexion au backend

### Les notifications arrivent mais ne s'affichent pas

1. Vérifier les paramètres de notification de l'OS
2. Vérifier que le navigateur n'est pas en mode "Ne pas déranger"
3. Tester avec une notification locale pour isoler le problème
