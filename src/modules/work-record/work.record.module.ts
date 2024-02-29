import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CoreModule } from '@mush/modules/core-module/core.module'
import { EmployeeModule } from '@mush/modules/employee/employee.module'
import { ShiftModule } from '@mush/modules/shift/shift.module'
import { WorkModule } from '@mush/modules/work/work.module'

import { WorkRecordController } from './work.record.controller'
import { WorkRecord } from './work.record.entity'
import { WorkRecordService } from './work.record.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkRecord]),
    CoreModule,
    WorkModule,
    EmployeeModule,
    ShiftModule,
  ],
  controllers: [WorkRecordController],
  providers: [WorkRecordService],
  exports: [WorkRecordService],
})
export class WorkRecordModule {}
