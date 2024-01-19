import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CoreModule } from '@mush/modules/core-module/core.module'

import { EmployeeController } from './employee.controller'
import { Employee } from './employee.entity'
import { EmployeeService } from './employee.service'

@Module({
  imports: [TypeOrmModule.forFeature([Employee]), CoreModule],
  controllers: [EmployeeController],
  providers: [EmployeeService],
  exports: [EmployeeService],
})
export class EmployeeModule {}
