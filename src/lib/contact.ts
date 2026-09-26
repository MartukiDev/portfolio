/** Link de WhatsApp (formato internacional sin "+"), con mensaje prellenado opcional. */
export function whatsappUrl(number: string, text?: string): string {
  const base = `https://wa.me/${encodeURIComponent(number)}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** mailto: sin codificar la @ (algunos clientes no la decodifican). */
export function mailtoUrl(email: string, subject?: string): string {
  const address = email.split("@").map(encodeURIComponent).join("@");
  return subject ? `mailto:${address}?subject=${encodeURIComponent(subject)}` : `mailto:${address}`;
}
