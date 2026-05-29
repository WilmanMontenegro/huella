/**
 * Verifica URLs y redirects de auth por perfil (sin Supabase en vivo).
 * Ejecutar: pnpm exec tsx scripts/verify-auth-flows.ts
 */
import {
  buildAccederUrlForRole,
  buildAuthCallbackUrl,
  getPanelPathForRole,
  resolveRedirectAfterAuth,
} from "../src/lib/auth";
import { LANDING_GUEST_ROLES, type HuellaRole } from "../src/lib/auth/roles";

const ROLES: HuellaRole[] = ["turista", "productor", "operador", "exportador"];

const EXPECTED_PANEL: Record<HuellaRole, string> = {
  turista: "/mis-pedidos",
  productor: "/productor/dashboard",
  operador: "/operador/dashboard?agencia=huella-tours",
  exportador: "/exportador/dashboard",
};

let passed = 0;
let failed = 0;

function ok(label: string) {
  passed++;
  console.log(`  ✓ ${label}`);
}

function fail(label: string, detail: string) {
  failed++;
  console.error(`  ✗ ${label}`);
  console.error(`    ${detail}`);
}

function assertEq(actual: string, expected: string, label: string) {
  if (actual === expected) ok(label);
  else fail(label, `esperado "${expected}", obtuvo "${actual}"`);
}

function assertIncludes(haystack: string, needle: string, label: string) {
  if (haystack.includes(needle)) ok(label);
  else fail(label, `"${haystack}" no contiene "${needle}"`);
}

console.log("\n=== Paneles por rol ===\n");
for (const role of ROLES) {
  assertEq(getPanelPathForRole(role), EXPECTED_PANEL[role], `getPanelPathForRole(${role})`);
}

console.log("\n=== Landing → /acceder (buildAccederUrlForRole) ===\n");
for (const role of ROLES) {
  const url = buildAccederUrlForRole(role);
  assertIncludes(url, `rol=${role}`, `${role}: query rol`);
  const encodedNext = encodeURIComponent(EXPECTED_PANEL[role]);
  assertIncludes(url, `next=${encodedNext}`, `${role}: query next al panel`);
}

console.log("\n=== OAuth callback redirect (resolveRedirectAfterAuth) ===\n");
for (const role of ROLES) {
  assertEq(
    resolveRedirectAfterAuth("/", role),
    EXPECTED_PANEL[role],
    `${role}: next=/ → panel del rol`
  );
  assertEq(
    resolveRedirectAfterAuth(EXPECTED_PANEL[role], role),
    EXPECTED_PANEL[role],
    `${role}: next explícito al panel`
  );
}

assertEq(resolveRedirectAfterAuth("/", null), "/", "sin rol y next=/ → home");
assertEq(
  resolveRedirectAfterAuth("/acceder", "turista"),
  "/mis-pedidos",
  "next inválido (/acceder) → panel turista"
);

console.log("\n=== Simulación Google OAuth (callback URL) ===\n");
for (const role of ROLES) {
  const panel = EXPECTED_PANEL[role];
  const callback = buildAuthCallbackUrl(panel, { pending_rol: role });
  assertIncludes(callback, `/auth/callback`, `${role}: path callback`);
  assertIncludes(callback, `next=${encodeURIComponent(panel)}`, `${role}: next en callback`);
  assertIncludes(callback, `pending_rol=${role}`, `${role}: pending_rol en callback`);
}

console.log("\n=== Landing (sin turista: escáner + Entrar) ===\n");
const landingIds = LANDING_GUEST_ROLES.map((r) => r.id);
assertEq(landingIds.join(","), "productor,operador,exportador", "solo perfiles de gestión");
assertEq(landingIds.includes("turista"), false, "turista no duplica escáner");

console.log("\n--- Resumen ---");
console.log(`Pasaron: ${passed}`);
console.log(`Fallaron: ${failed}`);
if (failed > 0) process.exit(1);
console.log("\nTodos los flujos de navegación auth están coherentes.\n");
