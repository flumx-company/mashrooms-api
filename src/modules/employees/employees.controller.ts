import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiBadGatewayResponse,
  ApiBody,
  ApiResponse,
  ApiParam,
  ApiParamOptions,
} from '@nestjs/swagger'

import { Auth } from '@mush/core/decorators'
import { ERole, EPermission } from '@mush/core/enums'
import { ApiV1 } from '@mush/core/utils'

import { EmployeesService } from './employees.service'
import { EmployeesEntity } from './employees.entity'
import { CreateEmployeeDto } from './dto/create.employees.dto'
import { UpdateEmployeeDto } from './dto/update.employees.dto'

@ApiTags('Employees')
@ApiBadGatewayResponse({
  status: 502,
  description: 'Something went wrong',
})
@Controller(ApiV1('employees'))
export class EmployeesController {
  constructor(readonly employeesService: EmployeesService) {}

  @Get()
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.READ_EMPLOYEES,
  })
  @ApiOperation({
    summary: 'Get list of all employees. Role: SUPERADMIN, ADMIN. Permission: READ_EMPLOYEES.',
  })
  async getAllEmployees(): Promise<EmployeesEntity[]> {
    return this.employeesService.findAll()
  }

  @Post()
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.CREATE_EMPLOYEES,
  })
  @ApiOperation({
    summary: 'Add a new employee. Role: SUPERADMIN, ADMIN. Permission: CREATE_EMPLOYEES.',
  })
  @ApiBody({
    description: 'Model to add a new employee.',
    type: CreateEmployeeDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Will return the employee data.',
    type: EmployeesEntity,
  })
  async createEmployee(
    @Body() data: CreateEmployeeDto,
  ): Promise<EmployeesEntity> {
    return this.employeesService.createEmployee(data)
  }

  @Put(':id')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.UPDATE_EMPLOYEES,
  })
  @ApiOperation({
    summary: 'Update an employee. Role: SUPERADMIN, ADMIN. Permission: UPDATE_EMPLOYEES.',
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
    type: EmployeesEntity,
  })
  async updateEmployee(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateEmployeeDto,
  ): Promise<EmployeesEntity> {
    return this.employeesService.updateEmployee(id, data)
  }

  @Delete(':id')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.DELETE_EMPLOYEES,
  })
  @ApiOperation({
    summary: 'Remove an employee. Role: SUPERADMIN, ADMIN. Permission: DELETE_EMPLOYEES',
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
    return this.employeesService.removeEmployee(id)
  }
}
