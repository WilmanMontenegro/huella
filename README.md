# Huellas Web

App Next.js 14 del hackathon Huellas — trazabilidad agro-turística del Magdalena.

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 14 + TypeScript + Tailwind |
| Diseño | Google Stitch — **Artisan Heritage** (`ripe_banana_yellow_update`) |
| DB + Auth | Supabase |
| IA | Gemini 2.0 Flash |
| Blockchain | Polygon Amoy + ethers.js (Etapa 2) |

## Estructura del proyecto

```
web/
├── src/
│   ├── app/                    # App Router (rutas)
│   │   ├── page.tsx            # Landing /
│   │   ├── producto/[id]/      # Vista QR ⭐
│   │   ├── productor/dashboard/
│   │   ├── checkout/[id]/
│   │   └── api/chat/           # Agente Gemini
│   ├── components/
│   │   ├── icons/              # MaterialIcon
│   │   ├── layout/             # TopAppBar, BottomNav
│   │   ├── product/            # Hero, Timeline, Chat...
│   │   ├── farmer/             # LotCard, FAB
│   │   └── checkout/
│   ├── data/mock/              # Demo data (until Supabase is connected)
│   ├── lib/
│   │   ├── design/tokens.ts    # Colores Stitch (fuente única)
│   │   ├── supabase/           # Cliente browser + server
│   │   ├── gemini/             # Agente del producto
│   │   └── blockchain/         # Polygon Amoy config
│   └── types/                  # TypeScript compartido
├── supabase/schema.sql         # Tablas PostgreSQL
└── .env.example
```

## Convenciones

- **Código** (variables, tipos, funciones, comentarios técnicos): inglés
- **UI** (textos visibles al usuario): español
- **Rutas** (`/producto`, `/productor`): español — son parte de la experiencia del usuario

## Inicio rápido

> Gestor de paquetes: **pnpm** (no npm). Si no lo tienes: `corepack enable`

```bash
cd web
cp .env.example .env.local
pnpm install
pnpm dev
```

Abrir [http://localhost:3000](http://localhost:3000)

**Demo QR:** `/producto/finca-la-esperanza`

## Rutas

| Ruta | Descripción |
|------|-------------|
| `/` | Landing |
| `/producto/[id]` | Trazabilidad + agente IA + compra |
| `/productor/dashboard` | Panel del agricultor |
| `/checkout/[id]` | Checkout simulado |

## Design system

Tokens en `src/lib/design/tokens.ts` — sincronizados con Stitch **Artisan Heritage**:
- Fondo crema `#fdf9f4`
- Primary café `#271310`
- Secondary verde `#1b6d24`
- Tertiary amarillo banano `#c9a900` / `#ffe16d`
- Fuentes: EB Garamond + Manrope

## Supabase (MVP Finca La Esperanza)

La CLI está instalada como dev dependency (`pnpm exec supabase`). **No necesitas Docker** para subir schema/seed al proyecto cloud.

### Opción A — CLI (recomendado)

```bash
cd web

# 1. Login (abre el navegador)
pnpm db:login

# 2. Vincular proyecto cloud (te pide el project ref, ej. abcdefghijklmnop)
pnpm db:link

# 3. Aplicar migraciones + seed demo en un solo paso
pnpm db:setup:remote
```

Scripts útiles:

| Comando | Qué hace |
|---------|----------|
| `pnpm db:push` | Sube migraciones de `supabase/migrations/` |
| `pnpm db:seed:remote` | Ejecuta `supabase/seed.sql` en el proyecto linked |
| `pnpm db:setup:remote` | push + seed |
| `pnpm db:start` | Supabase local (requiere Docker Desktop) |

Archivos:

- `supabase/migrations/` — schema versionado (fuente canónica)
- `supabase/seed.sql` — datos demo Finca La Esperanza

### Opción B — SQL Editor manual

1. `supabase/schema.sql` — tablas + RLS  
2. `supabase/seed.sql` — datos demo

### Variables de entorno

En **Project Settings → API**, copia:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

Pégalas en `web/.env.local` (y en Vercel → Environment Variables para producción).

### Verificar

```bash
pnpm dev
```

- `/producto/finca-la-esperanza` — trazabilidad desde DB
- `/productor/dashboard` — lotes de Don José desde DB
- `/producto/finca-la-esperanza/experiencias` — agencias desde DB

## Demo completo (60 segundos)

1. Landing `/` — QR visible → escanea o abre `/producto/finca-la-esperanza`
2. **Turista:** mapa, trazabilidad, blockchain Polygon, agente IA, tours, WhatsApp agencias, comprar
3. **Checkout** → confirmar → `/mis-pedidos`
4. **Exportador** `/exportador/dashboard` → aprobar pedidos internacionales
5. **Productor** `/productor/dashboard` → lotes → `/productor/nuevo-lote` → QR imprimible

## Variables Vercel (producción)

| Variable | Obligatoria |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Sí |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Sí |
| `GEMINI_API_KEY` | Sí — key gratis en [aistudio.google.com](https://aistudio.google.com) |
| `GEMINI_MODEL` | `gemini-2.5-flash-lite` (free tier, default) |
| `NEXT_PUBLIC_APP_URL` | Sí (QR apunta a prod) |

Supabase: habilitar **Google OAuth** en Authentication → Providers y redirect URL `https://tu-dominio/auth/callback`.
