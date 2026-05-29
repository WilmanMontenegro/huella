export interface StoredPedido {
  id: string;
  lotSlug: string;
  totalUsd: number;
  estado: string;
  createdAt: string;
}

const STORAGE_KEY = "huellas_pedidos";
const LEGACY_STORAGE_KEY = "magtrace_pedidos";

function readPedidos(): StoredPedido[] {
  if (typeof window === "undefined") return [];
  const current = localStorage.getItem(STORAGE_KEY);
  if (current) return JSON.parse(current) as StoredPedido[];

  const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
  if (legacy) {
    localStorage.setItem(STORAGE_KEY, legacy);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    return JSON.parse(legacy) as StoredPedido[];
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
