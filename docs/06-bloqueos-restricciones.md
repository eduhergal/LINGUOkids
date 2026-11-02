# 06 — Bloqueos y restricciones

## Restricciones de contenido (free vs premium)

### Límite diario de actividades

- **Free tier**: máximo **3 actividades por día** (`3 activity daily limit`)
- Al alcanzar el límite → pantalla `SCREEN__SCREEN_TIME_LIMIT_REACHED`
- Los padres pueden ajustar el tiempo de pantalla en `SCREEN__SCREEN_TIME_SETTINGS`
- El contador se reinicia diariamente

### Contenido premium

- Actividades marcadas con `visibilityAreas` controlan dónde aparecen
- Áreas posibles: `search`, `dynamic_content`, `lessons`, `topics`, `offline`, `worlds`
- Contenido offline solo disponible para suscriptores: `upgrade to Lingokids Plus and download videos and favorite games to play offline`
- Videos y algunos juegos bloqueados para free tier

### Descarga offline

- Solo usuarios Plus pueden descargar: `aik taraf ke Lingokids Plus dan muat turun video serta permainan kegemaran anda untuk bermain secara offline`
- Gestión de espacio en disco: `PARENTS_DOWNLOADS_DISK_SPACE_LEFT`

## Parental gate (control de acceso parental)

### Ubicación
- `ParentalGateModal` — modal que bloquea acceso a secciones de padres
- Se activa al intentar acceder a: configuración, suscripción, enlaces externos, sección de padres

### Implementación
- `NativeTouchEventControllerModule` — probablemente implementa un patrón de toque especial (ej: arrastrar un dedo mientras se toca otro punto)
- Interacción diseñada para ser difícil de realizar por niños pequeños

### Secciones protegidas
- `PARENTS_HOME` — área completa de padres
- `PARENTS_SETTINGS_STUDENT_PROFILE` — configuración del perfil
- `MANAGE_SUBSCRIPTION` — gestión de suscripción
- `SCREEN_TIME_SETTINGS` — configuración de tiempo de pantalla
- `HELP_CENTER` — centro de ayuda
- Cualquier enlace externo (browser, email)

## Restricciones de tiempo de pantalla

### Configuración por padres
- `SCREEN__SCREEN_TIME_SETTINGS` — pantalla de configuración
- `SESSION_INACTIVITY_SECONDS = "300"` — timeout de inactividad (5 min)
- `5 dakika daha oyna` — "juega 5 minutos más" (opción de extensión)

### Comportamiento al alcanzar límite
1. Se muestra `SCREEN_TIME_LIMIT_REACHED`
2. El juego/actividad se detiene
3. Se requiere intervención del padre para continuar

## Feature flags (GrowthBook)

- **Host**: `https://cdn.growthbook.io`
- **Client Key**: `sdk-RO0bGRwMOwZohfio`

Los feature flags controlan remotamente:
- Qué pantallas de onboarding se muestran (A/B testing)
- Flujo de paywall (horizontal vs vertical)
- Contenido visible en el feed
- Ofertas de churn deflection
- Funcionalidades experimentales

### Flags detectados por prefijo `EXP_`

- `EXP_ONBOARDING_*` — variantes experimentales de onboarding
- `EXP_POST_PURCHASE_*` — variantes del flujo post-compra
- `EXP_CHURN_DEFLECTION_*` — variantes de retención
- `xp_onboarding_path_selection_rebranding` — path selection experiment

## Verificación de suscripción

### Flujo
1. App consulta API: `https://api.lingokids.com/v1/...` (endpoint exacto en bytecode)
2. Verifica `subscriptionState` del usuario
3. Chequea `Original Purchase Date` y fecha de expiración
4. Valida con Google Play Billing / Apple receipt

### Compras in-app
- Google Play Billing v9.1.0 (`com.android.billingclient`)
- `buildPurchaseRequest` — construye request de compra
- `postPurchaseFlowCompleted` — callback de compra exitosa
- `getBillingChoiceInfoAndroid` — info de billing

### Fallback
- `STARTUP_API_REQUEST_TIMEOUT` — timeout en verificación inicial
- `ONBOARDING_CONNECTION_ERROR_MODAL` — error de conexión
- Probablemente permite uso offline limitado si la verificación falla

## Encriptación de contenido

- `encryptionKeyUuid` en JSON de actividad — clave de encriptación por actividad
- Algoritmos: `AES-GCM`, `aes-256-cfb`, `aes-128-cfb`
- `cleanupDecryptedFiles` — limpieza de archivos desencriptados
- `encryptionTimeMs` — medición de performance de desencriptación
- Propósito: proteger AssetBundles de Unity contra extracción directa

## Restricciones de red

### Network Security Config
- `@xml/network_security_config` — configuración de seguridad de red
- Probablemente restringe certificate pinning y cleartext traffic

### Conectividad
- `com.reactnativecommunity.netinfo` — monitoreo de estado de red
- Comportamiento offline: la app funciona con contenido descargado
- Verificación de conectividad antes de descargar nuevo contenido

## Restricciones de plataforma

### Android
- Min SDK 24 (Android 7.0) — no funciona en Android <7
- OpenGL ES 2.0 requerido — necesario para Unity
- No soporta split-screen (`resizeableActivity="false"`)

### Multi-ventana
- `NativeMultiWindowModule` existe pero `resizeableActivity="false"`
- Samsung DeX: dimensiones 0×0 (no adaptado)

## App Restrictions (MDM)

```xml
<meta-data
    android:name="android.content.APP_RESTRICTIONS"
    android:resource="@xml/app_restrictions"/>
```

La app soporta **managed configurations** para entornos empresariales/educativos (Google Family Link, MDM corporativo). Esto permite:
- Control externo de restricciones
- Configuración remota por administradores
- Políticas de uso en escuelas/instituciones

## Resumen de niveles de bloqueo

| Nivel | Mecanismo | Qué bloquea |
|-------|-----------|-------------|
| 1. Free tier | Contador diario (3 act) | Actividades extra tras el límite |
| 2. Premium gate | Verificación suscripción | Contenido premium, descargas offline |
| 3. Parental gate | Touch pattern modal | Sección padres, config, links externos |
| 4. Screen time | Timer configurable | Todo tras tiempo límite |
| 5. Feature flags | GrowthBook remoto | Features experimentales, UI variants |
| 6. Encryption | AES-GCM/CFB | AssetBundles protegidos |
| 7. API auth | Token + session | Acceso a datos del servidor |
| 8. MDM | App Restrictions | Control institucional externo |
