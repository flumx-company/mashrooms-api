import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CoreModule } from '@mush/core-module/core.module'

import { EmployeesEntity } from './employees.entity'
import { EmployeesController } from './employees.controller'
import { EmployeesService } from './employees.service'

@Module({
  imports: [TypeOrmModule.forFeature([EmployeesEntity]), CoreModule],
  controllers: [EmployeesController],
  providers: [EmployeesService],
  exports: [EmployeesService],
})
export class EmployeesModule {}
