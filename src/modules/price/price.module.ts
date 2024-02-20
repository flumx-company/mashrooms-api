import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CoreModule } from '@mush/modules/core-module/core.module'

import { Price } from './price.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Price]), CoreModule],
})
export class PriceModule {}
