import { WaveModule } from '@mush/modules/wave/wave.module';
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { BatchModule } from '@mush/modules/batch/batch.module'
import { CoreModule } from '@mush/modules/core-module/core.module'
import { ShiftModule } from '@mush/modules/shift/shift.module'

import { WateringController } from './watering.controller'
import { Watering } from './watering.entity'
import { WateringService } from './watering.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Watering]),
    CoreModule,
    ShiftModule,
    BatchModule,
    WaveModule
  ],
  controllers: [WateringController],
  providers: [WateringService],
  exports: [WateringService],
})
export class WateringModule {}
