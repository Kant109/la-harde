# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**LA HARDE - Les Sangliers atomiques** is a Nuxt 3 website for a professional cycling team. It features a team roster, history timeline, e-commerce shop with shopping cart, event management system, and a voting system for jersey designs. The site is multilingual-ready and includes PWA functionality.

## Common Commands

### Development
```bash
npm install              # Install dependencies
npm run dev             # Start development server (localhost:3000)
npm run build           # Build for production
npm run generate        # Generate static site
npm run preview         # Preview production build
```

### Image Management
```bash
npm run check-images         # Verify product images exist
npm run optimize-logo        # Optimize logo into multiple sizes
```

## Architecture

### Data Flow & State Management

**Shopping Cart System**: The cart uses a localStorage-based architecture with event-driven synchronization. Cart state is managed in [app/layouts/default.vue](app/layouts/default.vue) and persists to `localStorage` under the key `laharde-cart`. When the cart is updated, a custom `cart-updated` event is dispatched to sync across components. Product pages can add items by updating localStorage and dispatching this event.

**API Integration**: The application uses composables in [app/composables/](app/composables/) to communicate with a backend API:
- `useEvents()` - Manages cycling events (rides, races, training sessions) with GPX file uploads
- `useVoting()` - Handles jersey voting system with point allocation (5 points distributed among options)
- `useAddressAutocomplete()` - Provides French address autocomplete using government API
- `useCityAutocomplete()` - City search functionality
- `useNotifications()` - Manages push notifications subscription/unsubscription and communication with backend

The API base URL is configured via `NUXT_PUBLIC_API_BASE_URL` environment variable and accessed through `useRuntimeConfig().public.apiBaseUrl`.

**Push Notifications**: The app includes a complete push notification system. Users can enable/disable notifications via a bell icon in the header. When enabled, the app subscribes to push notifications and sends the subscription to the backend. Notifications are handled by the service worker in [public/sw-notification-handler.js](public/sw-notification-handler.js). See [NOTIFICATIONS.md](NOTIFICATIONS.md) for complete setup instructions including VAPID key configuration.

**Event Management**: Events support three types (RANDO, COURSE, ENTRAINEMENT) and include GPX file upload for route visualization. The [app/pages/race/[id].vue](app/pages/race/[id].vue) page displays event details with interactive Leaflet maps when GPX data is available. Participants can register/unregister from events.

### Key Components Structure

**Layout System**: [app/layouts/default.vue](app/layouts/default.vue) is the main layout wrapping all pages. It manages:
- Global cart state and persistence
- Header/Footer composition
- CartSidebar visibility
- PWA install prompt

**CartSidebar**: Uses Vue's Teleport to render outside the DOM hierarchy for proper z-index layering. Integrates with localStorage and emits events to parent layout for state updates.

**ProductCard**: Displays product info with stock badges. Emits add-to-cart events which parent components handle by updating localStorage and dispatching `cart-updated`.

**EventMap**: In [app/components/EventMap.vue](app/components/EventMap.vue), displays Leaflet maps for cycling routes. Only renders client-side (client-only check) since Leaflet requires browser APIs. Parses GPX files to extract coordinates and render routes.

### Data Structure

**Products**: Stored in [app/data/products.json](app/data/products.json) with structure:
```json
{
  "id": 1,
  "slug": "product-slug",
  "name": "Product Name",
  "price": 89.99,
  "description": "Short description",
  "fullDescription": "Long description",
  "image": "/images/products/main.png",
  "images": ["/images/products/main.png", "/images/products/alt.png"],
  "category": "Vêtements|Accessoires|Équipement",
  "stock": 45,
  "sizes": ["S", "M", "L"],
  "colors": ["Color"]
}
```

**Events API Response**:
```typescript
{
  _id: string
  name: string
  date: string  // ISO date
  localisation: string
  distance: string
  type: 'RANDO' | 'COURSE' | 'ENTRAINEMENT'
  gpx?: any[]  // GPX coordinate array
  participants?: Participant[]
}
```

**Voting System**: [app/pages/vote.vue](app/pages/vote.vue) allows users to distribute 5 points across jersey options. Each option has front/back images that can be toggled. The voting page uses hardcoded options (11 jerseys) and submits to the API.

### Image Conventions

**Product Images**: All product images use PNG format and follow naming pattern:
- `product-name.png` (primary image)
- `product-name-2.png`, `product-name-3.png`, etc. (gallery images)

Located in `public/images/products/`. The script `npm run check-images` validates all images referenced in products.json exist.

**Jersey Voting Images**: Follow pattern in `public/images/maillots/`:
- `maillotN-face.png` (front view)
- `maillotN-dos.png` (back view)

### Styling System

**Color Variables**: Defined in [app/assets/css/variables.css](app/assets/css/variables.css) and mirrored in [tailwind.config.js](tailwind.config.js):
```css
--color-primary: #DBD2C3      /* Beige clair - Primary text/accents */
--color-secondary: #6D2A31     /* Bordeaux - Headings/accents */
--color-accent: #3A3A3A        /* Gray - Contrast elements */
--color-background: #1A1A1A    /* Dark background */
--color-text: #F5F5F5          /* Light text */
```

Both CSS variables and Tailwind classes (bg-primary, text-secondary, etc.) are available. Many components use inline `style="color: var(--color-primary)"` for dynamic theming.

**Typography**:
- Montserrat (font-heading) - Headings, bold elements
- Roboto (font-sans) - Body text

Loaded via @nuxtjs/google-fonts module with weights 400/600/700/800 for Montserrat and 400/500/700 for Roboto.

### PWA Configuration

PWA setup in [nuxt.config.ts](nuxt.config.ts) includes:
- Manifest with French language setting
- Service worker with Workbox for offline functionality
- Icon generation (64x64, 192x192, 512x512, maskable)
- Automatic update strategy (`registerType: 'autoUpdate'`)
- Cache-first strategy for Google Fonts
- Network-first for external resources

[app/components/PwaInstallPrompt.vue](app/components/PwaInstallPrompt.vue) provides custom install UI prompt.

## Important Implementation Details

### Forms with Address Autocomplete

The events creation form in [app/pages/activites.vue](app/pages/activites.vue) demonstrates complex form patterns:
- Custom calendar date picker with past date disabling
- Address autocomplete with debounced search (300ms)
- GPX file upload handling
- Click-outside handling to close dropdowns
- FormData submission for multipart/form-data

When implementing similar forms, note the z-index layering (`calendar-wrapper` has `z-index: 2`, suggestions have `z-index: 10000`) to ensure dropdowns appear above modals.

### Image Optimization

The @nuxt/image module automatically converts images to WebP format. Reference images using:
```vue
<NuxtImg src="/images/products/maillot.png" alt="..." />
```

For product galleries, iterate through the `images` array property.

### Client-Only Components

Leaflet maps and other browser-only features must be wrapped in `<ClientOnly>` or use the `process.client` check since Nuxt pre-renders pages server-side.

### SEO

Each page uses `useHead()` composable for meta tags. Standard pattern:
```typescript
useHead({
  title: 'Page Title - LA HARDE',
  meta: [
    { name: 'description', content: 'Page description' }
  ]
})
```

Global SEO config in [nuxt.config.ts](nuxt.config.ts) includes Open Graph and Twitter Card tags.

## Configuration Files

- **[nuxt.config.ts](nuxt.config.ts)**: Main Nuxt config with modules, PWA, fonts, SEO
- **[tailwind.config.js](tailwind.config.js)**: Tailwind theme extending color palette and fonts
- **[tsconfig.json](tsconfig.json)**: TypeScript configuration
- **[package.json](package.json)**: Dependencies and scripts

## Environment Variables

Set `NUXT_PUBLIC_API_BASE_URL` to configure the backend API URL. Accessed via:
```typescript
const config = useRuntimeConfig()
const apiUrl = config.public.apiBaseUrl
```

## Testing Product Features

To test shopping cart:
1. Navigate to `/boutique`
2. Click product to view detail page at `/produits/[slug]`
3. Add to cart (updates localStorage and badge count in header)
4. Click cart icon in header to open CartSidebar
5. Modify quantities, remove items, or clear cart

To test event management:
1. Navigate to `/activites`
2. Click "Créer une nouvelle activité"
3. Fill form with address autocomplete and optional GPX
4. Submit to create event
5. Click event card to view detail page with participant list and map
