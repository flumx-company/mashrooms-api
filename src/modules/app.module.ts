import { DataSource } from 'typeorm'

import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'

import { AdminModule } from '@mush/modules/admin/admin.module'
import { AuthModule } from '@mush/modules/auth/auth.module'
import { Category } from '@mush/modules/category/category.entity'
import { CategoryModule } from '@mush/modules/category/category.module'
import { Client } from '@mush/modules/client/client.entity'
import { ClientModule } from '@mush/modules/client/client.module'
import { ContainerModule } from '@mush/modules/container/container.module'
import { CoreModule } from '@mush/modules/core-module/core.module'
import { User } from '@mush/modules/core-module/user/user.entity'
import { Driver } from '@mush/modules/driver/driver.entity'
import { DriverModule } from '@mush/modules/driver/driver.module'
import { Employee } from '@mush/modules/employee/employee.entity'
import { EmployeeModule } from '@mush/modules/employee/employee.module'
import { FileUploadModule } from '@mush/modules/file-upload/file-upload.module'
import { PublicFile } from '@mush/modules/file-upload/public-file.entity'
import { HealthcheckModule } from '@mush/modules/healthcheck/healthcheck.module'
import { Offload } from '@mush/modules/offload/offload.entity'
import { OffloadModule } from '@mush/modules/offload/offload.module'
import { Picking } from '@mush/modules/picking/picking.entity'
import { PickingModule } from '@mush/modules/picking/picking.module'
import { Price } from '@mush/modules/price/price.entity'
import { PriceModule } from '@mush/modules/price/price.module'
import { ProductModule } from '@mush/modules/product/product.module'
import { Shift } from '@mush/modules/shift/shift.entity'
import { WheelbarrowModule } from '@mush/modules/wheelbarrow/wheelbarrow.module'
import { WorkRecord } from '@mush/modules/work-record/work.record.entity'
import { WorkRecordModule } from '@mush/modules/work-record/work.record.module'
import { Work } from '@mush/modules/work/work.entity'
import { WorkModule } from '@mush/modules/work/work.module'
import { Yield } from '@mush/modules/yield/yield.entity'
import { YieldModule } from '@mush/modules/yield/yield.module'

import { TypeORMConfig } from '@mush/config'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ShiftModule } from './shift/shift.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
      envFilePath: ['stack.env'], //NOTE: for dev mode, use .serve.env; for prod mode, use stack.env
    }),
    TypeOrmModule.forRoot({
      ...TypeORMConfig,
      entities: [
        Category,
        Client,
        Driver,
        Employee,
        User,
        Offload,
        Picking,
        Price,
        PublicFile,
        Shift,
        Work,
        WorkRecord,
        Yield,
      ],
    } as TypeOrmModuleOptions),
    CoreModule,
    AuthModule,
    AdminModule,
    CategoryModule,
    ClientModule,
    ContainerModule,
    DriverModule,
    EmployeeModule,
    PickingModule,
    OffloadModule,
    PickingModule,
    PriceModule,
    ProductModule,
    WheelbarrowModule,
    YieldModule,
    FileUploadModule,
    HealthcheckModule,
    ShiftModule,
    WorkModule,
    WorkRecordModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
