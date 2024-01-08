import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CoreModule } from '@mush/core-module/core.module'

import { DriversEntity } from './drivers.entity'
import { DriversController } from './drivers.controller'
import { DriversService } from './drivers.service'

@Module({
  imports: [TypeOrmModule.forFeature([DriversEntity]), CoreModule],
  controllers: [DriversController],
  providers: [DriversService],
  exports: [DriversService],
})
export class DriversModule {}
