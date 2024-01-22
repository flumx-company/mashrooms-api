import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CoreModule } from '@mush/modules/core-module/core.module'

import { Pay } from './pay.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Pay]), CoreModule],
})
export class PayModule {}
