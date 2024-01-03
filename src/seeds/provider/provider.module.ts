import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { TypeORMConfig } from "src/config/mysql.config";
import { UsersEntity } from "src/modules/core-module/users/users.entity";
import { OffloadsEntity } from "src/modules/offloads/offloads.entity";

@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
      envFilePath: [".serve.env"], //NOTE: use .prod.env in production
    }),
    TypeOrmModule.forRoot({
      ...TypeORMConfig,
      entities: [UsersEntity, OffloadsEntity],
    } as TypeOrmModuleOptions),
  ],
})
export class MysqlDatabaseProviderModule {}
