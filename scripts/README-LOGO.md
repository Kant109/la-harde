# Guide d'optimisation du logo

## Étapes à suivre

### 1. Placer le logo original

Sauvegardez votre image de logo (le sanglier avec l'explosion) dans :
```
/home/qroulet/PERSO/la-harde/public/images/logo-harde.png
```

### 2. Lancer le script d'optimisation

Une fois le logo en place, exécutez :
```bash
npm run optimize-logo
```

### 3. Ce que fait le script

Le script créera automatiquement plusieurs versions optimisées du logo :

- **logo-harde-optimized.png** (512x512) - Image principale optimisée
- **logo-32x32.png** - Favicon standard
- **logo-16x16.png** - Petit favicon
- **logo-180x180.png** - Apple Touch Icon
- **logo-og.png** (1200x630) - Image pour les réseaux sociaux (Open Graph)
- **favicon-new.png** - Nouveau favicon à convertir en .ico si nécessaire

### 4. Optimisations incluses

✅ **Favicon configuré** - Le logo apparaîtra dans les onglets du navigateur
✅ **Logo dans le header** - Le logo remplace l'icône "LH" dans la navigation
✅ **Optimisation automatique** - Le composant NuxtImg convertit automatiquement en WebP
✅ **Meta tags sociaux** - Le logo apparaîtra sur Facebook, Twitter, etc.
✅ **Responsive** - Le logo s'adapte à toutes les tailles d'écran

### 5. Technologies utilisées

- **Sharp** - Pour l'optimisation et le redimensionnement des images
- **@nuxt/image** - Pour l'optimisation automatique en WebP et lazy loading
- **Compression PNG** - Niveau maximum (9) pour réduire la taille des fichiers

## Mise à jour du logo à l'avenir

Si vous souhaitez changer le logo :

1. Remplacez `public/images/logo-harde.png` par votre nouvelle image
2. Relancez `npm run optimize-logo`
3. Les versions optimisées seront recréées automatiquement

## Structure des fichiers

```
public/
├── images/
│   ├── logo-harde.png              # Logo original
│   ├── logo-harde-optimized.png    # Logo optimisé principal
│   ├── logo-32x32.png              # Favicon 32x32
│   ├── logo-16x16.png              # Favicon 16x16
│   ├── logo-180x180.png            # Apple Touch Icon
│   └── logo-og.png                 # Open Graph image
└── favicon.ico                      # Favicon principal
```

## Notes importantes

- Le format PNG est utilisé pour préserver la transparence du logo
- Le format WebP est automatiquement généré par NuxtImg pour les navigateurs modernes
- L'optimisation réduit la taille des fichiers sans perte visible de qualité
- Le logo est chargé en mode "eager" dans le header pour éviter tout délai de chargement
