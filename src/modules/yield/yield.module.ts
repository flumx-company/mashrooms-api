import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CoreModule } from '@mush/modules/core-module/core.module'

import { Yield } from './yield.entity'
import { YieldService } from './yield.service'

@Module({
  imports: [TypeOrmModule.forFeature([Yield]), CoreModule],
  providers: [YieldService],
  exports: [YieldService],
})
export class YieldModule {}
