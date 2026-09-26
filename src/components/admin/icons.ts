import {
  BriefcaseBusiness,
  ExternalLink,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  type LucideIcon,
  Mail,
  MessageSquareQuote,
  Plus,
  Settings,
  Sparkles,
} from "lucide-react";
import type { AdminIcon } from "@/content/es/admin";

export const adminIcons: Record<AdminIcon, LucideIcon> = {
  dashboard: LayoutDashboard,
  projects: FolderKanban,
  services: BriefcaseBusiness,
  testimonials: MessageSquareQuote,
  timeline: GraduationCap,
  skills: Sparkles,
  messages: Mail,
  settings: Settings,
  plus: Plus,
  external: ExternalLink,
};
