"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { TopAppBar } from "@/components/layout/TopAppBar";

export function NuevoLoteForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/lotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        producto: form.get("producto"),
        variedad: form.get("variedad"),
        cantidadKg: Number(form.get("cantidadKg")),
        fechaCosecha: form.get("fechaCosecha"),
        estadoActual: form.get("estadoActual"),
        fincaNombre: form.get("fincaNombre"),
        elevacion: form.get("elevacion"),
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.lote?.slug) {
      router.push(`/productor/lote/${data.lote.slug}`);
    } else {
      alert("No se pudo registrar el lote.");
    }
  }

  return (
    <>
      <TopAppBar title="Nuevo lote" backHref="/productor/dashboard" />
      <main className="mx-auto max-w-lg px-margin-mobile pb-24 pt-24 md:px-margin-desktop">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="Producto" name="producto" defaultValue="Café" required />
          <Field label="Variedad" name="variedad" placeholder="Castillo, Caturra…" />
          <Field label="Cantidad (kg)" name="cantidadKg" type="number" defaultValue="500" required />
          <Field label="Fecha de cosecha" name="fechaCosecha" type="date" />
          <Field label="Finca" name="fincaNombre" defaultValue="Finca La Esperanza" required />
          <Field label="Altitud / ubicación" name="elevacion" defaultValue="1.600 m" />
          <Field
            label="Estado actual"
            name="estadoActual"
            defaultValue="En secado · Listo en 3 días"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-tertiary-fixed font-body text-label-md text-on-tertiary-container shadow-fab-yellow disabled:opacity-60"
          >
            <MaterialIcon name="save" />
            {loading ? "Registrando…" : "Registrar lote y generar QR"}
          </button>
        </form>
      </main>
    </>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-body text-label-md text-on-surface-variant">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3 font-body text-body-md outline-none focus:border-secondary"
      />
    </label>
  );
}
