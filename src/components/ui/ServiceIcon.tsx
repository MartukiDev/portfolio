import { Sparkles } from "lucide-react";
import { createElement } from "react";
import { getServiceIcon } from "@/lib/icons";

type ServiceIconProps = {
  name: string | null | undefined;
  className?: string;
  /** Ícono si el servicio no tiene uno válido; null para no mostrar nada. */
  fallback?: "sparkles" | null;
};

/** Ícono de servicio por nombre (mapa estático de lib/icons). */
export function ServiceIcon({ name, className, fallback = "sparkles" }: ServiceIconProps) {
  const icon = getServiceIcon(name) ?? (fallback ? Sparkles : null);
  return icon ? createElement(icon, { "aria-hidden": true, className }) : null;
}
