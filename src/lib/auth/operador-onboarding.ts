import { linkUserToAgencia } from "@/lib/data/agencia-repository";
import { DEFAULT_OPERADOR_AGENCIA_SLUG } from "@/lib/constants/operador";

/** Vincula operador nuevo a la agencia demo del seed. */
export async function assignDefaultOperadorAgencia(userId: string): Promise<void> {
  await linkUserToAgencia(userId, DEFAULT_OPERADOR_AGENCIA_SLUG);
}
