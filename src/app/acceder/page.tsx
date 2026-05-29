import { redirect } from "next/navigation";
import { AccederPageLayout } from "@/app/acceder/AccederPageLayout";
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
          <AccederPageLayout title={intro.title} subtitle={intro.subtitle}>
            <AuthForm
              redirectTo={redirectTo}
              authError={searchParams.error === "auth"}
              initialRole={initialRole}
              needsRoleCompletion
            />
          </AccederPageLayout>
        );
      }
    }
  }

  return (
    <AccederPageLayout title={intro.title} subtitle={intro.subtitle}>
      <AuthForm
        redirectTo={redirectTo}
        authError={searchParams.error === "auth"}
        initialRole={initialRole}
      />
    </AccederPageLayout>
  );
}
