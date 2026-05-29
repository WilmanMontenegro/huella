-- Permisos para API pública (rol anon/authenticated). Sin esto, RLS no basta: "permission denied".

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
