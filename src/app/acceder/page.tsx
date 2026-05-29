import { redirect } from "next/navigation";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { AuthForm } from "@/components/auth/AuthForm";
import {
  getAccederIntro,
  isAuthDisabled,
  isValidNextPath,
  parseHuellaRole,
  readRoleFromUserMetadata,
  resolveRedirectAfterAuth,
} from "@/lib/auth";
import { createClientIfConfigured } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

interface PageProps {
  searchParams: { next?: string; error?: string; rol?: string; completar?: string };
}

export default async function AccederPage({ searchParams }: PageProps) {
  const redirectTo = searchParams.next?.startsWith("/") ? searchParams.next : "/";
  const initialRole = parseHuellaRole(searchParams.rol);
  const needsRoleCompletion = searchParams.completar === "1";
  const intro = getAccederIntro(initialRole);

  if (isAuthDisabled()) {
    redirect(isValidNextPath(searchParams.next) ? searchParams.next! : "/");
  }

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

        return (
          <>
            <TopAppBar title={intro.title} backHref="/" />
            <main className="mx-auto flex min-h-screen max-w-content flex-col items-center justify-center px-margin-mobile pb-24 pt-24 md:px-margin-desktop">
              <p className="mb-4 max-w-md text-center font-body text-body-sm text-on-surface-variant">
                {intro.subtitle}
              </p>
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
      <TopAppBar title={intro.title} backHref="/" />
      <main className="mx-auto flex min-h-screen max-w-content flex-col items-center justify-center px-margin-mobile pb-24 pt-24 md:px-margin-desktop">
        <p className="mb-4 max-w-md text-center font-body text-body-sm text-on-surface-variant">
          {intro.subtitle}
        </p>
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
