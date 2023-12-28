import {
  //   Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  //   Put,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiBadGatewayResponse,
  //   ApiBody,
  ApiResponse,
  ApiParam,
  ApiParamOptions,
} from "@nestjs/swagger";

import { ApiV1 } from "src/core/utils/versions";
import { Auth } from "src/core/decorators/auth.decorator";
import { ERole } from "src/core/enums/roles";
import { EPermission } from "src/core/enums/permissions";
import { OffloadsService } from "./offloads.service";
import { OffloadsEntity } from "./offloads.entity";
import { CurrentUser } from "src/core/decorators/current.user.decorator";
import { UsersEntity } from "../core-module/users/users.entity";

@ApiTags("Offloads")
@ApiBadGatewayResponse({
  status: 502,
  description: "Something went wrong",
})
@Controller(ApiV1("offloads"))
export class OffloadsController {
  constructor(readonly offloadsService: OffloadsService) {}

  @Get()
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.READ_OFFLOADS,
  })
  @ApiOperation({
    summary: "Get list of all offloads. Permission: READ_OFFLOADS.",
  })
  async getAllOffloads(): Promise<OffloadsEntity[]> {
    return this.offloadsService.findAll();
  }

  @Post()
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.CREATE_OFFLOADS,
  })
  @ApiOperation({
    summary: "Add a new offload. Permission: CREATE_OFFLOADS.",
  })
  // @ApiBody({
  //   description: "Model to add a new offload.",
  //   type: CreateOffloadDto,
  // })
  @ApiResponse({
    status: 200,
    description: "Will return the offload data.",
    type: OffloadsEntity,
  })
  async createOffload(
    @CurrentUser() user: UsersEntity
    /*@Body() data: CreateOffloadDto*/
  ): Promise<OffloadsEntity> {
    return this.offloadsService.createOffload({ user });
  }

  @Delete(":id")
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.DELETE_OFFLOADS,
  })
  @ApiOperation({
    summary: "Remove an offload. Permission: DELETE_OFFLOADS.",
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
  async removeOffload(@Param("id", ParseIntPipe) id: number): Promise<Boolean> {
    return this.offloadsService.removeOffload(id);
  }
}