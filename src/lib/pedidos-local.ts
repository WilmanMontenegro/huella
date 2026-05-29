export interface StoredPedido {
  id: string;
  lotSlug: string;
  totalUsd: number;
  estado: string;
  createdAt: string;
  metodoPago?: string;
  transaccionId?: string;
  cantidad?: number;
  tipoEnvio?: string;
}

const STORAGE_KEY = "huella_pedidos";
const LEGACY_STORAGE_KEYS = ["huellas_pedidos", "magtrace_pedidos"];

function readPedidos(): StoredPedido[] {
  if (typeof window === "undefined") return [];
  const current = localStorage.getItem(STORAGE_KEY);
  if (current) return JSON.parse(current) as StoredPedido[];

  for (const legacyKey of LEGACY_STORAGE_KEYS) {
    const legacy = localStorage.getItem(legacyKey);
    if (legacy) {
      localStorage.setItem(STORAGE_KEY, legacy);
      localStorage.removeItem(legacyKey);
      return JSON.parse(legacy) as StoredPedido[];
    }
  }

  return [];
}

export function savePedidoLocal(pedido: StoredPedido) {
  if (typeof window === "undefined") return;
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as StoredPedido[];
  localStorage.setItem(STORAGE_KEY, JSON.stringify([pedido, ...existing]));
}

export function getPedidosLocal(): StoredPedido[] {
  return readPedidos();
}
