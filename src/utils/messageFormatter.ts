import { CatalogItem } from "../types";

export function formatWelcome(): string {
  return "👋 ¡Hola! Bienvenido al asistente. ¿Cuál es tu nombre?";
}

export function formatCatalog(catalog: CatalogItem[]): string {
  if (catalog.length === 0) {
    return "📭 Lo siento, no hay productos en este momento.";
  }
  return `🛒 *Catálogo*:
${catalog.map((c, i) => `${i + 1}. ${c.name} - $${c.price}`).join("\n")}`;
}

export function formatAskAddress(): string {
  return "📍 Por favor envía tu dirección completa.";
}

export function formatConfirm(product: CatalogItem): string {
  return `🧾 Confirmación: *${product.name}* - $${product.price}\nResponde sí para confirmar o no para cancelar.`;
}
