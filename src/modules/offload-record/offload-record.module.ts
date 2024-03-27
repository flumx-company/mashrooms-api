import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CoreModule } from '@mush/modules/core-module'

import { OffloadRecordController } from './offload-record.controller'
import { OffloadRecord } from './offload-record.entity'
import { OffloadRecordService } from './offload-record.service'

@Module({
  imports: [TypeOrmModule.forFeature([OffloadRecord]), CoreModule],
  controllers: [OffloadRecordController],
  providers: [OffloadRecordService],
  exports: [OffloadRecordService],
})
export class OffloadRecordModule {}
