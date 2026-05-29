# Huella — Datos y fuentes (para la sustentación)

Documento interno: qué puedes afirmar con respaldo técnico y qué no.

## Lo que SÍ es verificable hoy en la demo

| Elemento | Cómo se verifica |
|----------|------------------|
| Registro en blockchain | Hash/tx en Polygon Amoy → explorador público (enlace desde la ficha del lote) |
| Orden de trazabilidad | Filas en Supabase (`trazabilidad`, campo `orden`) — coherencia interna |
| Respuestas del asistente IA | Derivadas del JSON del lote cargado en la sesión (no inventan otro producto) |
| Pedidos y referidos | Tablas `pedidos`, `referidos` en Supabase |

## Lo que NO debes presentar como “certificado oficial” sin respaldo

- Certificaciones Fairtrade / Rainforest / orgánico **solo porque aparecen en pantalla** (en MVP son metadatos declarados o demo).
- Cifras de ventas, hectáreas o historias del productor **sin documento o fuente externa**.
- Fotos de finca en el pitch (son ilustrativas en `pitch/images/`).

## Frase recomendada ante el jurado

> «La trazabilidad operativa la registra el productor en nuestra base de datos; el ancla en blockchain permite auditoría pública del registro del lote; las certificaciones de terceros se muestran con transparencia sobre su origen y, en el piloto, con validación documental. El caso que ven es demostración del modelo.»

## Ruta del piloto (datos reales)

1. Convenio con 1–3 fincas: datos de lote, coordenadas y documentos de certificación.
2. Operador turístico: métricas de `?ref=` contrastables con pedidos.
3. Exportador: pedidos internacionales en el mismo sistema.

## Stack (lenguaje profesional)

- **Next.js 14 + Vercel:** SSR, rutas por rol, despliegue gestionado.
- **Supabase:** PostgreSQL, OAuth 2.0, API y políticas por perfil.
- **Gemini:** IA acotada al esquema del lote.
- **Polygon Amoy:** ancla pública; testnet para prototipo, mainnet en producción comercial.
