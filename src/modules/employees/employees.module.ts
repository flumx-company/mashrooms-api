import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CoreModule } from '@mush/modules/core-module/core.module'

import { EmployeesController } from './employees.controller'
import { EmployeesEntity } from './employees.entity'
import { EmployeesService } from './employees.service'

@Module({
  imports: [TypeOrmModule.forFeature([EmployeesEntity]), CoreModule],
  controllers: [EmployeesController],
  providers: [EmployeesService],
  exports: [EmployeesService],
})
export class EmployeesModule {}
