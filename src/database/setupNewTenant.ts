import pgtools from "pgtools";
import path from "path";
import { execSync } from "child_process";
import { getTenantDatabaseUrl } from "./utils";

const baseConfig = {
  user: process.env.PGUSER!,
  password: process.env.PGPASSWORD!,
  port: parseInt(process.env.PGPORT!, 10),
  host: process.env.PGHOST!,
};

export async function setupNewTenant(tenantId: number): Promise<void> {
  const dbName = `tenant_${tenantId}`;
  const fullTenantUrl = `${process.env.PG_BASE_URL}${dbName}`;
  const schemaPath = path.join(__dirname, "../../prisma/tenant/schema.prisma");

  try {
    await pgtools.createdb(baseConfig, dbName);

    console.log(`✅ Database ${dbName} created`);
  } catch (err: any) {
    if (err.name === "duplicate_database") {
      console.warn(`ℹ️ Database ${dbName} already exists`);

      return;
    } else {
      throw err;
    }
  }

  console.info(`[setupNewTenant] fullTenantUrl: ${fullTenantUrl}`);
  console.info(`[setupNewTenant] Creating new database: ${dbName}`);
  console.info(
    `[setupNewTenant] Applying migrations with schema: ${schemaPath}`
  );

  try {
    execSync(
      `DATABASE_URL="${fullTenantUrl}" npx prisma migrate deploy --schema=${schemaPath}`,
      { stdio: "inherit" }
    );
  } catch (error) {
    console.error("[setupNewTenant] ❌ Error applying migrations:", error);

    throw error;
  }

  console.log(`✅ Migrations applied for ${dbName}`);
}
