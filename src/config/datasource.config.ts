import { DataSource } from 'typeorm'
import * as dotenv from 'dotenv'
dotenv.config()

export const datasource = new DataSource({
  type: 'mysql',
  logging: true,
  host: process.env.MYSQL_NODE_HOSTNAME,
  port: parseInt(process.env.MYSQL_TCP_PORT),
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: ['dist/modules/**/*.entity{ .ts,.js}'],
  migrations: ['dist/src/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations_TypeORM',
  replication: {
    master: {
      host: process.env.MYSQL_NODE_HOSTNAME,
      port: parseInt(process.env.MYSQL_TCP_PORT),
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    },
    slaves: [
      {
        host: process.env.MYSQL_NODE_HOSTNAME_2,
        port: parseInt(process.env.MYSQL_TCP_PORT_2),
        username: process.env.MYSQL_USER_2,
        password: process.env.MYSQL_PASSWORD_2,
        database: process.env.MYSQL_DATABASE_2,
      },
    ],
  },
})
