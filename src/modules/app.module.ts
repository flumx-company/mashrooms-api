import { DataSource } from 'typeorm'

import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'

import { AdminsModule } from '@mush/modules/admins/admins.module'
import { AuthModule } from '@mush/modules/auth/auth.module'
import { Category } from '@mush/modules/category/category.entity'
import { CategoryModule } from '@mush/modules/category/category.module'
import { ClientsEntity } from '@mush/modules/clients/clients.entity'
import { ClientsModule } from '@mush/modules/clients/clients.module'
import { ContainersModule } from '@mush/modules/containers/containers.module'
import { CoreModule } from '@mush/modules/core-module/core.module'
import { UsersEntity } from '@mush/modules/core-module/users/users.entity'
import { DriversEntity } from '@mush/modules/drivers/drivers.entity'
import { DriversModule } from '@mush/modules/drivers/drivers.module'
import { EmployeesEntity } from '@mush/modules/employees/employees.entity'
import { EmployeesModule } from '@mush/modules/employees/employees.module'
import { OffloadsEntity } from '@mush/modules/offloads/offloads.entity'
import { OffloadsModule } from '@mush/modules/offloads/offloads.module'
import { Picking } from '@mush/modules/picking/picking.entity'
import { PickingModule } from '@mush/modules/picking/picking.module'
import { ProductsModule } from '@mush/modules/products/products.module'
import { WheelbarrowsModule } from '@mush/modules/wheelbarrows/wheelbarrows.module'
import { WorkdaysModule } from '@mush/modules/workdays/workdays.module'
import { Yield } from '@mush/modules/yield/yield.entity'
import { YieldModule } from '@mush/modules/yield/yield.module'

import { TypeORMConfig } from '@mush/config'

import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
      envFilePath: ['.serve.env'], //NOTE: for dev mode, use .serve.env; for prod mode, use stack.env
    }),
    TypeOrmModule.forRoot({
      ...TypeORMConfig,
      entities: [
        Category,
        ClientsEntity,
        DriversEntity,
        EmployeesEntity,
        UsersEntity,
        OffloadsEntity,
        Picking,
        Yield,
      ],
    } as TypeOrmModuleOptions),
    CoreModule,
    AuthModule,
    AdminsModule,
    CategoryModule,
    ClientsModule,
    ContainersModule,
    DriversModule,
    EmployeesModule,
    PickingModule,
    OffloadsModule,
    PickingModule,
    ProductsModule,
    WheelbarrowsModule,
    WorkdaysModule,
    YieldModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
