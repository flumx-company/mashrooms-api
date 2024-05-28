import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CoreModule } from '@mush/modules/core-module/core.module'

import { VarietyController } from './variety.controller'
import { Variety } from './variety.entity'
import { VarietyService } from './variety.service'

@Module({
  imports: [TypeOrmModule.forFeature([Variety]), CoreModule],
  controllers: [VarietyController],
  providers: [VarietyService],
  exports: [VarietyService],
})
export class VarietyModule {}
