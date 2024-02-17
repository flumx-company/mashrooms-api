import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CoreModule } from '@mush/modules/core-module/core.module'

import { WorkController } from './work.controller'
import { Work } from './work.entity'
import { WorkService } from './work.service'

@Module({
  imports: [TypeOrmModule.forFeature([Work]), CoreModule],
  controllers: [WorkController],
  providers: [WorkService],
  exports: [WorkService],
})
export class WorkModule {}
