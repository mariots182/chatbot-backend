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

export async function setupNewTenant(tenantId: string): Promise<void> {
  const dbName = `tenant_${tenantId}`;
  try {
    await pgtools.createdb(baseConfig, dbName);
    console.log(`✅ Database ${dbName} created`);
  } catch (err: any) {
    if (err.name === "duplicate_database") {
      console.log(`ℹ️ Database ${dbName} already exists`);
    } else {
      throw err;
    }
  }

  // Run migrations on the new tenant DB
  const prismaSchema = path.resolve(process.cwd(), "prisma", "schema.prisma");
  const url = getTenantDatabaseUrl(tenantId);
  execSync(
    `npx prisma migrate deploy --schema=${prismaSchema} --url="${url}"`,
    { stdio: "inherit" }
  );
  console.log(`✅ Migrations applied for ${dbName}`);
}
