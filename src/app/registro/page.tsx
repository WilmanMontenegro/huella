import { redirect } from "next/navigation";

interface PageProps {
  searchParams: { next?: string; error?: string; rol?: string };
}

/** Redirige al flujo unificado con rol opcional */
export default function RegistroPage({ searchParams }: PageProps) {
  const q = new URLSearchParams();
  if (searchParams.next) q.set("next", searchParams.next);
  if (searchParams.error) q.set("error", searchParams.error);
  if (searchParams.rol) q.set("rol", searchParams.rol);
  const suffix = q.toString() ? `?${q.toString()}` : "";
  redirect(`/acceder${suffix}`);
}
