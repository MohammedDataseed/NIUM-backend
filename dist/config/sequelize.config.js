"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)("database", () => ({
    type: "postgres",
    host: process.env.PGHOST || "localhost",
    port: process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : 5433,
    username: process.env.PGUSER || "postgres",
    password: process.env.PGPASSWORD || "1234",
    database: process.env.PGDATABASE || "nium-test-3",
    entities: [__dirname + "/../models/*.model.{ts,js}"],
    logging: process.env.NODE_ENV === "development",
    migrations: [__dirname + "/../../db/migrations/*.{ts,js}"],
    migrationsTableName: "migrations",
}));
//# sourceMappingURL=sequelize.config.js.map