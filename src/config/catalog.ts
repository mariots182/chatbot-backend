import { CatalogItem } from "../types";

export const CATALOG: Record<string, CatalogItem[]> = {
  'default': [
    { id: '1', name: 'Garrafón de 20L', price: 200 },
    { id: '2', name: 'Garrafón de 10L', price: 120 },
    { id: '3', name: 'Garrafón de 5L', price: 70 },
  ]
};

export function getCatalog(companyId: string): CatalogItem[] {
  return CATALOG[companyId] || CATALOG['default'];
}