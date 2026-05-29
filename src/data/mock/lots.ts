import { LOT_MEDIA } from "@/lib/media/lot-images";
import type { Lot, Producer, ProducerDashboard } from "@/types";
import {
  getLotRegistrationTx,
  getContractAddress,
  mergeTraceabilityWithChain,
} from "@/lib/blockchain/demo-lot-chain";

export const DEMO_LOT_ID = "finca-la-esperanza";

const baseTraceability = [
  {
    id: "1",
    title: "Cosecha",
    description: "Cerezas recolectadas a mano y seleccionadas por madurez óptima.",
    date: "12 oct 2023",
    status: "completed" as const,
  },
  {
    id: "2",
    title: "Lavado y fermentación",
    description: "Proceso húmedo tradicional para resaltar la acidez brillante.",
    date: "14 oct 2023",
    status: "completed" as const,
  },
  {
    id: "3",
    title: "Secado al sol",
    description: "Reposo en camas elevadas hasta alcanzar la humedad ideal.",
    status: "current" as const,
  },
  {
    id: "4",
    title: "Listo para exportación",
    description: "Control de calidad final y preparación para el envío.",
    status: "pending" as const,
  },
];

const producer: Producer = {
  id: "prod-1",
  name: "Don José",
  photoUrl: LOT_MEDIA.producerPortrait,
  story:
    "Durante tres generaciones, la familia de Don José ha cuidado la rica tierra volcánica de la Sierra Nevada. Cada grano se recolecta a mano en su punto óptimo de madurez, se seca al sol en camas africanas elevadas y se selecciona con meticulosidad.",
  municipality: "Sierra Nevada, Magdalena",
  lat: 11.152657409735482,
  lng: -74.09185030956294,
  yearsOfExperience: 35,
};

export const demoLot: Lot = {
  id: DEMO_LOT_ID,
  producerId: producer.id,
  product: "Café",
  variety: "Castillo",
  quantityKg: 500,
  harvestDate: "2023-10-12",
  currentStatus: "En secado · Listo en 3 días",
  photoUrl: LOT_MEDIA.coffeeProduct,
  farmName: "Finca La Esperanza",
  elevation: "1.600 m",
  tags: ["Sierra Nevada", "Variedad Castillo"],
  productDetail: {
    displayName: "Café Castillo · Tostión media",
    brand: {
      name: "Esperanza Specialty Coffee",
      tagline: "Café de especialidad de la Sierra Nevada del Magdalena",
      description:
        "Marca comercial de exportación de la familia de Don José. Cada lote Castillo se identifica con trazabilidad Huella desde cosecha hasta empaque.",
    },
    farm: {
      name: "Finca La Esperanza",
      companyName: "La Esperanza Agrícola — empresa familiar",
      municipality: "Minca, Magdalena",
      region: "Sierra Nevada del Magdalena, Colombia",
      description:
        "Finca de altura con beneficio húmedo propio y secado al sol. Aquí se cultiva y procesa el café que acabas de escanear.",
      imageUrl: LOT_MEDIA.coffeeFarm,
    },
    summary:
      "Es el mismo café que probaste en Santa Marta: acidez cítrica brillante, cuerpo medio y un final dulce a panela. Grano 100 % arábica, lavado y secado al sol en la finca.",
    tastingNotes:
      "En taza: mandarina, panela y un toque de cacao amargo. Ideal en filtro Chemex o prensa francesa.",
    specs: [
      { label: "Variedad", value: "Castillo" },
      { label: "Proceso", value: "Lavado" },
      { label: "Altitud", value: "1.600 m" },
      { label: "Tostión", value: "Media" },
      { label: "Disponible", value: "500 kg" },
    ],
  },
  blockchainHash: getLotRegistrationTx(DEMO_LOT_ID) ?? "",
  contractAddress: getContractAddress(),
  priceUsd: 45,
  traceability: mergeTraceabilityWithChain(baseTraceability),
  certifications: [
    { id: "c1", type: "organic", label: "Certificado Orgánico" },
    { id: "c2", type: "fairtrade", label: "Comercio Justo" },
    { id: "c3", type: "rainforest", label: "Rainforest Alliance" },
  ],
  tour: {
    id: "t1",
    title: "Visita Finca La Esperanza",
    description:
      "Sumérgete en el mundo del café de especialidad. Recorre los cultivos con Don José y degusta la cosecha.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB7f2AT1G5fRQUIgib4Ww_tLuuV6NQ_F8zd9aferxtQSzjxpCSMeHdF-Ssq9pLDYVU__5lMti4SMie6f9pL1plvzfUewd9XEKPiNJ7P-IMCgEmdYnHdMsauN5HSuITWQbWBP1NHBYd7MJIvDrCKL66Db9QrwkdqcUXSUexaXwHnXXZ95x8du2gG2S7FEi8U7Haj59AZ0_WFYoUTNh8IuZ_8TlANJZyBnPnCO30b_wRyIN3PNPk__N4UflxMpjomVue1wxQ0ipkHDVyM",
    duration: "3 horas",
    price: 85,
  },
  experiences: [
    {
      id: "tour-finca",
      title: "Tour a la finca",
      summary: "Recorre cultivos, beneficio y secado con cata guiada.",
      description:
        "Vive el origen del café que escaneaste: camina entre los árboles, conoce el proceso de beneficio y termina con una cata guiada en la finca.",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB7f2AT1G5fRQUIgib4Ww_tLuuV6NQ_F8zd9aferxtQSzjxpCSMeHdF-Ssq9pLDYVU__5lMti4SMie6f9pL1plvzfUewd9XEKPiNJ7P-IMCgEmdYnHdMsauN5HSuITWQbWBP1NHBYd7MJIvDrCKL66Db9QrwkdqcUXSUexaXwHnXXZ95x8du2gG2S7FEi8U7Haj59AZ0_WFYoUTNh8IuZ_8TlANJZyBnPnCO30b_wRyIN3PNPk__N4UflxMpjomVue1wxQ0ipkHDVyM",
      providers: [
        {
          id: "prov-don-jose",
          agencyName: "Experiencias Don José",
          description: "Tour directo con la familia productora en Finca La Esperanza.",
          duration: "3 horas",
          price: 85,
          meetingPoint: 'Entrada principal "Finca La Esperanza"',
          capacity: "12 personas",
          languages: ["Español"],
        },
        {
          id: "prov-huella",
          agencyName: "Huella Tours",
          description: "Incluye guía bilingüe y kit de cata para llevar.",
          duration: "3.5 horas",
          price: 95,
          meetingPoint: "Centro de Minca · punto Huella",
          capacity: "10 personas",
          languages: ["Español", "Inglés"],
        },
        {
          id: "prov-sierra",
          agencyName: "Sierra Coffee Agency",
          description: "Grupo pequeño con enfoque fotográfico y cata comparativa.",
          duration: "4 horas",
          price: 78,
          meetingPoint: "Plaza de Minca",
          capacity: "6 personas",
          languages: ["Español"],
        },
      ],
    },
    {
      id: "ruta-sierra",
      title: "Ruta Sierra Nevada + Filtrado",
      summary: "Sendero ecológico, historia local y taller de métodos filtrados.",
      description:
        "Experiencia extendida por la Sierra Nevada con parada en finca aliada y taller práctico de preparación en Chemex y V60.",
      imageUrl:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop",
      providers: [
        {
          id: "prov-roots",
          agencyName: "Magdalena Roots Travel",
          description: "Ruta completa con transporte desde Santa Marta.",
          duration: "5 horas",
          price: 120,
          meetingPoint: "Parque principal de Minca",
          capacity: "8 personas",
          languages: ["Español", "Inglés"],
        },
        {
          id: "prov-andes",
          agencyName: "Andes Experience Co.",
          description: "Versión premium con almuerzo campesino incluido.",
          duration: "6 horas",
          price: 145,
          meetingPoint: "Hotel pickup · zona rodadero",
          capacity: "6 personas",
          languages: ["Español", "Inglés", "Francés"],
        },
      ],
    },
  ],
  tours: [
    {
      id: "t1",
      title: "Visita Finca La Esperanza",
      providerName: "Experiencias Don José",
      description:
        "Recorrido por cultivos, beneficio y secado con cata guiada de café de especialidad.",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB7f2AT1G5fRQUIgib4Ww_tLuuV6NQ_F8zd9aferxtQSzjxpCSMeHdF-Ssq9pLDYVU__5lMti4SMie6f9pL1plvzfUewd9XEKPiNJ7P-IMCgEmdYnHdMsauN5HSuITWQbWBP1NHBYd7MJIvDrCKL66Db9QrwkdqcUXSUexaXwHnXXZ95x8du2gG2S7FEi8U7Haj59AZ0_WFYoUTNh8IuZ_8TlANJZyBnPnCO30b_wRyIN3PNPk__N4UflxMpjomVue1wxQ0ipkHDVyM",
      duration: "3 horas",
      price: 85,
      meetingPoint: 'Entrada principal "Finca La Esperanza"',
      capacity: "12 personas",
      languages: ["Español"],
    },
    {
      id: "t2",
      title: "Ruta Sierra Nevada + Taller de Filtrado",
      providerName: "Magdalena Roots Travel",
      description:
        "Experiencia extendida con sendero ecológico, historia local y taller práctico de métodos filtrados.",
      imageUrl:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop",
      duration: "5 horas",
      price: 120,
      meetingPoint: "Parque principal de Minca",
      capacity: "8 personas",
      languages: ["Español", "Inglés"],
    },
  ],
};

export const demoProducer: ProducerDashboard = {
  name: "José",
  monthlySalesUsd: 14250,
  activeLots: 4,
  lots: [
    {
      id: "lot-1",
      name: "Reserva Caturra",
      location: "Finca El Mirador",
      status: "drying",
      statusLabel: "Secado",
      photoUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBs213Xu341oSOMN8879Vh9z_fk7cK3jVrRqcqobjtsVKTmPsXfEsvVhjFUdh7xY6_TMapsR1q4mZ_APFHxwatsJJFSQLtfauo430I5AuPzT0loUzno7POmj3mHTKCMYHjqI_KgCWpj6KCZeK2IF54OWc6oumFTxIv-OBu61J7PtAIxsWimLayMLTPW4k96hayrPNEaJe4zjQmu3ack22WRGmSpCKwTarCgXBOCFWXh8ZQZY6vBw4lHcEf5eC1JROdbeMiudRZ5sXHq",
      steps: [
        { label: "Cosecha", status: "completed" },
        { label: "Lavado", status: "completed" },
        { label: "Secado", status: "current" },
        { label: "Reposo", status: "pending" },
      ],
    },
    {
      id: "lot-2",
      name: "Gros Michel Exportación",
      location: "Lote Norte #3",
      status: "inspection",
      statusLabel: "Inspección",
      photoUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDWLxCmoza_ZRxwZUFfH3OkHEDxqjmeLNhBuqdxLW22JFUjtJ7DVOr7EI9u0vDr053NXVgThSuP3Beziy0_hyjI7keF9ojJHVjD5TMWI3HI6rcGbzwU_ZbH1zcLLMwHvN0-7FEl8XTxn-ylGz6v0XM4GEpg2Q9JvbhhwOKHoos-wTnedWxbS3Uj5A0iINFwOIaWDku7X8uwGDNMH2HrXlgvxWsz4-8yWsf4vg2LtJemd7ZJ9RQaTCuFIVsfH-RPJv8LnHdiVALoo8qW",
      steps: [
        { label: "Cosecha", status: "completed" },
        { label: "Inspección", status: "current" },
        { label: "Empaque", status: "pending" },
        { label: "Envío", status: "pending" },
      ],
    },
  ],
};

const grosMichelLot: Lot = {
  id: "gros-michel-norte-3",
  producerId: producer.id,
  product: "Banano",
  variety: "Gros Michel",
  quantityKg: 1200,
  harvestDate: "2026-05-20",
  currentStatus: "En inspección de calidad",
  photoUrl: LOT_MEDIA.bananaProduct,
  farmName: "Finca La Esperanza",
  elevation: "Lote Norte #3",
  tags: ["Sierra Nevada", "Exportación", "Gros Michel"],
  productDetail: {
    displayName: "Banano Gros Michel · Lote Norte #3",
    brand: {
      name: "Esperanza Export Banano",
      tagline: "Fruta de exportación con origen verificable",
      description:
        "Línea de banano Gros Michel de Finca La Esperanza, etiquetada por lote para compradores internacionales y turistas.",
    },
    farm: {
      name: "Finca La Esperanza",
      companyName: "La Esperanza Agrícola — empresa familiar",
      municipality: "Minca, Magdalena",
      region: "Sierra Nevada del Magdalena, Colombia",
      description:
        "El banano de este QR proviene del Lote Norte #3, en la misma finca donde se cultiva el café Castillo de la familia de Don José.",
      imageUrl: LOT_MEDIA.bananaFarm,
    },
    summary:
      "Mismo origen que el café de Finca La Esperanza: fruta de exportación en suelos volcánicos de la Sierra Nevada, con trazabilidad por lote desde la finca hasta el empaque.",
    tastingNotes:
      "Textura firme y aroma dulce característico del Gros Michel; lote en inspección final antes del empaque para mercado internacional.",
    specs: [
      { label: "Variedad", value: "Gros Michel" },
      { label: "Lote", value: "Norte #3" },
      { label: "Cantidad", value: "1.200 kg" },
      { label: "Destino", value: "Exportación" },
      { label: "Estado", value: "Inspección de calidad" },
    ],
  },
  priceUsd: 32,
  traceability: [
    {
      id: "b1",
      title: "Cosecha",
      description:
        "Racimos seleccionados a mano en Lote Norte #3, punto óptimo de madurez para exportación.",
      date: "20 may 2026",
      status: "completed",
    },
    {
      id: "b2",
      title: "Inspección de calidad",
      description:
        "Control de calibre, ausencia de plagas y humedad según estándar del comprador internacional.",
      status: "current",
    },
    {
      id: "b3",
      title: "Empaque",
      description: "Etiquetado con QR Huella y preparación para cadena de frío.",
      status: "pending",
    },
    {
      id: "b4",
      title: "Envío",
      description: "Salida hacia puerto y documentación de trazabilidad para el importador.",
      status: "pending",
    },
  ],
  certifications: [{ id: "b-c1", type: "organic", label: "Buenas prácticas agrícolas" }],
  experiences: demoLot.experiences,
};

const lotsById: Record<string, Lot> = {
  [DEMO_LOT_ID]: demoLot,
  "gros-michel-norte-3": grosMichelLot,
};

export function getLotById(id: string): Lot | undefined {
  return lotsById[id];
}

export function getProducerForLot(lot: Lot): Producer {
  if (lot.producerId === producer.id) return producer;
  return producer;
}

export function getExperiencesForLot(lotId: string) {
  const lot = getLotById(lotId);
  if (!lot) return [];
  if (lot.experiences?.length) return lot.experiences;
  const legacy = lot.tours ?? (lot.tour ? [lot.tour] : []);
  return legacy.map((t) => ({
    id: t.id,
    title: t.title,
    summary: t.description,
    description: t.description,
    imageUrl: t.imageUrl,
    providers: [
      {
        id: `${t.id}-provider`,
        agencyName: t.providerName ?? "Proveedor local",
        description: t.description,
        duration: t.duration,
        price: t.price,
        meetingPoint: t.meetingPoint,
        capacity: t.capacity,
        languages: t.languages,
      },
    ],
  }));
}

export function getExperienceById(lotId: string, experienceId: string) {
  return getExperiencesForLot(lotId).find((e) => e.id === experienceId);
}

export function getCheckoutItem(lotId: string) {
  const lot = getLotById(lotId);
  if (!lot) return undefined;
  return {
    lotId: lot.id,
    farmName: lot.farmName,
    product: lot.product,
    variety: lot.variety,
    priceUsd: lot.priceUsd ?? 45,
    weight: "250 g grano entero",
    origin: "Magdalena, COL",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAKuZ5COPjcdx3siIGuK8kxWvm_IYjDi1uhWQuYF-SL2ip5N6M3udeTH1dEFmyS71FWbZWNHiphUWXVQnvQ7J0tv0C-ssTYwuvDQDtiyyemE9Lbu7TgBC03OHRDbpholeCR2WkdAcsOUwoTqFhJEsWcpyT2MKUQVMUjitymse7bIEKm5ZX831u0cbik40oNYB6dYI9feW_bkQRK3gmm48nweK5FFBZhRs462evZfga_xGiFA5cqIBXNPJ_8C8y0auuFtsodeVsoyiP-",
  };
}
