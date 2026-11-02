# 04 — Lógica de negocio

## Gamificación

### Sistema de progresión

1. **Currículo de 12 materias** adaptado por edad del niño
2. **Organización**: Worlds → Topics → Units → Lessons → Activities
3. **Welcome Unit** como punto de inicio obligatorio para nuevos usuarios
4. **Phonics** con progresión por letras (A-Z, cursiva, escritura)

### Objetivos y streaks

- **Objetivo semanal**: cada niño tiene un objetivo de actividades por semana
  - `#CHILD_NAME# reached the goal` / `didn't reach last week's goal`
  - `#CHILD_NAME# ha quasi raggiunto l'obiettivo` (casi alcanzó)
- **Streak semanal**: `#WEEK_STREAK#-week streak!` — semanas consecutivas cumpliendo objetivo
- **Tracking diario**: `Semana #NUMBER#`, `Settimana #NUMBER#`

### Límite diario (free tier)

- **3 actividades por día** para usuarios gratuitos: `3 activity daily limit`
- Al alcanzar el límite → `SCREEN__SCREEN_TIME_LIMIT_REACHED`
- Los padres pueden configurar en `SCREEN__SCREEN_TIME_SETTINGS`

### Recompensas

- `REWARDS_WIDGET` — widget de recompensas tras completar actividades
- `CELEBRATION_ANIMATION_SOURCE` — animación de celebración
- Sistema de estrellas/puntos (inferido por el currículo y las pantallas de progreso)

### Reportes para padres

- **Reportes semanales por email**: `#CHILD_NAME# ha practicado:`
- **Centro de progreso** en la app: `PARENTS_REPORT`
- **Web view de progreso**: `app.lingokids.com/web_views/child_progress/reports/#CHILD_ID#`
- Métricas: actividades completadas, temas explorados, vocabulario aprendido

## Suscripciones y monetización

### Planes

| Plan | Contenido | Evidencia |
|------|-----------|-----------|
| Free | 3 actividades/día, contenido limitado | `3 activity daily limit` |
| Plus | Contenido completo, descargas offline | `Lingokids Plus`, `muat turun video serta permainan` |
| (Probablemente) Unlimited | Todo + múltiples perfiles | Inferido |

### Precios y períodos

Strings de pricing detectadas (ejemplos multi-idioma):
- `#CURRENCY_SYMBOL##PRICE#/month` (mensual)
- `fatturato ogni anno a [[price]]` (anual)
- `Enjoy {{count}} weeks at {{price}} each` (semanal trial)
- `Try one month for [[price]]`
- `Free for 1 week & only #CURRENCY_SYMBOL##PRICE#/month after`

### Flujo de compra

```
Pre-Paywall → Paywall (horizontal/vertical A/B) → 
  → Google Play Billing / Apple IAP →
  → PAYWALL_CONGRATS → POST_PURCHASE flow
```

### Post-purchase flow

1. `POST_PURCHASE_CHILD_NAME` — confirmar nombre del niño
2. `POST_PURCHASE_CAROUSEL` — tour de features desbloqueadas
3. `POST_PURCHASE_CONGRATS` — felicitación
4. `POST_PURCHASE_PERMISSIONS` — solicitar permisos (micrófono, cámara)
5. `POST_PURCHASE_LATE_SIGNUP` — registro diferido (si compró sin cuenta)

### Churn deflection (retención)

Cuando el usuario intenta cancelar:
1. `CHURN_DEFLECTION_SURVEY` — encuesta de por qué cancela
2. `CHURN_DEFLECTION_OFFER` — oferta de retención (`MEJOR OFERTA POR TEMPO LIMITADO!`)
3. `CHURN_DEFLECTION_THANK_YOU` — agradecimiento
4. `CHURN_DEFLECTION_ERROR` — error en el proceso

### Billing

- **Google Play Billing** v9.1.0 (`com.android.billingclient`)
- **Stripe** (inferido de strings del bytecode)
- **Apple IAP** (versión iOS)
- **Amazon IAP** (build FireOS: `BRAZE_API_KEY_FIREOS`)

## Sistema de contenido

### Feed dinámico

- `FEED_SET_PLACEMENT` — posicionamiento de feeds dinámicos
- `DOWNLOADS_FEED_SET` — feed de contenido descargado
- `FAMILY_TIME_HOME_SECTION` — sección de tiempo en familia
- `daily picks` — selección diaria personalizada

### Descarga offline

- Los usuarios Plus pueden descargar actividades: `Unduh semua aktivitas di "{{feedName}}"`
- Gestión de espacio: `PARENTS_DOWNLOADS_DISK_SPACE_LEFT`
- `deleteAllPersistentCacheIndexes` — limpieza de cache
- `cleanupDecryptedFiles` — limpieza de archivos desencriptados

### Contenido por IP (partners)

- **Disney**: Mickey (Dress Up Party), Zootopia (Clue Hunt)
- Actividades de partners tienen `partner` field en el JSON
- `LESSON_PARTNER_PREVIEW` — preview especial para contenido de partners

## Autenticación

### Métodos

1. **Email + password**: `ONBOARDING_LOGIN_PASSWORD`
2. **Magic link**: `MAGICLINK_EMAIL` — login sin contraseña por email
3. **Google Sign-In**: `com.reactnativegooglesignin`
4. **Apple Authentication**: `com.RNAppleAuthentication`
5. **Facebook Login**: `ONBOARDING_FACEBOOK_LOGIN` (Facebook App ID: `554369828034348`)

### Verificación

- Verificación de email: `VERIFY_EMAIL`
- Captcha: `CAPTCHA_ID = "iA96d7tOoz92fjR8gR1JdM=="`

### Sesión

- Inactividad: `SESSION_INACTIVITY_SECONDS = "300"` (5 minutos)
- Keychain para almacenamiento seguro: `KeychainModule`
- Ping de salud: `PING_URL = "https://api.lingokids.com/whoami"`

## Invitaciones y referidos

URLs de invitación con tracking por canal:
- Email: `lingokids.com/invitation?adgroup=email&user_id=#USERID#`
- Facebook: `...?adgroup=fb&user_id=#USERID#`
- Facebook Messenger: `...?adgroup=fbmsn&user_id=#USERID#`
- SMS: `...?adgroup=sms&user_id=#USERID#`
- Twitter: `...?adgroup=tw&user_id=#USERID#`
- WhatsApp: `...?adgroup=wh&user_id=#USERID#`
- Link directo: `...?adgroup=link&user_id=#USERID#`
- Otros: `...?adgroup=other&user_id=#USERID#`

Variantes con período de trial: `?c=1m` (1 mes), `?c=lw` (last week), `?c=nps`, `?c=npsw`

## Reconocimiento de voz

- Permiso: `RECORD_AUDIO` + speech recognition
- Strings multi-idioma solicitando acceso al micrófono
- `to play this activity, give access to the microphone and enable speech recognition`
- Usado en actividades de pronunciación/phonics

## Notificaciones

### Push (remoto)
- **Braze** como plataforma principal de push
- **Firebase Cloud Messaging** como transporte
- **OneSignal** como secundario (`ONE_SIGNAL_ID`)

### Locales
- **Notifee** para notificaciones locales programadas
- Alarmas exactas (`SCHEDULE_EXACT_ALARM`)
- Recordatorios: `Ingatkan saat saya online` (recuérdame cuando esté online)

## Analytics y tracking

| Servicio | Uso |
|----------|-----|
| Firebase Analytics | Eventos de app, screen views |
| Sentry | Crash reporting, performance monitoring |
| Braze | CRM, segmentación, mensajes in-app |
| GrowthBook | Feature flags, A/B testing |
| AppsFlyer (OneLink) | Attribution, deep linking |
| Facebook SDK | Attribution, login |

### Eventos de analytics detectados

- `firebase.analytics().logAddToCart`
- `firebase.analytics().logPurchase`
- `firebase.analytics().logSignUp`
- `firebase.analytics().logLogin`
- `firebase.analytics().logLevelStart` / `logLevelEnd` / `logLevelUp`
- `firebase.analytics().logScreenView`
- `firebase.analytics().logSearch`
- `firebase.analytics().logSelectContent` / `logSelectItem`
- `firebase.analytics().logShare`
- `firebase.analytics().logSpendVirtualCurrency`
- `firebase.analytics().logUnlockAchievement`
- `firebase.analytics().logViewItem` / `logViewItemList`
- `firebase.analytics().logViewCart`
- `firebase.analytics().logViewSearchResults`
- `firebase.analytics().logGenerateLead`
- `firebase.analytics().logJoinGroup`
- `firebase.analytics().logPostScore`
- `firebase.analytics().logRefund`
- `firebase.analytics().logRemoveFromCart`
- `firebase.analytics().logSelectPromotion` / `logViewPromotion`

## Lokalise (traducciones)

- `LOKALISE_PROJECT_ID = "151168365aa6413f25be95.26435868"`
- Las traducciones se gestionan en Lokalise y probablemente se descargan dinámicamente
- Idiomas detectados en strings: EN, ES, PT, FR, IT, ID (indonesio), MS (malayo), TR (turco), ZH
