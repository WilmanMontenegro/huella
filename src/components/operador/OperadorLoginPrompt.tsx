import { RoleAccederLink } from "@/components/auth/RoleAccederLink";
import { getOperadorDashboardPath } from "@/lib/auth";

interface OperadorLoginPromptProps {
  agenciaSlug?: string;
}

export function OperadorLoginPrompt({ agenciaSlug }: OperadorLoginPromptProps) {
  return (
    <RoleAccederLink
      role="operador"
      next={getOperadorDashboardPath(agenciaSlug)}
      className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 font-body text-label-md text-on-primary"
    />
  );
}
