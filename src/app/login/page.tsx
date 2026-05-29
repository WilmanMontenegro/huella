import { TopAppBar } from "@/components/layout/TopAppBar";
import { LoginForm } from "@/components/auth/LoginForm";

interface PageProps {
  searchParams: { next?: string; error?: string };
}

export default function LoginPage({ searchParams }: PageProps) {
  const redirectTo = searchParams.next ?? "/mis-pedidos";

  return (
    <>
      <TopAppBar title="Iniciar sesión" backHref="/" />
      <main className="mx-auto flex min-h-screen max-w-content items-center justify-center px-margin-mobile pb-24 pt-24 md:px-margin-desktop">
        <LoginForm redirectTo={redirectTo} authError={searchParams.error === "auth"} />
      </main>
    </>
  );
}
