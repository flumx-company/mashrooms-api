import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CoreModule } from '@mush/modules/core-module/core.module'

import { PriceController } from './price.controller'
import { Price } from './price.entity'
import { PriceService } from './price.service'

@Module({
  imports: [TypeOrmModule.forFeature([Price]), CoreModule],
  controllers: [PriceController],
  providers: [PriceService],
  exports: [PriceService],
})
export class PriceModule {}
