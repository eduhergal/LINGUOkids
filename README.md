# 🎓 LINGUOkids

**App educativa interactiva para niños de 2 a 8 años** — aprendizaje de letras, números, colores, animales, alimentos, música, matemáticas, cuentos y escritura a través de juegos táctiles diseñados para iPad.

[![TypeScript](https://img.shields.io/badge/TypeScript-7.0-blue)]()
[![React](https://img.shields.io/badge/React-19-61dafb)]()
[![PWA](https://img.shields.io/badge/PWA-Offline--First-green)]()
[![Vite](https://img.shields.io/badge/Vite-8-646cff)]()

---

## 📋 Índice

- [Descripción](#-descripción)
- [Características principales](#-características-principales)
- [Mundos y currículo](#-mundos-y-currículo)
- [Tipos de actividad](#-tipos-de-actividad)
- [Temas visuales](#-temas-visuales)
- [Gamificación](#-gamificación)
- [Sistema pedagógico](#-sistema-pedagógico)
- [Tecnología](#-tecnología)
- [Instalación](#-instalación)
- [Despliegue en iPad](#-despliegue-en-ipad)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Comandos](#-comandos)
- [Roadmap](#-roadmap)

---

## 🎯 Descripción

LINGUOkids es una **PWA (Progressive Web App)** educativa que funciona **100% offline** en iPad. Inspirada en las mejores prácticas pedagógicas de apps como Linguokids y Duolingo ABC, ofrece un entorno seguro, sin anuncios y sin suscripciones donde los niños aprenden jugando.

### Filosofía

- **Aprender jugando**: cada actividad es un juego interactivo con feedback inmediato
- **Sin barreras**: todo el contenido es accesible sin límites ni pagos
- **Offline-first**: funciona sin conexión a internet después de la primera carga
- **Seguro para niños**: sin anuncios, sin enlaces externos, con puerta parental
- **Bilingüe**: interfaz y contenido en español e inglés

---

## ✨ Características principales

### Para niños
| Característica | Descripción |
|---|---|
| **16 tipos de juegos** | Trazado, identificación, parejas, memoria, colorear, arrastrar, construir palabras, buscar, mostrar y contar, ordenar, piano interactivo, contar objetos, comparar grupos, operaciones matemáticas, cuentos interactivos, escritura libre |
| **7 mundos temáticos** | ABC (A-Z), Números (1-20), Colores, Animales, Comida, Música, Matemáticas |
| **Audio TTS** | Pronunciación de letras, números y palabras con Web Speech API (funciona offline en iPad) |
| **Cuentos interactivos** | 6 historias bilingües con ilustraciones, lectura en voz alta y quiz de comprensión |
| **Piano interactivo** | Teclado de 2 octavas con 28 canciones infantiles y modo libre |
| **Escritura libre** | Canvas de dibujo con modelo de letra superpuesto, 6 colores y 3 grosores |
| **3 temas visuales** | Bosque Mágico, Aventura Cósmica, Jardín Encantado |
| **Mascota guía** | Cada tema tiene una mascota animada con frases de ánimo |
| **Dificultad adaptativa** | Se ajusta automáticamente según el rendimiento del niño |
| **Tutorial interactivo** | Primera vez en cada actividad: guía paso a paso con animaciones |
| **Celebraciones** | Confetti, estrellas animadas, sonidos de victoria y vibración |
| **Progreso visual** | Árbol de frutos / órbita planetaria / flor de pétalos según el tema |

### Para padres
| Característica | Descripción |
|---|---|
| **Puerta parental** | Operación matemática para acceder a configuración |
| **Reporte semanal** | Gráfico de actividades por día, desglose por tema, puntuación media |
| **Recomendaciones inteligentes** | Detecta temas débiles y sugiere áreas de práctica |
| **Múltiples perfiles** | Hasta varios niños con progreso independiente |
| **Control de tiempo** | Temporizador visual de reloj de arena |
| **Selector de tema** | Personaliza la experiencia visual del niño |
| **Favoritos** | Los niños pueden marcar sus actividades preferidas |

---

## 🌍 Mundos y currículo

La app organiza el contenido en **7 mundos**, cada uno con temas, unidades y lecciones progresivas:

### 🔤 ABC — El Alfabeto (A-Z)
- **26 letras** con actividades de trazado e identificación
- Cada letra incluye: trazar con el dedo, identificar entre distractores similares
- Distractores inteligentes: letras visualmente parecidas (B↔D, M↔N, P↔R)
- Paths SVG vectoriales para trazado preciso

### 🔢 123 — Los Números (1-20)
- **20 números** con trazado y reconocimiento
- Paths SVG para cada número incluyendo doble dígito (10-20)
- Progresión natural: unidades simples → números compuestos

### 🎨 Colores
- **10 colores**: rojo, azul, verde, amarillo, naranja, morado, rosa, marrón, blanco, negro
- Actividades: colorear figuras, emparejar color-nombre, memory de colores, arrastrar a zonas de color

### 🐾 Animales
- **12 animales**: perro, gato, pez, pájaro, caballo, vaca, cerdo, oveja, rana, mariposa, león, elefante
- Actividades: emparejar animal-nombre, mostrar y contar, buscar en escena, ordenar por tamaño

### 🍎 Comida
- **12 alimentos**: manzana, plátano, naranja, uva, zanahoria, tomate, leche, pan, queso, huevo, arroz, agua
- Actividades: emparejar, construir palabras, arrastrar a categorías (frutas/verduras/lácteos)

### 🎵 Música
- **10 instrumentos**: piano, guitarra, violín, tambor, flauta, trompeta, arpa, xilófono, maracas, pandereta
- **Piano interactivo**: teclado de 2 octavas con síntesis Web Audio
- **28 canciones infantiles** + 3 K-pop con notas cayendo estilo Guitar Hero
- Actividades: emparejar instrumento-nombre, buscar en escena, tocar piano libre

### 🧮 Matemáticas (NUEVO)
- **47 actividades** organizadas en 8 temas progresivos
- **Contar (1-20)**: tocar objetos uno a uno para contar
- **Más o menos**: comparar dos grupos y elegir el mayor/menor
- **Sumas**: operaciones visuales con emojis (1+1 hasta 4+6)
- **Restas**: operaciones visuales (3-1 hasta 10-4)
- **Multiplicación**: tablas básicas visuales (2×2 hasta 5×5)
- **División**: divisiones sencillas (4÷2 hasta 20÷5)
- Adaptado por edades: 2-4 años (contar), 4-6 (sumas/restas), 6-8 (multiplicar/dividir)

### 📖 Cuentos interactivos (NUEVO)
- **6 historias bilingües** (una por mundo original)
- Páginas con fondos gradiente e ilustraciones emoji
- Botón **Aa** para alternar mayúsculas/minúsculas
- Botón **🔊** para lectura en voz alta (Web Speech API)
- **Quiz de comprensión** al final de cada cuento
- Cuentos: La aventura de la A, Los tres ositos, El arcoíris mágico, La granja divertida, La ensalada gigante, La orquesta del bosque

### ✏️ Escritura libre (NUEVO)
- **Canvas de dibujo** a pantalla completa
- **Letra modelo** translúcida de fondo para practicar
- **6 colores** y **3 grosores** de línea
- Botones de **deshacer**, **borrar** y **listo**
- Transición natural del trazado guiado a la escritura independiente

---

## 🎮 Tipos de actividad

### 1. ✍️ Trazado de letras (phonics_trace)
El niño traza letras y números con el dedo sobre paths SVG. Detecta la precisión del trazo y da feedback visual en tiempo real.

### 2. 🔍 Identificación fonética (phonics_identify)
Se muestra una letra objetivo y varias opciones. El niño debe identificar la correcta entre distractores visualmente similares.

### 3. 🃏 Parejas (matching)
Emparejar imágenes con sus nombres escritos. Usa drag-and-drop táctil optimizado para dedos pequeños.

### 4. 🧠 Memory Cards (memory_cards)
Juego clásico de memoria: voltear cartas para encontrar parejas. Entrena la memoria visual y la concentración.

### 5. 🎨 Colorear (coloring)
Seleccionar un color y tocar una figura para colorearla. Trabaja reconocimiento de colores y motricidad fina.

### 6. ✋ Arrastrar y soltar (drag_and_drop)
Clasificar elementos arrastrándolos a la zona correcta (ej: frutas en un grupo, verduras en otro).

### 7. 🔠 Construir palabras (word_builder)
Se muestran letras desordenadas y el niño debe tocarlas en orden para formar la palabra correcta.

### 8. 🔎 I Spy — Buscar (i_spy)
En una escena con varios objetos, el niño debe encontrar los elementos indicados.

### 9. 🎤 Mostrar y contar (show_and_tell)
Se presenta un objeto y el niño aprende su nombre en ambos idiomas con interacción táctil.

### 10. 📊 Ordenar (sorting)
Colocar elementos en el orden correcto (alfabético, numérico o por tamaño).

### 11. 🎹 Piano interactivo (piano)
Teclado de 2 octavas con síntesis de sonido Web Audio API. Modo canciones con notas cayendo (Guitar Hero) y modo libre para tocar lo que quieran. 28 canciones infantiles populares.

### 12. 🔢 Contar objetos (counting)
Objetos emoji dispersos en pantalla que el niño toca uno a uno. Contador visual grande que sube con cada toque. Celebración al llegar al número objetivo.

### 13. ⚖️ Comparar grupos (comparison)
Dos grupos de objetos lado a lado. El niño debe elegir cuál tiene más (o menos). Desarrolla sentido numérico y estimación visual.

### 14. 🧮 Operaciones matemáticas (math_ops)
Problemas visuales de suma, resta, multiplicación y división con emojis. 3 opciones de respuesta. Feedback inmediato con visualización del resultado.

### 15. 📖 Cuentos interactivos (story)
Historias de 4-5 páginas con fondos coloridos, emojis grandes y texto bilingüe. Navegación por swipe o flechas. Lectura en voz alta con TTS. Quiz de comprensión al final.

### 16. ✏️ Escritura libre (free_write)
Canvas de dibujo con modelo de letra translúcido de fondo. El niño escribe encima con el dedo. Paleta de colores y grosores. Transición del trazado guiado a escritura independiente.

---

## 🎨 Temas visuales

Los niños pueden elegir entre 3 temas que transforman toda la experiencia visual:

### 🌲 Bosque Mágico
- **Paleta**: verdes y dorados naturales
- **Mascota**: Búho Sabi 🦉 — sabio y paciente
- **Progreso**: árbol que crece frutos dorados
- **Frases**: "¡Sabiduría del bosque!", "¡El búho está orgulloso!"

### 🚀 Aventura Cósmica
- **Paleta**: morados y azules cósmicos
- **Mascota**: Alien Zip 👾 — divertido y energético
- **Progreso**: órbita planetaria con planetas que aparecen
- **Frases**: "¡Exploración galáctica!", "¡Viajando a las estrellas!"

### 🌸 Jardín Encantado
- **Paleta**: rosas y verdes primaverales
- **Mascota**: Mariposa Lila 🦋 — dulce y animadora
- **Progreso**: flor que crece pétalos coloridos
- **Frases**: "¡Tu jardín florece!", "¡Las flores aplauden!"

Cada tema personaliza: gradientes de fondo, colores de botones, navegación inferior, colores de gráficos de progreso, y frases de ánimo de la mascota.

---

## 🏆 Gamificación

| Elemento | Descripción |
|---|---|
| **Estrellas** | 1-3 estrellas por actividad según rendimiento |
| **Meta semanal** | Objetivo de actividades por semana con barra de progreso |
| **Racha semanal** | Contador de semanas consecutivas cumpliendo la meta |
| **Confetti** | Explosión de partículas al completar actividades |
| **Sonidos** | Tonos musicales generados con Web Audio API (sin archivos MP3) |
| **Vibración** | Feedback háptico en dispositivos compatibles |
| **Mascota animada** | Frases de ánimo contextuales con animación bounce |
| **Mensajes constructivos** | "¡Casi! Prueba otra vez" en vez de "Incorrecto" |
| **Dificultad adaptativa** | 3 niveles que se ajustan según las últimas 10 puntuaciones |

---

## 🧠 Sistema pedagógico

### Dificultad adaptativa
El sistema analiza las últimas 10 actividades completadas:
- **Promedio ≥ 2.5 estrellas** → Nivel 3 (más opciones, menos tiempo)
- **Promedio ≥ 1.5 estrellas** → Nivel 2 (dificultad media)
- **Promedio < 1.5 estrellas** → Nivel 1 (más ayuda, menos opciones)

### Tutorial interactivo
La primera vez que un niño abre cualquier tipo de actividad, se muestra un tutorial de 2 pasos con:
- Emoji animado que ilustra la interacción
- Texto bilingüe (español/inglés)
- Opción de saltar ("Ya sé") o seguir paso a paso

### Feedback constructivo
- Respuesta correcta: tono alegre + vibración suave + mensaje positivo
- Respuesta incorrecta: mensajes de ánimo aleatorios ("¡Casi! Inténtalo de nuevo", "¡Tú puedes! Prueba otra vez")
- Nunca se muestra "Incorrecto" o mensajes negativos

### Reporte para padres
- Gráfico de barras de actividades por día de la semana
- Desglose por mundo con conteo y puntuación media
- Recomendaciones automáticas (temas débiles, mundos no explorados)
- Estadísticas: total de actividades, tiempo, puntuación media, racha

---

## 🛠 Tecnología

| Componente | Tecnología |
|---|---|
| **Framework UI** | React 19 + TypeScript 7 |
| **Bundler** | Vite 8 |
| **Animaciones** | Framer Motion 14 |
| **Base de datos** | Dexie.js 4 (IndexedDB) |
| **Audio** | Howler.js 2 + Web Audio API + Web Speech API (TTS) |
| **PWA/Offline** | vite-plugin-pwa + Workbox |
| **Routing** | React Router 7 |
| **Testing** | Vitest 5 + Testing Library |
| **Gráficos** | SVG nativo + Canvas API |

### Arquitectura

```
React 19 (UI declarativa)
├── Framer Motion (animaciones, drag-and-drop)
├── SVG (trazado de letras, progreso visual)
├── Canvas API (confetti, dibujo)
├── Web Audio API (tonos sintetizados)
├── Dexie/IndexedDB (persistencia local)
└── Service Worker (caché offline)
```

### Bundle
- **Tamaño total**: ~727 KiB (30 archivos precacheados)
- **Code splitting**: React.lazy + Suspense para cada pantalla
- **Offline**: Service Worker cachea todos los assets en la primera carga

---

## 📦 Instalación

### Requisitos
- Node.js 18+ y npm

### Pasos

```bash
# Clonar el repositorio
git clone https://github.com/TU_USUARIO/LINGUOkids.git
cd LINGUOkids/app

# Instalar dependencias
npm install

# Modo desarrollo (hot reload)
npm run dev

# Ejecutar tests
npm test

# Build de producción
npm run build

# Preview del build
npm run preview
```

---

## 📱 Despliegue en iPad

### Requisitos
- PC y iPad en la **misma red WiFi**
- Safari en iPad (obligatorio para PWA)

### Pasos

1. **Build de producción**:
   ```bash
   cd app && npm run build
   ```

2. **Levantar servidor local**:
   ```bash
   npx serve dist -l 3000
   ```

3. **Averiguar IP local del PC**:
   - Windows: `ipconfig` → buscar IPv4 de WiFi
   - Mac/Linux: `ifconfig` o `ip addr`

4. **En iPad Safari**: navegar a `http://TU_IP:3000`

5. **Añadir a pantalla de inicio**:
   - Tocar botón Compartir (↑)
   - Seleccionar "Añadir a pantalla de inicio"
   - Nombrar "LINGUOkids" → Añadir

6. **¡Listo!** La app funciona offline desde el icono de la pantalla de inicio.

> **Nota**: El servidor solo se necesita para la carga inicial y para actualizaciones posteriores. Después, la PWA es autónoma.

---

## 📁 Estructura del proyecto

```
LINGUOkids/
├── app/                          # Código fuente de la PWA
│   ├── public/                   # Assets estáticos
│   │   ├── icons/                # Iconos PWA (192x192, 512x512)
│   │   └── manifest.webmanifest  # Manifest PWA
│   ├── src/
│   │   ├── activities/           # 16 tipos de actividad
│   │   │   ├── Coloring/
│   │   │   ├── Comparison/       # Comparar grupos (NUEVO)
│   │   │   ├── Counting/         # Contar objetos (NUEVO)
│   │   │   ├── DragAndDrop/
│   │   │   ├── FreeWrite/        # Escritura libre (NUEVO)
│   │   │   ├── ISpy/
│   │   │   ├── Matching/
│   │   │   ├── MathOps/          # Operaciones matemáticas (NUEVO)
│   │   │   ├── MemoryCards/
│   │   │   ├── PhonicsIdentify/
│   │   │   ├── PhonicsTrace/
│   │   │   ├── Piano/            # Piano interactivo (NUEVO)
│   │   │   ├── ShowAndTell/
│   │   │   ├── Sorting/
│   │   │   ├── Story/            # Cuentos interactivos (NUEVO)
│   │   │   └── WordBuilder/
│   │   ├── components/           # Componentes reutilizables
│   │   │   ├── BottomNav/
│   │   │   ├── Confetti/
│   │   │   ├── Mascot/
│   │   │   ├── ParentalGate/
│   │   │   ├── ProgressVisual/
│   │   │   ├── SandTimer/
│   │   │   ├── ScreenTimeModal/
│   │   │   ├── StreakBadge/
│   │   │   ├── SvgIllustration/  # Ilustraciones SVG Disney Pixar (NUEVO)
│   │   │   └── TutorialOverlay/
│   │   ├── data/                 # Currículo y contenido
│   │   │   ├── curriculum.ts     # 7 mundos, ~200+ actividades
│   │   │   ├── mathCurriculum.ts # Mundo Mates: 8 temas, 47 actividades
│   │   │   └── stories.ts       # 6 cuentos bilingües con quiz
│   │   ├── db/                   # Base de datos IndexedDB
│   │   │   └── database.ts       # Dexie v4, 8 tablas, 3 migraciones
│   │   ├── hooks/                # React hooks personalizados
│   │   ├── screens/              # Pantallas principales
│   │   │   ├── Activity/         # Pantalla de juego (16 tipos)
│   │   │   ├── ChildSelect/      # Selección de perfil
│   │   │   ├── Favorites/        # Actividades favoritas
│   │   │   ├── Home/             # Pantalla principal
│   │   │   ├── Lessons/          # Navegación de mundos
│   │   │   ├── Onboarding/       # Registro (4 pasos)
│   │   │   ├── Progress/         # Reporte semanal
│   │   │   └── Settings/         # Zona de padres
│   │   ├── services/             # Lógica de negocio
│   │   │   ├── adaptiveDifficulty.ts
│   │   │   ├── audio.ts
│   │   │   ├── favorites.ts
│   │   │   ├── feedback.ts
│   │   │   ├── gamification.ts
│   │   │   ├── i18n.ts
│   │   │   ├── profiles.ts
│   │   │   ├── progress.ts
│   │   │   ├── screenTime.ts
│   │   │   ├── tts.ts            # Text-to-Speech bilingüe (NUEVO)
│   │   │   └── tutorial.ts
│   │   ├── styles/               # CSS global y tokens
│   │   ├── themes/               # Sistema de 3 temas
│   │   │   ├── themes.ts         # Definiciones de temas
│   │   │   └── ThemeContext.tsx   # Provider React
│   │   └── types/                # Tipos TypeScript
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── docs/                         # Documentación del proyecto
│   ├── GUIA-PADRES.md            # Guía de uso para padres
│   └── blueprint/                # Blueprint de reconstrucción
└── CLAUDE.md                     # Contexto del proyecto
```

---

## ⌨️ Comandos

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con hot reload |
| `npm run build` | Build de producción (genera `dist/`) |
| `npm run preview` | Preview local del build |
| `npm test` | Ejecutar tests (Vitest) |
| `npm run test:watch` | Tests en modo watch |
| `npm run lint` | Linter (oxlint) |

---

## 🗺 Roadmap

### Implementado en v2.0
- [x] Audio TTS: pronunciación de letras, números y palabras con Web Speech API
- [x] Ilustraciones SVG propias estilo Disney Pixar (70+ ilustraciones)
- [x] Cuentos interactivos bilingües con quiz de comprensión (6 historias)
- [x] Piano interactivo con 28 canciones infantiles y modo libre
- [x] Matemáticas: contar, comparar, sumar, restar, multiplicar, dividir (47 actividades)
- [x] Escritura libre: canvas con modelo de letra y herramientas de dibujo

### Próximas mejoras
- [ ] Assets reales: imágenes PNG de alta calidad por actividad
- [ ] Exportar reporte semanal a PDF
- [ ] Más tests de componentes
- [ ] Animaciones Lottie para celebraciones
- [ ] Modo nocturno/lectura
- [ ] Soporte para más idiomas (PT, FR)
- [ ] Más cuentos interactivos (uno por cada mundo Math)
- [ ] Actividades de ritmo musical
- [ ] Dictado de palabras con reconocimiento de voz

---

## 📄 Licencia

Proyecto educativo personal. No destinado a distribución comercial.

---

Hecho con ❤️ para los más pequeños.
