# 02 — Modelos de datos

## Motor de persistencia

La app usa **Realm** como base de datos principal del lado cliente, con **AsyncStorage** como almacenamiento secundario para preferencias simples y tokens.

Evidencia: múltiples referencias a `Realm`, `realm`, schemas de Realm en las strings del bytecode Hermes. También hay referencias a `AsyncStorage` para datos más ligeros.

## Modelos principales (inferidos del análisis estático)

### User / Parent

```
User {
  id: string (UUID)
  email: string
  firstName: string
  lastName: string
  authProvider: "email" | "google" | "apple" | "facebook"
  subscriptionState: string  // "free" | "plus" | "unlimited"
  locale: string             // "en-US", "es-ES", etc.
  createdAt: datetime
}
```

Evidencia: strings de onboarding como `signUpScreen`, `Verify Email`, `MAGICLINK_EMAIL`, `ONBOARDING_EMAIL_COLLECTION`, `registerUserWithProvider`.

### Child (Perfil del niño)

```
Child {
  id: string (UUID)             // #CHILD_ID#
  name: string                  // #CHILDNAME#
  age: number                   // seleccionado en onboarding
  avatar: string                // referencia a avatar asset
  educationalLanguageTag: string // idioma de aprendizaje
  preferredContentLocale: string // idioma preferido del contenido
  weeklyGoalReached: boolean
  weekStreak: number            // #WEEK_STREAK#
  dailyActivityCount: number    // max 3 en free tier
  isInWelcomeUnit: boolean
  parentId: string (FK → User)
}
```

Evidencia: `#CHILDNAME#`, `#CHILD_NAME#`, `EDIT_CHILD_AVATAR`, `ONBOARDING_AGE_SELECTION`, `educationalLanguageTag`, `3 activity daily limit`, `#WEEK_STREAK#-week streak!`.

### Activity (Actividad / Juego)

```
Activity {
  id: string                    // "bathroom_game"
  slug: string                  // "bathroom_game"
  type: "game" | "video" | "song" | "lesson"
  subtype: string               // "chore_routine", "phonics", "matching", etc.
  displayName: string           // "Bathroom"
  label: {
    displayName: string         // "Health"
    textColor: string           // "#0C123BFF"
    backgroundColor: string     // "#FFFFFFE0"
    strokeColor: string
  }
  state: "published" | "draft"
  partner: string | null        // "disney", null
  publishedAt: datetime
  bgColor: string               // "#ffe252"
  alwaysDownload: boolean
  visibilityAreas: string[]     // ["search", "dynamic_content", "lessons", "topics", "offline", "worlds"]
  fresh: boolean                // flag de "contenido nuevo"
  sceneName: string             // "ActivityPrefabScene"
  letter: string                // letra asociada (para phonics)
  bundles: ActivityBundle[]
  activityData: {
    freeAspectRatio: boolean
  }
  locale: string                // "en-US"
  encryptionKeyUuid: string | null
  videoUrl: string
  streamUrl: string
  subtitlesUrl: string
  duration: number | null
  thumbnails: {
    original: string            // URL imgix
  }
}
```

Evidencia: JSON completo en `bathroom_game.json`.

### ActivityBundle (Asset bundles de Unity)

```
ActivityBundle {
  name: string                  // "bathroom_game"
  locale: string | null         // "en-US" (para bundles localizados)
  urls: {
    android: string             // "https://ab0.lingokids.com/Activities/.../Android/..."
    ios: string
    editor: string
  }
}
```

### Lesson / Lesson Path

```
Lesson {
  id: string
  activities: Activity[]        // lista ordenada de actividades
  topicId: string
  unitId: string
  order: number
}

LessonPath {
  id: string
  lessons: Lesson[]
  worldId: string
}
```

Evidencia: `LESSON_PATH`, `LESSON_PREVIEW`, `LESSON_RECOMMENDATION`, `LESSON_PARTNER_PREVIEW`.

### Topic / World

```
Topic {
  id: string
  name: string
  activities: Activity[]
  worldId: string
}

World {
  id: string
  name: string
  topics: Topic[]
}
```

Evidencia: `visibilityAreas: ["topics", "worlds"]`, `GAMES_HOME_CITY`, secciones del feed.

### Subscription

```
Subscription {
  userId: string
  plan: "free" | "plus" | "unlimited"
  platform: "google" | "apple" | "stripe"
  originalPurchaseDate: datetime
  expirationDate: datetime
  isActive: boolean
  currency: string              // #CURRENCY_SYMBOL#
  price: number                 // #PRICE#
  billingPeriod: "monthly" | "yearly" | "weekly"
}
```

Evidencia: `MANAGE_SUBSCRIPTION`, `postPurchaseFlowCompleted`, `#CURRENCY_SYMBOL##PRICE#/month`, strings de precios en múltiples monedas, `Original Purchase Date`.

### Download / CachedActivity

```
CachedActivity {
  activityId: string
  bundleName: string
  localPath: string
  downloadedAt: datetime
  version: string               // "26.25.0"
  sizeBytes: number
}
```

Evidencia: `DOWNLOADS_FEED`, `downloadPromises`, `PARENTS_DOWNLOADS_DISK_SPACE_LEFT`, `deleteAllPersistentCacheIndexes`.

### Progress / Achievement

```
ChildProgress {
  childId: string
  activityId: string
  completedAt: datetime
  score: number
  starsEarned: number
}

WeeklyReport {
  childId: string
  weekStartDate: date
  goalReached: boolean
  activitiesCompleted: number
  topicsExplored: string[]
  weekStreak: number
}
```

Evidencia: `#CHILD_NAME# reached the goal`, `#CHILD_NAME# ha practicado:`, `PARENTS_REPORT`, `child_progress/reports/#CHILD_ID#`.

### Notification

```
Notification {
  id: string
  type: "push" | "local" | "inapp"
  title: string
  body: string
  payload: object
  scheduledAt: datetime
}
```

Evidencia: `NotificationsModule`, `BrazeBroadcastReceiver`, `SCHEDULE_EXACT_ALARM`.

## Flujo de datos

```
                    ┌──────────────┐
                    │ API Backend  │
                    │api.lingokids │
                    └──────┬───────┘
                           │ REST v1
                    ┌──────▼───────┐
                    │   Realm DB   │◄──── Sync/Cache
                    │  (offline)   │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
        ┌─────▼────┐ ┌────▼─────┐ ┌───▼────┐
        │  React   │ │  Unity   │ │ Parents│
        │  Native  │ │  Engine  │ │WebViews│
        │   UI     │ │  Games   │ │        │
        └──────────┘ └──────────┘ └────────┘
```

## Feature flags (GrowthBook)

Los modelos de datos están condicionados por feature flags que llegan del servidor GrowthBook:
- `GROWTHBOOK_API_HOST`: `https://cdn.growthbook.io`
- `GROWTHBOOK_CLIENT_KEY`: `sdk-RO0bGRwMOwZohfio`

Estos flags controlan qué contenido es visible, qué experimentos están activos y qué flujos de onboarding se muestran.

## Encriptación

Algunas actividades pueden tener `encryptionKeyUuid` no nulo, indicando que sus AssetBundles están encriptados. El bytecode contiene referencias a `AES-GCM`, `aes-256-cfb`, `cleanupDecryptedFiles`, `encryptionTimeMs`.
