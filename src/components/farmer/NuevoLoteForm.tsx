"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { TopAppBar } from "@/components/layout/TopAppBar";
import type { ProductorProfile } from "@/lib/data/lots-repository";

export function NuevoLoteForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<ProductorProfile | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/productor/profile")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          setProfileError(data.error ?? "No se pudo cargar el productor");
          return;
        }
        setProfile(data.profile);
      })
      .catch(() => setProfileError("Error de red al cargar el productor"));
  }, []);

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
        productorId: profile?.id,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.lote?.slug) {
      router.push(`/productor/lote/${data.lote.slug}`);
      router.refresh();
    } else {
      alert(data.error ?? "No se pudo registrar el lote en Supabase.");
    }
  }

  const fincaDefault = profile?.fincaNombre ?? "Finca La Esperanza";
  const productoDefault = profile?.defaultProducto ?? "Café";
  const elevacionDefault = profile?.defaultElevacion ?? "1.600 m";

  return (
    <>
      <TopAppBar title="Nuevo lote" backHref="/productor/dashboard" />
      <main className="mx-auto max-w-lg px-margin-mobile pb-24 pt-24 md:px-margin-desktop">
        {profile && (
          <p className="mb-6 rounded-xl border border-secondary/30 bg-secondary/10 px-4 py-3 font-body text-body-sm text-on-surface-variant">
            Registrando lote para <strong className="text-primary">{profile.fullName}</strong>
            {profile.municipio ? ` · ${profile.municipio}` : ""}
          </p>
        )}
        {profileError && (
          <p className="mb-6 rounded-xl border border-error/40 bg-error/10 px-4 py-3 font-body text-body-sm text-error">
            {profileError}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" key={profile?.id ?? "loading"}>
          <Field label="Producto" name="producto" defaultValue={productoDefault} required />
          <Field label="Variedad" name="variedad" placeholder="Castillo, Caturra…" />
          <Field label="Cantidad (kg)" name="cantidadKg" type="number" defaultValue="500" required />
          <Field label="Fecha de cosecha" name="fechaCosecha" type="date" />
          <Field label="Finca" name="fincaNombre" defaultValue={fincaDefault} required />
          <Field label="Altitud / ubicación" name="elevacion" defaultValue={elevacionDefault} />
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
            {loading ? "Registrando en Supabase…" : "Registrar lote y generar QR"}
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
