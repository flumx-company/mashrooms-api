import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CoreModule } from '@mush/modules/core-module/core.module'

import { CuttingController } from './cutting.controller'
import { Cutting } from './cutting.entity'
import { CuttingService } from './cutting.service'

@Module({
  imports: [TypeOrmModule.forFeature([Cutting]), CoreModule],
  controllers: [CuttingController],
  providers: [CuttingService],
  exports: [CuttingService],
})
export class CuttingModule {}
