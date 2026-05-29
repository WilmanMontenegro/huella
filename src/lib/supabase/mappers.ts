import type {
  Certification,
  CheckoutItem,
  Lot,
  LotSummary,
  Producer,
  ProducerDashboard,
  ProductDetailInfo,
  TourExperience,
  TourProvider,
  TraceabilityStep,
} from "@/types";

export interface DbProductor {
  id: string;
  nombre: string;
  nombre_corto: string | null;
  foto_url: string | null;
  historia: string | null;
  municipio: string | null;
  lat: number | null;
  lng: number | null;
  años_experiencia: number | null;
  ventas_mes_usd: number | null;
}

export interface DbLote {
  id: string;
  slug: string;
  productor_id: string;
  producto: string;
  variedad: string | null;
  cantidad_kg: number;
  fecha_cosecha: string | null;
  estado_actual: string | null;
  foto_url: string | null;
  finca_nombre: string | null;
  elevacion: string | null;
  blockchain_hash: string | null;
  contract_address: string | null;
  precio_usd: number | null;
  tags: string[] | null;
  product_detail: ProductDetailInfo | null;
  dashboard_status: string | null;
  dashboard_status_label: string | null;
}

export interface DbTrazabilidad {
  id: string;
  lote_id: string;
  etapa: string;
  descripcion: string | null;
  fecha: string | null;
  blockchain_tx: string | null;
  status: "completed" | "current" | "pending";
  orden: number;
}

export interface DbCertificacion {
  id: string;
  lote_id: string;
  tipo: string;
  label: string;
  fecha: string | null;
  documento_url: string | null;
}

export interface DbExperiencia {
  id: string;
  lote_id: string;
  slug: string;
  titulo: string;
  resumen: string | null;
  descripcion: string | null;
  imagen_url: string | null;
  orden: number;
}

export interface DbExperienciaProveedor {
  id: string;
  experiencia_id: string;
  agencia_id: string | null;
  agency_name: string;
  descripcion: string | null;
  duracion: string | null;
  precio: number | null;
  punto_encuentro: string | null;
  capacidad: string | null;
  idiomas: string[] | null;
  agencias?: { whatsapp: string | null } | null;
}

export function mapProductor(row: DbProductor): Producer {
  return {
    id: row.id,
    name: row.nombre,
    photoUrl: row.foto_url ?? "",
    story: row.historia ?? "",
    municipality: row.municipio ?? "",
    lat: row.lat ?? 0,
    lng: row.lng ?? 0,
    yearsOfExperience: row.años_experiencia ?? 0,
  };
}

export function mapTraceabilitySteps(rows: DbTrazabilidad[], dashboard = false): TraceabilityStep[] {
  const filtered = dashboard
    ? rows.filter((r) => r.orden >= 10).sort((a, b) => a.orden - b.orden)
    : rows.filter((r) => r.orden < 10).sort((a, b) => a.orden - b.orden);

  return filtered.map((row) => ({
    id: row.id,
    title: row.etapa,
    description: row.descripcion ?? "",
    date: row.fecha ?? undefined,
    status: row.status,
    blockchainTx: row.blockchain_tx ?? undefined,
  }));
}

export function mapDashboardSteps(rows: DbTrazabilidad[]): LotSummary["steps"] {
  const dashboardRows = rows.filter((r) => r.orden >= 10).sort((a, b) => a.orden - b.orden);
  if (dashboardRows.length) {
    return dashboardRows.map((r) => ({ label: r.etapa, status: r.status }));
  }
  return rows
    .filter((r) => r.orden < 10)
    .sort((a, b) => a.orden - b.orden)
    .map((r) => ({ label: r.etapa.split(" ")[0] ?? r.etapa, status: r.status }));
}

export function mapCertifications(rows: DbCertificacion[]): Certification[] {
  return rows.map((row) => ({
    id: row.id,
    type: row.tipo as Certification["type"],
    label: row.label,
    date: row.fecha ?? undefined,
    documentUrl: row.documento_url ?? undefined,
  }));
}

export function mapExperiences(
  experiencias: DbExperiencia[],
  proveedores: DbExperienciaProveedor[]
): TourExperience[] {
  return experiencias
    .sort((a, b) => a.orden - b.orden)
    .map((exp) => ({
      id: exp.slug,
      title: exp.titulo,
      summary: exp.resumen ?? "",
      description: exp.descripcion ?? "",
      imageUrl: exp.imagen_url ?? "",
      providers: proveedores
        .filter((p) => p.experiencia_id === exp.id)
        .map(
          (p): TourProvider => ({
            id: p.id,
            agencyName: p.agency_name,
            description: p.descripcion ?? undefined,
            duration: p.duracion ?? undefined,
            price: p.precio ?? undefined,
            meetingPoint: p.punto_encuentro ?? undefined,
            capacity: p.capacidad ?? undefined,
            languages: p.idiomas ?? undefined,
            whatsapp: p.agencias?.whatsapp ?? undefined,
          })
        ),
    }));
}

export function mapLot(
  lote: DbLote,
  trazabilidad: DbTrazabilidad[],
  certificaciones: DbCertificacion[],
  experiencias: TourExperience[]
): Lot {
  return {
    id: lote.slug,
    producerId: lote.productor_id,
    product: lote.producto,
    variety: lote.variedad ?? undefined,
    quantityKg: Number(lote.cantidad_kg),
    harvestDate: lote.fecha_cosecha ?? "",
    currentStatus: lote.estado_actual ?? "",
    photoUrl: lote.foto_url ?? "",
    farmName: lote.finca_nombre ?? "",
    elevation: lote.elevacion ?? undefined,
    tags: lote.tags ?? [],
    productDetail: lote.product_detail ?? undefined,
    blockchainHash: lote.blockchain_hash ?? undefined,
    contractAddress: lote.contract_address ?? undefined,
    priceUsd: lote.precio_usd ?? undefined,
    traceability: mapTraceabilitySteps(trazabilidad, false),
    certifications: mapCertifications(certificaciones),
    experiences: experiencias,
  };
}

export function mapLotSummary(lote: DbLote, trazabilidad: DbTrazabilidad[]): LotSummary {
  const isBanana = lote.dashboard_status === "inspection";
  const detail = lote.product_detail as { displayName?: string; brand?: { name?: string } } | null;
  const brandOrDetail = detail?.brand?.name ?? detail?.displayName;

  const displayName = brandOrDetail
    ? brandOrDetail
    : isBanana
      ? `${lote.variedad ?? lote.producto} Exportación`
      : lote.slug === "finca-la-esperanza"
        ? "Café Castillo · Finca La Esperanza"
        : `${lote.variedad ?? lote.producto} · ${lote.finca_nombre ?? lote.slug}`;

  const location = isBanana
    ? (lote.elevacion ?? lote.finca_nombre ?? "")
    : (lote.finca_nombre ?? lote.elevacion ?? "");

  return {
    id: lote.slug,
    name: displayName,
    location,
    status: lote.dashboard_status ?? "drying",
    statusLabel: lote.dashboard_status_label ?? lote.estado_actual ?? "",
    photoUrl: lote.foto_url ?? "",
    steps: mapDashboardSteps(trazabilidad),
  };
}

export function mapProducerDashboard(
  productor: DbProductor,
  lotes: LotSummary[]
): ProducerDashboard {
  return {
    name: productor.nombre_corto ?? productor.nombre,
    monthlySalesUsd: Number(productor.ventas_mes_usd ?? 0),
    activeLots: lotes.length,
    lots: lotes,
  };
}

export function mapCheckoutItem(lot: Lot): CheckoutItem {
  return {
    lotId: lot.id,
    farmName: lot.farmName,
    product: lot.product,
    variety: lot.variety,
    priceUsd: lot.priceUsd ?? 45,
    weight: "250 g grano entero",
    origin: "Magdalena, COL",
    imageUrl:
      lot.photoUrl ||
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAKuZ5COPjcdx3siIGuK8kxWvm_IYjDi1uhWQuYF-SL2ip5N6M3udeTH1dEFmyS71FWbZWNHiphUWXVQnvQ7J0tv0C-ssTYwuvDQDtiyyemE9Lbu7TgBC03OHRDbpholeCR2WkdAcsOUwoTqFhJEsWcpyT2MKUQVMUjitymse7bIEKm5ZX831u0cbik40oNYB6dYI9feW_bkQRK3gmm48nweK5FFBZhRs462evZfga_xGiFA5cqIBXNPJ_8C8y0auuFtsodeVsoyiP-",
  };
}
