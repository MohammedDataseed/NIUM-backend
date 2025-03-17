// sequelize.config.ts
import { registerAs } from "@nestjs/config";

export default registerAs("database", () => ({
  type: "postgres",
  host: process.env.PGHOST || "localhost",
  port: process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : 5433, // Ensures safe parsing
  username: process.env.PGUSER || "postgres",
  password: process.env.PGPASSWORD || "1234",
  database: process.env.PGDATABASE || "nium-dev",
  entities: [__dirname + "/../models/*.model.{ts,js}"], // Ensures proper path resolution
  logging: process.env.NODE_ENV === "development",
  migrations: [__dirname + "/../../db/migrations/*.{ts,js}"], // Ensures migration path is correct
  migrationsTableName: "migrations",
}));
