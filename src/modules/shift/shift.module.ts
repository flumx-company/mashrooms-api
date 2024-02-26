import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CoreModule } from '@mush/modules/core-module/core.module'
import { EmployeeModule } from '@mush/modules/employee/employee.module'

import { ShiftController } from './shift.controller'
import { Shift } from './shift.entity'
import { ShiftService } from './shift.service'

@Module({
  imports: [TypeOrmModule.forFeature([Shift]), CoreModule, EmployeeModule],
  controllers: [ShiftController],
  providers: [ShiftService],
  exports: [ShiftService],
})
export class ShiftModule {}
