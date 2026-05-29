-- MagTrace · MVP Finca La Esperanza (schema inicial)

create extension if not exists "pgcrypto";

create table if not exists productores (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  nombre_corto text,
  foto_url text,
  historia text,
  municipio text,
  lat double precision,
  lng double precision,
  años_experiencia int default 0,
  ventas_mes_usd numeric default 0,
  created_at timestamptz default now()
);

create table if not exists lotes (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  productor_id uuid references productores(id) on delete cascade,
  producto text not null,
  variedad text,
  cantidad_kg numeric not null,
  fecha_cosecha date,
  estado_actual text,
  foto_url text,
  finca_nombre text,
  elevacion text,
  blockchain_hash text,
  contract_address text,
  qr_code text,
  precio_usd numeric,
  tags text[] default '{}',
  product_detail jsonb,
  dashboard_status text,
  dashboard_status_label text,
  created_at timestamptz default now()
);

create table if not exists trazabilidad (
  id uuid primary key default gen_random_uuid(),
  lote_id uuid references lotes(id) on delete cascade,
  etapa text not null,
  descripcion text,
  fecha text,
  responsable text,
  blockchain_tx text,
  status text not null check (status in ('completed', 'current', 'pending')),
  orden int not null default 0
);

create table if not exists certificaciones (
  id uuid primary key default gen_random_uuid(),
  lote_id uuid references lotes(id) on delete cascade,
  tipo text not null,
  label text not null,
  fecha date,
  documento_url text
);

create table if not exists agencias (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  nombre text not null,
  whatsapp text,
  logo_url text,
  created_at timestamptz default now()
);

create table if not exists experiencias (
  id uuid primary key default gen_random_uuid(),
  lote_id uuid references lotes(id) on delete cascade,
  slug text not null,
  titulo text not null,
  resumen text,
  descripcion text,
  imagen_url text,
  orden int default 0,
  unique (lote_id, slug)
);

create table if not exists experiencia_proveedores (
  id uuid primary key default gen_random_uuid(),
  experiencia_id uuid references experiencias(id) on delete cascade,
  agencia_id uuid references agencias(id) on delete set null,
  agency_name text not null,
  descripcion text,
  duracion text,
  precio numeric,
  punto_encuentro text,
  capacidad text,
  idiomas text[] default '{Español}'
);

create table if not exists pedidos (
  id uuid primary key default gen_random_uuid(),
  lote_id uuid references lotes(id),
  comprador_email text,
  cantidad int not null,
  tipo_envio text check (tipo_envio in ('local', 'export')),
  pais_destino text,
  estado text default 'pendiente',
  total_usd numeric,
  created_at timestamptz default now()
);

create index if not exists idx_lotes_slug on lotes(slug);
create index if not exists idx_lotes_productor on lotes(productor_id);
create index if not exists idx_trazabilidad_lote on trazabilidad(lote_id, orden);
create index if not exists idx_experiencias_lote on experiencias(lote_id, orden);

alter table productores enable row level security;
alter table lotes enable row level security;
alter table trazabilidad enable row level security;
alter table certificaciones enable row level security;
alter table agencias enable row level security;
alter table experiencias enable row level security;
alter table experiencia_proveedores enable row level security;
alter table pedidos enable row level security;

drop policy if exists "Productores públicos" on productores;
create policy "Productores públicos" on productores for select using (true);

drop policy if exists "Lotes públicos" on lotes;
create policy "Lotes públicos" on lotes for select using (true);

drop policy if exists "Trazabilidad pública" on trazabilidad;
create policy "Trazabilidad pública" on trazabilidad for select using (true);

drop policy if exists "Certificaciones públicas" on certificaciones;
create policy "Certificaciones públicas" on certificaciones for select using (true);

drop policy if exists "Agencias públicas" on agencias;
create policy "Agencias públicas" on agencias for select using (true);

drop policy if exists "Experiencias públicas" on experiencias;
create policy "Experiencias públicas" on experiencias for select using (true);

drop policy if exists "Proveedores públicos" on experiencia_proveedores;
create policy "Proveedores públicos" on experiencia_proveedores for select using (true);

drop policy if exists "Crear pedidos" on pedidos;
create policy "Crear pedidos" on pedidos for insert with check (true);

drop policy if exists "Leer pedidos propios" on pedidos;
create policy "Leer pedidos propios" on pedidos for select using (true);

drop policy if exists "Update pedidos exportador" on pedidos;
create policy "Update pedidos exportador" on pedidos for update using (true);

drop policy if exists "Insert lotes MVP" on lotes;
create policy "Insert lotes MVP" on lotes for insert with check (true);

drop policy if exists "Insert trazabilidad MVP" on trazabilidad;
create policy "Insert trazabilidad MVP" on trazabilidad for insert with check (true);
