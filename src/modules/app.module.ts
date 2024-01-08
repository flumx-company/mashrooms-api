import { Module } from '@nestjs/common'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { ConfigModule } from '@nestjs/config'

import { TypeORMConfig } from '@mush/config'

import { AdminsModule } from '@mush/modules/admins/admins.module'
import { AuthModule } from '@mush/modules/auth/auth.module'
import { ClientsModule } from '@mush/modules/clients/clients.module'
import { ContainersModule } from '@mush/modules/containers/containers.module'
import { CoreModule } from '@mush/modules/core-module/core.module'
import { DriversModule } from '@mush/modules/drivers/drivers.module'
import { EmployeesModule } from '@mush/modules/employees/employees.module'
import { GatheringModule } from '@mush/modules/gathering/gathering.module'
import { OffloadsModule } from '@mush/modules/offloads/offloads.module'
import { ProductsModule } from '@mush/modules/products/products.module'
import { WheelbarrowsModule } from '@mush/modules/wheelbarrows/wheelbarrows.module'
import { WorkdaysModule } from '@mush/modules/workdays/workdays.module'

import { ClientsEntity } from '@mush/modules/clients/clients.entity'
import { DriversEntity } from '@mush/modules/drivers/drivers.entity'
import { EmployeesEntity } from '@mush/modules/employees/employees.entity'
import { OffloadsEntity } from '@mush/modules/offloads/offloads.entity'
import { UsersEntity } from '@mush/modules/core-module/users/users.entity'

import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
      envFilePath: ['stack.env'], //NOTE: for dev mode, use .serve.env; for prod mode, use stack.env
    }),
    TypeOrmModule.forRoot({
      ...TypeORMConfig,
      entities: [
        ClientsEntity,
        DriversEntity,
        EmployeesEntity,
        UsersEntity,
        OffloadsEntity,
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
