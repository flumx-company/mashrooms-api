import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { BatchModule } from '@mush/modules/batch/batch.module'
import { CategoryModule } from '@mush/modules/category/category.module'
import { CoreModule } from '@mush/modules/core-module/core.module'
import { WaveModule } from '@mush/modules/wave/wave.module'

import { YieldController } from './yield.controller'
import { Yield } from './yield.entity'
import { YieldService } from './yield.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Yield]),
    CoreModule,
    BatchModule,
    CategoryModule,
    WaveModule,
  ],
  providers: [YieldService],
  exports: [YieldService],
  controllers: [YieldController],
})
export class YieldModule {}
