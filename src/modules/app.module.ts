import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { ConfigModule } from "@nestjs/config";

import { AuthModule } from "./auth/auth.module";
import { CoreModule } from "./core-module/core.module";

import { UsersEntity } from "./core-module/users/users.entity";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AdminsModule } from "./admins/admins.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
      envFilePath: [".env"],
    }),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.MYSQL_NODE_HOSTNAME, //NOTE: external host
      port: parseInt(process.env.MYSQL_TCP_PORT), //NOTE: external port
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      synchronize: true, //NOTE: shouldn't be used in production - otherwise you can lose production data.
      autoLoadEntities: true,
      entities: [UsersEntity],
    }),
    CoreModule,
    AuthModule,
    AdminsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
