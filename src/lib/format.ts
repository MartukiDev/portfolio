import { site } from "@/content/es/site";

const dateTimeFormat = new Intl.DateTimeFormat(site.locale, {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: site.timeZone,
});

export function formatDateTime(value: string | Date): string {
  return dateTimeFormat.format(typeof value === "string" ? new Date(value) : value);
}

// Fechas sin hora ("2022-03-01"): se formatean en UTC para que no se corran de día por zona horaria.
const monthYearFormat = new Intl.DateTimeFormat(site.locale, {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function formatMonthYear(date: string): string {
  return monthYearFormat.format(new Date(`${date}T00:00:00Z`));
}

/** "mar 2022 – Actual" / "mar 2022 – jul 2025" / "" si no hay fechas. */
export function formatPeriod(inicio: string | null, fin: string | null, currentLabel: string): string {
  if (!inicio && !fin) return "";
  const start = inicio ? formatMonthYear(inicio) : "";
  const end = fin ? formatMonthYear(fin) : currentLabel;
  return start ? `${start} – ${end}` : end;
}
