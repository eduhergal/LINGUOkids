# 01 — Arquitectura de Linguokids

## Resumen ejecutivo

Linguokids v26.44.0 es una app **híbrida React Native + Unity3D** empaquetada como APK split.
La capa de navegación, UI de padres, onboarding y suscripciones corre en **React Native (Expo 55, Hermes engine)**.
Los juegos/actividades interactivas corren en un **player Unity embebido** como componente nativo de React Native.

## Stack tecnológico

| Capa | Tecnología | Evidencia |
|------|-----------|-----------|
| Framework | React Native (New Architecture habilitada) | `IS_NEW_ARCHITECTURE_ENABLED = true` en `BuildConfig.java` |
| Motor JS | Hermes (bytecode compilado) | `IS_HERMES_ENABLED = true`, magic bytes `c61fbc03` en bundle |
| Plataforma Expo | SDK 55.0.0 | `app.config` → `sdkVersion: "55.0.0"` |
| Motor de juegos | Unity3D (embebido como Activity) | `com.unity3d.player.*`, `UnityPlayerForActivityOrService` |
| Gráficos | OpenGL ES 2.0 (min), Vulkan (opcional) | `android:glEsVersion="0x20000"`, `android.hardware.vulkan` |
| Base de datos local | Realm (principal) + AsyncStorage (secundario) | Strings del bytecode: `Realm`, `asyncStorage` |
| Compilación nativa | Gradle (product flavors: production/staging × google/amazon) | `FLAVOR = "productionGoogle"` |

## Diagrama de capas

```
┌─────────────────────────────────────────────────────┐
│                   React Native Shell                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │
│  │Onboarding│ │  Paywall │ │  Parents │ │  Home  │ │
│  │  Screens │ │  Screens │ │  Section │ │  Feed  │ │
│  └──────────┘ └──────────┘ └──────────┘ └────────┘ │
│          │          │          │          │          │
│  ┌──────────────────────────────────────────────┐   │
│  │         React Navigation (Stack + Tab)        │   │
│  └──────────────────────────────────────────────┘   │
│                        │                             │
│  ┌─────────────────────┴───────────────────────┐    │
│  │           NativeRBridge (puente RN↔Unity)    │    │
│  │  callUnity() ──► UnitySendMessage()          │    │
│  │  callNative() ◄── Unity C# → Java → RN      │    │
│  └──────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────┤
│               Unity3D Engine (embebido)              │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐    │
│  │  Phonics │ │ Matching │ │ Tracing / Drawing │    │
│  │  Scene   │ │  Scene   │ │     Scene         │    │
│  └──────────┘ └──────────┘ └──────────────────┘    │
│          │          │               │                │
│  ┌──────────────────────────────────────────────┐   │
│  │     ActivityPrefabScene (cargador genérico)   │   │
│  │     Carga AssetBundles según JSON descriptor  │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

## Componentes clave del lado nativo (Java/Kotlin)

### Paquete `es.monkimun.lingokids`

| Clase | Rol |
|-------|-----|
| `MainActivity` | Activity principal. Extiende `ReactActivity`. Inicializa Unity Player en `onCreate()`. Componente RN: `"Lingokids"` |
| `MainApplication` | Application class. Configura módulos nativos RN |
| `UnityViewManager` | `SimpleViewManager<UnityView>` — expone `<UnityView>` como componente React con prop `activityJson` |
| `NativeRBridgeModule` | Puente bidireccional RN↔Unity. `callUnity(method, params)` envía a Unity via `UnitySendMessage("NativeListener", ...)`. `callNative(event, json)` recibe eventos de Unity y los propaga a listeners RN |
| `RBridge` | Wrapper estático invocado desde el lado Unity (C#) para llamar de vuelta a RN |
| `NativeAssetReaderModule` | Lee assets del APK desde JS: `readDir()`, `readFile()`, `copyFile()`, `exists()` |
| `NativeSplashModule` | Control de splash screen |
| `NativeTouchEventControllerModule` | Gestión de eventos táctiles (posiblemente para el parental gate) |
| `NativeMultiWindowModule` | Soporte multi-ventana (Samsung DeX) |
| `NativeIntentExtrasModule` | Lee extras del intent de lanzamiento (deep links) |
| `NativeDebugUtilsModule` | Utilidades de debug |
| `KeychainModule` | Almacenamiento seguro de credenciales |
| `DeviceSettingsModule` | Lectura de configuración del dispositivo |
| `ScreenSettingsModule` | Control de orientación/brillo de pantalla |
| `EmailLauncherModule` | Lanzar cliente de email |
| `GoogleAdsModule` | Integración con Google Ads |
| `BrazeInAppMessageModule` | In-app messages de Braze |
| `NotificationsModule` | Push notifications (integra Braze + Notifee) |
| `BrazeBroadcastReceiver` | Receptor de broadcasts de Braze |

## Comunicación RN ↔ Unity

El puente es **bidireccional asíncrono basado en JSON**:

### RN → Unity
```
JS llama NativeRBridge.callUnity(methodName, paramsMap)
  → Java convierte ReadableMap a JSONObject
  → UnityPlayer.UnitySendMessage("NativeListener", methodName, json)
  → Unity C# recibe en GameObject "NativeListener"
```

### Unity → RN
```
Unity C# llama RBridge.callNative(eventName, jsonString)
  → Java estático parsea JSON
  → Itera sobre CopyOnWriteArraySet<UnityEventListener>
  → Cada UnityView (React component) recibe el evento como `onEvent` prop
```

### Prop `activityJson`
Cuando RN quiere lanzar una actividad Unity, pasa el JSON descriptor completo como prop:
```jsx
<UnityView activityJson={JSON.stringify(activityDescriptor)} onEvent={handleUnityEvent} />
```

## Estructura del APK

```
base.apk (100 MB)
├── classes.dex, classes2.dex, classes3.dex  (código Java/Kotlin)
├── assets/
│   ├── index.android.bundle       (13 MB — bytecode Hermes)
│   ├── app.config                 (configuración Expo)
│   ├── activities/                (3 actividades embebidas)
│   │   ├── bathroom_game.json + bathroom_game/ + bathroom_game_en_us/
│   │   ├── game_dressupparty_disney_mickey_costumes.*
│   │   └── game_uniquebuilder_disney_zootopia_cluehunt.*
│   ├── bin/Data/                  (323 archivos Unity: escenas, prefabs, shaders)
│   ├── fonts/                     (GothamRounded-Bold/Medium, lingokidsv04.ttf)
│   └── braze-html-*.js            (puentes Braze in-app)
├── res/                           (recursos Android: layouts, drawables, strings)
├── lib/                           (librerías nativas: arm64-v8a)
└── AndroidManifest.xml

split_config.arm64_v8a.apk (128 MB) — librerías nativas ARM64 (Unity, Hermes, etc.)
split_config.en.apk (73 KB)        — recursos de idioma inglés
split_config.xxhdpi.apk (6.6 MB)   — recursos gráficos xxhdpi
```

## Dependencias React Native detectadas

| Módulo | Paquete Java | Función |
|--------|-------------|---------|
| react-native-screens | `com.swmansion.rnscreens` | Navegación nativa de pantallas |
| react-native-gesture-handler | `com.swmansion.gesturehandler` | Gestos (swipe, pinch, etc.) |
| react-native-svg | `com.horcrux.svg` | Renderizado SVG |
| react-native-linear-gradient | `com.p366BV.LinearGradient` | Gradientes |
| react-native-webview | `com.reactnativecommunity.webview` | WebViews (paywall, parents) |
| react-native-community/netinfo | `com.reactnativecommunity.netinfo` | Estado de red |
| react-native-community/cameraroll | `com.reactnativecommunity.cameraroll` | Acceso a galería |
| react-native-community/slider | `com.reactnativecommunity.slider` | Controles deslizantes |
| react-native-community/picker | `com.reactnativecommunity.picker` | Selectores |
| react-native-device-info | `com.learnium.RNDeviceInfo` | Info del dispositivo |
| react-native-config | `com.lugg.RNCConfig` | Variables de entorno |
| react-native-safe-area-context | `com.th3rdwave.safeareacontext` | Safe areas |
| react-native-localize | `com.zoontek.rnlocalize` | Localización |
| react-native-permissions | `com.zoontek.rnpermissions` | Gestión de permisos |
| react-native-quick-base64 | `com.reactnativequickbase64` | Encoding base64 |
| react-native-quick-crypto | `com.margelo.quickcrypto` | Criptografía |
| react-native-apple-authentication | `com.RNAppleAuthentication` | Auth Apple |
| react-native-google-signin | `com.reactnativegooglesignin` | Auth Google |
| react-native-video (ExoPlayer) | `com.brentvatne.exoplayer` | Reproducción de video |
| lottie-react-native | `com.airbnb.lottie` | Animaciones Lottie |
| react-native-apng | `com.github.penfeizhou.animation` | Animaciones APNG |
| expo-audio | (plugin Expo) | Grabación/reproducción audio |
| expo-image | (plugin Expo) | Carga de imágenes optimizada |
| expo-filesystem | `expo.modules.filesystem` | Sistema de archivos |

## Patrones arquitectónicos observados

1. **Feature flags con GrowthBook**: `GROWTHBOOK_CLIENT_KEY = "sdk-RO0bGRwMOwZohfio"` — las features se controlan remotamente
2. **New Architecture RN habilitada**: Fabric renderer + TurboModules (confirma que es una app moderna y activamente mantenida)
3. **Realm como DB principal**: Almacena datos de usuario, progreso, actividades descargadas
4. **Unity como "micro-frontend"**: Cada actividad es una escena Unity autocontenida, cargada dinámicamente via AssetBundles
5. **Offline-first**: El módulo `NativeAssetReader` permite a JS leer assets locales; las actividades se descargan y cachean

## Implicaciones para la réplica

- La **shell** (navegación, onboarding, padres) se puede replicar con cualquier framework web/móvil
- Los **juegos** son el reto: son escenas Unity con lógica C#, shaders, animaciones, físicas. Opciones:
  - **(a) Unity WebGL**: Exportar las escenas Unity como WebGL para correr en un wrapper web (iPad Safari)
  - **(b) HTML5 Canvas**: Re-implementar cada tipo de actividad con Phaser/PixiJS/p5.js
  - **(c) Expo/RN nativo**: Re-implementar con React Native + animaciones + Canvas
- Para **offline en iPad**: PWA con Service Worker o app nativa con Capacitor/Expo
