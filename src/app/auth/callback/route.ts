import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { assignDefaultOperadorAgencia } from "@/lib/auth/operador-onboarding";
import {
  HUELLA_ROLE_KEY,
  parseHuellaRole,
  readRoleFromUserMetadata,
  resolveRedirectAfterAuth,
} from "@/lib/auth";

async function applyRoleIfNeeded(
  supabase: ReturnType<typeof createServerClient>,
  roleParam: string | null
) {
  const role = parseHuellaRole(roleParam);
  if (!role) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const existing = readRoleFromUserMetadata(user.user_metadata as Record<string, unknown>);
  if (existing === role) return;

  await supabase.auth.updateUser({
    data: { [HUELLA_ROLE_KEY]: role },
  });

  if (role === "operador") {
    await assignDefaultOperadorAgencia(user.id);
  }
}

function completarPerfilUrl(origin: string, next: string, rol: string | null) {
  const q = new URLSearchParams({ completar: "1", next });
  if (rol) q.set("rol", rol);
  return `${origin}/acceder?${q.toString()}`;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const roleParam = searchParams.get("role") ?? searchParams.get("pending_rol");
  let next = searchParams.get("next") ?? "/";
  if (!next.startsWith("/")) next = "/";

  if (code) {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      await applyRoleIfNeeded(supabase, roleParam);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      const role = readRoleFromUserMetadata(user?.user_metadata as Record<string, unknown>);

      if (!role) {
        return NextResponse.redirect(completarPerfilUrl(origin, next, roleParam));
      }

      const path = resolveRedirectAfterAuth(next, role);
      return NextResponse.redirect(new URL(path, origin));
    }
    console.error("[auth/callback]", error.message);
  }

  const failNext = encodeURIComponent(next);
  return NextResponse.redirect(`${origin}/acceder?error=auth&next=${failNext}`);
}
