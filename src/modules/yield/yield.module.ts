import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CoreModule } from '@mush/modules/core-module/core.module'

import { Yield } from './yield.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Yield]), CoreModule],
})
export class YieldModule {}
