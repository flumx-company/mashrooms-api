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
import { CreateUserDto } from "../core-module/users/dto/create.user.dto";
import { UpdateUserDto } from "../core-module/users/dto/update.user.dto";
import { ResetPasswordDto } from "../core-module/users/dto/reset.password.dto";
import { ApiV1 } from "src/core/utils/versions";
import { Auth } from "src/core/decorators/auth.decorator";
import { ERole } from "../../core/enums/roles";
import { EPermission } from "../../core/enums/permissions";
import { UpdateUserPermissionsDto } from "../core-module/users/dto/update.user.permissions.dto";
import { OffloadsEntity } from "../offloads/offloads.entity";
import { OffloadsService } from "../offloads/offloads.service";
import {
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
  Paginated,
} from "nestjs-paginate";
import { usersPaginationConfig } from "../core-module/users/pagination/users.pagination.config";
import { offloadsPaginationConfig } from "../offloads/pagination/offloads.pagination.config";
import { UpdateActiveStatusDto } from "../core-module/users/dto/update.active.status.dto";

@ApiTags("Admins")
@ApiBadGatewayResponse({
  status: 502,
  description: "Something went wrong",
})
@Controller(ApiV1("admins"))
export class AdminsController {
  constructor(
    readonly usersService: UsersService,
    readonly offloadsService: OffloadsService
  ) {}

  @Get()
  @Auth({ roles: [ERole.SUPERADMIN], permission: EPermission.READ_ADMINS })
  @ApiOperation({
    summary: "Get list of all admins. Permission: READ_ADMINS",
  })
  @ApiPaginationQuery(usersPaginationConfig)
  async getAllUsers(
    @Paginate() query: PaginateQuery
  ): Promise<Paginated<UsersEntity>> {
    return this.usersService.findAll(query);
  }

  @Post()
  @Auth({ roles: [ERole.SUPERADMIN], permission: EPermission.CREATE_ADMINS })
  @ApiOperation({
    summary: "Add a new admin user. Permission: CREATE_ADMINS",
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

  @Put(":id")
  @Auth({ roles: [ERole.SUPERADMIN], permission: EPermission.UPDATE_ADMINS })
  @ApiOperation({
    summary:
      "Update an admin user. Permission: UPDATE_ADMINS. It will trigger 422 error if the user id is wrong or belongs to the superadmin.",
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

  @Put("password/:id")
  @Auth({ roles: [ERole.SUPERADMIN], permission: EPermission.UPDATE_ADMINS })
  @ApiOperation({
    summary:
      "Change admin user's password. Permission: UPDATE_ADMINS. It will trigger 422 error if the user id is wrong or belongs to the superadmin.",
  })
  @ApiParam({
    name: "id",
    type: "number",
    example: 1,
  } as ApiParamOptions)
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
    @Param("id", ParseIntPipe) id: number,
    @Body() { password }: ResetPasswordDto
  ): Promise<UsersEntity> {
    return this.usersService.changeUserPassword(id, password);
  }

  @Put("active/:id")
  @Auth({ roles: [ERole.SUPERADMIN], permission: EPermission.UPDATE_ADMINS })
  @ApiOperation({
    summary:
      "Change admin user's active status. Permission: UPDATE_ADMINS. It will trigger 422 error if the user id is wrong or belongs to the superadmin.",
  })
  @ApiParam({
    name: "id",
    type: "number",
    example: 1,
  } as ApiParamOptions)
  @ApiBody({
    description: "Model to change user's active status.",
    type: UpdateActiveStatusDto,
  })
  @ApiResponse({
    status: 200,
    description: "Will return the user data.",
    type: UsersEntity,
  })
  async updateUserActiveStatus(
    @Param("id", ParseIntPipe) id: number,
    @Body() { isActive }: UpdateActiveStatusDto
  ): Promise<UsersEntity> {
    return this.usersService.updateUserActiveStatus(id, isActive);
  }

  @Delete(":id")
  @Auth({ roles: [ERole.SUPERADMIN], permission: EPermission.DELETE_ADMINS })
  @ApiOperation({
    summary:
      "Remove an admin. Permission: DELETE_ADMINS. It will trigger 422 error if the user id is wrong or belongs to the superadmin.",
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

  @Get(":id/offloads")
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.READ_OFFLOADS,
  })
  @ApiParam({
    name: "id",
    type: "number",
    example: 1,
  } as ApiParamOptions)
  @ApiPaginationQuery(offloadsPaginationConfig)
  @ApiOperation({
    summary:
      "Get list of all offloads of the user, whose id is provided. Permission: READ_OFFLOADS. Example of date limit: $btw: 2024-01-01 00:00:00, 2024-01-2 23:59:59 It is important to add hh:mm:ss in date limit for database to return the correct data.",
  })
  async getAllOffloadsByUserId(
    @Param("id", ParseIntPipe) id: number,
    @Paginate() query: PaginateQuery
  ): Promise<Paginated<OffloadsEntity>> {
    return this.offloadsService.findAllByUserId(id, query);
  }

  @Get("permissions/:id")
  @Auth({ roles: [ERole.SUPERADMIN], permission: EPermission.READ_ADMINS })
  @ApiOperation({
    summary:
      "Get list of all permissions of the admin user whose id is given in param. Permission: READ_ADMINS.",
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
      "Update an admin user's permission list. Permission: UPDATE_ADMINS. It will trigger 422 error if the user id is wrong or belongs to the superadmin.",
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
    @Body() { permissions }: UpdateUserPermissionsDto
  ): Promise<UsersEntity> {
    return this.usersService.updateUserPermissions(id, permissions);
  }
}
