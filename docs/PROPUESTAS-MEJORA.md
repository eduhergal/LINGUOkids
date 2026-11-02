# 🚀 Propuestas de mejora — LINGUOkids

## ✅ Implementadas en v2.0 (2026-11-02)

### 1. 🔊 Audio TTS (Text-to-Speech) ✅
**Implementado**: Web Speech API con mapas fonéticos completos para A-Z en español e inglés. Voces preferidas: Paulina/Monica (ES), Samantha (EN). Velocidad adaptada a niños (0.75-0.85). Funciona offline en iPad Safari.

### 2. 🖼️ Ilustraciones SVG propias ✅
**Implementado**: Librería de 70+ ilustraciones SVG estilo Disney Pixar con helpers compartidos (ojos, sonrisa, rubor). Cubre: 12 animales, 12 alimentos, 10 instrumentos, 10 colores, A-Z, 0-20. ViewBox 64×64.

### 3. 📖 Cuentos interactivos ✅
**Implementado**: 6 historias bilingües (una por mundo). Páginas con gradientes e ilustraciones. Botón Aa para mayúsculas/minúsculas. Lectura en voz alta con TTS. Quiz de comprensión al final.

### 4. 🎵 Piano interactivo ✅
**Implementado**: Teclado de 2 octavas con síntesis Web Audio (4 osciladores ADSR). 28 canciones infantiles + 3 K-pop. Modo canciones con notas cayendo (Guitar Hero) y modo libre. Multitouch.

### 5. 🧮 Matemáticas completas ✅
**Implementado**: Nuevo mundo "Mates" con 47 actividades en 8 temas: Contar 1-5, Contar 6-10, Contar 11-20, Más/Menos, Sumas, Restas, Multiplicación, División. Adaptado por edades.

### 6. ✏️ Escritura libre ✅
**Implementado**: Canvas de dibujo con letra modelo translúcida. 6 colores, 3 grosores. Botones deshacer/borrar/listo. Transición del trazado guiado a escritura independiente.

---

## Prioridad Alta — Siguiente iteración

### 1. 🔊 Audio real grabado (mejora sobre TTS)
**Estado actual**: TTS sintetizado funciona pero la voz no es tan cálida como audio grabado.

**Propuesta**:
- Grabar audio profesional con voces cálidas infantiles (ej: ElevenLabs)
- Instrucciones habladas con entonación natural
- Sonido de cada animal al aparecer
- Música de fondo suave y ambiental por tema

**Impacto**: El audio grabado es más cálido y natural que el TTS sintetizado. Mejora la experiencia sensorial del niño.

---

### 2. 📖 Más cuentos y narrativas
**Propuesta**: Ampliar de 6 a 20+ cuentos:
- Cuentos para el mundo Math (ej: "Los números van de excursión")
- Cuentos más largos (8-10 páginas) para niños mayores
- Cuentos con decisiones (elige tu aventura)
- Audio narrado profesional

---

### 3. 🎵 Actividades musicales adicionales
**Propuesta**: Ampliar el piano con:
- **Xilófono de colores**: cada barra tiene un color y una nota musical
- **Ritmo y patrones**: reproducir una secuencia de sonidos (Simon Says musical)
- **Karaoke de letras**: seguir una melodía simple letra por letra

---

## Prioridad Media — UX y engagement

### 7. 🏅 Sistema de logros y colección
**Propuesta**:
- Logros desbloqueables: "Explorador" (visitar todos los mundos), "Estrella" (5 actividades con 3 estrellas), "Madrugador" (primera actividad del día)
- Colección de stickers: cada logro da un sticker que se colecciona en un álbum
- Los stickers son temáticos (animales del bosque, planetas, flores) según el tema activo

**Impacto**: La colección es un motivador potentísimo a estas edades. Da una razón para volver y explorar más.

---

### 8. 🗺️ Mapa de progreso por mundo
**Propuesta**: En vez de lista de lecciones, un mapa visual estilo "camino":
- Cada actividad es un punto en un camino
- Los completados se iluminan, los pendientes están en gris
- Animación del personaje caminando por el mapa
- "Jefe de mundo" al final de cada tema (actividad más difícil con recompensa especial)

**Impacto**: Visualizar el progreso como un viaje motiva a continuar y da sensación de avance.

---

### 9. 🎭 Personalización del avatar
**Propuesta**: En vez de un emoji fijo como avatar:
- Crear un personaje simple (cara redonda + ojos + boca + pelo + accesorio)
- El niño elige: color de pelo, forma de ojos, accesorio (gorra, lazo, gafas)
- Los accesorios se desbloquean con logros
- El avatar aparece en la pantalla de inicio y en las celebraciones

**Impacto**: La personalización crea identificación y pertenencia. "Es MI app, MI personaje".

---

### 10. 👨‍👩‍👧 Modo multiplayer local
**Propuesta**: Actividades para 2 jugadores en la misma pantalla:
- Memory competitivo: turnos para voltear cartas, gana quien tenga más parejas
- Carrera de trazado: pantalla dividida, quién traza la letra más rápido
- Quiz en equipo: responder juntos para sumar puntos

**Impacto**: El aprendizaje cooperativo refuerza lo aprendido. Jugar con un hermano o padre aumenta la motivación.

---

## Prioridad Baja — Técnicas y plataforma

### 11. 📱 Exportar reporte a PDF
Permitir a los padres descargar el reporte semanal como PDF para compartir con profesores o guardar como registro.

### 12. 🌐 Más idiomas
Añadir portugués, francés e italiano al sistema de i18n.

### 13. 🎬 Animaciones Lottie
Reemplazar animaciones CSS/Framer Motion por Lottie para personajes más expresivos y celebraciones más vistosas.

### 14. 📊 Dashboard de padres avanzado
- Gráficos de progreso mensual/trimestral
- Comparativa entre mundos
- Tiempo promedio por actividad
- Exportar datos

### 15. 🔄 Sincronización entre dispositivos
Guardar progreso en la nube (opcional) para sincronizar entre iPad, tablet Android y navegador.

---

## Resumen de impacto

| Propuesta | Impacto pedagógico | Esfuerzo técnico | Prioridad |
|---|---|---|---|
| Audio real | ⭐⭐⭐⭐⭐ | Medio | 🔴 Alta |
| Ilustraciones propias | ⭐⭐⭐⭐ | Alto (diseño) | 🔴 Alta |
| Cuentos interactivos | ⭐⭐⭐⭐⭐ | Alto | 🔴 Alta |
| Música interactiva | ⭐⭐⭐⭐ | Medio | 🔴 Alta |
| Mates básicas | ⭐⭐⭐⭐⭐ | Medio | 🔴 Alta |
| Escritura libre | ⭐⭐⭐⭐ | Alto | 🔴 Alta |
| Logros y colección | ⭐⭐⭐ | Medio | 🟡 Media |
| Mapa de progreso | ⭐⭐⭐ | Medio | 🟡 Media |
| Avatar personalizable | ⭐⭐⭐ | Medio | 🟡 Media |
| Multiplayer local | ⭐⭐⭐ | Alto | 🟡 Media |
| Exportar PDF | ⭐⭐ | Bajo | 🟢 Baja |
| Más idiomas | ⭐⭐ | Bajo | 🟢 Baja |
| Animaciones Lottie | ⭐⭐ | Medio | 🟢 Baja |
| Dashboard avanzado | ⭐⭐ | Medio | 🟢 Baja |
| Sincronización cloud | ⭐⭐ | Alto | 🟢 Baja |

---

## Recomendación de próximos pasos

**Sprint 1** (máximo impacto):
1. Generar audio TTS para todas las letras y números (ElevenLabs o Google TTS)
2. Añadir actividad de piano/xilófono interactivo con Web Audio API
3. Crear actividad de "contar objetos" como primera actividad matemática

**Sprint 2** (contenido rico):
4. Diseñar 3 cuentos interactivos (uno por mundo principal)
5. Añadir actividades de sumas visuales
6. Sistema de logros con 10 logros iniciales

**Sprint 3** (pulido):
7. Ilustraciones SVG propias para al menos un mundo
8. Mapa visual de progreso
9. Exportar reporte a PDF
