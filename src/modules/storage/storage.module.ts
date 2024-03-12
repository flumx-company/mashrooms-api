import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ChamberModule } from '@mush/modules/chamber/chamber.module'
import { CoreModule } from '@mush/modules/core-module/core.module'
import { VarietyModule } from '@mush/modules/variety/variety.module'
import { WaveModule } from '@mush/modules/wave/wave.module'

import { StorageController } from './storage.controller'
import { Storage } from './storage.entity'
import { StorageService } from './storage.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Storage]),
    CoreModule,
    ChamberModule,
    WaveModule,
    VarietyModule,
  ],
  controllers: [StorageController],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
