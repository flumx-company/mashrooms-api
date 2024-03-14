import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ChamberModule } from '@mush/modules/chamber/chamber.module'
import { CoreModule } from '@mush/modules/core-module/core.module'
import { SubbatchModule } from '@mush/modules/subbatch/subbatch.module'
import { WaveModule } from '@mush/modules/wave/wave.module'

import { BatchController } from './batch.controller'
import { Batch } from './batch.entity'
import { BatchService } from './batch.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Batch]),
    CoreModule,
    ChamberModule,
    WaveModule,
    SubbatchModule,
  ],
  controllers: [BatchController],
  providers: [BatchService],
  exports: [BatchService],
})
export class BatchModule {}
