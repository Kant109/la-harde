# Guide de test PWA - LA HARDE

## ✅ Corrections apportées

### Configuration Nuxt (nuxt.config.ts)
- ✅ Ajout du préfixe `/` pour les chemins des icônes
- ✅ Correction des couleurs theme_color et background_color avec les vraies couleurs du site
- ✅ Suppression de `orientation: 'portrait-primary'` (trop restrictif)
- ✅ Ajout de `globPatterns` pour le cache Workbox
- ✅ Ajout de `cleanupOutdatedCaches: true`
- ✅ Ajout d'une stratégie de cache pour les ressources externes
- ✅ Ajout de `client.installPrompt: true`
- ✅ Ajout de `periodicSyncForUpdates` pour les mises à jour automatiques

### Composant PwaInstallPrompt.vue
- ✅ Amélioration du design avec les couleurs du site
- ✅ Ajout d'une animation slide-up
- ✅ Vérification si l'app est déjà installée (`display-mode: standalone`)
- ✅ Délai de 3 secondes avant d'afficher le prompt
- ✅ Meilleure gestion des erreurs
- ✅ Logs plus détaillés pour le debug

## 🧪 Comment tester la PWA

### 1. En développement (Chrome/Edge)

```bash
npm run dev
```

Ouvrez http://localhost:3000 dans Chrome ou Edge.

**Note importante:** La PWA fonctionne mieux en production. En dev, certaines fonctionnalités peuvent être limitées.

### 2. En production (recommandé)

```bash
# Build de production
npm run build

# Preview du build
npm run preview
```

Ouvrez l'URL affichée (généralement http://localhost:3000) dans Chrome ou Edge.

### 3. Vérifications à faire

#### Dans Chrome DevTools (F12)
1. **Application Tab > Manifest**
   - ✅ Le manifest doit apparaître avec toutes les infos
   - ✅ Les icônes doivent être listées (64x64, 192x192, 512x512, maskable)

2. **Application Tab > Service Workers**
   - ✅ Un service worker doit être enregistré
   - ✅ Status: "activated and is running"

3. **Console**
   - ✅ Pas d'erreurs PWA
   - ✅ Messages de log si vous cliquez sur "Installer"

#### Test d'installation
1. Après 3 secondes, un popup d'installation devrait apparaître en bas à droite
2. Ou utilisez le menu Chrome : `⋮` > `Installer LA HARDE`
3. L'app doit s'installer et créer une icône sur votre bureau/menu

#### Test hors ligne
1. Installez l'app
2. Dans DevTools > Network, sélectionnez "Offline"
3. Rafraîchissez la page
4. ✅ L'app doit continuer à fonctionner (cache Service Worker)

### 4. Test sur mobile (Android)

1. Déployez le site sur un serveur HTTPS (requis pour PWA)
2. Ouvrez le site dans Chrome Android
3. Une bannière "Ajouter à l'écran d'accueil" devrait apparaître
4. Installez l'app
5. L'icône apparaît sur l'écran d'accueil
6. L'app s'ouvre en mode standalone (sans barre d'URL)

### 5. Test sur mobile (iOS)

⚠️ **Note:** iOS ne supporte pas complètement les PWA standards.

Sur Safari iOS :
1. Ouvrez le site
2. Appuyez sur le bouton "Partager"
3. Sélectionnez "Sur l'écran d'accueil"
4. L'app s'ajoute comme une icône

## 🐛 Debugging

Si la PWA ne fonctionne pas :

### Vérifier les icônes
```bash
ls -la public/pwa-*.png public/maskable-*.png
```
Toutes les icônes doivent être présentes.

### Vérifier le manifest en production
Après le build, vérifiez :
```bash
cat .output/public/manifest.webmanifest
```

### Vérifier les logs
Ouvrez la console du navigateur et cherchez :
- Erreurs de Service Worker
- Messages "PWA installation..."
- Erreurs de manifest

### Réinitialiser pour tester
```javascript
// Dans la console du navigateur
localStorage.removeItem('pwa-install-dismissed')
location.reload()
```

## 📱 Résolution des problèmes courants

### Le prompt d'installation n'apparaît pas
- ✅ Vérifiez que vous êtes sur HTTPS (ou localhost)
- ✅ Vérifiez que le Service Worker est bien enregistré
- ✅ Attendez 3 secondes après le chargement
- ✅ L'app ne doit pas déjà être installée
- ✅ Effacez `pwa-install-dismissed` du localStorage

### L'app ne fonctionne pas hors ligne
- ✅ Vérifiez que le Service Worker est activé
- ✅ Visitez plusieurs pages avant de tester le mode hors ligne
- ✅ Le cache doit se remplir progressivement

### Les icônes ne s'affichent pas
- ✅ Vérifiez les chemins dans nuxt.config.ts (avec `/` au début)
- ✅ Vérifiez que les fichiers existent dans `public/`
- ✅ Rebuild le projet

## 🚀 Déploiement

Pour que la PWA fonctionne en production :

1. **HTTPS obligatoire** (sauf localhost)
2. Utilisez un hébergeur qui supporte les Service Workers
3. Recommendations :
   - Vercel ✅
   - Netlify ✅
   - Cloudflare Pages ✅
   - GitHub Pages ✅

## 📊 Tester les performances PWA

Utilisez Lighthouse dans Chrome DevTools :
1. F12 > Lighthouse tab
2. Cochez "Progressive Web App"
3. Cliquez "Analyze page load"
4. Score cible : > 90/100

## ✨ Fonctionnalités PWA implémentées

- ✅ Installation sur desktop et mobile
- ✅ Mode standalone (sans barre d'URL)
- ✅ Icônes adaptatives (maskable)
- ✅ Cache Service Worker pour le mode hors ligne
- ✅ Mise à jour automatique toutes les heures
- ✅ Prompt d'installation personnalisé
- ✅ Cache des fonts Google
- ✅ Cache des ressources externes

## 📝 Notes

- Le prompt d'installation se réaffiche après 7 jours si refusé
- Les mises à jour sont vérifiées toutes les heures
- Le cache est nettoyé automatiquement (anciennes versions)
