// Returns the full connection string for a tenant DB
export function getTenantDatabaseUrl(tenantId: string): string {
  const base = process.env.PG_BASE_URL;
  if (!base) throw new Error("PG_BASE_URL not set");
  return `${base}tenant_${tenantId}`;
}
