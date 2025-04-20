import pgtools from "pgtools";
import path from "path";
import { execSync } from "child_process";
import { Company } from "./utils";

const baseConfig = {
  user: process.env.PGUSER!,
  password: process.env.PGPASSWORD!,
  port: parseInt(process.env.PGPORT!, 10),
  host: process.env.PGHOST!,
};

export async function setupNewTenant(tenant: Company): Promise<void> {
  const dbName = `tenant_${tenant.database.replace(/[^a-zA-Z0-9_]/g, "_")}`;
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

  console.info(`🏗️ [setupNewTenant] fullTenantUrl: ${fullTenantUrl}`);
  console.info(`🏗️ [setupNewTenant] Creating new database: ${dbName}`);
  console.info(
    `🏗️ [setupNewTenant] Applying migrations with schema: ${schemaPath}`
  );

  try {
    execSync(`npx prisma db push --schema=${schemaPath}`, {
      stdio: "inherit",
      env: {
        ...process.env,
        DATABASE_URL: fullTenantUrl,
      },
    });

    console.log(
      `✅ [setupNewTenant] Schema pushed successfully to ${fullTenantUrl}`
    );
  } catch (error) {
    console.error("🏗️ [setupNewTenant] ❌ Error applying migrations:", error);

    throw error;
  }

  console.log(`✅ [setupNewTenant] Migrations applied for ${dbName}`);
}
