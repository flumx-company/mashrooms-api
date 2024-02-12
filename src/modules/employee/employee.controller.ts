import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common'
import { AnyFilesInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import {
  ApiBadGatewayResponse,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiParamOptions,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import { Auth } from '@mush/core/decorators'
import { EPermission, ERole } from '@mush/core/enums'
import { ApiV1 } from '@mush/core/utils'

import { BufferedFile } from '../file-upload/file.model'
import { CreateEmployeeDto } from './dto/create.employee.dto'
import { UpdateEmployeeDto } from './dto/update.employee.dto'
import { Employee } from './employee.entity'
import { EmployeeService } from './employee.service'

@ApiTags('Employees')
@ApiBadGatewayResponse({
  status: 502,
  description: 'Something went wrong',
})
@Controller(ApiV1('employees'))
export class EmployeeController {
  constructor(readonly employeeService: EmployeeService) {}

  @Get()
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.READ_EMPLOYEES,
  })
  @ApiOperation({
    summary:
      'Get list of all employees. Role: SUPERADMIN, ADMIN. Permission: READ_EMPLOYEES.',
  })
  async getAllEmployees(): Promise<Employee[]> {
    return this.employeeService.findAll()
  }

  @Get(':id')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.READ_EMPLOYEES,
  })
  @ApiOperation({
    summary:
      'Get employee whose id was provided. Role: SUPERADMIN, ADMIN. Permission: READ_EMPLOYEES.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  async getEmployee(@Param('id', ParseIntPipe) id: number): Promise<Employee> {
    return this.employeeService.findEmployeeById(id)
  }

  @Post()
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.CREATE_EMPLOYEES,
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(AnyFilesInterceptor())
  @ApiOperation({
    summary:
      'Add a new employee. Role: SUPERADMIN, ADMIN. Permission: CREATE_EMPLOYEES.',
  })
  @ApiBody({
    description: 'Model to add a new employee.',
    type: CreateEmployeeDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Will return the employee data.',
    type: Employee,
  })
  async createEmployee(
    @UploadedFiles() files: Array<BufferedFile>,
    @Body() data: CreateEmployeeDto,
  ): Promise<Employee> {
    return this.employeeService.createEmployee(data, files)
  }

  @Put(':id')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.UPDATE_EMPLOYEES,
  })
  @ApiOperation({
    summary:
      'Update an employee. Role: SUPERADMIN, ADMIN. Permission: UPDATE_EMPLOYEES.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  @ApiBody({
    description: 'Model to update an existing employee.',
    type: UpdateEmployeeDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Will return the employee data.',
    type: Employee,
  })
  async updateEmployee(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateEmployeeDto,
  ): Promise<Employee> {
    return this.employeeService.updateEmployee(id, data)
  }

  @Delete(':id')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.DELETE_EMPLOYEES,
  })
  @ApiOperation({
    summary:
      'Remove an employee. Role: SUPERADMIN, ADMIN. Permission: DELETE_EMPLOYEES',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  @ApiResponse({
    status: 200,
    description: 'Will return boolean result.',
    type: Boolean,
  })
  async removeEmployee(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Boolean> {
    return this.employeeService.removeEmployee(id)
  }
}
