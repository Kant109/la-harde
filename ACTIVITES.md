# Gestion des Activités - LA HARDE

Ce module permet de créer, gérer et consulter les activités de l'équipe cycliste LA HARDE.

## Fonctionnalités

### Page Activités (`/activites`)
- **Liste des activités** : Affichage de toutes les activités à venir, triées par date
- **Formulaire de création** : Création d'une nouvelle activité avec :
  - Nom de l'activité
  - Date (avec date picker)
  - Type (Randonnée, Course, Entraînement)
  - Localisation
  - Distance

### Page Détail d'une Activité (`/activites/[id]`)
- **Informations détaillées** de l'activité
- **Gestion des participants** :
  - Liste des participants inscrits
  - Ajout d'un participant
  - Suppression d'un participant

## Configuration de l'API

L'URL de l'API backend est configurable via une variable d'environnement :

```bash
# Créer un fichier .env à la racine du projet
API_BASE_URL=http://localhost:3001
```

Par défaut, l'API pointe vers `http://localhost:3001`.

## Endpoints API Utilisés

### Événements
- `POST /harde/events` : Créer un événement
  ```json
  {
    "name": "LA roue Tourangelle",
    "date": "2026-12-31",
    "localisation": "Chinon",
    "distance": "59km",
    "type": "RANDO"
  }
  ```

- `GET /harde/events` : Récupérer tous les événements
  Retourne un tableau d'événements avec le champ `_id` en plus

### Participants
- `GET /harde/participants?event=1234` : Récupérer les participants d'un événement

- `POST /harde/participants` : Ajouter un participant
  ```json
  {
    "idEvent": "1234",
    "participant": "Matis Charrier"
  }
  ```

- `DELETE /harde/participants?participant=1234&event=1234` : Supprimer un participant

## Structure des Fichiers

```
app/
├── composables/
│   └── useEvents.ts              # Composable pour les appels API
├── pages/
│   ├── activites.vue             # Page liste + création
│   └── activites/
│       └── [id].vue              # Page détail d'une activité
└── components/
    └── Header.vue                # Navigation avec lien "Activités"
```

## Types TypeScript

```typescript
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
```

## Navigation

Le lien "Activités" est accessible :
- Dans le menu de navigation (Header)
- Sur la page d'accueil (section Hero)

## Utilisation

1. Accédez à `/activites`
2. Créez une nouvelle activité via le formulaire
3. Cliquez sur une activité pour voir les détails
4. Ajoutez ou retirez des participants

## Développement

Le composable `useEvents` gère toutes les interactions avec l'API :

```typescript
const { getEvents, createEvent, getParticipants, addParticipant, deleteParticipant } = useEvents()
```

Toutes les fonctions sont asynchrones et retournent des Promises.
