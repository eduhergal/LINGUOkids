# Blueprint de Reconstrucción — LINGUOkids Réplica

> Versión 1.0 — 2026-11-01
> Basado en el análisis REA VERA de Linguokids v26.44.0

---

## 1. Evaluación de plataforma

### 1.1 Requisito clave
**Dispositivo objetivo**: iPad (iOS), ejecución offline como archivo local, sin dependencia de backend remoto.

### 1.2 Opciones evaluadas

| Plataforma | Pros | Contras | Veredicto |
|---|---|---|---|
| **PWA (HTML5/Canvas)** | Sin App Store, offline via SW, un solo codebase, desplegable como archivo local | Sin acceso nativo completo, audio/haptics limitados | ✅ **Seleccionada** |
| Unity WebGL | Fiel a la original, motor de juegos real | Build pesado (~50MB+), no óptimo para iPad Safari, requiere licencia | ❌ |
| React Native + Expo | Stack idéntico al original | Requiere compilación nativa, no es "archivo local", necesita Xcode | ❌ |
| Capacitor/Ionic | Wrapper nativo sobre web | Misma complejidad que PWA pero con overhead nativo innecesario | ❌ |
| Phaser.js | Motor 2D web especializado en juegos | Bueno para juegos pero no para UI/navegación | 🔶 Complemento |
| Swift/SwiftUI nativo | Máximo rendimiento iPad | Solo iOS, requiere Xcode + Apple Developer, no es "archivo local" | ❌ |

### 1.3 Decisión: PWA + Phaser.js híbrido

```
┌─────────────────────────────────────────────────┐
│              PWA Shell (HTML5/CSS/JS)            │
│  ┌───────────────────────────────────────────┐  │
│  │         React SPA (navegación, UI)        │  │
│  │  ┌─────────────────────────────────────┐  │  │
│  │  │  Phaser.js Canvas (actividades)     │  │  │
│  │  │  - Tracing, matching, coloring...   │  │  │
│  │  └─────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────┘  │
│  Service Worker (cache offline)                  │
│  IndexedDB (progreso, datos locales)             │
└─────────────────────────────────────────────────┘
```

**Justificación**:
- Una PWA se puede servir desde un archivo `.html` local o desde un servidor local mínimo en iPad
- Phaser.js maneja Canvas 2D/WebGL para las actividades interactivas (tracing, drag-and-drop, coloring)
- React gestiona la UI de navegación, modales, listas, configuración
- Service Worker permite cache completa offline
- IndexedDB almacena progreso del niño sin servidor
- Compatible con Safari en iPad sin necesidad de App Store

### 1.4 Stack tecnológico definitivo

| Capa | Tecnología | Versión | Propósito |
|---|---|---|---|
| Framework UI | React | 18.x | Navegación, componentes UI |
| Bundler | Vite | 5.x | Build rápido, HMR, PWA plugin |
| Motor de juegos | Phaser | 3.80+ | Actividades interactivas en Canvas |
| Estilos | CSS Modules + Tailwind | 3.x | Diseño responsive, temas |
| Audio | Howler.js | 2.2+ | Reproducción de audio cross-browser |
| Animaciones UI | Framer Motion | 11.x | Transiciones, celebraciones |
| Animaciones Lottie | lottie-web | 5.x | Animaciones vectoriales |
| Persistencia | IndexedDB (Dexie.js) | 4.x | Progreso, configuración, cache |
| Offline | Workbox (vite-plugin-pwa) | 7.x | Service Worker, precaching |
| Testing | Vitest + Playwright | — | Unit + E2E |
| Tipografía | Nunito / Quicksand | — | Alternativa libre a Gotham Rounded |
| Idioma principal | TypeScript | 5.x | Tipado estricto |

---

## 2. Funcionalidad core (sin restricciones)

### 2.1 Qué se replica (todo el contenido lectivo)

La réplica incluye **todo el contenido educativo** sin las restricciones comerciales del original:

| Feature original | Réplica | Notas |
|---|---|---|
| 3 actividades/día (free) | ❌ Sin límite | Acceso completo siempre |
| Suscripción Plus requerida | ❌ Sin paywall | Todo desbloqueado |
| Parental gate para config | ✅ Simplificado | PIN de 4 dígitos en lugar de touch pattern |
| Screen time configurable | ✅ Mantenido | Importante para bienestar infantil |
| 12-subject curriculum | ✅ Completo | Todas las materias |
| Worlds → Topics → Lessons | ✅ Completo | Misma jerarquía |
| Phonics A-Z | ✅ Completo | Tracing + pronunciación |
| Matching games | ✅ Completo | Drag-and-drop + tap |
| Coloring activities | ✅ Completo | Canvas touch |
| Memory cards | ✅ Completo | Flip + match |
| Songs & Videos | ✅ Audio + letras | Sin video streaming, audio local |
| Weekly goals & streaks | ✅ Mantenido | Gamificación motivacional |
| Progress reports | ✅ Simplificado | Vista local para padres |
| Multi-idioma | ✅ EN + ES | Dos idiomas inicialmente |
| Descargas offline | N/A | Todo es offline por defecto |
| Analytics/tracking | ❌ Eliminado | Privacidad total |
| Auth/login | ❌ Eliminado | Sin cuentas, todo local |
| Feature flags remotos | ❌ Eliminado | Sin dependencias externas |
| Disney IP content | ❌ Excluido | Derechos de autor |

### 2.2 Mejoras sobre el original

| Mejora | Descripción |
|---|---|
| **100% offline** | Zero dependencias de red, todo embebido |
| **Sin monetización** | Cero paywalls, banners, o upsells |
| **Privacidad total** | Sin analytics, sin tracking, sin datos a terceros |
| **Multi-perfil local** | Varios niños con progreso independiente en IndexedDB |
| **Exportación de progreso** | Descargar reporte como PDF desde el navegador |
| **Modo nocturno** | Tema oscuro suave para uso antes de dormir |
| **Velocidad de audio ajustable** | Más lento/normal/rápido para pronunciación |
| **Editor de contenido** | Panel de padres para añadir vocabulario personalizado |
| **Accesibilidad mejorada** | Alto contraste, tamaños ajustables, VoiceOver hints |

---

## 3. Arquitectura del sistema

### 3.1 Diagrama de capas

```
┌──────────────────────────────────────────────────────────────┐
│                     CAPA DE PRESENTACIÓN                     │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────────┐ │
│  │  React UI  │  │  Phaser    │  │  Lottie / Framer       │ │
│  │  Screens   │  │  Canvas    │  │  Motion Animations     │ │
│  └─────┬──────┘  └─────┬──────┘  └───────────┬────────────┘ │
│        │               │                      │              │
├────────┼───────────────┼──────────────────────┼──────────────┤
│        ▼               ▼                      ▼              │
│                  CAPA DE APLICACIÓN                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  ActivityEngine — orquesta cada tipo de actividad     │   │
│  │  CurriculumManager — progresión, recomendaciones      │   │
│  │  GamificationService — streaks, goals, rewards        │   │
│  │  AudioManager (Howler.js) — TTS, efectos, música      │   │
│  │  ProfileManager — multi-niño, preferencias            │   │
│  └──────────────────────┬───────────────────────────────┘   │
│                         │                                    │
├─────────────────────────┼────────────────────────────────────┤
│                         ▼                                    │
│                   CAPA DE DATOS                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  IndexedDB (Dexie.js)                                 │   │
│  │  ├── children (perfiles)                              │   │
│  │  ├── progress (actividades completadas por niño)      │   │
│  │  ├── curriculum (estructura de contenido)             │   │
│  │  ├── settings (configuración global)                  │   │
│  │  └── customContent (vocabulario personalizado)        │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Assets estáticos embebidos                           │   │
│  │  ├── audio/ (pronunciación, efectos, música)          │   │
│  │  ├── images/ (sprites, backgrounds, UI)               │   │
│  │  ├── animations/ (Lottie JSON)                        │   │
│  │  └── data/ (curriculum JSON, traducciones)            │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                   CAPA DE INFRAESTRUCTURA                    │
│  ┌──────────────┐  ┌───────────────┐  ┌──────────────────┐ │
│  │ Service      │  │ Vite Build    │  │ PWA Manifest     │ │
│  │ Worker       │  │ (producción)  │  │ (icons, splash)  │ │
│  │ (Workbox)    │  │               │  │                  │ │
│  └──────────────┘  └───────────────┘  └──────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

### 3.2 Estructura de directorios del proyecto

```
linguokids-replica/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── icons/                 # App icons (192, 512)
│   ├── splash/                # Splash screens iPad
│   └── audio/                 # Audio files (pronunciación, SFX)
│       ├── phonics/           # Letra por letra: a.mp3, b.mp3...
│       ├── words/             # Vocabulario: apple.mp3, banana.mp3...
│       ├── instructions/      # "Tap the letter A", "Find the match"...
│       ├── sfx/               # Efectos: correct.mp3, wrong.mp3, pop.mp3...
│       └── music/             # Background loops
├── src/
│   ├── main.tsx               # Entry point
│   ├── App.tsx                # Router principal
│   ├── routes/                # Definición de rutas
│   ├── screens/               # Pantallas React
│   │   ├── Home/              # Pantalla principal (mundo con actividades)
│   │   ├── Lessons/           # Lista de lecciones por tema
│   │   ├── Activity/          # Wrapper que carga Phaser canvas
│   │   ├── Progress/          # Reporte de progreso (padres)
│   │   ├── Settings/          # Configuración (detrás de PIN)
│   │   ├── ChildSelect/       # Selección de perfil de niño
│   │   └── Onboarding/        # Primera vez: nombre, edad, idioma
│   ├── activities/            # Tipos de actividad (Phaser scenes)
│   │   ├── PhonicsTrace/      # Trazar letras con el dedo
│   │   ├── PhonicsIdentify/   # Identificar letra correcta
│   │   ├── Matching/          # Emparejar imagen-palabra
│   │   ├── MemoryCards/       # Cartas de memoria
│   │   ├── Coloring/          # Colorear dibujos
│   │   ├── DragAndDrop/       # Arrastrar al lugar correcto
│   │   ├── WordBuilder/       # Construir palabras letra a letra
│   │   ├── ISpy/              # Buscar letras/objetos en escena
│   │   ├── ShowAndTell/       # Escuchar y repetir
│   │   ├── Sorting/           # Clasificar por categoría
│   │   └── _shared/           # Componentes Phaser compartidos
│   │       ├── ActivityScene.ts       # Base scene para todas las actividades
│   │       ├── RewardOverlay.ts       # Celebración al completar
│   │       ├── InstructionBar.ts      # Barra de instrucciones con audio
│   │       └── ProgressIndicator.ts   # Indicador de avance (3/5 estrellas)
│   ├── components/            # Componentes React reutilizables
│   │   ├── ParentalGate/      # PIN modal
│   │   ├── ActivityCard/      # Tarjeta de actividad en el feed
│   │   ├── TopicCard/         # Tarjeta de tema
│   │   ├── ChildAvatar/       # Avatar del niño
│   │   ├── StreakBadge/       # Badge de racha semanal
│   │   ├── BottomNav/         # Navegación inferior (tabs)
│   │   └── ScreenTimeModal/   # Aviso de límite de pantalla
│   ├── services/              # Lógica de negocio
│   │   ├── curriculum.ts      # Gestión del currículo y progresión
│   │   ├── gamification.ts    # Streaks, goals, rewards
│   │   ├── audio.ts           # Wrapper sobre Howler.js
│   │   ├── profiles.ts        # Gestión de perfiles de niños
│   │   ├── progress.ts        # Tracking de progreso por niño
│   │   ├── screenTime.ts      # Control de tiempo de pantalla
│   │   └── i18n.ts            # Internacionalización (EN/ES)
│   ├── data/                  # Datos estáticos del currículo
│   │   ├── curriculum.json    # Estructura: worlds > topics > units > lessons
│   │   ├── activities.json    # Catálogo de actividades con metadata
│   │   ├── phonics.json       # Datos de phonics (letras, palabras, fonemas)
│   │   ├── vocabulary.json    # Vocabulario por tema e idioma
│   │   └── translations/      # Archivos i18n
│   │       ├── en.json
│   │       └── es.json
│   ├── db/                    # Capa de persistencia
│   │   └── database.ts        # Schema Dexie.js + migrations
│   ├── hooks/                 # React hooks custom
│   ├── types/                 # TypeScript types
│   └── styles/                # Estilos globales y tokens
│       ├── tokens.css         # Variables CSS (colores, espaciado, tipografía)
│       ├── global.css         # Reset + estilos base
│       └── animations.css     # Keyframes reutilizables
├── assets/                    # Assets fuente (pre-build)
│   ├── images/
│   │   ├── characters/        # Personajes propios (no Linguokids IP)
│   │   ├── objects/           # Objetos para vocabulario
│   │   ├── backgrounds/       # Fondos de actividades
│   │   ├── ui/                # Elementos de UI (botones, badges)
│   │   └── phonics/           # Letras ilustradas
│   └── animations/
│       └── lottie/            # Archivos Lottie JSON
│           ├── celebration.json
│           ├── streak-fire.json
│           └── star-burst.json
├── index.html                 # HTML entry
├── vite.config.ts             # Configuración Vite + PWA
├── tsconfig.json
├── package.json
└── README.md
```

---

## 4. Modelos de datos

### 4.1 Schema de IndexedDB (Dexie.js)

```typescript
// db/database.ts

interface Child {
  id: string;                    // UUID
  name: string;
  age: number;                   // 2-8
  avatarId: string;              // Referencia a avatar predefinido
  locale: 'en' | 'es';
  createdAt: Date;
}

interface ActivityProgress {
  id: string;                    // UUID
  childId: string;               // FK → Child
  activityId: string;            // Referencia a activities.json
  completedAt: Date;
  score: number;                 // 0-3 estrellas
  timeSpentMs: number;
  attempts: number;
  data?: Record<string, any>;    // Datos específicos (letras trazadas, etc.)
}

interface LessonProgress {
  id: string;
  childId: string;
  lessonId: string;
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  activitiesCompleted: number;
  activitiesTotal: number;
  unlockedAt?: Date;
  completedAt?: Date;
}

interface WeeklyGoal {
  id: string;
  childId: string;
  weekStartDate: string;         // ISO date del lunes
  targetActivities: number;      // Objetivo (ej: 15)
  completedActivities: number;
  streakWeeks: number;           // Semanas consecutivas cumpliendo
  achieved: boolean;
}

interface Settings {
  id: 'global';
  parentPin: string;             // PIN de 4 dígitos (hash)
  screenTimeLimitMinutes: number; // 0 = sin límite
  locale: 'en' | 'es';
  darkMode: boolean;
  audioSpeed: 'slow' | 'normal' | 'fast';
  soundEffects: boolean;
  backgroundMusic: boolean;
}

interface CustomWord {
  id: string;
  childId: string;
  word: string;
  translation?: string;
  imageUrl?: string;             // Data URL de imagen capturada
  audioUrl?: string;             // Data URL de grabación
  topicId: string;
  createdAt: Date;
}
```

### 4.2 Datos estáticos del currículo (JSON embebido)

```typescript
// data/curriculum.json — estructura jerárquica

interface Curriculum {
  worlds: World[];
}

interface World {
  id: string;
  name: I18nString;              // { en: "ABC World", es: "Mundo ABC" }
  color: string;                 // Hex color del mundo
  icon: string;                  // Nombre de icono
  topics: Topic[];
}

interface Topic {
  id: string;
  worldId: string;
  name: I18nString;
  description: I18nString;
  thumbnailPath: string;
  units: Unit[];
}

interface Unit {
  id: string;
  topicId: string;
  name: I18nString;
  order: number;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  unitId: string;
  name: I18nString;
  order: number;
  activities: ActivityRef[];     // IDs de actividades
  prerequisiteLessonId?: string; // Lección que debe completarse antes
}

interface ActivityRef {
  activityId: string;
  order: number;
  required: boolean;             // ¿Obligatoria para completar la lección?
}

// data/activities.json — catálogo plano de actividades

interface ActivityDef {
  id: string;
  type: ActivityType;
  name: I18nString;
  instructions: I18nString;      // Texto de la instrucción
  instructionAudioPath: string;  // Ruta al audio de instrucción
  difficulty: 1 | 2 | 3;
  estimatedTimeSeconds: number;
  config: Record<string, any>;   // Config específica del tipo
}

type ActivityType =
  | 'phonics_trace'      // Trazar letras
  | 'phonics_identify'   // Identificar letra
  | 'matching'           // Emparejar
  | 'memory_cards'       // Cartas de memoria
  | 'coloring'           // Colorear
  | 'drag_and_drop'      // Arrastrar y soltar
  | 'word_builder'       // Construir palabras
  | 'i_spy'              // Buscar en escena
  | 'show_and_tell'      // Escuchar y repetir
  | 'sorting';           // Clasificar

interface I18nString {
  en: string;
  es: string;
}
```

---

## 5. Grafo de navegación

```
┌─────────────────────────────────────────────────────────────────┐
│                          APP START                              │
│                             │                                   │
│              ┌──────────────┼──────────────┐                    │
│              ▼              ▼              ▼                     │
│        [First time?]   [Has children?]  [Normal]                │
│              │              │              │                     │
│              ▼              │              │                     │
│     ┌──────────────┐       │              │                     │
│     │  Onboarding  │       │              │                     │
│     │ ┌──────────┐ │       │              │                     │
│     │ │ChildName │ │       │              │                     │
│     │ │  + Age   │ │       │              │                     │
│     │ │ + Locale │ │       │              │                     │
│     │ └────┬─────┘ │       │              │                     │
│     └──────┼───────┘       │              │                     │
│            └───────────────┼──────────────┘                     │
│                            ▼                                    │
│                  ┌──────────────────┐                            │
│                  │  Child Selector  │ (si multi-niño)            │
│                  └────────┬─────────┘                            │
│                           ▼                                     │
│            ┌──────────────────────────────┐                     │
│            │     MAIN TABS (BottomNav)    │                     │
│            │                              │                     │
│            │  [🏠Home] [📚Lessons] [⭐Fav] [⚙️]              │
│            │                              │                     │
│            │  Tab 1: HOME                 │                     │
│            │  ├── WorldMap (mundos)        │                     │
│            │  ├── DailyPicks (sugeridas)   │                     │
│            │  ├── WeeklyGoal (progreso)    │                     │
│            │  └── ContinueLearning         │                     │
│            │                              │                     │
│            │  Tab 2: LESSONS              │                     │
│            │  ├── TopicList               │                     │
│            │  ├── UnitList                │                     │
│            │  └── LessonDetail            │                     │
│            │       └── ActivityCard ──────┼──── [Launch Activity]│
│            │                              │          │          │
│            │  Tab 3: FAVORITES            │          │          │
│            │  └── SavedActivities         │          │          │
│            │                              │          │          │
│            │  Tab 4: PARENTS (PIN gate)   │          │          │
│            │  ├── ProgressReport          │          │          │
│            │  ├── ChildManagement         │          │          │
│            │  ├── ScreenTimeSettings      │          │          │
│            │  ├── CustomContent           │          │          │
│            │  └── AppSettings             │          │          │
│            └──────────────┬───────────────┘          │          │
│                           │                          │          │
│                           │         ┌────────────────┘          │
│                           │         ▼                           │
│                           │  ┌──────────────────┐               │
│                           │  │  ACTIVITY VIEW   │               │
│                           │  │  (Phaser Canvas) │               │
│                           │  │                  │               │
│                           │  │  InstructionBar  │               │
│                           │  │  GameArea        │               │
│                           │  │  ProgressDots    │               │
│                           │  │  ExitButton      │               │
│                           │  └────────┬─────────┘               │
│                           │           │                         │
│                           │     [Completed?]                    │
│                           │      ▼         ▼                    │
│                           │  [Yes]       [No/Exit]              │
│                           │      │         │                    │
│                           │      ▼         │                    │
│                           │  ┌────────┐    │                    │
│                           │  │Rewards │    │                    │
│                           │  │Overlay │    │                    │
│                           │  │(stars) │    │                    │
│                           │  └───┬────┘    │                    │
│                           │      │         │                    │
│                           │      ▼         ▼                    │
│                           │  ┌──────────────────┐               │
│                           │  │ Next Activity /  │               │
│                           │  │ Back to Lesson   │               │
│                           │  └──────────────────┘               │
│                           │                                     │
│         MODALS (overlay sobre cualquier pantalla)               │
│         ├── ParentalGateModal (PIN de 4 dígitos)                │
│         ├── ScreenTimeLimitModal                                │
│         └── ConfirmExitModal                                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. Pantallas y wireframes

### 6.1 Onboarding (3 pasos)

```
┌─────────────────────────┐  ┌─────────────────────────┐  ┌─────────────────────────┐
│    ¡Hola! 🎈            │  │   ¿Cuántos años tiene   │  │   ¿En qué idioma        │
│                         │  │     [nombre]?            │  │    aprenderá?            │
│  ¿Cómo se llama         │  │                         │  │                         │
│  tu peque?              │  │  ┌───┐ ┌───┐ ┌───┐     │  │  ┌───────────────────┐  │
│                         │  │  │ 2 │ │ 3 │ │ 4 │     │  │  │ 🇬🇧 English       │  │
│  ┌───────────────────┐  │  │  └───┘ └───┘ └───┘     │  │  └───────────────────┘  │
│  │  Nombre...        │  │  │  ┌───┐ ┌───┐ ┌───┐     │  │  ┌───────────────────┐  │
│  └───────────────────┘  │  │  │ 5 │ │ 6 │ │ 7 │     │  │  │ 🇪🇸 Español       │  │
│                         │  │  └───┘ └───┘ └───┘     │  │  └───────────────────┘  │
│  ┌───────────────────┐  │  │  ┌───┐                  │  │                         │
│  │    Siguiente →     │  │  │  │ 8 │                  │  │  ┌───────────────────┐  │
│  └───────────────────┘  │  │  └───┘                  │  │  │  ¡A aprender! →    │  │
└─────────────────────────┘  └─────────────────────────┘  └─────────────────────────┘
```

### 6.2 Home (pantalla principal)

```
┌─────────────────────────────────────────┐
│  🔥3  [Avatar]  Lucía  ⚙️             │  ← Header: streak, perfil, settings
├─────────────────────────────────────────┤
│                                         │
│  🎯 Meta semanal: 8/15 actividades     │  ← Barra de progreso semanal
│  ████████░░░░░░░                        │
│                                         │
│  ── Sigue aprendiendo ──               │  ← Continuar donde dejó
│  ┌─────────┐ ┌─────────┐              │
│  │ Phonics │ │Matching │              │
│  │  Letra D│ │ Colores │              │
│  │  ⭐⭐☆  │ │  ⭐☆☆  │              │
│  └─────────┘ └─────────┘              │
│                                         │
│  ── Mundos ──                          │  ← Grid de mundos
│  ┌────────┐ ┌────────┐ ┌────────┐     │
│  │🔤 ABC  │ │🔢 123  │ │🎨Color│     │
│  │ World  │ │ World  │ │ World │     │
│  └────────┘ └────────┘ └────────┘     │
│  ┌────────┐ ┌────────┐ ┌────────┐     │
│  │🐾Animal│ │🍎Food │ │🎵Music│     │
│  │ World  │ │ World  │ │ World │     │
│  └────────┘ └────────┘ └────────┘     │
│                                         │
├─────────────────────────────────────────┤
│  [🏠Home]  [📚Lessons]  [⭐Fav]  [👤] │  ← Bottom tabs
└─────────────────────────────────────────┘
```

### 6.3 Activity View (Phaser Canvas)

```
┌─────────────────────────────────────────┐
│  ✕   "Trace the letter D"    🔊  3/5   │  ← TopBar: exit, instrucción, audio, progreso
├─────────────────────────────────────────┤
│                                         │
│                                         │
│            ┌─────────────┐              │
│            │             │              │
│            │      D      │              │  ← Área de juego (Phaser Canvas)
│            │  - - - - -  │              │     Ejemplo: tracing de letra
│            │  (trace     │              │     El niño traza con el dedo
│            │   path)     │              │     sobre la línea punteada
│            │             │              │
│            └─────────────┘              │
│                                         │
│         ┌───┐  ┌───┐  ┌───┐            │  ← Helpers opcionales
│         │ 🔄 │  │ 💡 │  │ 🔊 │            │     Reset, hint, replay audio
│         └───┘  └───┘  └───┘            │
│                                         │
│  ● ● ● ○ ○                             │  ← Progress dots (actividad 3 de 5)
└─────────────────────────────────────────┘
```

### 6.4 Rewards Overlay (post-actividad)

```
┌─────────────────────────────────────────┐
│                                         │
│          ✨ ¡Genial! ✨                │
│                                         │
│           ⭐ ⭐ ⭐                     │  ← Estrellas ganadas (Lottie anim)
│                                         │
│        Has trazado la D                 │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │     Siguiente actividad →       │    │  ← CTA principal
│  └─────────────────────────────────┘    │
│                                         │
│        Volver a la lección              │  ← Link secundario
│                                         │
└─────────────────────────────────────────┘
```

### 6.5 Parents Dashboard (detrás de PIN)

```
┌─────────────────────────────────────────┐
│  ← Volver     Zona de padres           │
├─────────────────────────────────────────┤
│                                         │
│  👧 Lucía (5 años)      [Cambiar niño] │
│                                         │
│  ── Esta semana ──                     │
│  Actividades: 12 completadas           │
│  Tiempo: 45 min total                  │
│  Mejor tema: Phonics (8 act.)          │
│  Racha: 🔥 3 semanas                  │
│                                         │
│  ── Por tema ──                        │
│  🔤 Phonics      ████████░░  80%      │
│  🔢 Números      █████░░░░░  50%      │
│  🎨 Colores      ███░░░░░░░  30%      │
│  🐾 Animales     ██░░░░░░░░  20%      │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  📄 Exportar reporte (PDF)     │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ── Configuración ──                   │
│  Tiempo de pantalla: [30 min ▼]        │
│  Velocidad audio:    [Normal ▼]        │
│  Tema oscuro:        [  OFF  ]         │
│  Efectos sonido:     [  ON   ]         │
│                                         │
├─────────────────────────────────────────┤
│  [🏠Home]  [📚Lessons]  [⭐Fav]  [👤] │
└─────────────────────────────────────────┘
```

---

## 7. Catálogo de tipos de actividad

### 7.1 Implementación por tipo

| # | Tipo | Interacción | Motor | Complejidad |
|---|---|---|---|---|
| 1 | `phonics_trace` | Trazar letra con dedo siguiendo path SVG | Phaser + Path | 🔴 Alta |
| 2 | `phonics_identify` | Tocar la letra correcta entre opciones | React + Audio | 🟢 Baja |
| 3 | `matching` | Arrastrar elemento a su par correcto | Phaser D&D | 🟡 Media |
| 4 | `memory_cards` | Voltear cartas para encontrar pares | React + Framer | 🟡 Media |
| 5 | `coloring` | Tocar zonas para rellenar con color | Phaser + Flood fill | 🔴 Alta |
| 6 | `drag_and_drop` | Arrastrar objeto a zona correcta | Phaser D&D | 🟡 Media |
| 7 | `word_builder` | Ordenar letras para formar palabra | React D&D | 🟡 Media |
| 8 | `i_spy` | Encontrar objetos/letras ocultas en escena | Phaser + Hitbox | 🟡 Media |
| 9 | `show_and_tell` | Escuchar palabra y seleccionar imagen | React + Audio | 🟢 Baja |
| 10 | `sorting` | Clasificar objetos en categorías | Phaser D&D | 🟡 Media |

### 7.2 Diseño detallado: phonics_trace (el más complejo)

```typescript
// activities/PhonicsTrace/PhonicsTraceScene.ts

class PhonicsTraceScene extends ActivityScene {
  // Datos de entrada (del JSON de actividad)
  private letter: string;           // "D"
  private tracePath: PathPoint[];   // Puntos del SVG path de la letra
  private tolerancePixels: number;  // 30px de margen de error

  // Estado
  private playerPath: Phaser.Curves.Path;
  private isTracing: boolean;
  private completionPercent: number;
  private currentSegment: number;

  // Flujo:
  // 1. Mostrar letra con línea punteada (path SVG)
  // 2. Reproducir audio: "Trace the letter D"
  // 3. Animar dedo-guía mostrando el trazo correcto
  // 4. Esperar input táctil del niño
  // 5. Validar que el trazo sigue el path (dentro de tolerancia)
  // 6. Feedback visual: verde = correcto, rojo = salió del path
  // 7. Al completar 80%+ del path → éxito
  // 8. Reproducir audio: "D! Great job!"
  // 9. Mostrar RewardOverlay

  // Eventos Phaser usados:
  // - pointerdown → iniciar trazo
  // - pointermove → extender trazo, validar proximidad
  // - pointerup → finalizar trazo, calcular % completado
}
```

---

## 8. Plan de implementación

### Fase A: Fundamentos (Semanas 1-2)

| Tarea | Descripción | Estimación |
|---|---|---|
| A.1 | Scaffold del proyecto (Vite + React + TS + PWA) | 2h |
| A.2 | Sistema de rutas y navegación (React Router) | 4h |
| A.3 | Bottom tab navigator con iconos | 3h |
| A.4 | Schema de IndexedDB con Dexie.js | 3h |
| A.5 | Sistema de tokens CSS (colores, tipografía, espaciado) | 3h |
| A.6 | Onboarding flow (3 pantallas: nombre, edad, idioma) | 6h |
| A.7 | Child selector + multi-perfil | 4h |
| A.8 | Parental gate (PIN modal) | 3h |
| **Total Fase A** | | **28h** |

### Fase B: Motor de actividades (Semanas 3-5)

| Tarea | Descripción | Estimación |
|---|---|---|
| B.1 | Integración Phaser.js en React (componente wrapper) | 6h |
| B.2 | ActivityScene base (clase padre para todas las actividades) | 8h |
| B.3 | Sistema de audio (Howler.js wrapper + precarga) | 4h |
| B.4 | InstructionBar (texto + audio de instrucciones) | 3h |
| B.5 | RewardOverlay (estrellas + animación Lottie) | 4h |
| B.6 | `phonics_trace` — el tipo más complejo (SVG path + touch tracking) | 16h |
| B.7 | `phonics_identify` — seleccionar letra correcta | 4h |
| B.8 | `matching` — drag-and-drop para emparejar | 8h |
| B.9 | `memory_cards` — voltear y emparejar cartas | 6h |
| B.10 | `coloring` — rellenar zonas táctiles | 12h |
| B.11 | `drag_and_drop` — genérico (arrastrar a zona) | 6h |
| B.12 | `word_builder` — ordenar letras | 6h |
| B.13 | `i_spy` — buscar elementos en escena | 6h |
| B.14 | `show_and_tell` — escuchar y elegir | 4h |
| B.15 | `sorting` — clasificar en categorías | 6h |
| **Total Fase B** | | **97h** |

### Fase C: Contenido y currículo (Semanas 6-7)

| Tarea | Descripción | Estimación |
|---|---|---|
| C.1 | Estructura JSON del currículo (worlds, topics, units, lessons) | 8h |
| C.2 | Pantalla Home con mapa de mundos | 8h |
| C.3 | Pantalla Lessons (lista por tema) | 4h |
| C.4 | Lesson detail (lista de actividades con estado) | 4h |
| C.5 | Lógica de progresión (desbloqueo de lecciones) | 6h |
| C.6 | Sistema de favoritos | 3h |
| C.7 | Daily picks (recomendaciones basadas en progreso) | 4h |
| **Total Fase C** | | **37h** |

### Fase D: Gamificación (Semana 8)

| Tarea | Descripción | Estimación |
|---|---|---|
| D.1 | Weekly goals (objetivo + tracking + UI) | 6h |
| D.2 | Streak counter (semanas consecutivas) | 4h |
| D.3 | Progress tracking por actividad (estrellas, tiempo) | 4h |
| D.4 | Animaciones de celebración (Lottie) | 4h |
| D.5 | Badges y logros | 6h |
| **Total Fase D** | | **24h** |

### Fase E: Zona de padres (Semana 9)

| Tarea | Descripción | Estimación |
|---|---|---|
| E.1 | Dashboard de progreso por niño | 6h |
| E.2 | Gráficas de actividad por tema | 4h |
| E.3 | Screen time settings + enforcement | 6h |
| E.4 | Child management (añadir/editar/eliminar) | 4h |
| E.5 | Exportar reporte PDF | 4h |
| E.6 | Editor de contenido personalizado | 8h |
| **Total Fase E** | | **32h** |

### Fase F: Assets y contenido real (Semanas 10-12)

| Tarea | Descripción | Estimación |
|---|---|---|
| F.1 | Creación/adquisición de assets gráficos (personajes propios, objetos) | 20h |
| F.2 | Grabación/adquisición de audios (pronunciación EN/ES, instrucciones) | 16h |
| F.3 | Creación de animaciones Lottie (celebración, transiciones) | 8h |
| F.4 | Población del currículo: Phonics A-Z (26 letras × 3 actividades) | 12h |
| F.5 | Población del currículo: Números 1-20 | 6h |
| F.6 | Población del currículo: Colores (12 colores) | 4h |
| F.7 | Población del currículo: Animales (20 animales) | 4h |
| F.8 | Población del currículo: Comida (20 alimentos) | 4h |
| F.9 | Población del currículo: restantes worlds | 8h |
| **Total Fase F** | | **82h** |

### Fase G: Pulido y despliegue (Semanas 13-14)

| Tarea | Descripción | Estimación |
|---|---|---|
| G.1 | PWA manifest + Service Worker + precaching | 4h |
| G.2 | Splash screen + loading states | 3h |
| G.3 | Dark mode (tema nocturno suave) | 4h |
| G.4 | Accesibilidad (VoiceOver hints, alto contraste) | 6h |
| G.5 | Optimización de performance (lazy loading, code split) | 6h |
| G.6 | Testing E2E con Playwright en iPad viewport | 8h |
| G.7 | Testing manual en iPad Safari real | 4h |
| G.8 | Empaquetado final como archivo local | 4h |
| **Total Fase G** | | **39h** |

### Resumen de estimaciones

| Fase | Horas | Semanas (20h/sem) |
|---|---|---|
| A: Fundamentos | 28h | 1.5 |
| B: Motor de actividades | 97h | 5 |
| C: Contenido y currículo | 37h | 2 |
| D: Gamificación | 24h | 1 |
| E: Zona de padres | 32h | 1.5 |
| F: Assets y contenido | 82h | 4 |
| G: Pulido y despliegue | 39h | 2 |
| **TOTAL** | **339h** | **~17 semanas** |

> **Nota**: Las estimaciones asumen un desarrollador. Con Claude Code como copiloto, las fases A-E pueden reducirse un 40-60%, llevando el código a ~130h (~6.5 semanas). La Fase F (contenido) depende mayormente de creación de assets, no de código.

---

## 9. Dependencias y orden de implementación

```
A.1 ──→ A.2 ──→ A.3
  │       │
  │       ├──→ A.6 ──→ A.7
  │       │
  ▼       ▼
A.4     A.5 ──→ Todo lo visual
  │
  ▼
A.8 ──→ E.* (zona padres)

A.1 + A.4 ──→ B.1 ──→ B.2 ──→ B.3/B.4/B.5
                              │
                              ├──→ B.6 (phonics_trace)
                              ├──→ B.7 (phonics_identify)
                              ├──→ B.8 (matching)
                              ├──→ B.9 (memory)
                              ├──→ B.10 (coloring)
                              ├──→ B.11-B.15 (rest)
                              │
                              ▼
                         C.1 ──→ C.2-C.7
                              │
                              ▼
                         D.1-D.5 (gamification)
                              │
                              ▼
                         F.* (contenido real)
                              │
                              ▼
                         G.* (pulido)
```

**Camino crítico**: A.1 → A.2 → B.1 → B.2 → B.6 → C.1 → F.4 → G.7

---

## 10. Validación del blueprint

### 10.1 Cobertura de funcionalidades

| Funcionalidad original | ¿Cubierta? | Sección del blueprint |
|---|---|---|
| Currículo de 12 materias | ✅ | §4.2, §8 Fase C |
| Worlds → Topics → Units → Lessons | ✅ | §4.2 |
| 10 tipos de actividad | ✅ | §7 |
| Phonics con tracing | ✅ | §7.2 |
| Gamificación (streaks, goals) | ✅ | §8 Fase D |
| Multi-perfil de niños | ✅ | §4.1, §8 A.7 |
| Parental gate | ✅ | §8 A.8 |
| Screen time control | ✅ | §8 E.3 |
| Progress reports | ✅ | §8 E.1-E.2 |
| Multi-idioma (EN/ES) | ✅ | §4.2 (I18nString) |
| Offline-first | ✅ | §1.3, §8 G.1 |
| Audio (instrucciones, pronunciación) | ✅ | §3.1, §8 B.3 |
| Animaciones (Lottie) | ✅ | §3.1, §8 D.4 |

### 10.2 Dependencias circulares

Verificación: **No hay dependencias circulares** en el grafo de §9. El flujo es estrictamente:
```
Infraestructura → Motor → Contenido → Gamificación → Assets → Pulido
```

### 10.3 Orden de implementación

El camino crítico identifica que el **motor de actividades** (especialmente `phonics_trace`) es el componente de mayor riesgo y debería priorizarse. La estructura del currículo puede desarrollarse en paralelo con los últimos tipos de actividad.

### 10.4 Realismo de estimaciones

- **Fases A-E (código)**: 218h. Con Claude Code asistiendo, estimación ajustada: ~100-130h (~5-6.5 semanas).
- **Fase F (assets)**: 82h. Es el cuello de botella real — requiere creación artística (imágenes, audio) que no puede automatizarse completamente. Se pueden usar assets temporales (placeholders) durante desarrollo.
- **Fase G (pulido)**: 39h. Estándar para un proyecto de esta envergadura.

### 10.5 Riesgos identificados

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Performance de Phaser en iPad Safari | Media | Alto | Prototipar B.6 temprano, medir FPS |
| Touch tracking impreciso (tracing) | Media | Alto | Tolerancia generosa, testing temprano |
| Assets gráficos insuficientes | Alta | Medio | Usar SVGs/formas simples como fallback |
| Audio de pronunciación | Alta | Medio | TTS como placeholder, grabar después |
| Service Worker en iPad | Baja | Alto | Safari soporta SW desde iOS 11.3 |
| Tamaño del bundle | Media | Medio | Lazy loading, code splitting agresivo |

---

## Apéndice A: Mapping de la app original a la réplica

| Componente original | Tecnología original | Réplica | Tecnología réplica |
|---|---|---|---|
| React Native UI | React Native + Hermes | React SPA | React 18 + Vite |
| Unity game engine | Unity3D + C# | Canvas games | Phaser.js 3 |
| RN↔Unity bridge | NativeRBridgeModule | React↔Phaser bridge | Props/events |
| AssetBundles CDN | ab0.lingokids.com | Assets embebidos | Vite static import |
| Realm DB | Realm React Native | IndexedDB | Dexie.js |
| AsyncStorage | RN AsyncStorage | localStorage | Built-in |
| Hermes bytecode | Compiled JS bundle | TypeScript source | Vite TS |
| Lottie animations | lottie-react-native | Lottie web | lottie-web |
| react-native-size-matters | Proportional scaling | CSS clamp() | Native CSS |
| React Navigation | Stack/Tab navigators | React Router | react-router-dom |
| Google/Apple auth | Native SDKs | N/A | Sin auth |
| Braze/Firebase analytics | Native SDKs | N/A | Sin tracking |
| Google Play Billing | Billing client | N/A | Sin compras |
