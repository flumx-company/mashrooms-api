import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CategoryModule } from '@mush/modules/category/category.module'
import { CoreModule } from '@mush/modules/core-module/core.module'

import { Subbatch } from './subbatch.entity'
import { SubbatchService } from './subbatch.service'

@Module({
  imports: [TypeOrmModule.forFeature([Subbatch]), CoreModule, CategoryModule],
  providers: [SubbatchService],
  exports: [SubbatchService],
})
export class SubbatchModule {}
