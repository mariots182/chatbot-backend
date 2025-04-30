import { companySuscrptionType } from "@prisma/client";

export type BotState =
  | "WELCOME"
  | "REGISTER_NAME"
  | "REGISTER_ADDRESS"
  | "SHOW_CATALOG"
  | "SELECT_PRODUCT"
  | "CONFIRM_ORDER";

export interface CatalogItem {
  id: string;
  name: string;
  price: number;
}

export interface UserSession {
  userId: string;
  state: BotState;
  name?: string;
  address?: string;
  cart?: { item: CatalogItem; quantity: number }[];
  lastActivity: number;
  data: Record<string, any>;
}

export interface Company {
  id: number;
  name: string;
  database: string;
  ownerName?: string;
  ownerPhone?: string;
  ownerEmail?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  address?: string;
  rfc?: string;
  companyType: CompanyType;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export enum CompanyType {
  BASIC = "BASIC",
  PREMIUM = "PREMIUM",
  ENTERPRISE = "ENTERPRISE",
}

export interface NewCompany {
  name: string;
  phoneWhatsapp: string;
}

export interface CompanyUpdateDto {
  name?: string;
  database?: string;
  ownerName?: string;
  ownerPhone?: string;
  ownerEmail?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  address?: string;
  rfc?: string;
  companyType?: CompanyType;
  active?: boolean;
  deletedAt?: Date | null;
}
