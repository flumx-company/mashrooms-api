import { Module } from '@nestjs/common'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { ConfigModule } from '@nestjs/config'

import { TypeORMConfig } from '@mush/config'

import { AdminsModule } from '@mush/admins/admins.module'
import { AuthModule } from '@mush/auth/auth.module'
import { ClientsModule } from '@mush/clients/clients.module'
import { ContainersModule } from '@mush/containers/containers.module'
import { CoreModule } from '@mush/core-module/core.module'
import { DriversModule } from '@mush/drivers/drivers.module'
import { EmployeesModule } from '@mush/employees/employees.module'
import { GatheringModule } from '@mush/gathering/gathering.module'
import { OffloadsModule } from '@mush/offloads/offloads.module'
import { ProductsModule } from '@mush/products/products.module'
import { WheelbarrowsModule } from '@mush/wheelbarrows/wheelbarrows.module'
import { WorkdaysModule } from '@mush/workdays/workdays.module'

import { ClientsEntity } from '@mush/clients/clients.entity'
import { DriversEntity } from '@mush/drivers/drivers.entity'
import { EmployeesEntity } from '@mush/employees/employees.entity'
import { OffloadsEntity } from '@mush/offloads/offloads.entity'
import { UsersEntity } from '@mush/users/users.entity'

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
