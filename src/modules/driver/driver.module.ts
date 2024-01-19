import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CoreModule } from '@mush/modules/core-module/core.module'

import { DriverController } from './driver.controller'
import { Driver } from './driver.entity'
import { DriverService } from './driver.service'

@Module({
  imports: [TypeOrmModule.forFeature([Driver]), CoreModule],
  controllers: [DriverController],
  providers: [DriverService],
  exports: [DriverService],
})
export class DriverModule {}
