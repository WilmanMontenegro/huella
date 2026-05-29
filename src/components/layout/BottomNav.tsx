import Link from "next/link";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { cn } from "@/lib/utils/cn";

interface BottomNavProps {
  active?: "discover" | "crops" | "history";
}

export function BottomNav({ active = "crops" }: BottomNavProps) {
  const items = [
    { id: "discover" as const, icon: "explore", label: "Explorar", href: "/" },
    { id: "crops" as const, icon: "agriculture", label: "Mis cultivos", href: "/productor/dashboard" },
    { id: "history" as const, icon: "history", label: "Pedidos", href: "/mis-pedidos" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-xl bg-surface/40 px-6 py-3 shadow-[0_-8px_30px_rgba(75,54,33,0.08)] backdrop-blur-xl md:hidden">
      {items.map((item) => {
        const isActive = active === item.id;
        return (
          <Link
            key={item.id}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center p-2 transition-all duration-300 active:scale-90",
              isActive
                ? "rounded-full bg-tertiary-fixed px-5 py-1.5 text-on-tertiary-container shadow-[0_4px_12px_rgba(75,54,33,0.15)]"
                : "text-on-surface-variant hover:text-primary"
            )}
          >
            <MaterialIcon name={item.icon} filled={isActive} className={cn(!isActive && "mb-1")} />
            <span className="mt-0.5 text-[10px] uppercase tracking-wider opacity-80">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
