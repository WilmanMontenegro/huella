import { TopAppBar } from "@/components/layout/TopAppBar";
import type { ReactNode } from "react";

interface AccederPageLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AccederPageLayout({ title, subtitle, children }: AccederPageLayoutProps) {
  return (
    <>
      <TopAppBar title={title} backHref="/" />
      <main className="mx-auto flex min-h-screen max-w-content flex-col items-center justify-center px-margin-mobile pb-24 pt-24 md:px-margin-desktop">
        <p className="mb-4 max-w-md text-center font-body text-body-sm text-on-surface-variant">
          {subtitle}
        </p>
        {children}
      </main>
    </>
  );
}
