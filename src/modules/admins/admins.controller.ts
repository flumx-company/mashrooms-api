import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
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
import { UsersService } from "../core-module/users/users.service";
import { UsersEntity } from "../core-module/users/users.entity";
import {
  CreateUserDto,
  AddSuperaminUserDto,
} from "../core-module/users/dto/create.user.dto";
import { UpdateUserDto } from "../core-module/users/dto/update.user.dto";
import { ResetPasswordDto } from "../core-module/users/dto/reset.password.dto";
import { ApiV1 } from "src/core/utils/versions";
import { Auth } from "src/core/decorators/auth.decorator";
import { ERole } from "../../core/enums/roles";
import { EPermission } from "../../core/enums/permissions";
import { UpdateUserPermissionsDto } from "../core-module/users/dto/update.user.permissions.dto";

@ApiTags("Admins")
@ApiBadGatewayResponse({
  status: 502,
  description: "Something went wrong",
})
@Controller(ApiV1("admins"))
export class AdminsController {
  constructor(readonly usersService: UsersService) {}

  @Get()
  @Auth({ roles: [ERole.SUPERADMIN], permission: EPermission.READ_ADMINS })
  @ApiOperation({
    summary: "Get list of all admins",
  })
  async getAllUsers(): Promise<UsersEntity[]> {
    return this.usersService.findAll();
  }

  @Post()
  @Auth({ roles: [ERole.SUPERADMIN], permission: EPermission.CREATE_ADMINS })
  @ApiOperation({
    summary: "Add a new admin user",
  })
  @ApiBody({
    description: "Model to add a new user.",
    type: CreateUserDto,
  })
  @ApiResponse({
    status: 200,
    description: "Will return the user data.",
    type: UsersEntity,
  })
  async createUser(@Body() data: CreateUserDto): Promise<UsersEntity> {
    return this.usersService.createUser(data);
  }

  //NOTE: this endpoint is temporary. It will not appear in production.
  @Post("superadmin")
  @ApiOperation({
    summary: "Temporary: Add a new superadmin user",
  })
  @ApiBody({
    description: "Model to add a superadmin.",
    type: AddSuperaminUserDto,
  })
  @ApiResponse({
    status: 200,
    description: "Will return the user data.",
    type: UsersEntity,
  })
  async createSuperadminUser(
    @Body() data: AddSuperaminUserDto
  ): Promise<UsersEntity> {
    return this.usersService.createSuperadminUser(data);
  }

  @Put(":id")
  @Auth({ roles: [ERole.SUPERADMIN], permission: EPermission.UPDATE_ADMINS })
  @ApiOperation({
    summary:
      "Update an admin user. It will trigger 422 error if the user id is wrong or belongs to the superadmin.",
  })
  @ApiParam({
    name: "id",
    type: "number",
    example: 1,
  } as ApiParamOptions)
  @ApiBody({
    description: "Model to update an existing user.",
    type: UpdateUserDto,
  })
  @ApiResponse({
    status: 200,
    description: "Will return the user data.",
    type: UsersEntity,
  })
  async updateUser(
    @Param("id", ParseIntPipe) id: number,
    @Body() data: UpdateUserDto
  ): Promise<UsersEntity> {
    return this.usersService.updateUser(id, data);
  }

  @Put("password")
  @Auth({ roles: [ERole.SUPERADMIN], permission: EPermission.UPDATE_ADMINS })
  @ApiOperation({
    summary:
      "Change admin user's password. It will trigger 422 error if the user id is wrong or belongs to the superadmin.",
  })
  @ApiBody({
    description: "Model to change user's password.",
    type: ResetPasswordDto,
  })
  @ApiResponse({
    status: 200,
    description: "Will return the user data.",
    type: UsersEntity,
  })
  async changeUserPassword(
    @Body() data: ResetPasswordDto
  ): Promise<UsersEntity> {
    return this.usersService.changeUserPassword(data);
  }

  @Delete(":id")
  @Auth({ roles: [ERole.SUPERADMIN], permission: EPermission.DELETE_ADMINS })
  @ApiOperation({
    summary:
      "Remove an admin. It will trigger 422 error if the user id is wrong or belongs to the superadmin.",
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
  async removeUser(@Param("id", ParseIntPipe) id: number): Promise<Boolean> {
    return this.usersService.removeUser(id);
  }

  @Get("permissions/:id")
  @Auth({ roles: [ERole.SUPERADMIN], permission: EPermission.READ_ADMINS })
  @ApiOperation({
    summary:
      "Get list of all permissions of the admin user whose id is given in param.",
  })
  @ApiParam({
    name: "id",
    type: "number",
    example: 1,
  } as ApiParamOptions)
  async getUserPermissions(
    @Param("id", ParseIntPipe) id: number
  ): Promise<EPermission[]> {
    return this.usersService.getUserPermissions(id);
  }

  @Put("permissions/:id")
  @Auth({ roles: [ERole.SUPERADMIN], permission: EPermission.UPDATE_ADMINS })
  @ApiOperation({
    summary:
      "Update an admin user's permission list. It will trigger 422 error if the user id is wrong or belongs to the superadmin.",
  })
  @ApiBody({
    description: "Model to update an existing user.",
    type: UpdateUserPermissionsDto,
  })
  @ApiResponse({
    status: 200,
    description: "Will return the user data.",
    type: UsersEntity,
  })
  async updateUserPermissions(
    @Param("id", ParseIntPipe) id: number,
    @Body() data: UpdateUserPermissionsDto
  ): Promise<UsersEntity> {
    return this.usersService.updateUserPermissions({
      id,
      permissions: data.permissions,
    });
  }
}
