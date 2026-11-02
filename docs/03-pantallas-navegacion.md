# 03 — Pantallas y navegación

## Framework de navegación

- **React Navigation** con `NavigationContainer`
- **createNativeStackNavigator** para stacks de pantallas
- **createBottomTabNavigator** para la navegación principal con tabs
- **react-native-screens** (`com.swmansion.rnscreens`) para renderizado nativo de pantallas

## Estructura de navegación (inferida)

```
NavigationContainer
├── AuthStack (no autenticado)
│   ├── Onboarding
│   │   ├── ONBOARDING_WELCOME
│   │   ├── ONBOARDING_AGE_SELECTION
│   │   ├── ONBOARDING_CHILD_NAME
│   │   ├── ONBOARDING_INTENT
│   │   ├── ONBOARDING_CATEGORIES_EDUCATIONAL
│   │   ├── ONBOARDING_CATEGORIES_ENTERTAINMENT
│   │   ├── ONBOARDING_PREFERRED_CONTENT_LOCALE_SELECTION
│   │   ├── ONBOARDING_FAVORITE_IPS
│   │   ├── ONBOARDING_CUSTOMIZE_OR_PLAYING
│   │   ├── ONBOARDING_PERMISSIONS
│   │   ├── ONBOARDING_WHY_INSTALL_OPTIONS
│   │   ├── ONBOARDING_DEMO_GAME
│   │   └── ONBOARDING_DEMO_VIDEO_AND_GAME
│   ├── Login
│   │   ├── ONBOARDING_LOGIN_PASSWORD
│   │   ├── ONBOARDING_FACEBOOK_LOGIN
│   │   ├── ONBOARDING_EMAIL_COLLECTION
│   │   ├── ONBOARDING_SIGNUP_ERROR
│   │   ├── ONBOARDING_CONNECTION_ERROR_MODAL
│   │   ├── MAGICLINK_EMAIL
│   │   └── MAGICLINK_ERROR
│   └── Paywall (pre-auth)
│       ├── PAYWALL_LOADING
│       ├── PAYWALL_HORIZONTAL / PAYWALL_VERTICAL (A/B test)
│       ├── PAYWALL_FACEBOOK_LOGIN
│       ├── PAYWALL_MAGICLINK_EMAIL
│       ├── PAYWALL_WEBVIEW
│       ├── PAYWALL_CONGRATS
│       └── PAYWALL_POST_PURCHASE_VIDEO
│
├── MainTabs (autenticado — Bottom Tab Navigator)
│   ├── Tab: Home / Explore
│   │   ├── GAMES_HOME_CITY (pantalla principal con mundos)
│   │   ├── EXPLORE_BUTTON (explorar contenido)
│   │   ├── FEED_SET_PLACEMENT (feeds dinámicos)
│   │   ├── LESSON_PATH (camino de lecciones)
│   │   ├── LESSON_PREVIEW_CARD
│   │   ├── LESSON_RECOMMENDATION
│   │   └── LESSON_PARTNER_PREVIEW
│   │
│   ├── Tab: Lessons
│   │   ├── LESSONS_BOTTOM_ICON_SVG
│   │   └── (contenido dinámico de lecciones)
│   │
│   ├── Tab: Videos
│   │   ├── VIDEOS_HOME
│   │   └── VIDEO_MODE_PLAYER
│   │
│   ├── Tab: Favorites
│   │   └── FAVORITES_BUTTON
│   │
│   └── Tab: Downloads
│       └── PARENTS_DOWNLOADS
│
├── Activity Stack (juegos Unity)
│   ├── ActivityScreen (carga UnityView con activityJson)
│   ├── SCREEN_TIME_LIMIT_REACHED
│   └── REWARDS_WIDGET
│
├── Parents Stack (sección de padres — detrás de parental gate)
│   ├── PARENTS_HOME
│   ├── PARENTS_REPORT (progreso del niño)
│   ├── PARENTS_SETTINGS_STUDENT_PROFILE
│   ├── PARENTS_BLOG
│   ├── PARENTS_DOWNLOADS_DISK_SPACE
│   ├── MANAGE_SUBSCRIPTION
│   ├── EDIT_CHILD_AVATAR
│   ├── NEW_CHILD (añadir hijo)
│   ├── SCREEN_TIME_SETTINGS
│   ├── PROFILE_UPDATE
│   └── HELP_CENTER
│
├── Post-Purchase Flow
│   ├── POST_PURCHASE_CHILD_NAME
│   ├── POST_PURCHASE_CAROUSEL
│   ├── POST_PURCHASE_CONGRATS
│   ├── POST_PURCHASE_LATE_SIGNUP
│   └── POST_PURCHASE_PERMISSIONS
│
├── Churn Deflection (intento de cancelación)
│   ├── CHURN_DEFLECTION_SURVEY
│   ├── CHURN_DEFLECTION_OFFER
│   ├── CHURN_DEFLECTION_THANK_YOU
│   └── CHURN_DEFLECTION_ERROR
│
├── Modales
│   ├── ParentalGateModal
│   ├── ConnectionErrorModal
│   ├── WELCOME_BACK_BENEFIT (re-engagement)
│   ├── PROMO_VIDEO
│   └── STARTUP_API_REQUEST_TIMEOUT
│
└── WebViews
    ├── PRIVACY_POLICY_WEB_VIEW
    ├── TERMS_OF_SERVICE
    ├── OUR_METHOD_WEB_VIEW
    ├── DEFAULT_WEB_VIEW (genérica)
    └── VERIFY_EMAIL
```

## Pantallas identificadas por constante SCREEN__

Las siguientes constantes fueron extraídas del bytecode Hermes (las strings están a veces concatenadas con otras constantes; aquí las separo por contexto):

### Onboarding
- `SCREEN__ONBOARDING_WELCOME`
- `SCREEN__ONBOARDING_AGE_SELECTION`
- `SCREEN__ONBOARDING_CHILD_NAME`
- `SCREEN__ONBOARDING_INTENT`
- `SCREEN__ONBOARDING_CATEGORIES_EDUCATIONAL`
- `SCREEN__ONBOARDING_CATEGORIES_ENTERTAINMENT`
- `SCREEN__ONBOARDING_PREFERRED_CONTENT_LOCALE_SELECTION`
- `SCREEN__ONBOARDING_CUSTOMIZE_OR_PLAYING`
- `SCREEN__ONBOARDING_PERMISSIONS`
- `SCREEN__ONBOARDING_WHY_INSTALL_OPTIONS`
- `SCREEN__ONBOARDING_LOGIN_PASSWORD`
- `SCREEN__ONBOARDING_FACEBOOK_LOGIN`
- `SCREEN__ONBOARDING_EMAIL_COLLECTION`
- `SCREEN__ONBOARDING_SIGNUP_ERROR`
- `SCREEN__ONBOARDING_CONNECTION_ERROR_MODAL`

### Onboarding experimental (A/B)
- `SCREEN__EXP_ONBOARDING_WELCOME`
- `SCREEN__EXP_ONBOARDING_AGE_SELECTION`
- `SCREEN__EXP_ONBOARDING_DEMO_GAME`
- `SCREEN__EXP_ONBOARDING_DEMO_VIDEO_AND_GAME`
- `SCREEN__EXP_ONBOARDING_FAVORITE_IPS`
- `SCREEN__EXP_ONBOARDING_CUSTOMIZE_OR_PLAYER`

### Paywall
- `SCREEN__PAYWALL_LOADING`
- `SCREEN__PAYWALL_HORIZONTAL`
- `SCREEN__PAYWALL_VERTICAL`
- `SCREEN__PAYWALL_FACEBOOK_LOGIN`
- `SCREEN__PAYWALL_MAGICLINK_EMAIL`
- `SCREEN__PAYWALL_WEBVIEW`
- `SCREEN__PAYWALL_CONGRATS`
- `SCREEN__PAYWALL_POST_PURCHASE_VIDEO`
- `SCREEN__PAYWALL_POST_SUBSCRIPTION_CAROUSEL`
- `SCREEN__PRE_PAYWALL`

### Post-Purchase
- `SCREEN__EXP_POST_PURCHASE_CHILD_NAME`
- `SCREEN__EXP_POST_PURCHASE_CAROUSEL`
- `SCREEN__EXP_POST_PURCHASE_CONGRATS`
- `SCREEN__EXP_POST_PURCHASE_LATE_SIGNUP`
- `SCREEN__EXP_POST_PURCHASE_PERMISSIONS`

### Home / Contenido
- `SCREEN__GAMES_HOME_CITY`
- `SCREEN__VIDEOS_HOME`
- `SCREEN__FAMILY_TIME_HOME_SECTION`
- `SCREEN__EXPLORE_BUTTON`
- `SCREEN__FAVORITES_BUTTON`
- `SCREEN__FEED_SET_PLACEMENT`
- `SCREEN__DOWNLOADS_FEED_SET`
- `SCREEN__LESSON_PATH`
- `SCREEN__LESSON_PREVIEW_CARD`
- `SCREEN__LESSON_RECOMMENDATION`
- `SCREEN__LESSON_PARTNER_PREVIEW`

### Actividades
- `SCREEN__ACTIVITY_CARD`
- `SCREEN__SCREEN_TIME_LIMIT_REACHED`
- `SCREEN__REWARDS_WIDGET`
- `SCREEN__VIDEO_MODE_PLAYER`

### Padres
- `SCREEN__PARENTS_HOME`
- `SCREEN__PARENTS_REPORT`
- `SCREEN__PARENTS_SETTINGS_STUDENT_PROFILE`
- `SCREEN__PARENTS_BLOG`
- `SCREEN__PARENTS_DOWNLOADS_DISK_SPACE`

### Cuenta / Settings
- `SCREEN__MANAGE_SUBSCRIPTION`
- `SCREEN__EDIT_CHILD_AVATAR`
- `SCREEN__NEW_CHILD`
- `SCREEN__SCREEN_TIME_SETTINGS`
- `SCREEN__PROFILE_UPDATE`
- `SCREEN__HELP_CENTER`
- `SCREEN__VERIFY_EMAIL`

### Churn deflection
- `SCREEN__EXP_CHURN_DEFLECTION_SURVEY`
- `SCREEN__EXP_CHURN_DEFLECTION_OFFER`
- `SCREEN__EXP_CHURN_DEFLECTION_THANK_YOU`
- `SCREEN__EXP_CHURN_DEFLECTION_ERROR`

### WebViews
- `SCREEN__PRIVACY_POLICY_WEB_VIEW`
- `SCREEN__TERMS_OF_SERVICE`
- `SCREEN__OUR_METHOD_WEB_VIEW`
- `SCREEN__DEFAULT_WEB_VIEW`

### Auth
- `SCREEN__MAGICLINK_EMAIL`
- `SCREEN__MAGICLINK_ERROR`
- `SCREEN__WELCOME_BACK_BENEFIT`
- `SCREEN__STARTUP_API_REQUEST_TIMEOUT`

## Deep linking

La app soporta:
- **HTTP/HTTPS deep links**: `lingokids.com/deeplink/*`
- **AppsFlyer OneLink**: `lingokids.onelink.me/WpRx/*`
- **Custom scheme**: `lingokids://*`
- **Invitations**: `www.lingokids.com/invitation?adgroup=...&user_id=...`

## Parental gate

Presente como modal (`ParentalGateModal`) que se activa al intentar:
- Acceder a la sección de padres
- Cambiar configuración
- Acceder a enlaces externos

El módulo `NativeTouchEventControllerModule` probablemente gestiona la detección de touch patterns para el gate.

## Orientación de pantalla

- La MainActivity tiene `screenOrientation="unspecified"` — la app gestiona la rotación ella misma
- Los juegos Unity probablemente fuerzan landscape
- La navegación RN probablemente es portrait
- `SIZE_MATTERS_BASE_WIDTH = 375`, `SIZE_MATTERS_BASE_HEIGHT = 812` (dimensiones base = iPhone X)
