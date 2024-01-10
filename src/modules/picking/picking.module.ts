import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CoreModule } from '@mush/modules/core-module/core.module'

import { Picking } from './picking.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Picking]), CoreModule],
})
export class PickingModule {}
