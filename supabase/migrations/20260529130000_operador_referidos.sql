-- Operador turístico: perfiles, referidos y pedidos vinculados

alter table agencias add column if not exists descripcion text;
alter table agencias add column if not exists tagline text;

alter table pedidos add column if not exists agencia_referente_id uuid references agencias(id);

create table if not exists operador_usuarios (
  user_id uuid primary key,
  agencia_id uuid not null references agencias(id) on delete cascade,
  created_at timestamptz default now()
);

create table if not exists referidos_eventos (
  id uuid primary key default gen_random_uuid(),
  agencia_id uuid not null references agencias(id) on delete cascade,
  tipo text not null check (tipo in ('escaneo', 'pedido')),
  lote_slug text,
  pedido_id uuid references pedidos(id) on delete set null,
  created_at timestamptz default now()
);

create index if not exists idx_referidos_agencia on referidos_eventos(agencia_id, created_at desc);
create index if not exists idx_pedidos_agencia_ref on pedidos(agencia_referente_id);

alter table operador_usuarios enable row level security;
alter table referidos_eventos enable row level security;

drop policy if exists "Operador usuarios lectura" on operador_usuarios;
create policy "Operador usuarios lectura" on operador_usuarios for select using (true);

drop policy if exists "Operador usuarios insert" on operador_usuarios;
create policy "Operador usuarios insert" on operador_usuarios for insert with check (true);

drop policy if exists "Referidos insert" on referidos_eventos;
create policy "Referidos insert" on referidos_eventos for insert with check (true);

drop policy if exists "Referidos lectura" on referidos_eventos;
create policy "Referidos lectura" on referidos_eventos for select using (true);

drop policy if exists "Agencias update MVP" on agencias;
create policy "Agencias update MVP" on agencias for update using (true);
