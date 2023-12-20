import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiBadGatewayResponse,
  ApiBody,
  ApiResponse,
  ApiParam,
  ApiParamOptions,
} from "@nestjs/swagger";

import { ApiV1 } from "src/core/utils/versions";
import { Auth } from "src/core/decorators/auth.decorator";
import { ERole } from "../../core/enums/roles";
import { EPermission } from "../../core/enums/permissions";
import { EmployeesService } from "./employees.service";
import { EmployeesEntity } from "./employees.entity";
import { CreateEmployeeDto } from "./dto/create.employees.dto";
import { UpdateEmployeeDto } from "./dto/update.employees.dto";

@ApiTags("Employees")
@ApiBadGatewayResponse({
  status: 502,
  description: "Something went wrong",
})
@Controller(ApiV1("employees"))
export class EmployeesController {
  constructor(readonly employeesService: EmployeesService) {}

  @Get()
  @Auth({ role: ERole.ADMIN, permission: EPermission.READ_EMPLOYEES })
  @ApiOperation({
    summary: "Get list of all employees",
  })
  async getAllEmployees(): Promise<EmployeesEntity[]> {
    return this.employeesService.findAll();
  }

  @Post()
  @Auth({ role: ERole.ADMIN, permission: EPermission.CREATE_EMPLOYEES })
  @ApiOperation({
    summary: "Add a new employee",
  })
  @ApiBody({
    description: "Model to add a new employee.",
    type: CreateEmployeeDto,
  })
  @ApiResponse({
    status: 200,
    description: "Will return the employee data.",
    type: EmployeesEntity,
  })
  async createEmployee(
    @Body() data: CreateEmployeeDto
  ): Promise<EmployeesEntity> {
    return this.employeesService.createEmployee(data);
  }

  @Put()
  @Auth({ role: ERole.ADMIN, permission: EPermission.UPDATE_EMPLOYEES })
  @ApiOperation({
    summary: "Update an employee.",
  })
  @ApiBody({
    description: "Model to update an existing employee.",
    type: UpdateEmployeeDto,
  })
  @ApiResponse({
    status: 200,
    description: "Will return the employee data.",
    type: EmployeesEntity,
  })
  async updateEmployee(
    @Body() data: UpdateEmployeeDto
  ): Promise<EmployeesEntity> {
    return this.employeesService.updateEmployee(data);
  }

  @Delete(":id")
  @Auth({ role: ERole.ADMIN, permission: EPermission.DELETE_EMPLOYEES })
  @ApiOperation({
    summary: "Remove an employee.",
  })
  @ApiParam({
    name: "id",
    type: "number",
    example: 1,
  } as ApiParamOptions)
  @ApiResponse({
    status: 200,
    description: "Will return boolean result.",
    type: Boolean,
  })
  async removeEmployee(@Param("id") id: string): Promise<Boolean> {
    return this.employeesService.removeEmployee(parseInt(id));
  }
}
