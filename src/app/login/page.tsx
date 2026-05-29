import { redirect } from "next/navigation";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { LoginForm } from "@/components/auth/LoginForm";
import { createClientIfConfigured } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

interface PageProps {
  searchParams: { next?: string; error?: string };
}

export default async function LoginPage({ searchParams }: PageProps) {
  const redirectTo = searchParams.next?.startsWith("/") ? searchParams.next : "/mis-pedidos";

  if (isSupabaseConfigured()) {
    const supabase = await createClientIfConfigured();
    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        redirect(redirectTo);
      }
    }
  }

  return (
    <>
      <TopAppBar title="Acceder" backHref="/" />
      <main className="mx-auto flex min-h-screen max-w-content items-center justify-center px-margin-mobile pb-24 pt-24 md:px-margin-desktop">
        <LoginForm redirectTo={redirectTo} authError={searchParams.error === "auth"} />
      </main>
    </>
  );
}
