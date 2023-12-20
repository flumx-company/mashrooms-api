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
import { UsersEntity } from "../core-module/users/users.entity";

import { ApiV1 } from "src/core/utils/versions";
import { Auth } from "src/core/decorators/auth.decorator";
import { ERole } from "../../core/enums/roles";
import { EPermission } from "../../core/enums/permissions";
import { DriversService } from "./drivers.service";
import { DriversEntity } from "./drivers.entity";
import { CreateDriverDto } from "./dto/create.driver.dto";
import { UpdateDriverDto } from "./dto/update.driver.dto";

@ApiTags("Drivers")
@ApiBadGatewayResponse({
  status: 502,
  description: "Something went wrong",
})
@Controller(ApiV1("drivers"))
export class DriversController {
  constructor(readonly driversService: DriversService) {}

  @Get()
  @Auth({ role: ERole.ADMIN, permission: EPermission.READ_DRIVERS })
  @ApiOperation({
    summary: "Get list of all drivers",
  })
  async getAllDrivers(): Promise<DriversEntity[]> {
    return this.driversService.findAll();
  }

  @Post()
  @Auth({ role: ERole.ADMIN, permission: EPermission.CREATE_DRIVERS })
  @ApiOperation({
    summary: "Add a new drvier",
  })
  @ApiBody({
    description: "Model to add a new driver.",
    type: CreateDriverDto,
  })
  @ApiResponse({
    status: 200,
    description: "Will return the driver data.",
    type: DriversEntity,
  })
  async createDriver(@Body() data: CreateDriverDto): Promise<DriversEntity> {
    return this.driversService.createDriver(data);
  }

  @Put()
  @Auth({ role: ERole.ADMIN, permission: EPermission.UPDATE_DRIVERS })
  @ApiOperation({
    summary: "Update an driver.",
  })
  @ApiBody({
    description: "Model to update an existing driver.",
    type: UpdateDriverDto,
  })
  @ApiResponse({
    status: 200,
    description: "Will return the driver data.",
    type: UsersEntity,
  })
  async updateDriver(@Body() data: UpdateDriverDto): Promise<DriversEntity> {
    return this.driversService.updateDriver(data);
  }

  @Delete(":id")
  @Auth({ role: ERole.ADMIN, permission: EPermission.DELETE_DRIVERS })
  @ApiOperation({
    summary: "Remove an driver.",
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
  async removeUser(@Param("id") id: string): Promise<Boolean> {
    return this.driversService.removeDriver(parseInt(id));
  }
}
