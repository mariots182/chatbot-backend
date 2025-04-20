// Returns the full connection string for a tenant DB
export function getTenantDatabaseUrl(tenantDbName: string): string {
  const base = process.env.PG_BASE_URL;

  if (!base) throw new Error("PG_BASE_URL not set");

  return `${base}tenant_${tenantDbName}`;
}

export interface Company {
  id: number;
  name: string;
  database: string;
  createdAt: Date;
}
