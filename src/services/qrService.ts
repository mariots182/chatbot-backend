// src/services/qrService.ts
import { initializeClientForCompany } from "../bot/botClientManager";

const qrStore = new Map<string, string | null>();

export async function setupCompanySession(companyId: string): Promise<void> {
  await initializeClientForCompany(companyId);
}

export function setQR(companyId: string, qr: string | null): void {
  qrStore.set(companyId, qr);
}

export function fetchQR(companyId: string): string | null {
  return qrStore.get(companyId) || null;
}
