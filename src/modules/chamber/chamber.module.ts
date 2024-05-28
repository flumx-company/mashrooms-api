import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CoreModule } from '@mush/modules/core-module/core.module'

import { ChamberController } from './chamber.controller'
import { Chamber } from './chamber.entity'
import { ChamberService } from './chamber.service'

@Module({
  imports: [TypeOrmModule.forFeature([Chamber]), CoreModule],
  controllers: [ChamberController],
  providers: [ChamberService],
  exports: [ChamberService],
})
export class ChamberModule {}
