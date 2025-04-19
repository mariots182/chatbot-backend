import { getQRCode, initializeClientForCompany } from "../bot/botClientManager";

let latestQR: string | null = null;

export function setupCompanySession(companyId: string) {
  initializeClientForCompany(companyId);
}

export function fetchQR(companyId: string) {
  return getQRCode(companyId);
}

export function setQR(qr: string) {
  latestQR = qr;
}

export function getQR(): string | null {
  return latestQR;
}
