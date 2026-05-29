-- Quitar URLs Unsplash rotas; la app usa /public/media/lots vía resolveLotProductPhotoUrl / resolveFarmPhotoUrl
update lotes
set
  foto_url = null,
  product_detail = product_detail #- '{farm,imageUrl}'
where slug in ('finca-la-esperanza', 'gros-michel-norte-3');
