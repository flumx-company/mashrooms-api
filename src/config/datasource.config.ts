import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
dotenv.config();

export const datasource = new DataSource({
  type: "mysql",
  host: process.env.MYSQL_NODE_HOSTNAME,
  port: parseInt(process.env.MYSQL_TCP_PORT),
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: ["dist/**/*.entity{ .ts,.js}", "dist/**/**/*.entity{ .ts,.js}"],
  migrations: ["dist/src/migrations/*{.ts,.js}"],
  migrationsTableName: "migrations_TypeORM",
});
