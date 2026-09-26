type ClassValue = string | false | null | undefined;

/** Une clases ignorando valores falsy. */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
