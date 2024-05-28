import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { BatchModule } from '@mush/modules/batch/batch.module'
import { CategoryModule } from '@mush/modules/category/category.module'
import { CoreModule } from '@mush/modules/core-module/core.module'
import { ShiftModule } from '@mush/modules/shift/shift.module'
import { StorageModule } from '@mush/modules/storage/storage.module'
import { VarietyModule } from '@mush/modules/variety/variety.module'
import { WaveModule } from '@mush/modules/wave/wave.module'

import { CuttingController } from './cutting.controller'
import { Cutting } from './cutting.entity'
import { CuttingService } from './cutting.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Cutting]),
    CoreModule,
    CategoryModule,
    VarietyModule,
    BatchModule,
    WaveModule,
    ShiftModule,
    StorageModule,
  ],
  controllers: [CuttingController],
  providers: [CuttingService],
  exports: [CuttingService],
})
export class CuttingModule {}
