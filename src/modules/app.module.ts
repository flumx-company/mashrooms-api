import { Module } from "@nestjs/common";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { ConfigModule } from "@nestjs/config";

import { TypeORMConfig } from "src/config/mysql.config";

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
import { DriversEntity } from "./drivers/drivers.entity";
import { EmployeesEntity } from "./employees/employees.entity";
import { OffloadsEntity } from "./offloads/offloads.entity";
import { UsersEntity } from "./core-module/users/users.entity";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
      envFilePath: ["stack.env"], //NOTE: for dev mode, use .serve.env; for prod mode, use stack.env
    }),
    TypeOrmModule.forRoot({
      ...TypeORMConfig,
      entities: [
        ClientsEntity,
        DriversEntity,
        EmployeesEntity,
        OffloadsEntity,
        UsersEntity,
      ],
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
