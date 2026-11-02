# 07 — APIs y red

## Endpoints principales (de BuildConfig.java)

| Constante | URL | Uso |
|-----------|-----|-----|
| `API_URL` | `https://api.lingokids.com` | API REST principal |
| `API_VERSION` | `v1` | Versión de la API |
| `APP_URL` | `https://app.lingokids.com` | Web app / WebViews |
| `PING_URL` | `https://api.lingokids.com/whoami` | Health check / verificación de sesión |

Base URL completa de la API: **`https://api.lingokids.com/v1/`**

## CDN y servicios de contenido

| Servicio | URL | Uso |
|----------|-----|-----|
| Asset Bundles CDN | `ab0.lingokids.com` | AssetBundles de Unity (actividades) |
| Imgix CDN | `lingokids-ab0.imgix.net` | Imágenes/thumbnails con resize dinámico |
| Web Views | `app.lingokids.com/web_views/` | Contenido web embebido |
| Help Center | `help.lingokids.com/hc/en-us/` | Centro de ayuda (Zendesk) |
| Website | `www.lingokids.com` | Invitaciones, landing pages |
| Deep links | `lingokids.onelink.me` | AppsFlyer OneLink |

## URLs de AssetBundles (patrón)

```
https://ab0.lingokids.com/Activities/{activity_id}/assetBundles/{version}/{platform}/{bundle_name}
```

Ejemplo real del JSON:
```
https://ab0.lingokids.com/Activities/bathroom_game/assetBundles/26.25.0/Android/bathroom_game
https://ab0.lingokids.com/Activities/bathroom_game/assetBundles/26.25.0/Android/bathroom_game_en_us
https://ab0.lingokids.com/Activities/bathroom_game/assetBundles/26.25.0/iOS/bathroom_game
```

Plataformas: `Android`, `iOS`, `Editor`

## URLs de imágenes CDN (patrón imgix)

```
https://lingokids-ab0.imgix.net/{hash}
```

Hashes detectados (ejemplos):
- `qmmxwb21nt8gvqhs30puurce7dm3` (bathroom_game thumbnail)
- `5tuzptz9lphpk1cec00avpldt2n`
- `2sldwjf1kcyov3xtsmds2sa8r8b`
- `2f4nq9wcz9t8039qvr7vf5hmq77`
- `jmizsz7jrhbhntoh83bjvfgmlph1`
- `yh486gjclwaf55xjvqk0r1ia8a`
- `8omdfmn1tyzvowob4a9ctb73cef`

Imgix soporta parámetros de transformación en URL: `?w=300&h=200&fit=crop`

## URLs de streaming/video

Detectadas en el bytecode:
```
https://ab0.lingokids.com/{hash}/video.m3u8   (HLS streaming)
```

Videos probablemente usan HLS (HTTP Live Streaming) con archivos `.m3u8`.

## Servicios de terceros

### Analytics y tracking

| Servicio | Endpoint/Config | Uso |
|----------|----------------|-----|
| Firebase Analytics | (SDK, no REST) | Eventos, screen views |
| Sentry | `https://o25032.ingest.sentry.io/268779` | Crash reporting |
| Braze | `sdk.iad-03.braze.com` | CRM, push, in-app messaging |
| GrowthBook | `https://cdn.growthbook.io` (key: `sdk-RO0bGRwMOwZohfio`) | Feature flags |
| OneSignal | (ID: `6a1d2b62-7bbf-11e5-ba36-a0369f2d9328`) | Push notifications |
| Facebook SDK | (App ID: `554369828034348`) | Auth, attribution |
| Google Analytics | (Sender ID: `49597201864`) | Analytics |

### Autenticación

| Servicio | Config |
|----------|--------|
| Google Sign-In | Via `com.reactnativegooglesignin` |
| Apple Auth | Via `com.RNAppleAuthentication` |
| Facebook Login | App ID: `554369828034348`, Page ID: `497983453648415` |

### Billing

| Servicio | Versión/Config |
|----------|---------------|
| Google Play Billing | v9.1.0 |
| Stripe | (inferido de strings) |

### Localización

| Servicio | Config |
|----------|--------|
| Lokalise | Project ID: `151168365aa6413f25be95.26435868` |

## Endpoints API inferidos

Basándome en las strings del bytecode y patrones REST v1:

| Endpoint (inferido) | Método | Uso |
|---------------------|--------|-----|
| `/v1/whoami` | GET | Verificación de sesión |
| `/v1/auth/login` | POST | Login email/password |
| `/v1/auth/signup` | POST | Registro |
| `/v1/auth/magic-link` | POST | Enviar magic link |
| `/v1/auth/verify-email` | POST | Verificar email |
| `/v1/auth/social/{provider}` | POST | Login social (google/apple/fb) |
| `/v1/children` | GET/POST | Listar/crear perfiles de niños |
| `/v1/children/{id}` | GET/PUT | Detalle/actualizar niño |
| `/v1/children/{id}/progress` | GET | Progreso del niño |
| `/v1/activities` | GET | Catálogo de actividades |
| `/v1/activities/{id}` | GET | Detalle de actividad |
| `/v1/lessons` | GET | Lecciones disponibles |
| `/v1/feeds` | GET | Feeds dinámicos (home) |
| `/v1/subscriptions` | GET/POST | Estado de suscripción |
| `/v1/subscriptions/validate` | POST | Validar receipt |
| `/v1/recommendations` | GET | Recomendaciones personalizadas |
| `/v1/downloads` | GET | Lista de descargas offline |

> **Nota**: Estos endpoints son inferidos del análisis estático. El análisis dinámico (Fase 2) los confirmará con tráfico real.

## Headers probables

```http
Authorization: Bearer {jwt_token}
Content-Type: application/json
Accept: application/json
X-App-Version: 26.44.0
X-Platform: android
X-Device-Id: {uuid}
X-Locale: en-US
```

## Invitaciones (URLs completas detectadas)

```
https://www.lingokids.com/invitation?adgroup={channel}&user_id=#USERID#
https://www.lingokids.com/invitation?c={campaign}&adgroup={channel}&user_id=#USERID#
```

Canales: `email`, `fb`, `fbmsn`, `sms`, `tw`, `wh`, `link`, `other`
Campañas: `1m` (1 mes), `lw` (last week), `nps`, `npsw`

## Progreso del niño (WebView)

```
https://app.lingokids.com/web_views/child_progress/reports/#CHILD_ID#
```

Endpoint web para ver reportes detallados de progreso.

## Seguridad de red

- `@xml/network_security_config` — configuración de seguridad de red Android
- `allowBackup="false"` — no permite backup de datos
- HTTPS obligatorio para todas las comunicaciones API
- Certificate pinning probable (no confirmado sin análisis dinámico)
- Tokens almacenados en Keychain (`KeychainModule`)

## Manejo de errores de red

Pantallas de error detectadas:
- `ONBOARDING_CONNECTION_ERROR_MODAL` — error durante onboarding
- `STARTUP_API_REQUEST_TIMEOUT` — timeout al iniciar
- `PAYWALL_HORIZONTAL_ERROR` / `PAYWALL_VERTICAL_ERROR` — error en paywall

Comportamiento offline:
- La app funciona con contenido previamente descargado
- `react-native-community/netinfo` monitorea cambios de conectividad
- Sincronización de progreso al reconectarse (inferido)
