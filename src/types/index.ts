export type TraceabilityStepStatus = "completed" | "current" | "pending";

export interface TraceabilityStep {
  id: string;
  title: string;
  description: string;
  date?: string;
  status: TraceabilityStepStatus;
  blockchainTx?: string;
}

export interface Certification {
  id: string;
  type: "organic" | "fairtrade" | "rainforest";
  label: string;
  date?: string;
  documentUrl?: string;
}

export interface TourProvider {
  id: string;
  agencyName: string;
  description?: string;
  duration?: string;
  price?: number;
  meetingPoint?: string;
  capacity?: string;
  languages?: string[];
  whatsapp?: string;
}

export interface TourExperience {
  id: string;
  title: string;
  summary: string;
  description: string;
  imageUrl: string;
  providers: TourProvider[];
}

/** @deprecated Use TourExperience + TourProvider */
export interface Tour {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  providerName?: string;
  duration?: string;
  price?: number;
  meetingPoint?: string;
  capacity?: string;
  languages?: string[];
}

export interface Producer {
  id: string;
  name: string;
  photoUrl: string;
  story: string;
  municipality: string;
  lat: number;
  lng: number;
  yearsOfExperience: number;
}

export interface ProductDetailInfo {
  displayName: string;
  summary: string;
  tastingNotes?: string;
  specs: { label: string; value: string }[];
}

export interface Lot {
  id: string;
  producerId: string;
  product: string;
  variety?: string;
  quantityKg: number;
  harvestDate: string;
  currentStatus: string;
  photoUrl: string;
  farmName: string;
  elevation?: string;
  tags: string[];
  productDetail?: ProductDetailInfo;
  blockchainHash?: string;
  contractAddress?: string;
  priceUsd?: number;
  traceability: TraceabilityStep[];
  certifications: Certification[];
  tour?: Tour;
  tours?: Tour[];
  experiences?: TourExperience[];
}

export interface LotSummary {
  id: string;
  name: string;
  location: string;
  status: string;
  statusLabel: string;
  photoUrl: string;
  steps: { label: string; status: TraceabilityStepStatus }[];
}

export interface ProducerDashboard {
  name: string;
  monthlySalesUsd: number;
  activeLots: number;
  lots: LotSummary[];
}

export interface CheckoutItem {
  lotId: string;
  farmName: string;
  product: string;
  variety?: string;
  priceUsd: number;
  weight: string;
  origin: string;
  imageUrl: string;
}
