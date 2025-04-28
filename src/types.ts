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
  createdAt: Date;
  // whatsappId: string;
  // whatsappToken: string;
  // whatsappPhone: string;
  // whatsappClientId: string;
}
