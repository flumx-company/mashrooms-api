import { Module } from "@nestjs/common";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { ConfigModule } from "@nestjs/config";

import { AdminsModule } from "./admins/admins.module";
import { AuthModule } from "./auth/auth.module";
import { ClientsModule } from "./clients/clients.module";
import { ContainersModule } from "./containers/containers.module";
import { CoreModule } from "./core-module/core.module";
import { DriversModule } from "./drivers/drivers.module";
import { EmployeesModule } from "./employees/employees.module";
import { GatheringModule } from "src/modules/gathering/gathering.module";
import { OffloadsModule } from "./offloads/offloads.module";
import { ProductsModule } from "./products/products.module";
import { WheelbarrowsModule } from "./wheelbarrows/wheelbarrows.module";
import { WorkdaysModule } from "./workdays/workdays.module";

import { ClientsEntity } from "./clients/clients.entity";
import { EmployeesEntity } from "./employees/employees.entity";
import { UsersEntity } from "./core-module/users/users.entity";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
      envFilePath: ["stack.env"], //NOTE: use .prod.env in production
    }),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.MYSQL_NODE_HOSTNAME, //NOTE: external host
      port: parseInt(process.env.MYSQL_TCP_PORT), //NOTE: external port
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      synchronize: Boolean(parseInt(process.env.IS_DB_SYNCHRONIZED)), //NOTE: must be false for production mode
      autoLoadEntities: true,
      entities: [ClientsEntity, EmployeesEntity, UsersEntity],
    } as TypeOrmModuleOptions),
    CoreModule,
    AuthModule,
    AdminsModule,
    ClientsModule,
    ContainersModule,
    DriversModule,
    EmployeesModule,
    GatheringModule,
    OffloadsModule,
    ProductsModule,
    WheelbarrowsModule,
    WorkdaysModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
