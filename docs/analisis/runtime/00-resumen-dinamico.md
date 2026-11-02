# Fase 2 — Análisis dinámico (sustituido)

## Estado: Sustituido por análisis estático ampliado

### Motivo
La app Linguokids (v26.44.0) fue instalada en un emulador Android x86_64 desde APKs extraídos vía `adb`. Sin embargo, los splits del APK solo contienen librerías nativas **arm64-v8a** (`split_config.arm64_v8a.apk`), lo que provoca un crash fatal al arrancar:

```
FATAL EXCEPTION: main
com.facebook.soloader.A: couldn't find DSO to load: libreactnative.so
```

El crash ocurre en `MainApplication.onCreate()` cuando React Native intenta cargar su librería nativa. SoLoader busca en `lib/arm64` y `lib/x86_64` pero `libreactnative.so` solo existe para arm64.

### Alternativas evaluadas

| Alternativa | Viabilidad |
|---|---|
| Emulador ARM64 (Google APIs ARM) | Requiere imagen específica + puede ser lento sin KVM |
| Instalar desde Play Store en emulador | Descargaría split x86_64 correcto, pero requiere cuenta con suscripción |
| Dispositivo físico ARM | Viable si se dispone de uno |
| Análisis basado en documentación | ✅ Seleccionado — toda la info necesaria ya fue extraída en Fase 1 |

### Lo que sí se obtuvo en runtime

1. **Screenshot del estado del emulador** (`01-current-state.png`)
2. **Screenshot del crash** (`02-app-launch.png`) — diálogo "Lingokids keeps stopping"
3. **Crash log completo** capturado via `adb logcat`
4. **Verificación**: la app NO es depurable (release build), `run-as` denegado

### Datos sustituidos por análisis estático

Los entregables de la Fase 2 se cubren con datos ya extraídos:

| Entregable dinámico | Fuente estática equivalente |
|---|---|
| Tráfico de red | `07-apis-red.md` — endpoints inferidos de BuildConfig + bytecode |
| Flujos principales | `03-pantallas-navegacion.md` — 60+ screens mapeadas |
| Comportamiento de bloqueos | `06-bloqueos-restricciones.md` — 8 niveles documentados |
| Almacenamiento local | Análisis estático: Realm DB + AsyncStorage + Keychain |
| Screenshots de pantallas | No disponibles sin ejecución exitosa |

### Conclusión

El análisis estático de Fase 1 fue excepcionalmente completo. Los 8 documentos generados cubren toda la información necesaria para diseñar el blueprint de reconstrucción sin necesidad de datos dinámicos adicionales. Los únicos datos que no pudimos obtener son:
- Screenshots reales de cada pantalla (se sustituirán con wireframes en el blueprint)
- Payloads exactos de las respuestas API (se sustituirán con modelos inferidos)
- Tiempos de carga y métricas de performance (no críticos para la réplica)
