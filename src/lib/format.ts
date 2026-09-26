import { site } from "@/content/es/site";

const dateTimeFormat = new Intl.DateTimeFormat(site.locale, {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: site.timeZone,
});

export function formatDateTime(value: string | Date): string {
  return dateTimeFormat.format(typeof value === "string" ? new Date(value) : value);
}
