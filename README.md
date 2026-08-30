# 🎧 Oído Absoluto

Juego web interactivo de adivinanza musical desarrollado con **Next.js 15 (App Router)**, **Tailwind CSS v4** y **Supabase**.

Escucha un fragmento mínimo de una canción icónica (**0.5s**, **2.0s** o **5.0s**) y adivina el **año de lanzamiento** exacto para escalar al podio del **Ranking Mundial**.

---

## 🌟 Características Principales

- 🎵 **Motor de Audio de Alta Precisión:** Reproduce fragmentos de audio cortados al milisegundo (0.5s, 2s, 5s) con visualizador de ondas reactivo en Canvas.
- 🎯 **Sistema de Puntuación Arcade:**
  - `0.5s`: **1,000 pts** base
  - `2.0s`: **600 pts** base
  - `5.0s`: **300 pts** base
  - **Bonus "Oído Absoluto" (+500 pts)** al acertar el año exacto.
  - Multiplicador combo de racha progresivo (hasta `x2.5`).
- ❤️ **Sistema de Vidas:** Comienzas con 3 corazones. Errar por más de 5 años te descuenta 1 vida.
- 🌍 **Ranking Mundial en Tiempo Real:** Tabla global con podio (🥇, 🥈, 🥉) que muestra la bandera del país de cada jugador, puntaje, canciones acertadas y aciertos exactos.
- ⚡ **Resiliencia Offline / Zero-Config:** Funciona al instante con un catálogo integrado de más de 40 canciones de leyenda (1960 - 2024) y almacenamiento local, conectándose fluidamente a Supabase al añadir las credenciales.
- 🔊 **Efectos de Sonido Sintetizados:** Sonidos arcade nativos mediante Web Audio API con opción de silenciar.

---

## 🚀 Inicio Rápido

### 1. Clonar o acceder al proyecto
```bash
cd oido-absoluto
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Iniciar el servidor de desarrollo
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para comenzar a jugar.

---

## 🗄️ Configuración de Supabase (Opcional)

Si deseas sincronizar las puntuaciones en una base de datos PostgreSQL real en la nube:

1. Crea un proyecto gratuito en [Supabase](https://supabase.com).
2. Ve a la sección **SQL Editor** y ejecuta el script ubicado en [`supabase/schema.sql`](supabase/schema.sql).
3. Copia el archivo `.env.example` como `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
4. Completa tus variables de entorno en `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
   ```
5. Reinicia el servidor con `npm run dev`.

---

## 📁 Estructura del Proyecto

```
oido-absoluto/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── leaderboard/route.ts   # API REST para ranking mundial
│   │   │   └── songs/route.ts         # API REST para canciones
│   │   ├── globals.css                # Estilos globales y Tailwind CSS
│   │   ├── layout.tsx                 # Layout raíz con metadata
│   │   └── page.tsx                   # Página principal (Jugar & Ranking)
│   ├── components/
│   │   ├── AudioSnippetPlayer.tsx     # Reproductor con selección 0.5s / 2s / 5s
│   │   ├── CountryPicker.tsx          # Selector de países con banderas y búsqueda
│   │   ├── GameOverModal.tsx          # Modal de fin de partida y guardado en ranking
│   │   ├── Header.tsx                 # Barra superior, switch de pestañas y HUD
│   │   ├── HowToPlayModal.tsx         # Guía y reglas del juego
│   │   ├── LeaderboardView.tsx        # Pantalla de Ranking Mundial con podio y banderas
│   │   ├── RoundResultModal.tsx       # Revelación de canción, portada y puntuación
│   │   ├── Visualizer.tsx             # Visualizador de ondas en Canvas
│   │   └── YearTimeline.tsx           # Slider interactivo de año y controles
│   ├── lib/
│   │   ├── audio-engine.ts            # Motor de audio y efectos de sonido
│   │   ├── countries.ts               # Listado de países con códigos ISO y banderas
│   │   ├── songs-data.ts              # Catálogo precargado de canciones (1960-2025)
│   │   └── supabase.ts                # Cliente y servicios de Supabase con fallback
│   └── types/
│       └── index.ts                   # Tipos e interfaces TypeScript
├── supabase/
│   └── schema.sql                     # Script SQL para tablas y políticas RLS
└── public/
```

---

## 🛠️ Tecnologías

- [Next.js](https://nextjs.org/) (App Router, React 19)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/) (@supabase/supabase-js)
- [Lucide React](https://lucide.dev/) (Iconografía moderna)
- [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
