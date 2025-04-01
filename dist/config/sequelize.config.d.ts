declare const _default: (() => {
    type: string;
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    entities: string[];
    logging: boolean;
    migrations: string[];
    migrationsTableName: string;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    type: string;
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    entities: string[];
    logging: boolean;
    migrations: string[];
    migrationsTableName: string;
}>;
export default _default;
