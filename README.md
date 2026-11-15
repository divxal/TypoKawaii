# TypoKawaii

Entrenador de mecanografía **en español**, con estética kawaii. Juego, subo de rango y de paso
aprendo a escribir sin mirar el teclado.

`React 19` · `TypeScript` · `Vite 6` · `Tailwind (CDN)` · `@google/genai`

---

## Qué hay dentro

| Modo | Qué hace |
|:--|:--|
| **Infinito** | Frases encadenadas sin final. Mide WPM, precisión y errores de puntuación. |
| **Free Write** | Escribes libre y el juego puntúa tu propio texto. |
| **Historia** | Niveles con un mínimo de WPM y precisión para desbloquear el siguiente. |

- **Rangos por modo**: Hierro → Gran Maestro, con XP y nivel acumulados por partida.
- **Cuatro temas**: Cinnamoroll, Kuromi, My Melody y Pompompurin (avatares de DiceBear).
- **Atlas**, un asistente con `gemini-2.5-flash`: conoce tu nivel y tu WPM y te sugiere qué
  practicar. Sin API key el juego funciona igual, solo se queda sin chat.
- Perfil, estadísticas y amigos en `localStorage`. **No hay backend**: la "cuenta" es local y
  la contraseña no sale de tu máquina. Es un prototipo de práctica, no un sistema de login.

## Correrlo

```bash
npm install
echo "API_KEY=tu_api_key_de_gemini" > .env.local   # opcional, solo para el chat de Atlas
npm run dev
```

Vite sirve en `http://localhost:5173`. `npm run build` deja el estático en `dist/`.

## Estado

Prototipo jugable y funcional de principio a fin. Pendiente: textos de nivel propios en vez de
los de prueba y persistencia real si algún día deja de ser local.
