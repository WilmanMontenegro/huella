import { redirect } from "next/navigation";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { AuthForm } from "@/components/auth/AuthForm";
import { parseHuellaRole, readRoleFromUserMetadata, resolveRedirectAfterAuth } from "@/lib/auth/roles";
import { createClientIfConfigured } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

interface PageProps {
  searchParams: { next?: string; error?: string; rol?: string; completar?: string };
}

export default async function AccederPage({ searchParams }: PageProps) {
  const redirectTo = searchParams.next?.startsWith("/") ? searchParams.next : "/";
  const initialRole = parseHuellaRole(searchParams.rol);
  const needsRoleCompletion = searchParams.completar === "1";

  if (isSupabaseConfigured()) {
    const supabase = await createClientIfConfigured();
    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const role = readRoleFromUserMetadata(user.user_metadata as Record<string, unknown>);
        if (role && !needsRoleCompletion) {
          redirect(resolveRedirectAfterAuth(redirectTo, role));
        }
        if (role && needsRoleCompletion) {
          redirect(resolveRedirectAfterAuth(redirectTo, role));
        }

        return (
          <>
            <TopAppBar title="Tu perfil en Huella" backHref="/" />
            <main className="mx-auto flex min-h-screen max-w-content items-center justify-center px-margin-mobile pb-24 pt-24 md:px-margin-desktop">
              <AuthForm
                mode="unified"
                redirectTo={redirectTo}
                authError={searchParams.error === "auth"}
                initialRole={initialRole}
                needsRoleCompletion
              />
            </main>
          </>
        );
      }
    }
  }

  return (
    <>
      <TopAppBar title="Entrar / Registrarse" backHref="/" />
      <main className="mx-auto flex min-h-screen max-w-content items-center justify-center px-margin-mobile pb-24 pt-24 md:px-margin-desktop">
        <AuthForm
          mode="unified"
          redirectTo={redirectTo}
          authError={searchParams.error === "auth"}
          initialRole={initialRole}
        />
      </main>
    </>
  );
}
