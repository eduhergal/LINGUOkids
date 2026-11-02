# LINGUOKIDS — REA VERA

## Objetivo del proyecto

Ejecutar un análisis REA (Reverse Engineering & Acquisition) completo sobre la aplicación **Linguokids** para:

1. **Extraer todo el contenido lectivo** de la app: lecciones, ejercicios, assets gráficos, audios, animaciones, flujos pedagógicos y lógica de gamificación.
2. **Documentar la arquitectura y mecánicas** de cada tipo de actividad para poder replicarlas fielmente.
3. **Construir una réplica funcional** que corra como **archivo local en iPad** (sin depender de servidores externos).

## Idioma y tono

- Todo el proyecto se documenta y comenta en **español fluido**.
- Claude actúa en **modo profesor**: explica decisiones, razona en voz alta y enseña mientras construye.

## Estado actual

> Fase 1 — Análisis estático del APK completado. ✅
> Fase 2 — Análisis dinámico sustituido por análisis estático ampliado (crash ABI en emulador). ✅
> Fase 3 — Blueprint de reconstrucción completado → `docs/blueprint/00-blueprint.md`. ✅
> Fase A — Scaffold del proyecto (Vite + React + TS + PWA). ✅
> Fase B — Implementación de 10 tipos de actividad. ✅
> Fase C — Currículo completo (A-Z, 1-20, colores, animales, comida, música). ✅
> Fase D — Persistencia IndexedDB (progreso, favoritos, perfiles, gamificación). ✅
> Fase E — PWA offline (Service Worker, manifest, icons). ✅
>
> Fase F — Sistema de temas (Bosque/Espacio/Jardín) + 15 mejoras UX pedagógicas. ✅
>
> Fase G — Tutorial interactivo + Reporte semanal + Temporizador visual. ✅
>
> Fase H — 6 nuevas funcionalidades: TTS, SVG, Cuentos, Piano, Matemáticas, Escritura libre. ✅
>
> **Estado**: v2.0 completa. 16 tipos de actividad, 7 mundos, 47 actividades de mates, 6 cuentos, piano interactivo. Build limpio (727 KiB), 14 tests, 3 temas.
> **Pendiente**: Audio grabado real (ElevenLabs), más cuentos, sistema de logros, mapa de progreso visual, exportar PDF.

## Hallazgos del análisis estático (2026-11-01)

### Identidad de la app
- **Package**: `es.monkimun.lingokids`
- **Versión**: 26.44.0 (versionCode 10041911)
- **SDK**: Expo 55.0.0 (React Native con Hermes engine)
- **Target SDK**: 36 (Android 16)
- **Plugins Expo**: `expo-audio`, `expo-image`

### Arquitectura híbrida: React Native + Unity
La app tiene una arquitectura de **dos capas**:
1. **Capa RN (React Native/Hermes)**: navegación, UI principal, onboarding, suscripciones, perfil de usuario, parental gate, descarga de contenido
2. **Capa Unity3D**: las actividades/juegos interactivos se renderizan en un player Unity embebido (`com.unity3d.player.*`). Los assets de juegos son **AssetBundles de Unity** que se descargan desde CDN (`ab0.lingokids.com`)

### Estructura de actividades
Cada actividad tiene:
- **JSON descriptor** (`activities/<nombre>.json`) con metadata: id, slug, tipo, subtipo, colores, bundles URLs, visibilidad
- **AssetBundles por plataforma** (Android/iOS/Editor) versionados (ej. `26.25.0`)
- **Bundles localizados** (ej. `bathroom_game_en_us` para audio/texto en inglés)
- **Cover image** (`.jpg`) para thumbnails
- **scene_name**: `ActivityPrefabScene` (escena Unity genérica que carga el bundle)

### Actividades embebidas en el APK
Solo 3 actividades vienen pre-empaquetadas:
1. `bathroom_game` (tipo: game, subtipo: chore_routine, tema: Health)
2. `game_dressupparty_disney_mickey_costumes` (Disney collab)
3. `game_uniquebuilder_disney_zootopia_cluehunt` (Disney collab)

El resto se descarga dinámicamente desde `ab0.lingokids.com`.

### Tipos de actividad identificados (de strings del bytecode)
- **Phonics** (lectura de letras, cursiva, escritura)
- **Tracing** (trazado de letras)
- **Matching** (emparejar)
- **Coloring** (colorear)
- **Vocabulary/Words** (ej. `words_y_yellow`)
- **Show and Tell**
- **Memory Cards**
- **I Spy** (buscar letras)
- **Songs** (canciones educativas)
- **Dance Time** (movimiento)
- **Chore Routines** (rutinas como baño)
- **Dress Up Party** (vestir personajes)
- **Unique Builder** (construcción)

### Currículo
- **12-subject curriculum** (confirmado en strings: "12-subject curriculum tailored to your child's age")
- Sistema de **Worlds** y **Topics** para organizar contenido
- **Units** progresivas (ej. "Welcome Unit", "Phonics B Kindergarten")
- Soporte multi-idioma: EN, ES, PT, FR, IT, ID (indonesio), ZH

### Gamificación
- Objetivos semanales por niño (`#CHILD_NAME# reached the goal`)
- Streaks semanales (`#WEEK_STREAK#-week streak!`)
- Límite diario de 3 actividades (free tier: `3 activity daily limit`)
- Sistema de progreso por niño con reportes para padres
- Recompensas y celebraciones al completar actividades

### Assets en el APK
- **`index.android.bundle`** (13 MB): bytecode Hermes — NO es JS legible, requiere decompilador Hermes
- **`assets/bin/Data/`**: 323 archivos de datos Unity (AssetBundles locales, escenas, prefabs)
- **Fuentes**: GothamRounded-Bold.otf, GothamRounded-Medium.otf, lingokidsv04.ttf (fuente propia con iconos)
- **`app.config`**: configuración Expo

### URLs y servicios externos detectados
- **CDN de assets**: `ab0.lingokids.com` (AssetBundles de actividades)
- **Imágenes**: `lingokids-ab0.imgix.net` (CDN de thumbnails)
- **Progreso infantil**: `app.lingokids.com/web_views/child_progress/reports/`
- **Invitaciones**: `www.lingokids.com/invitation?adgroup=...`
- **Soporte**: `help.lingokids.com/hc/en-us/requests/new`
- **Analytics**: Firebase, Sentry, Braze
- **Auth**: Google Sign-In, Apple Authentication
- **Billing**: Google Play Billing, Stripe

### Herramientas de descompilación
- **jadx 1.5.1**: descompilación Java/XML exitosa (9878 clases, 26 errores menores)
- **hbctool 0.1.5**: NO compatible con esta versión de Hermes bytecode
- **hermes-dec 0.1.8**: instalado pero sin CLI directo para decompilación completa
- **Próximo paso**: necesitamos `hermes-dec` con script personalizado o herramientas alternativas para el bundle JS

## Comandos de build y test

```bash
# Directorio de trabajo
cd app

# Instalar dependencias
npm install

# Dev server (hot reload)
npx vite --port 5173

# Type-check
npx tsc -b --noEmit

# Tests (Vitest)
npx vitest run

# Build de producción (genera dist/ con PWA + Service Worker)
npx vite build

# Preview local del build de producción
npx vite preview --port 4173

# Desplegar en iPad:
# 1. Servir dist/ desde un servidor local (npx serve dist)
# 2. Abrir en Safari iPad: http://<IP-local>:3000
# 3. Compartir → Añadir a pantalla de inicio
# 4. La PWA funciona 100% offline con Service Worker
```

## Plataforma objetivo

- **Dispositivo**: iPad (iOS)
- **Modo de ejecución**: archivo local / offline-first
- **Sin dependencias de backend remoto** en la versión final

## Contenido lectivo a extraer

- Estructura curricular completa (temas, niveles, progresión)
- Todos los tipos de actividad/ejercicio (matching, drag-and-drop, quiz, tracing, etc.)
- Assets: imágenes, iconos, sprites, animaciones (Lottie/Spine/CSS)
- Audio: instrucciones, pronunciación, efectos de sonido, música
- Lógica de gamificación: puntos, estrellas, recompensas, desbloqueos
- Flujos de navegación y UX entre actividades

## Convenciones de código

> Por definir. Se irán estableciendo conforme se elija el stack tecnológico.

### Principios generales (provisionales)

- Código limpio y autoexplicativo; comentarios solo cuando el "por qué" no es obvio
- Nombres de variables y funciones en inglés; documentación y commits en español
- Estructura modular: cada tipo de actividad es un componente independiente
- Assets organizados por categoría (`audio/`, `images/`, `animations/`, `data/`)

## Lecciones aprendidas

> Cada decisión arquitectónica importante y cada error que Claude cometa y corrija se documenta aquí para no repetirlo en futuras sesiones.

### 2026-11-01: El bundle JS es bytecode Hermes, no JavaScript legible
**Qué pasó**: Al intentar leer `index.android.bundle` (13 MB), descubrimos que es bytecode compilado de Hermes (magic bytes `c61fbc03`), no JavaScript en texto plano. Las herramientas estándar (`hbctool`) no soportan esta versión.
**Decisión**: Extraer strings del bytecode como primera aproximación (3887 strings útiles). Para decompilación completa necesitaremos un script personalizado con `hermes-dec` o compilar `hbc-decompiler` desde el repo de Hermes.
**Impacto**: La lógica de negocio de React Native (navegación, API calls, estado) está en el bytecode. Los juegos Unity están en AssetBundles separados.

### 2026-11-01: Arquitectura híbrida React Native + Unity3D
**Qué pasó**: El análisis reveló que Linguokids NO es una app React Native pura. Las actividades/juegos corren en un player Unity embebido.
**Implicación para la réplica**: No podemos simplemente replicar React Native. Los juegos interactivos (phonics, tracing, matching, etc.) son escenas Unity con AssetBundles. Para la réplica offline en iPad, tendremos que elegir entre: (a) replicar con Unity, (b) re-implementar los juegos en web/Canvas/HTML5, o (c) usar un motor 2D como Phaser/PixiJS.
**Decisión tomada**: PWA con React (UI) + Phaser.js (juegos Canvas). Ver blueprint `docs/blueprint/00-blueprint.md` §1.

### 2026-11-01: Crash ABI en emulador x86_64 — análisis dinámico sustituido
**Qué pasó**: Al intentar ejecutar la app en un emulador Android x86_64, crashea con `couldn't find DSO to load: libreactnative.so`. Los splits del APK solo contienen librerías arm64-v8a.
**Decisión**: Sustituir la Fase 2 (análisis dinámico) por análisis basado en la documentación estática ya extraída. Los 8 documentos de Fase 1 cubren toda la información necesaria para el blueprint.
**Impacto**: No tenemos screenshots reales ni payloads exactos de API, pero los wireframes del blueprint y los endpoints inferidos son suficientes para la reconstrucción.

### 2026-11-01: Stack tecnológico elegido — PWA + React + Phaser.js
**Qué pasó**: Evaluamos 6 opciones de plataforma para la réplica offline en iPad. Unity WebGL descartado por peso y complejidad. React Native descartado porque no permite "archivo local". Capacitor descartado como overhead innecesario.
**Decisión**: PWA (HTML5) con React 18 para UI/navegación + Phaser.js 3 para las actividades interactivas en Canvas. Vite como bundler, Dexie.js sobre IndexedDB para persistencia, Howler.js para audio, Workbox para offline.
**Justificación**: Una PWA se puede servir como archivo local en iPad Safari, funciona 100% offline con Service Worker, y combina lo mejor de React (UI declarativa) con Phaser (motor de juegos 2D optimizado para touch).

### 2026-11-02: Onboarding en bucle — needsOnboarding nunca se reseteaba
**Qué pasó**: En iPad (y en cualquier navegador), tras completar el onboarding (nombre → edad → idioma), la app volvía inmediatamente a la pantalla de onboarding en bucle infinito. El usuario no podía avanzar a las lecciones.
**Causa raíz**: En `App.tsx`, el estado `needsOnboarding` se ponía `true` cuando no había perfiles en IndexedDB, pero **nunca se reseteaba a `false`** cuando `setActiveChild(child)` era llamado desde el componente Onboarding. La condición de routing `{needsOnboarding ? <Navigate to="/onboarding" />}` siempre capturaba la ruta `*` y redirigía de vuelta.
**Solución**: Envolver `setActiveChild` en un callback que también llama `setNeedsOnboarding(false)` cuando se le pasa un hijo no-nulo. Así cuando el Onboarding crea el perfil y lo asigna, el flag se limpia y las rutas principales se renderizan.
**Impacto**: Bug crítico que impedía usar la app en absoluto. Los tests unitarios no lo detectaron porque prueban servicios individuales, no el flujo de navegación completo.

### 2026-11-02: overflow:hidden impedía el scroll en Lessons
**Qué pasó**: La página de Lessons mostraba los mundos pero no se podía scrollear para ver los que quedaban debajo. Causa: `overflow: hidden` en `html` y `body` del CSS global.
**Solución**: Añadir un wrapper `<main className="app-main">` con `flex: 1; overflow-y: auto; -webkit-overflow-scrolling: touch` y cambiar `#root` a `height: 100dvh` con flex column. El `overflow: hidden` en html/body se mantiene para evitar el rubber-band bounce de iOS.
**Impacto**: Ahora todas las pantallas con contenido largo scrollean correctamente, manteniendo el BottomNav fijo.

### 2026-11-02: Audio service sin error handling causaba promises infinitas
**Qué pasó**: El servicio de audio (`services/audio.ts`) no manejaba errores. Si un archivo MP3 no existía, `Howl` emitía `loaderror` y la Promise de `play()` nunca se resolvía, colgando la app.
**Solución**: Añadir `onloaderror` al constructor de Howl, un set `failedSrcs` para evitar reintentos, y listeners de `loaderror`/`playerror` en `play()` que resuelven la Promise inmediatamente. `getOrCreate()` ahora retorna `null` para fuentes fallidas.
**Impacto**: La app funciona sin archivos de audio reales (usa emojis como placeholders) sin colgarse ni mostrar errores.

### 2026-11-02: Sistema de 3 temas y 15 mejoras UX pedagógicas
**Qué pasó**: Tras investigar pedagogía infantil, reseñas de Duolingo ABC y Linguokids, y principios UX para niños, implementamos un rediseño completo.
**Cambios implementados**:
1. **3 temas seleccionables** (Bosque Mágico, Aventura Cósmica, Jardín Encantado) con paletas de color basadas en psicología del color infantil
2. **Mascota guía por tema** (Búho Sabi, Alien Zip, Mariposa Lila) con frases de ánimo contextuales
3. **Progreso visual orgánico** (árbol de frutos / órbita planetaria / flor de pétalos) en vez de barra
4. **Confetti y feedback háptico/sonoro** al completar actividades (vibración + tonos musicales generados con Web Audio API)
5. **Targets táctiles mínimo 48px** en todos los botones y controles
6. **Fondos con gradientes suaves** temáticos en vez de colores planos
7. **Transiciones animadas** entre pantallas (AnimatePresence de Framer Motion)
8. **Dificultad adaptativa** basada en historial de puntuaciones
9. **Mensajes constructivos de error** ("¡Casi! Prueba otra vez" en vez de "Incorrecto")
10. **Celebración enriquecida** al completar: confetti canvas + mascota + estrellas animadas + frase de ánimo
11. **Modo foco**: la navegación se oculta durante actividades (screen-no-nav)
12. **Selector de tema** en la zona de padres + en el onboarding
13. **BottomNav temático** con iconos y labels del tema activo
14. **Migración de BD** (Dexie v2) para themeId en Child y defaultThemeId en Settings
**Arquitectura**: ThemeProvider (React context) + CSS custom properties dinámicas. Cada tema define 12 colores, mascota, etiquetas de nav, frases de ánimo. Los tokens CSS se actualizan en runtime vía `documentElement.style.setProperty`.
**Impacto**: +18 KiB en el bundle (642 KiB total), mantiene 14/14 tests, build limpio.

### 2026-11-02: Tutorial interactivo, reporte semanal y temporizador visual
**Qué pasó**: Se implementaron los 3 últimos ítems pendientes de las 15 mejoras UX.
**Tutorial interactivo**: Nueva tabla `tutorialSeen` en IndexedDB (Dexie v3). Al abrir una actividad por primera vez, se muestra un overlay con 2 pasos animados (emoji + texto bilingüe) explicando cómo interactuar. El servicio `tutorial.ts` define pasos específicos para cada uno de los 10 tipos de actividad. El overlay se puede saltar ("Ya sé") o seguir paso a paso.
**Reporte semanal**: La pantalla Progress ahora incluye: gráfico de barras CSS por día de la semana (con highlight del día actual), desglose por tema (mundo) con conteo y estrellas promedio, sección de recomendaciones inteligentes (detecta temas débiles, mundos no explorados, ritmo bajo), y estadísticas de puntuación media y racha.
**Temporizador visual**: Componente `SandTimer` con SVG de reloj de arena animado. Muestra minutos restantes, cambia de color azul→naranja→rojo según el porcentaje transcurrido. Se integra discretamente en el header de las actividades.
**Impacto**: +11 KiB en el bundle (653 KiB total). Migración BD v3 sin riesgo (solo añade tabla nueva).

### 2026-11-02: Phaser.js descartado — React puro con Framer Motion
**Qué pasó**: El blueprint original proponía Phaser.js para las actividades interactivas. En la implementación real, descubrimos que React + Framer Motion + SVG + Canvas nativo cubren los 16 tipos de actividad sin necesidad de un motor de juegos externo.
**Decisión**: Todas las actividades se implementaron como componentes React puros: SVG para trazado (PhonicsTrace), Canvas overlay para dibujo, Framer Motion para drag-and-drop y animaciones, CSS animations para feedback visual.
**Impacto**: Bundle 600KB más ligero, sin dependencia de Phaser, mejor integración con el ecosistema React, y toque responsivo en iPad.

### 2026-11-02: v2.0 — 6 nuevas funcionalidades con arquitectura de agentes paralelos
**Qué pasó**: Se implementaron 6 funcionalidades grandes en una sola sesión usando agentes fork en paralelo: TTS, SVG, Cuentos, Piano, Matemáticas y Escritura libre.
**Decisiones técnicas**:
- **TTS**: Web Speech API nativa (no librería externa). Funciona offline en iPad Safari con voces del sistema. Mapas fonéticos por letra para pronunciación correcta en ES/EN.
- **Piano**: Síntesis con Web Audio API (4 osciladores con ADSR envelope). No se usa Tone.js ni librerías de audio. 28 canciones codificadas como arrays de {note, duration}.
- **Matemáticas**: 47 actividades en `mathCurriculum.ts` separado de `curriculum.ts` para mantener modularidad. 3 nuevos tipos de actividad: counting, comparison, math_ops.
- **Cuentos**: 6 historias en `stories.ts` con estructura StoryDef (pages + questions). Integración con TTS para lectura en voz alta.
- **SVG**: 70+ ilustraciones como funciones TypeScript que retornan JSX. Helpers compartidos (drawEyes, drawSmile, drawBlush) para consistencia visual.
- **Escritura libre**: Canvas 2D con evento touch/pointer. Letra modelo como SVG translúcido debajo del canvas.
**Integración**: Los 6 nuevos tipos se añadieron a `ActivityType` union en `types/index.ts`, los casos en `Activity.tsx`, pasos en `tutorial.ts`, traducciones en `i18n.ts`, y actividades en `curriculum.ts`.
**Impacto**: De 10 a 16 tipos de actividad, de 6 a 7 mundos. Bundle 653→727 KiB. 14 tests mantienen verde.

### 2026-11-02: Service Worker impide actualizaciones en iPad
**Qué pasó**: Tras desplegar v2.0, el iPad seguía mostrando la versión anterior. El Service Worker (Workbox, registerType: 'autoUpdate') cacheaba los archivos y no detectaba los cambios del nuevo build.
**Solución**: Instruir al usuario a limpiar datos de Safari manualmente: Ajustes → Safari → Avanzado → Datos de sitios web → eliminar la entrada de la IP del servidor. Luego cerrar la PWA completamente y reabrir.
**Lección**: `registerType: 'autoUpdate'` NO garantiza actualización instantánea en iPad Safari. Siempre avisar al usuario de este paso tras un despliegue nuevo.

## Notas para Claude

- Cuando encuentres información nueva sobre la app, **actualiza este archivo** con lo descubierto.
- Mantén una actitud de profesor: explica el razonamiento detrás de cada decisión técnica.
- Prioriza siempre que el resultado final funcione **offline en iPad**.
- Si un comando de build/test cambia, actualízalo aquí inmediatamente.
- **Ante cada decisión arquitectónica importante o error corregido**, añade una entrada en la sección "Lecciones aprendidas" con fecha, qué pasó y por qué se tomó esa decisión o corrección.
