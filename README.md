# LA HARDE - Site Officiel

Site web officiel de l'équipe cycliste professionnelle **LA HARDE - Les Sangliers atomiques**.

Site moderne et responsive développé avec Nuxt 3, Vue 3, TypeScript et Tailwind CSS.

## Fonctionnalités

### Pages principales
- **Accueil** (`/`) - Hero section avec animations, présentation de l'équipe et produits vedettes
- **Équipe** (`/equipe`) - 6 profils de coureurs avec statistiques et valeurs de l'équipe
- **Histoire** (`/histoire`) - Timeline interactive des courses majeures et moments mémorables
- **Boutique** (`/boutique`) - E-commerce avec filtres par catégorie et 6 produits
- **Page produit** (`/produits/[slug]`) - Galerie d'images interactive avec gestion de stock
- **Mentions légales** (`/mentions-legales`) - Informations légales complètes (RGPD, hébergement, etc.)

### Fonctionnalités avancées
- Panier d'achat avec persistance localStorage
- Galerie d'images produits (2-4 photos par produit)
- Système de filtres par catégorie
- Gestion de stock et vérification disponibilité
- Design responsive mobile-first
- Animations fluides (float, glow, scale, bounce)
- SEO optimisé avec meta tags personnalisés
- Optimisation automatique des images (WebP)

## Technologies

- **Framework**: Nuxt 3 (v4.1.3)
- **Frontend**: Vue 3 + TypeScript
- **Styling**: Tailwind CSS (v6.14.0) + CSS personnalisé
- **Fonts**: Google Fonts (Montserrat, Roboto)
- **Images**: @nuxt/image (v1.11.0) - Optimisation automatique
- **Data**: JSON local (aucune base de données)
- **Cart**: LocalStorage avec synchronisation événements

## Structure du projet

```
la-harde/
├── app/
│   ├── assets/css/
│   │   ├── variables.css      # Variables de couleurs (palette marron/or/vert)
│   │   └── main.css           # Styles globaux + animations
│   ├── components/
│   │   ├── Header.vue         # En-tête avec navigation et compteur panier
│   │   ├── Footer.vue         # Pied de page avec réseaux sociaux
│   │   ├── TeamMemberCard.vue # Carte membre avec overlay animé
│   │   ├── ProductCard.vue    # Carte produit avec badge stock
│   │   ├── TimelineEvent.vue  # Événement timeline avec images
│   │   └── CartSidebar.vue    # Panier modal avec Teleport
│   ├── data/
│   │   ├── team.json          # 6 coureurs avec rôles et spécialités
│   │   ├── history.json       # 3 courses + 4 moments mémorables
│   │   └── products.json      # 6 produits avec galeries (PNG)
│   ├── layouts/
│   │   └── default.vue        # Layout principal avec panier global
│   ├── pages/
│   │   ├── index.vue          # Page d'accueil
│   │   ├── equipe.vue         # Page équipe
│   │   ├── histoire.vue       # Page histoire
│   │   ├── boutique.vue       # Page boutique avec filtres
│   │   ├── mentions-legales.vue # Page mentions légales
│   │   └── produits/
│   │       └── [slug].vue     # Page détail produit dynamique
│   └── app.vue                # Root component
├── public/
│   └── images/
│       ├── products/          # Images produits (PNG uniquement)
│       ├── team/              # Photos coureurs (à ajouter)
│       └── races/             # Photos courses (à ajouter)
├── scripts/
│   ├── check-images.sh        # Vérifie les images manquantes
│   └── optimize-logo.js       # Optimise le logo en plusieurs tailles
├── nuxt.config.ts             # Configuration Nuxt
├── tailwind.config.js         # Configuration Tailwind
└── Documentation/
    ├── GUIDE-IMAGES-PRODUITS.md  # Guide complet ajout images
    ├── RESUME-AJOUT-IMAGES.md    # Quick start images
    └── MIGRATION-PNG.md          # Guide migration vers PNG
```

## Personnalisation des couleurs

Les couleurs du site sont définies dans [app/assets/css/variables.css](app/assets/css/variables.css):

```css
:root {
  --color-primary: #DBD2C3;      /* Beige clair - Texte principal */
  --color-secondary: #6D2A31;     /* Bordeaux foncé - Accents/Titres */
  --color-accent: #3A3A3A;        /* Gris neutre - Contrastes */
  --color-background: #1A1A1A;    /* Noir profond - Fond */
  --color-text: #F5F5F5;          /* Blanc cassé - Texte */
}
```

Pour changer les couleurs du site, modifiez simplement ces variables. Les changements seront automatiquement répercutés dans Tailwind CSS.

## Images

### Format d'images : PNG uniquement

Tous les produits utilisent maintenant le format **PNG** pour une meilleure qualité et le support de la transparence.

### Organisation des images

Placez vos images dans le dossier [public/images/](public/images/):
- `public/images/products/` - **Photos des produits (PNG uniquement)**
- `public/images/team/` - Photos des coureurs (à ajouter)
- `public/images/races/` - Photos des courses (à ajouter)

### Convention de nommage

Les images de produits suivent cette convention :

```
stickers.png + stickers-2.png + stickers-3.png
maillot.png + maillot-2.png + maillot-3.png + maillot-4.png
mug.png + mug-2.png
veste.png + veste-2.png + veste-3.png + veste-4.png
casque.png + casque-2.png + casque-3.png + casque-4.png
bidon.png + bidon-2.png + bidon-3.png
```

### Scripts utiles

```bash
# Vérifier les images manquantes
npm run check-images

# Optimiser le logo en plusieurs tailles
npm run optimize-logo
```

## Installation et développement

### Prérequis

- Node.js (version 18+ recommandée)
- npm (ou pnpm/yarn/bun)

### Installation des dépendances

```bash
npm install
```

### Serveur de développement

Démarrez le serveur de développement sur `http://localhost:3000`:

```bash
npm run dev
```

### Scripts disponibles

```bash
npm run dev           # Développement (localhost:3000)
npm run build         # Build production
npm run generate      # Génération statique
npm run preview       # Prévisualisation production
npm run check-images  # Vérifie l'état des images produits
npm run optimize-logo # Optimise le logo en plusieurs tailles
```

## Production

### Build pour production

```bash
npm run build
```

### Génération statique

```bash
npm run generate
```

Le site peut être déployé en tant que SSR (Server-Side Rendering) ou en génération statique selon vos besoins.

### Prévisualisation production

```bash
npm run preview
```

## Données du site

### Équipe (6 coureurs)

Les profils des coureurs sont définis dans [app/data/team.json](app/data/team.json):
- Matis (Leader), Pierre (Directeur sportif), Quentin (Tueur d'échappée)
- Corentin (Futur puncheur), Baptiste (Baby rouleur), Simon (Sanglier original)

### Historique des courses

L'historique est défini dans [app/data/history.json](app/data/history.json):
- 3 courses majeures (La Roue Tourangelle, La Vendéenne, Paris-Roubaix)
- 4 moments mémorables avec photos

### Produits boutique

Les produits sont définis dans [app/data/products.json](app/data/products.json):
- 6 produits avec galeries de 2 à 4 images (PNG)
- 3 catégories : Vêtements, Accessoires, Équipement
- Gestion de stock et prix

## Déploiement

Le site est compatible avec les principales plateformes de déploiement:
- **Vercel** (recommandé pour Nuxt)
- **Netlify**
- **Cloudflare Pages**
- Tout hébergement supportant Node.js ou les sites statiques

Consultez la [documentation de déploiement Nuxt](https://nuxt.com/docs/getting-started/deployment) pour plus d'informations.

## Architecture technique

### Composants principaux

- **[Header.vue](app/components/Header.vue)** - Navigation fixe avec compteur panier
- **[Footer.vue](app/components/Footer.vue)** - Pied de page avec liens et réseaux sociaux
- **[CartSidebar.vue](app/components/CartSidebar.vue)** - Panier modal avec Teleport et transitions
- **[ProductCard.vue](app/components/ProductCard.vue)** - Carte produit avec badge de stock
- **[TeamMemberCard.vue](app/components/TeamMemberCard.vue)** - Carte membre avec overlay animé
- **[TimelineEvent.vue](app/components/TimelineEvent.vue)** - Événement timeline avec images

### Système de panier

Le panier utilise localStorage pour la persistance et un système d'événements pour la synchronisation:

```typescript
// Structure du panier
interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
}

// Stockage: localStorage key 'laharde-cart'
// Synchronisation: Event 'cart-updated'
```

### Optimisations

- **Images** : Conversion automatique en WebP via @nuxt/image
- **Fonts** : Préchargement Google Fonts (Montserrat, Roboto)
- **SEO** : Meta tags personnalisés par page
- **Performance** : Lazy loading des images, code splitting
- **Responsive** : Mobile-first avec breakpoints Tailwind

## Documentation

Consultez la [documentation Nuxt](https://nuxt.com/docs/getting-started/introduction) pour en savoir plus sur le framework.

## Contribution

Ce projet utilise:
- **ESLint** : Pas encore configuré (à ajouter)
- **Prettier** : Pas encore configuré (à ajouter)
- **TypeScript** : Configuration stricte dans tsconfig.json

## Licence

Tous droits réservés - LA HARDE - Les Sangliers atomiques
