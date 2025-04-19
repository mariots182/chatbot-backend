import { getQRCode, initializeClientForCompany } from "../bot/botClientManager";

export function setupCompanySession(companyId: string) {
  initializeClientForCompany(companyId);
}

export async function fetchQR(companyId: string): Promise<string | null> {
  return getQRCode(companyId);
}

let latestQR: string | null = null;

export function setQR(qr: string) {
  latestQR = qr;
}

export function getQR(): string | null {
  return latestQR;
}
