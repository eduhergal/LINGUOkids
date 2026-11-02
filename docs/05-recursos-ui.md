# 05 — Recursos de UI

## Fuentes tipográficas

| Fuente | Archivo | Uso |
|--------|---------|-----|
| Gotham Rounded Bold | `fonts/GothamRounded-Bold.otf` | Títulos, botones, elementos destacados |
| Gotham Rounded Medium | `fonts/GothamRounded-Medium.otf` | Texto general, descripciones |
| Lingokids v04 | `fonts/lingokidsv04.ttf` | Fuente de iconos propia (icon font) |
| FontAwesome | `fontawesome-webfont.ttf` | Iconos genéricos (fallback) |

> Gotham Rounded es una fuente comercial de Hoefler&Co. Para la réplica se necesitará una alternativa (Nunito, Quicksand, Varela Round).

## Dimensiones base de diseño

```
SIZE_MATTERS_BASE_WIDTH  = 375  (iPhone X width)
SIZE_MATTERS_BASE_HEIGHT = 812  (iPhone X height)
```

La app usa `react-native-size-matters` para escalar dimensiones proporcionalmente a estos valores base. El diseño está optimizado para iPhone X como referencia.

## Sistema de colores (extraídos del bytecode)

### Colores de marca

| Color | Hex | Uso probable |
|-------|-----|-------------|
| Amarillo principal | `#ffe252` | Background de actividad (bathroom_game) |
| Azul oscuro | `#0C123B` | Texto sobre fondos claros |
| Blanco translúcido | `#FFFFFFE0` | Labels de categoría |
| Naranja | `#ff6857` | CTAs, botones principales |
| Verde | `#5AC9FA` | Éxito, completado |
| Rosa | `#ff5870` | Favoritos, amor |
| Púrpura | `#7013f7` | Categoría |

### Colores de UI (selección de los strings)

```
#16313D  — texto oscuro alternativo
#2196F3  — azul Material (enlaces)
#54FDFF  — cyan claro
#FF0033  — error/peligro
#FFDF62  — amarillo/estrella
#00CE3F  — verde éxito
#FF4355  — rojo acción
```

## Animaciones

### Lottie
- **Librería**: `com.airbnb.lottie` (Lottie para Android)
- Usado para: celebraciones, transiciones, feedback visual
- `CELEBRATION_ANIMATION_SOURCE` — animación al completar actividad
- `fadeInAnimation` / `fadeOutAnimation` — transiciones

### APNG (Animated PNG)
- **Librería**: `com.github.penfeizhou.animation`
- Usado probablemente para stickers y personajes animados en el feed

### SVGs embebidos
Múltiples SVGs inline detectados en el bytecode para:
- Iconos de navegación
- Decoraciones de pantalla (waves, shapes)
- Elementos del onboarding
- Botones y badges

### Unity Animations
Los juegos usan el sistema de animación de Unity (Mecanim/Animation), no accesibles desde RN.

## Iconos

- **Icon font propio**: `lingokidsv04.ttf` — iconos personalizados de la app
- **FontAwesome**: iconos genéricos como fallback
- **SVGs inline**: iconos específicos de UI embebidos como strings en el bundle

## Layouts XML nativos

Recursos en `res/layout/`:
- Layouts de Activities nativos
- Splash screen
- Notificaciones custom
- WebView containers

Recursos en `res/drawable/`:
- Splash background
- Iconos de notificación
- Shapes y backgrounds

## Recursos por densidad

| Carpeta | Densidad | Uso |
|---------|----------|-----|
| `drawable-mdpi` | 1x | Tablets baja densidad |
| `drawable-hdpi` | 1.5x | Smartphones económicos |
| `drawable-xhdpi` | 2x | Smartphones medio |
| `drawable-xxhdpi` | 3x | Smartphones premium (APK split) |
| `drawable-xxxhdpi` | 4x | Tablets premium |
| `drawable-nodpi` | N/A | Assets independientes de densidad |
| `drawable-anydpi` | Vector | Drawables vectoriales |

## Imágenes del CDN

Las imágenes se sirven desde **imgix** con transformaciones dinámicas:
- `lingokids-ab0.imgix.net/{hash}` — thumbnails de actividades
- Imgix permite resize, crop, format en la URL

## Temas y estilos

### Light/Dark
No hay evidencia de soporte de dark mode en el análisis estático. La app probablemente solo usa un tema claro optimizado para niños.

### Styles XML
- `@style/AppTheme.NoActionBar` — tema principal
- `@style/SplashTheme` — tema de splash screen
- `@style/Braze.PushTrampoline.Transparent` — notificaciones Braze

## Assets de actividades (Unity)

Cada actividad embebida tiene:
- **Cover image** (`.jpg`): thumbnail para el feed/listado
- **AssetBundle principal**: escena Unity con sprites, animaciones, lógica
- **AssetBundle localizado** (`_en_us`): audio de instrucciones y texto por idioma
- **323 archivos** en `bin/Data/`: datos binarios de Unity (escenas, prefabs, materiales, shaders, texturas comprimidas)

## Responsive design

- **react-native-size-matters**: escalado proporcional desde base 375×812
- **react-native-safe-area-context**: respeto a safe areas (notch, home indicator)
- `android.notch_support = true` en manifest
- `resizeableActivity = false` — no soporta split-screen para evitar problemas con Unity
