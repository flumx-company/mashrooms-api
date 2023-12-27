import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { UsersEntity } from "src/modules/core-module/users/users.entity";

@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
      envFilePath: [".serve.env"], //NOTE: use .prod.env in production
    }),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.MYSQL_NODE_HOSTNAME, //NOTE: external host
      port: parseInt(process.env.MYSQL_TCP_PORT), //NOTE: external port
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      synchronize:  Boolean(process.env.IS_DB_SYNCHRONIZED), //NOTE: shouldn't be used in production - otherwise you can lose production data.
      autoLoadEntities: true,
      entities: [UsersEntity],
    } as TypeOrmModuleOptions),
  ],
})
export class MysqlDatabaseProviderModule {}
