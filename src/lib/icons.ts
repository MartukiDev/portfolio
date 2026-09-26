import {
  Bot,
  Brain,
  Calendar,
  Camera,
  ChartLine,
  Cloud,
  Code,
  Cog,
  Cpu,
  Database,
  FileText,
  GitBranch,
  Globe,
  GraduationCap,
  LayoutDashboard,
  type LucideIcon,
  Mail,
  Map,
  Monitor,
  Palette,
  PenTool,
  Plug,
  Rocket,
  Search,
  Server,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Terminal,
  Users,
  Workflow,
  Wrench,
  Zap,
} from "lucide-react";

/**
 * Íconos disponibles para servicios (services.icono guarda la clave).
 * Lista curada: importar todos los íconos de lucide inflaría el bundle.
 */
export const serviceIcons = {
  globe: Globe,
  "layout-dashboard": LayoutDashboard,
  workflow: Workflow,
  cpu: Cpu,
  code: Code,
  terminal: Terminal,
  smartphone: Smartphone,
  monitor: Monitor,
  database: Database,
  server: Server,
  cloud: Cloud,
  plug: Plug,
  "git-branch": GitBranch,
  "shopping-cart": ShoppingCart,
  bot: Bot,
  brain: Brain,
  "chart-line": ChartLine,
  search: Search,
  palette: Palette,
  "pen-tool": PenTool,
  camera: Camera,
  wrench: Wrench,
  cog: Cog,
  rocket: Rocket,
  zap: Zap,
  "shield-check": ShieldCheck,
  mail: Mail,
  calendar: Calendar,
  users: Users,
  "graduation-cap": GraduationCap,
  "file-text": FileText,
  map: Map,
} as const satisfies Record<string, LucideIcon>;

export type ServiceIconName = keyof typeof serviceIcons;

export const serviceIconNames = Object.keys(serviceIcons) as ServiceIconName[];

export function isServiceIcon(name: string | null | undefined): name is ServiceIconName {
  return typeof name === "string" && name in serviceIcons;
}

/** Ícono de un servicio; null si no tiene o si el nombre ya no existe en la lista. */
export function getServiceIcon(name: string | null | undefined): LucideIcon | null {
  return isServiceIcon(name) ? serviceIcons[name] : null;
}
