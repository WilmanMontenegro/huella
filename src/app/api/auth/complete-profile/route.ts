import { NextResponse } from "next/server";
import { assignDefaultOperadorAgencia } from "@/lib/auth/operador-onboarding";
import { HUELLA_ROLE_KEY, parseHuellaRole } from "@/lib/auth/roles";
import { createClientIfConfigured } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { role: roleRaw } = await request.json();
    const role = parseHuellaRole(roleRaw);
    if (!role) {
      return NextResponse.json({ error: "Rol inválido" }, { status: 400 });
    }

    const supabase = await createClientIfConfigured();
    if (!supabase) {
      return NextResponse.json({ error: "Supabase no configurado" }, { status: 503 });
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { error } = await supabase.auth.updateUser({
      data: { [HUELLA_ROLE_KEY]: role },
    });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (role === "operador") {
      await assignDefaultOperadorAgencia(user.id);
    }

    return NextResponse.json({ ok: true, role });
  } catch (error) {
    console.error("[api/auth/complete-profile]", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
