# MagTrace — Plan de trabajo MVP
> Hackathon Regional Magdalena · Colombia 5.0 · 28–29 mayo 2026

---

## El dolor (apertura del pitch)
> "Un turista toma el mejor café de su vida en Santa Marta. Quiere llevárselo a su país. Pero no sabe de dónde viene, si es certificado, si es de calidad real, ni cómo comprarlo. Se va y el agricultor que lo cultivó nunca se enteró."

---

## La solución
**MagTrace** — Sistema de trazabilidad digital agro-turística del Magdalena que conecta al productor, al operador turístico, al exportador y al comprador internacional en un solo ecosistema verificable e inmutable mediante blockchain.

---

## Stack tecnológico
| Capa | Tecnología | Por qué |
|------|-----------|---------|
| Frontend | Next.js 14 + TypeScript | Rápido, conocido, desplegable |
| Base de datos | Supabase (PostgreSQL) | Gratis, auth incluida, tiempo real |
| Blockchain | Polygon Amoy testnet | Gratis, rápido, verificable en vivo (Mumbai deprecado) |
| Librería blockchain | ethers.js | Simple, bien documentada |
| Auth | Supabase Auth (Google OAuth) | Cero fricción para el turista |
| IA | Google Gemini 2.0 Flash (API gratis) | Agente del producto + recomendaciones; tier free en AI Studio |
| QR | qrcode.react | Genera QR del lote en segundos |
| Mapas | Leaflet.js | Muestra ubicación de la finca gratis |

---

## Actores del sistema
1. **Productor** — registra el lote, su historia, fotos, estado del cultivo
2. **Exportador** — valida la cadena, gestiona solicitudes de exportación
3. **Turista / Comprador internacional** — escanea QR, ve trazabilidad, compra
4. **Operador turístico** — punto de acceso pasivo, tiene el QR físico en su negocio

---

## Vistas de la aplicación

### 🌐 Vistas públicas (sin login)

#### `/` — Landing page
- Headline con el dolor
- CTA: "Escanea un producto" / "Soy productor"
- Logos de Fairtrade y Rainforest Alliance

#### `/producto/[id]` — Vista pública del lote ⭐ LA MÁS IMPORTANTE
- Foto del agricultor + nombre + años de experiencia
- Ubicación de la finca en mapa (Leaflet)
- Historia del agricultor (texto narrativo)
- Estado actual del cultivo (ej: "En secado · Listo en 3 días")
- Línea de tiempo de trazabilidad:
  - ✅ Cosecha — fecha, lugar
  - ✅ Procesado — fecha, planta
  - ✅ Certificación Fairtrade — fecha, inspector (documento subido por el productor)
  - ✅ Certificación Rainforest Alliance — fecha (documento subido por el productor)
  - ✅ Empaque — fecha, cantidad disponible
- Botón "Verificar en blockchain" → abre hash real en Polygon Amoy explorer
- Sellos de certificación visibles
- **Tours relacionados** — experiencias disponibles vinculadas al producto: visita a la finca, tour de catación, recorrido por la plantación. El operador turístico las registra en la plataforma
- **Agente especializado del producto** — no es un chatbot genérico, es un agente con contexto real del lote. El turista le pregunta: "¿tiene acidez alta?", "¿puedo llevarlo en el avión?", "¿cuánto tarda en llegar a Alemania?" — responde con datos reales de ese lote específico. Implementado con Gemini Flash (API gratis) pasando el contexto del producto
- Botón **"Comprar"** → redirige a login si no está autenticado

---

### 🔐 Vistas autenticadas (turista/comprador)

#### `/login`
- Login con Google (un clic, cero fricción)

#### `/checkout/[id]` — Proceso de compra
- Cantidad a comprar
- ¿Cómo lo recibe?
  - 📦 **Envío local** — dirección en Colombia
  - ✈️ **Exportación** — país destino + datos básicos
- Resumen del pedido
- Botón pagar (simulado para el MVP)

#### `/mis-pedidos`
- Lista de pedidos del comprador
- Estado del envío

---

### 🌱 Vistas del productor

#### `/productor/dashboard`
- Mis lotes registrados
- Botón "Registrar nuevo lote"

#### `/productor/nuevo-lote`
- Formulario:
  - Nombre del producto (café, banano, cacao)
  - Cantidad (kg)
  - Fecha de cosecha
  - Foto del lote
  - Historia del agricultor
  - Ubicación (lat/lng o municipio)
  - Estado actual del cultivo
  - Temperatura °C — *opcional*, ingreso manual (en producción: sensor IoT automático)
  - Humedad % — *opcional*, ingreso manual (en producción: sensor IoT automático)
  - Condiciones del cultivo — *opcional*, texto libre
- Si el agricultor llena los campos opcionales → la IA analiza y le da recomendaciones inmediatas
- Al guardar → se registra en Supabase + se escribe en Polygon testnet
- Se genera QR automáticamente

#### `/productor/lote/[id]`
- Ver detalle del lote
- Actualizar estado del cultivo (nuevo bloque en blockchain)
- Ver QR generado para imprimir/compartir

---

### 📦 Vistas del exportador

#### `/exportador/dashboard`
- Solicitudes de exportación pendientes
- Lotes disponibles para exportar

#### `/exportador/solicitud/[id]`
- Ver datos del comprador y cantidad solicitada
- Aprobar / rechazar
- Subir documentación de exportación

---

## Modelo de datos (Supabase)

```sql
-- Productores
productores (id, nombre, foto_url, historia, municipio, lat, lng, años_experiencia)

-- Lotes
lotes (id, productor_id, producto, cantidad_kg, fecha_cosecha, estado_actual, foto_url, blockchain_hash, qr_code)

-- Eventos de trazabilidad (la cadena)
trazabilidad (id, lote_id, etapa, descripcion, fecha, responsable, blockchain_tx)

-- Certificaciones
certificaciones (id, lote_id, tipo, fecha, inspector, documento_url)

-- Tours
tours (id, operador_id, titulo, descripcion, duracion, precio, lote_id, disponible)

-- Pedidos
pedidos (id, lote_id, comprador_id, cantidad, tipo_envio, pais_destino, estado, fecha)
```

---

## Plan de construcción por etapas

### ⚡ ETAPA 1 — Base funcional (Día 1 tarde)
- [ ] Crear proyecto Next.js + Supabase
- [ ] Configurar tablas en Supabase
- [ ] Auth con Google OAuth
- [ ] Formulario registro de lote (productor)
- [ ] Vista pública `/producto/[id]` con datos básicos

**Meta:** lote registrado y visible en URL pública

---

### 🔗 ETAPA 2 — Blockchain (Día 1 noche)
- [ ] Configurar wallet en Polygon testnet (Mumbai)
- [ ] Smart contract básico: guardar hash del lote
- [ ] Al crear lote → escribir en Polygon → guardar tx hash en Supabase
- [ ] Botón "Verificar en blockchain" → link al explorer

**Meta:** hash real verificable en Polygon. Esto es el diferenciador técnico.

---

### ✨ ETAPA 3 — El WOW del QR (Día 2 mañana)
- [ ] Generar QR con qrcode.react apuntando a `/producto/[id]`
- [ ] Línea de tiempo de trazabilidad visual
- [ ] Mapa con ubicación de la finca (Leaflet)
- [ ] Historia del agricultor con foto
- [ ] Sellos Fairtrade y Rainforest Alliance visibles (documentos subidos por el productor)
- [ ] Tours relacionados al producto visibles en la vista pública
- [ ] Agente especializado del producto — chat con contexto real del lote vía Gemini Flash (API gratis)

**Meta:** escaneas el QR → ves historia, trazabilidad, tours, y puedes hablar con el agente del producto

---

### 🛒 ETAPA 4 — Flujo de compra (Día 2 antes del pitch)
- [ ] Botón comprar → login Google → checkout
- [ ] Elegir cantidad y tipo de envío
- [ ] Confirmación de pedido (simulada)

**Meta:** flujo completo demostrable en 60 segundos

---

### 🎨 ETAPA 5 — Polish para el pitch (últimas horas)
- [ ] Datos reales o muy realistas (agricultor con nombre, foto, historia)
- [ ] QR listo para poner en la diapositiva
- [ ] Deploy final en Vercel con URL limpia
- [ ] Probar el flujo completo desde el celular

---

## Guía del pitch (lo que pide el jurado)

### 1. Contexto — dónde estamos
Somos equipos del **Hackathon Regional Magdalena · Colombia 5.0** (28–29 mayo 2026). El reto es **agro-turismo digital** en el departamento del Magdalena: Sierra Nevada, Tayrona, Santa Marta, Minca, fincas de café/cacao/banano. Hoy el turismo mueve millones de visitas, pero el productor rural queda fuera de esa cadena de valor.

**Frase de apertura territorial:**
> "En el Magdalena, el turista prueba productos de clase mundial… pero el agricultor que los cultiva no tiene cómo contar su historia ni vender directo."

---

### 2. Problema — en negativo, que duela
No describir features. Describir **pérdida, frustración, desconexión**:

| Quién sufre | Qué pierde |
|-------------|-----------|
| **Turista / comprador** | No sabe origen, certificación ni calidad real. Se va sin comprar o compra sin confianza. No puede llevar el producto a su país. |
| **Productor** | Cultiva café excepcional y nunca se entera de quién lo probó. Sin trazabilidad = sin precio justo ni acceso a exportación. |
| **Operador turístico** | Tiene el producto en la mesa pero no puede demostrar que es auténtico ni conectar al visitante con la finca. |
| **Exportador** | Sin cadena verificable, cada solicitud es manual, lenta y riesgosa. |

**Historia ancla (0:00–0:30):**
> "Un turista toma el mejor café de su vida en Santa Marta. Quiere llevárselo a su país. Pero no sabe de dónde viene, si es certificado, si es de calidad real, ni cómo comprarlo. Se va y el agricultor que lo cultivó nunca se enteró."

---

### 3. Solución — vista del usuario/cliente (no del sistema)
Hablar en **beneficio**, no en arquitectura:

| Usuario | Qué gana con MagTrace |
|---------|----------------------|
| **Turista** | Escanea un QR → ve la historia del agricultor, el mapa de la finca, certificaciones reales, habla con un agente que conoce *ese* lote, y puede comprar o pedir exportación. |
| **Productor** | Registra su lote una vez, genera QR, actualiza el cultivo y recibe recomendaciones de la IA sobre temperatura/humedad. Su producto llega al turista sin intermediarios opacos. |
| **Operador turístico** | Pone el QR en su negocio y ofrece tours vinculados al producto — convierte una taza de café en experiencia + venta. |
| **Exportador** | Ve solicitudes con trazabilidad completa y documentación; aprueba o rechaza con datos verificables en blockchain. |

**Frase solución (0:30–1:00):**
> "MagTrace conecta al turista que escanea un producto con el agricultor que lo cultivó — con historia, certificación verificable y compra en un solo lugar."

---

### 4. Usuarios vs. clientes

| Tipo | Quién es | Rol en MagTrace |
|------|----------|-----------------|
| **Usuario final** | Turista, comprador internacional | Escanea QR, consulta agente IA, compra |
| **Usuario operativo** | Productor / agricultor | Registra lotes, sube certificaciones, actualiza cultivo |
| **Usuario operativo** | Operador turístico | Registra tours, expone QR en punto físico |
| **Usuario operativo** | Exportador | Gestiona solicitudes de exportación |
| **Cliente / beneficiario** | Productores rurales del Magdalena | Acceso a mercado, precio justo, visibilidad |
| **Cliente / beneficiario** | Sector agro-turístico regional | Trazabilidad como ventaja competitiva |
| **Cliente potencial (B2B)** | Cooperativas, cámaras de comercio, entidades del Magdalena | Escala la plataforma a más fincas |

---

### 5. Qué soluciona → a quién (mapa directo)

| Feature | Resuelve para… |
|---------|----------------|
| QR + vista `/producto/[id]` | Turista: confianza e historia en 3 segundos |
| Timeline + certificaciones + mapa | Turista: prueba de origen y calidad |
| Verificar en blockchain | Turista/exportador: "esto no se puede falsificar" |
| Agente IA del producto (Gemini) | Turista: respuestas sobre *ese* lote sin buscar en Google |
| Tours relacionados | Operador turístico + turista: experiencia + venta cruzada |
| Dashboard productor + QR auto | Productor: digitalización sin fricción |
| IA temp/humedad/cultivo | Productor: recomendaciones simples (futuro: IoT) |
| Flujo checkout + exportación | Comprador + exportador: de escaneo a pedido |
| Dashboard exportador | Exportador: solicitudes con cadena verificada |

---

### 6. Tecnologías — qué usamos y por qué las elegimos

| Tecnología | Por qué la elegimos |
|------------|---------------------|
| **Next.js 14 + TypeScript** | Un solo repo, deploy rápido en Vercel, URL pública para el QR en minutos |
| **Supabase** | PostgreSQL + auth Google gratis; tablas de lotes, trazabilidad y pedidos sin montar backend desde cero |
| **Polygon Amoy + ethers.js** | Testnet gratis, tx verificables en explorer en vivo — diferenciador del pitch sin costo |
| **Google OAuth (Supabase Auth)** | El turista entra con un clic; cero fricción en la demo |
| **Gemini 2.0 Flash** | IA gratis para agente del producto y recomendaciones al agricultor; suficiente calidad para el MVP |
| **qrcode.react** | QR del lote al instante, imprimible en diapositiva |
| **Leaflet.js** | Mapa de la finca sin API key de pago |

**Frase tecnología (4:00–4:30):**
> "Elegimos herramientas gratuitas y desplegables en horas — para demostrar en vivo, no en slides."

---

### 7. Impacto esperado (respecto a la necesidad)

| Necesidad | Impacto con MagTrace |
|-----------|---------------------|
| Desconfianza del turista | Trazabilidad visible + blockchain = compra informada |
| Productor invisible | Historia + QR = el agricultor tiene cara y nombre en cada venta |
| Cadena de exportación opaca | Solicitudes con documentación y hash verificable |
| Turismo desconectado del campo | Tours + producto en la misma experiencia |
| Digitalización rural costosa | MVP con stack gratis; escalable a IoT/LoRaWAN después |

**Datos para mencionar (ajustar con cifras reales si las tienen):**
- Magdalena: potencial agro-turístico en Sierra Nevada, Tayrona, Minca
- X productores podrían registrarse con un solo QR por lote
- Un turista escanea → acceso directo a mercado internacional (exportación simulada en MVP)

**Frase impacto (3:30–4:00):**
> "Cada QR es una ventana del Magdalena al mundo: el turista confía, el productor vende, y la región exporta con historia verificable."

---

## Estructura del pitch (5 minutos)

| Tiempo | Contenido | Bloque guía |
|--------|-----------|-------------|
| 0:00–0:30 | Contexto territorial + **problema que duele** (historia del turista) | §1 + §2 |
| 0:30–1:00 | **Solución** desde el usuario — qué gana el turista y el productor | §3 |
| 1:00–2:30 | Demo en vivo — escanear QR, trazabilidad, agente IA, blockchain | Momento WOW |
| 2:30–3:30 | **Quién es usuario/cliente** + mapa solución → usuario | §4 + §5 |
| 3:30–4:00 | **Impacto esperado** — datos Magdalena | §7 |
| 4:00–4:30 | **Tecnologías y por qué** — 1 frase blockchain | §6 |
| 4:30–5:00 | Cierre + visión (IoT, LoRaWAN, exportación automática) | Roadmap |

---

## Frase blockchain para el pitch
> *"Usamos blockchain para garantizar que cada paso del producto — desde la cosecha hasta el comprador — queda registrado de forma permanente y verificable. Si alguien intenta cambiar datos, el sistema lo detecta automáticamente."*

---

## Inteligencia Artificial

La IA se integra en dos puntos clave de la experiencia:

**1. Recomendaciones por ubicación** — cuando el turista escanea el QR, la IA detecta su ubicación y muestra primero los productos más relevantes de la zona. Un turista en el Tayrona ve café de la Sierra Nevada de primero.

**2. Recomendaciones post-compra** — basado en lo que compró o vio, la IA sugiere productos complementarios. Compró café → "también te puede interesar este cacao del mismo agricultor".

**3. Asistencia al agricultor** — el productor ingresa temperatura, humedad y estado del cultivo de forma manual. La IA analiza esos datos y le da recomendaciones simples. En producción esos campos se llenan automáticamente con sensores IoT — el sistema ya está diseñado para recibirlos.

**Implementación para el MVP:** Google **Gemini 2.0 Flash** vía [Google AI Studio](https://aistudio.google.com) — tier **gratis**, sin tarjeta, suficiente para el hackathon.

| Opción | Costo | Cuándo usarla |
|--------|-------|---------------|
| **Gemini 2.0 Flash** ⭐ | Gratis (AI Studio) | MVP — agente del producto + recomendaciones al agricultor |
| **Groq** (Llama 3.3 70B) | Gratis | Plan B si Gemini falla; respuestas muy rápidas |
| **Ollama** (local) | $0, sin internet | Último recurso offline; calidad menor pero demo funciona |

- **Agente del producto** ⭐ va en el MVP — recibe los datos reales del lote como contexto y responde preguntas específicas del turista sobre ese producto. Demostrable en vivo escaneando el QR.
- **Recomendaciones de productos y tours** — secundario, solo si sobra tiempo. Analiza ubicación del escaneo y sugiere productos y tours relevantes.
- **Asistencia al agricultor** — mismo endpoint Gemini; prompt corto con temp/humedad/estado del cultivo.

Variables de entorno: `GEMINI_API_KEY` en `.env.local` (nunca commitear).

Lo que NO va en el MVP: Claude/Anthropic (de pago), recomendaciones post-compra complejas ni análisis de historial. Se menciona como visión futura.

**Frase para el pitch:**
> *"Nuestra IA analiza el comportamiento del comprador y la ubicación del escaneo para conectarlo con los productos más relevantes de su entorno."*

---

## Roadmap futuro (mencionar en el pitch como visión)

- **IA para el agricultor** — el sistema analiza el estado del cultivo y las condiciones climáticas de la Sierra Nevada y le da recomendaciones: *"tu café está en secado, extiéndelo 2 días más por la humedad de esta semana"*
- **IoT + sensores** — temperatura, humedad y condiciones capturadas automáticamente desde la finca
- **LoRaWAN** — conectividad rural de hasta 15km sin internet para zonas sin señal de la Sierra Nevada
- **Cálculo automático de exportación** — cotización por país y cantidad sin intervención manual

---

## Criterios del jurado vs. cómo los cubrimos

| Criterio | Peso | Cómo lo cubrimos |
|----------|------|-----------------|
| Pertinencia Territorial | 25% | Abrimos con dolor real del Magdalena, mencionamos Sierra Nevada, Tayrona, productores locales |
| Innovación y Creatividad | 20% | Blockchain + agente especializado del producto + tours integrados + historia del agricultor |
| Viabilidad Técnica | 20% | Prototipo funcionando en vivo, desplegado en Vercel |
| Impacto Potencial | 20% | X productores beneficiados, acceso directo a mercado internacional |
| Presentación y Comunicación | 15% | Hilo conductor claro, demo en vivo, pitch ensayado |

---

> **Recuerda:** el jurado escanea el QR desde la diapositiva. Ese es el momento WOW. Todo lo demás apunta a ese instante.
