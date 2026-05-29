-- Fotos demo: producto (empaque) vs finca (cultivo)
update lotes
set
  foto_url = 'https://images.unsplash.com/photo-1559056199-641a0ac8b55c?w=1200&q=80&auto=format&fit=crop',
  product_detail = jsonb_set(
    coalesce(product_detail, '{}'::jsonb),
    '{farm,imageUrl}',
    '"https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200&q=80&auto=format&fit=crop"'::jsonb,
    true
  )
where slug = 'finca-la-esperanza';

update lotes
set
  foto_url = 'https://images.unsplash.com/photo-1605027990121-4753a3042ed6?w=1200&q=80&auto=format&fit=crop',
  product_detail = jsonb_set(
    coalesce(product_detail, '{}'::jsonb),
    '{farm,imageUrl}',
    '"https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&q=80&auto=format&fit=crop"'::jsonb,
    true
  )
where slug = 'gros-michel-norte-3';
