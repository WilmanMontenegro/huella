export type ChatArea =
  | "landing"
  | "product-hero"
  | "product-origin"
  | "product-detail"
  | "product-producer"
  | "product-certifications"
  | "product-timeline"
  | "product-tours"
  | "experiences-list"
  | "experience-detail"
  | "checkout"
  | "producer-dashboard"
  | "producer-new-lot"
  | "general";

export interface ChatAreaConfig {
  title: string;
  greeting: string;
  suggestions: string[];
}

export const CHAT_AREA_CONFIG: Record<ChatArea, ChatAreaConfig> = {
  landing: {
    title: "Asistente Huella",
    greeting:
      "Hola, soy tu guía en Huella. Te ayudo a entender cómo funciona la trazabilidad y qué puedes hacer aquí.",
    suggestions: [
      "¿Qué es Huella?",
      "¿Cómo escaneo un producto?",
      "¿Puedo comprar y llevar café a mi país?",
      "¿Qué gana el productor?",
    ],
  },
  "product-hero": {
    title: "Agente · Finca La Esperanza",
    greeting:
      "Agente de Finca La Esperanza. Pregúntame por el lote Castillo, su proceso o cómo visitar la finca.",
    suggestions: [
      "¿En qué etapa está el cultivo hoy?",
      "¿De dónde viene este café?",
      "¿Quién es Don José?",
      "¿Cuándo estará listo para exportación?",
    ],
  },
  "product-origin": {
    title: "Agente · Marca y finca",
    greeting:
      "Aquí ves la marca comercial del producto y la finca donde se cultiva. Pregúntame por la empresa, el origen o la marca.",
    suggestions: [
      "¿Cuál es la marca de este producto?",
      "¿En qué finca se cultiva?",
      "¿Quién es la empresa detrás?",
      "¿Dónde queda la finca?",
    ],
  },
  "product-detail": {
    title: "Agente · Finca La Esperanza",
    greeting:
      "Este es el mismo café Castillo que probaste. Te explico sabor, proceso y cuánto hay disponible en la finca.",
    suggestions: [
      "¿Cómo se siente en taza?",
      "¿Qué método de preparación recomiendas?",
      "¿Cuántos kilos hay disponibles?",
      "¿Por qué es variedad Castillo?",
    ],
  },
  "product-producer": {
    title: "Agente · Finca La Esperanza",
    greeting:
      "Don José y su familia llevan tres generaciones cuidando esta finca. Pregúntame lo que quieras sobre ellos.",
    suggestions: [
      "Cuéntame la historia de la finca",
      "¿Dónde queda Finca La Esperanza?",
      "¿Puedo visitar los cultivos?",
      "¿Cómo cosechan el café?",
    ],
  },
  "product-certifications": {
    title: "Agente · Finca La Esperanza",
    greeting:
      "Estas certificaciones respaldan cómo se cultiva el café en La Esperanza. Te las explico sin tecnicismos.",
    suggestions: [
      "¿Qué significa orgánico en esta finca?",
      "¿Qué es Comercio Justo aquí?",
      "¿Las certificaciones afectan el sabor?",
      "¿Están vigentes para este lote?",
    ],
  },
  "product-timeline": {
    title: "Agente · Finca La Esperanza",
    greeting:
      "El lote va en secado. Pregúntame por etapas, tiempos o comprobantes de trazabilidad.",
    suggestions: [
      "¿En qué etapa va el lote ahora?",
      "¿Qué falta para exportación?",
      "¿Qué es el comprobante verificable?",
      "¿Cómo se seca el café en la finca?",
    ],
  },
  "product-tours": {
    title: "Agente · Finca La Esperanza",
    greeting:
      "¿Quieres conocer la finca en persona? Te recomiendo tour y agencia según tu tiempo y presupuesto.",
    suggestions: [
      "¿Qué tour me recomiendas?",
      "¿Cuál agencia es más económica?",
      "¿Puedo combinar tour y compra del café?",
      "¿Hay tours en inglés?",
    ],
  },
  "experiences-list": {
    title: "Agente de experiencias",
    greeting: "Compara experiencias y elige la que mejor se adapte a tu viaje.",
    suggestions: [
      "¿Cuál experiencia es mejor para principiantes?",
      "¿Hay opciones en inglés?",
      "¿Cuál sale más económica?",
      "¿Qué incluye el tour a la finca?",
    ],
  },
  "experience-detail": {
    title: "Agente de experiencias",
    greeting: "Estás viendo una experiencia concreta. Te ayudo a elegir la mejor agencia para reservar.",
    suggestions: [
      "¿Qué agencia me conviene más?",
      "¿Dónde es el punto de encuentro?",
      "¿Cuántas personas caben?",
      "¿Puedo combinar tour y compra del café?",
    ],
  },
  checkout: {
    title: "Asistente de compra",
    greeting: "Estás por llevar este café contigo. Te ayudo con envío, cantidad y recomendaciones finales.",
    suggestions: [
      "¿Puedo llevarlo en el avión?",
      "¿Cuánto dura el grano fresco?",
      "¿Conviene comprar más de un paquete?",
      "¿Cómo funciona el pago?",
    ],
  },
  "producer-dashboard": {
    title: "Asistente productor",
    greeting: "Te ayudo a gestionar lotes, trazabilidad y ventas en Huella.",
    suggestions: [
      "¿Cómo registro un nuevo lote?",
      "¿Cómo comparto el QR con turistas?",
      "¿Qué datos debo subir en cada etapa?",
      "¿Cómo conecto blockchain?",
    ],
  },
  "producer-new-lot": {
    title: "Asistente productor",
    greeting: "Vas a crear un lote nuevo. Te guío paso a paso para que quede bien documentado.",
    suggestions: [
      "¿Qué información mínima necesito?",
      "¿Cuándo activar la trazabilidad?",
      "¿Puedo editar el lote después?",
      "¿Cómo genero el QR?",
    ],
  },
  general: {
    title: "Asistente Huella",
    greeting: "Hola, ¿en qué te puedo ayudar hoy?",
    suggestions: [
      "¿Qué puedo hacer en Huella?",
      "¿Cómo funciona la trazabilidad?",
      "¿Dónde veo un producto de ejemplo?",
    ],
  },
};

export function areaFromPathname(pathname: string): ChatArea {
  if (pathname === "/") return "landing";
  if (pathname === "/productor/dashboard") return "producer-dashboard";
  if (pathname === "/productor/nuevo-lote") return "producer-new-lot";
  if (/^\/checkout\/.+/.test(pathname)) return "checkout";
  if (/^\/producto\/[^/]+\/experiencias\/[^/]+/.test(pathname)) return "experience-detail";
  if (/^\/producto\/[^/]+\/experiencias/.test(pathname)) return "experiences-list";
  if (/^\/producto\/[^/]+$/.test(pathname)) return "product-hero";
  return "general";
}

export function lotIdFromPathname(pathname: string): string | undefined {
  const match = pathname.match(/^\/producto\/([^/]+)/) ?? pathname.match(/^\/checkout\/([^/]+)/);
  return match?.[1];
}
