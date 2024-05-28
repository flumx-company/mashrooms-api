import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CoreModule } from '@mush/modules/core-module/core.module'

import { Wave } from './wave.entity'
import { WaveService } from './wave.service'

@Module({
  imports: [TypeOrmModule.forFeature([Wave]), CoreModule],
  providers: [WaveService],
  exports: [WaveService],
})
export class WaveModule {}
