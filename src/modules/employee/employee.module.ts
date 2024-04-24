import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CoreModule } from '@mush/modules/core-module/core.module'
import { FileUploadModule } from '@mush/modules/file-upload/file-upload.module'
import { PublicFile } from '../file-upload/public-file.entity';
import { EmployeeController } from './employee.controller'
import { Employee } from './employee.entity'
import { EmployeeService } from './employee.service'

@Module({
  imports: [TypeOrmModule.forFeature([Employee, PublicFile]), CoreModule, FileUploadModule],
  controllers: [EmployeeController],
  providers: [EmployeeService],
  exports: [EmployeeService],
})
export class EmployeeModule {}
