-- Huella · Seed MVP Finca La Esperanza
-- Ejecutar DESPUÉS de schema.sql (incluye migración operador si falta en remoto)

-- Operador turístico: columnas y tablas (idempotente)
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

-- Grants anon (idempotente; ver migrations/20260529140000_grants_public_api.sql)
grant usage on schema public to anon, authenticated;
grant select on table public.productores to anon, authenticated;
grant select on table public.lotes to anon, authenticated;
grant select on table public.trazabilidad to anon, authenticated;
grant select on table public.certificaciones to anon, authenticated;
grant select on table public.agencias to anon, authenticated;
grant select on table public.experiencias to anon, authenticated;
grant select on table public.experiencia_proveedores to anon, authenticated;
grant select, insert, update on table public.pedidos to anon, authenticated;
grant insert on table public.lotes to anon, authenticated;
grant insert on table public.trazabilidad to anon, authenticated;
grant update on table public.agencias to anon, authenticated;
grant select, insert on table public.operador_usuarios to anon, authenticated;
grant select, insert on table public.referidos_eventos to anon, authenticated;

-- IDs fijos para coherencia entre entornos
-- Productor: Don José
insert into productores (id, nombre, nombre_corto, foto_url, historia, municipio, lat, lng, años_experiencia, ventas_mes_usd)
values (
  '11111111-1111-1111-1111-111111111101',
  'Don José',
  'José',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAoLOfMP3gtZAJLhbH1DJBuOMlYweVX1K15F4NLNKQDVFZMKSMaCwwN6kQGraIa-xdrP8rTKTUoC8WfoWON_89jPw5ut-Kwr8PKjNP8cotpXM-cwsuUO3MJd1_HeQK-6bbdR0dgRZ-1282K67BzraM9l8ioivuLGXIQELq4swvEGF2NO8DVKXTVVn9-OusQLNpcKF57hsP76j4L80Yvp4jYpZOEuvqRV85gmpvcMPBFMXteq1R4WpNu21RGe83wuFfAAbjB3YBM6t6c',
  'Durante tres generaciones, la familia de Don José ha cuidado la rica tierra volcánica de la Sierra Nevada. Cada grano se recolecta a mano en su punto óptimo de madurez, se seca al sol en camas africanas elevadas y se selecciona con meticulosidad.',
  'Sierra Nevada, Magdalena',
  11.152657409735482,
  -74.09185030956294,
  35,
  14250
)
on conflict (id) do update set
  nombre = excluded.nombre,
  nombre_corto = excluded.nombre_corto,
  lat = excluded.lat,
  lng = excluded.lng,
  ventas_mes_usd = excluded.ventas_mes_usd;

-- Lote principal (QR demo)
insert into lotes (
  id, slug, productor_id, producto, variedad, cantidad_kg, fecha_cosecha,
  estado_actual, foto_url, finca_nombre, elevacion,
  blockchain_hash, contract_address, precio_usd, tags, product_detail,
  dashboard_status, dashboard_status_label
)
values (
  '22222222-2222-2222-2222-222222222201',
  'finca-la-esperanza',
  '11111111-1111-1111-1111-111111111101',
  'Café',
  'Castillo',
  500,
  '2023-10-12',
  'En secado · Listo en 3 días',
  null,
  'Finca La Esperanza',
  '1.600 m',
  '0xc13cbb1566fe10eb1a846449a214f940f18515264e6d382e3157c9c62b7fdbb0',
  '0x4D773045b5ffD0292107A46EdA37d76a33C668dc',
  45,
  array['Sierra Nevada', 'Variedad Castillo'],
  '{
    "displayName": "Café Castillo · Tostión media",
    "brand": {
      "name": "Esperanza Specialty Coffee",
      "tagline": "Café de especialidad de la Sierra Nevada del Magdalena",
      "description": "Marca comercial de exportación de la familia de Don José. Cada lote Castillo se identifica con trazabilidad Huella desde cosecha hasta empaque."
    },
    "farm": {
      "name": "Finca La Esperanza",
      "companyName": "La Esperanza Agrícola — empresa familiar",
      "municipality": "Minca, Magdalena",
      "region": "Sierra Nevada del Magdalena, Colombia",
      "description": "Finca de altura con beneficio húmedo propio y secado al sol. Aquí se cultiva y procesa el café que acabas de escanear."
    },
    "summary": "Es el mismo café que probaste en Santa Marta: acidez cítrica brillante, cuerpo medio y un final dulce a panela. Grano 100 % arábica, lavado y secado al sol en la finca.",
    "tastingNotes": "En taza: mandarina, panela y un toque de cacao amargo. Ideal en filtro Chemex o prensa francesa.",
    "specs": [
      {"label": "Variedad", "value": "Castillo"},
      {"label": "Proceso", "value": "Lavado"},
      {"label": "Altitud", "value": "1.600 m"},
      {"label": "Tostión", "value": "Media"},
      {"label": "Disponible", "value": "500 kg"}
    ]
  }'::jsonb,
  'drying',
  'Secado'
)
on conflict (slug) do update set
  estado_actual = excluded.estado_actual,
  foto_url = excluded.foto_url,
  blockchain_hash = excluded.blockchain_hash,
  contract_address = excluded.contract_address,
  product_detail = excluded.product_detail;

-- Segundo lote dashboard (banano — inspección)
insert into lotes (
  id, slug, productor_id, producto, variedad, cantidad_kg, fecha_cosecha,
  estado_actual, foto_url, finca_nombre, elevacion, precio_usd, tags, product_detail,
  dashboard_status, dashboard_status_label
)
values (
  '22222222-2222-2222-2222-222222222202',
  'gros-michel-norte-3',
  '11111111-1111-1111-1111-111111111101',
  'Banano',
  'Gros Michel',
  1200,
  '2026-05-20',
  'En inspección de calidad',
  null,
  'Finca La Esperanza',
  'Lote Norte #3',
  32,
  array['Sierra Nevada', 'Exportación', 'Gros Michel'],
  '{
    "displayName": "Banano Gros Michel · Lote Norte #3",
    "brand": {
      "name": "Esperanza Export Banano",
      "tagline": "Fruta de exportación con origen verificable",
      "description": "Línea de banano Gros Michel de Finca La Esperanza, etiquetada por lote para compradores internacionales y turistas."
    },
    "farm": {
      "name": "Finca La Esperanza",
      "companyName": "La Esperanza Agrícola — empresa familiar",
      "municipality": "Minca, Magdalena",
      "region": "Sierra Nevada del Magdalena, Colombia",
      "description": "El banano de este QR proviene del Lote Norte #3, en la misma finca donde se cultiva el café Castillo de la familia de Don José."
    },
    "summary": "Mismo origen que el café de Finca La Esperanza: fruta de exportación cultivada en suelos volcánicos de la Sierra Nevada, con trazabilidad por lote desde la finca hasta el empaque.",
    "tastingNotes": "Textura firme y aroma dulce característico del Gros Michel; lote en inspección final antes del empaque para mercado internacional.",
    "specs": [
      {"label": "Variedad", "value": "Gros Michel"},
      {"label": "Lote", "value": "Norte #3"},
      {"label": "Cantidad", "value": "1.200 kg"},
      {"label": "Destino", "value": "Exportación"},
      {"label": "Estado", "value": "Inspección de calidad"}
    ]
  }'::jsonb,
  'inspection',
  'Inspección'
)
on conflict (slug) do update set
  product_detail = excluded.product_detail,
  precio_usd = excluded.precio_usd,
  tags = excluded.tags,
  estado_actual = excluded.estado_actual;

-- Trazabilidad pública lote banano (vista turista, orden < 10)
delete from trazabilidad where lote_id = '22222222-2222-2222-2222-222222222202' and orden < 10;

insert into trazabilidad (lote_id, etapa, descripcion, fecha, status, orden) values
  ('22222222-2222-2222-2222-222222222202', 'Cosecha', 'Racimos seleccionados a mano en Lote Norte #3, punto óptimo de madurez para exportación.', '20 may 2026', 'completed', 0),
  ('22222222-2222-2222-2222-222222222202', 'Inspección de calidad', 'Control de calibre, ausencia de plagas y humedad según estándar del comprador internacional.', null, 'current', 1),
  ('22222222-2222-2222-2222-222222222202', 'Empaque', 'Etiquetado con QR Huella y preparación para cadena de frío.', null, 'pending', 2),
  ('22222222-2222-2222-2222-222222222202', 'Envío', 'Salida hacia puerto y documentación de trazabilidad para el importador.', null, 'pending', 3);

delete from certificaciones where lote_id = '22222222-2222-2222-2222-222222222202';

insert into certificaciones (lote_id, tipo, label) values
  ('22222222-2222-2222-2222-222222222202', 'organic', 'Buenas prácticas agrícolas');

-- Trazabilidad lote café
delete from trazabilidad where lote_id = '22222222-2222-2222-2222-222222222201';

insert into trazabilidad (lote_id, etapa, descripcion, fecha, status, orden, blockchain_tx) values
  ('22222222-2222-2222-2222-222222222201', 'Cosecha', 'Cerezas recolectadas a mano y seleccionadas por madurez óptima.', '12 oct 2023', 'completed', 0, '0x394f6b2491b6a7360e2eea8fcb1dc97066826c9559fb2995ca8e6f0fbe954580'),
  ('22222222-2222-2222-2222-222222222201', 'Lavado y fermentación', 'Proceso húmedo tradicional para resaltar la acidez brillante.', '14 oct 2023', 'completed', 1, '0x3570518cc1846b31f19d7412444973b2c64b1417800b86fff27fd7f7e0371a59'),
  ('22222222-2222-2222-2222-222222222201', 'Secado al sol', 'Reposo en camas elevadas hasta alcanzar la humedad ideal.', null, 'current', 2, '0x4ef2d3fea8fd0ff972d1da8e56983629df59bdafb3e906479b80ccebf385654e'),
  ('22222222-2222-2222-2222-222222222201', 'Listo para exportación', 'Control de calidad final y preparación para el envío.', null, 'pending', 3, '0xa628b386a19b9a4b2ab3fa7c7102a17cc124ec5ff153d84c111359d33544b323');

-- Trazabilidad dashboard (pasos cortos)
delete from trazabilidad where lote_id = '22222222-2222-2222-2222-222222222202';

insert into trazabilidad (lote_id, etapa, descripcion, status, orden) values
  ('22222222-2222-2222-2222-222222222202', 'Cosecha', null, 'completed', 0),
  ('22222222-2222-2222-2222-222222222202', 'Inspección', null, 'current', 1),
  ('22222222-2222-2222-2222-222222222202', 'Empaque', null, 'pending', 2),
  ('22222222-2222-2222-2222-222222222202', 'Envío', null, 'pending', 3);

-- Pasos dashboard lote café (vista productor)
insert into trazabilidad (lote_id, etapa, descripcion, status, orden)
select '22222222-2222-2222-2222-222222222201', etapa, null, status, orden + 10
from (values
  ('Cosecha', 'completed', 0),
  ('Lavado', 'completed', 1),
  ('Secado', 'current', 2),
  ('Reposo', 'pending', 3)
) as d(etapa, status, orden)
where not exists (
  select 1 from trazabilidad t
  where t.lote_id = '22222222-2222-2222-2222-222222222201' and t.orden = d.orden + 10
);

-- Certificaciones
delete from certificaciones where lote_id = '22222222-2222-2222-2222-222222222201';

insert into certificaciones (lote_id, tipo, label) values
  ('22222222-2222-2222-2222-222222222201', 'organic', 'Certificado Orgánico'),
  ('22222222-2222-2222-2222-222222222201', 'fairtrade', 'Comercio Justo'),
  ('22222222-2222-2222-2222-222222222201', 'rainforest', 'Rainforest Alliance');

-- Agencias
insert into agencias (id, slug, nombre, whatsapp, tagline, descripcion) values
  ('33333333-3333-3333-3333-333333333301', 'experiencias-don-jose', 'Experiencias Don José', '573001234567', null, null),
  (
    '33333333-3333-3333-3333-333333333302',
    'huella-tours',
    'Huella Tours',
    '573009876543',
    'Tours bilingües en la Sierra Nevada del Magdalena',
    'Conectamos turistas en Santa Marta y Minca con fincas trazables. Comparte el QR Huella y reserva experiencias por WhatsApp.'
  ),
  ('33333333-3333-3333-3333-333333333303', 'sierra-coffee', 'Sierra Coffee Agency', null, null, null),
  ('33333333-3333-3333-3333-333333333304', 'magdalena-roots', 'Magdalena Roots Travel', null, null, null),
  ('33333333-3333-3333-3333-333333333305', 'andes-experience', 'Andes Experience Co.', null, null, null)
on conflict (id) do update set
  slug = excluded.slug,
  nombre = excluded.nombre,
  whatsapp = excluded.whatsapp,
  tagline = excluded.tagline,
  descripcion = excluded.descripcion;

-- Experiencias
insert into experiencias (id, lote_id, slug, titulo, resumen, descripcion, imagen_url, orden)
values (
  '44444444-4444-4444-4444-444444444401',
  '22222222-2222-2222-2222-222222222201',
  'tour-finca',
  'Tour a la finca',
  'Recorre cultivos, beneficio y secado con cata guiada.',
  'Vive el origen del café que escaneaste: camina entre los árboles, conoce el proceso de beneficio y termina con una cata guiada en la finca.',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB7f2AT1G5fRQUIgib4Ww_tLuuV6NQ_F8zd9aferxtQSzjxpCSMeHdF-Ssq9pLDYVU__5lMti4SMie6f9pL1plvzfUewd9XEKPiNJ7P-IMCgEmdYnHdMsauN5HSuITWQbWBP1NHBYd7MJIvDrCKL66Db9QrwkdqcUXSUexaXwHnXXZ95x8du2gG2S7FEi8U7Haj59AZ0_WFYoUTNh8IuZ_8TlANJZyBnPnCO30b_wRyIN3PNPk__N4UflxMpjomVue1wxQ0ipkHDVyM',
  0
)
on conflict (id) do update set
  titulo = excluded.titulo,
  resumen = excluded.resumen,
  descripcion = excluded.descripcion,
  imagen_url = excluded.imagen_url,
  orden = excluded.orden;

insert into experiencias (id, lote_id, slug, titulo, resumen, descripcion, imagen_url, orden)
values (
  '44444444-4444-4444-4444-444444444402',
  '22222222-2222-2222-2222-222222222201',
  'ruta-sierra',
  'Ruta Sierra Nevada + Filtrado',
  'Sendero ecológico, historia local y taller de métodos filtrados.',
  'Experiencia extendida por la Sierra Nevada con parada en finca aliada y taller práctico de preparación en Chemex y V60.',
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop',
  1
)
on conflict (id) do update set
  titulo = excluded.titulo,
  resumen = excluded.resumen,
  descripcion = excluded.descripcion,
  imagen_url = excluded.imagen_url,
  orden = excluded.orden;

-- Proveedores experiencia 1
delete from experiencia_proveedores where experiencia_id = '44444444-4444-4444-4444-444444444401';

insert into experiencia_proveedores (experiencia_id, agencia_id, agency_name, descripcion, duracion, precio, punto_encuentro, capacidad, idiomas) values
  ('44444444-4444-4444-4444-444444444401', '33333333-3333-3333-3333-333333333301', 'Experiencias Don José', 'Tour directo con la familia productora en Finca La Esperanza.', '3 horas', 85, 'Entrada principal "Finca La Esperanza"', '12 personas', array['Español']),
  ('44444444-4444-4444-4444-444444444401', '33333333-3333-3333-3333-333333333302', 'Huella Tours', 'Incluye guía bilingüe y kit de cata para llevar.', '3.5 horas', 95, 'Centro de Minca · punto Huella', '10 personas', array['Español', 'Inglés']),
  ('44444444-4444-4444-4444-444444444401', '33333333-3333-3333-3333-333333333303', 'Sierra Coffee Agency', 'Grupo pequeño con enfoque fotográfico y cata comparativa.', '4 horas', 78, 'Plaza de Minca', '6 personas', array['Español']);

delete from experiencia_proveedores where experiencia_id = '44444444-4444-4444-4444-444444444402';

insert into experiencia_proveedores (experiencia_id, agencia_id, agency_name, descripcion, duracion, precio, punto_encuentro, capacidad, idiomas) values
  ('44444444-4444-4444-4444-444444444402', '33333333-3333-3333-3333-333333333304', 'Magdalena Roots Travel', 'Ruta completa con transporte desde Santa Marta.', '5 horas', 120, 'Parque principal de Minca', '8 personas', array['Español', 'Inglés']),
  ('44444444-4444-4444-4444-444444444402', '33333333-3333-3333-3333-333333333305', 'Andes Experience Co.', 'Versión premium con almuerzo campesino incluido.', '6 horas', 145, 'Hotel pickup · zona rodadero', '6 personas', array['Español', 'Inglés', 'Francés']);
