# 08 — AndroidManifest.xml — Análisis completo

## Identidad de la aplicación

| Campo | Valor |
|-------|-------|
| Package | `es.monkimun.lingokids` |
| Version Name | 26.44.0 |
| Version Code | 10041911 |
| Min SDK | 24 (Android 7.0) |
| Target SDK | 36 (Android 16) |
| Compile SDK | 36 |
| App Category | `game` |
| Main Component RN | `"Lingokids"` |
| Launch Mode | `singleInstance` |

## Permisos declarados

### Permisos del sistema

| Permiso | Uso |
|---------|-----|
| `INTERNET` | Conectividad general |
| `ACCESS_NETWORK_STATE` | Verificar estado de red (offline mode) |
| `ACCESS_WIFI_STATE` | Info WiFi para analytics |
| `WRITE_EXTERNAL_STORAGE` | Guardar assets descargados |
| `RECORD_AUDIO` | Reconocimiento de voz en actividades |
| `CAMERA` | Actividades con cámara (AR, foto perfil) |
| `WAKE_LOCK` | Mantener pantalla activa durante juegos |
| `VIBRATE` | Feedback háptico |
| `POST_NOTIFICATIONS` | Push notifications |
| `RECEIVE_BOOT_COMPLETED` | Reiniciar alarmas tras reboot |
| `FOREGROUND_SERVICE` | Servicios en primer plano |
| `MODIFY_AUDIO_SETTINGS` | Control de audio durante juegos |
| `USE_BIOMETRIC` / `USE_FINGERPRINT` | Autenticación biométrica (parental gate) |
| `SCHEDULE_EXACT_ALARM` | Alarmas para notificaciones locales |
| `com.android.vending.BILLING` | Compras in-app |

### Permisos de badging (fabricante-específicos)

Permisos para mostrar badge de notificación en launchers de Samsung, HTC, Sony, Oppo, Huawei y otros.

### Permisos de advertising

| Permiso | Uso |
|---------|-----|
| `ACCESS_ADSERVICES_ATTRIBUTION` | Attribution API de Android |
| `ACCESS_ADSERVICES_AD_ID` | Ad ID para analytics |

### Features hardware

| Feature | Requerido |
|---------|-----------|
| OpenGL ES 2.0 | Sí (implícito) |
| Vulkan | No |
| Touchscreen | No |
| Multitouch | No |
| Microphone | No |
| Camera | No |
| Camera autofocus | No |

> Nota: Ningún hardware es estrictamente requerido excepto OpenGL ES 2.0 (Unity lo necesita).

## Activity principal

```xml
<activity
    android:name="es.monkimun.lingokids.MainActivity"
    android:theme="@style/SplashTheme"
    android:launchMode="singleInstance"
    android:screenOrientation="unspecified"
    android:resizeableActivity="false"
    android:configChanges="fontScale|layoutDirection|smallestScreenSize|
                           screenSize|uiMode|screenLayout|orientation|
                           navigation|keyboardHidden|keyboard|
                           touchscreen|locale|mnc|mcc"
    android:windowSoftInputMode="adjustResize">
```

- `singleInstance`: solo una instancia de la app a la vez
- `unspecified` orientación: la app gestiona rotación internamente
- `resizeableActivity="false"`: no soporta split-screen
- Maneja **todos** los cambios de configuración sin recrear la activity

### Deep Links

| Scheme | Host | Path |
|--------|------|------|
| `https` | `lingokids.com` | `/deeplink/*` |
| `http` | `lingokids.com` | `/deeplink/*` |
| `https` | `lingokids.onelink.me` | `/WpRx/*` (AppsFlyer) |
| `lingokids` | `*` | (custom scheme) |

### Meta-data de MainActivity

- `unityplayer.UnityActivity = true` — marca como host de Unity
- `android.notch_support = true` — soporta pantallas con notch
- Samsung DeX: `launchwidth = 0`, `launchheight = 0`

## Application

```xml
<application
    android:name="es.monkimun.lingokids.MainApplication"
    android:allowBackup="false"
    android:largeHeap="true"
    android:supportsRtl="true"
    android:extractNativeLibs="false"
    android:networkSecurityConfig="@xml/network_security_config"
    android:appCategory="game"
    android:requestLegacyExternalStorage="true"
    android:enableOnBackInvokedCallback="false">
```

- `largeHeap = true` — necesario por Unity + React Native simultáneos
- `allowBackup = false` — no permite backup (seguridad, datos de niños)
- `extractNativeLibs = false` — libs se leen directamente del APK
- `requestLegacyExternalStorage = true` — compatibilidad con Android 10

## Servicios y receptores

### Push Notifications
- `BrazeFirebaseMessagingService` — recibe FCM y lo rutea a Braze
- `BrazeBroadcastReceiver` — maneja NOTIFICATION_OPENED y NOTIFICATION_RECEIVED
- `NotifeeInitProvider` — inicialización de Notifee (notificaciones locales)

### Analytics
- Firebase Analytics habilitado (`firebase_analytics_collection_enabled = true`)
- Recolección de SSAID habilitada
- Screen reporting automático habilitado
- Consentimiento de almacenamiento de analytics y ads: habilitado por defecto

### Billing
- Google Play Billing v9.1.0
- `ProxyBillingActivity` + `ProxyBillingActivityV2`

### Otros
- WorkManager para tareas en segundo plano
- Sentry para crash reporting (`SentryInitProvider`, `SentryPerformanceProvider`)
- `ReactNativeFirebaseAppInitProvider` (initOrder: 99)
- `FileSystemFileProvider` de Expo
- `RNCWebViewFileProvider` para compartir archivos con WebView

## Meta-data del canal

```xml
<meta-data android:name="CHANNEL" android:value="googleplay"/>
```

Confirma que este APK es el build de Google Play (no Amazon/FireOS).

## Restricciones de la app

```xml
<meta-data
    android:name="android.content.APP_RESTRICTIONS"
    android:resource="@xml/app_restrictions"/>
```

Soporta **managed configurations** (MDM / Family Link) — probablemente para control parental empresarial.
