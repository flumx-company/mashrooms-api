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
import {
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
  Paginated,
} from 'nestjs-paginate'

import { UsersService } from '@mush/users/users.service'
import { UsersEntity } from '@mush/users/users.entity'
import {
  CreateUserDto,
  UpdateUserDto,
  UpdateUserPermissionsDto,
  ResetPasswordDto,
  UpdateActiveStatusDto,
} from '@mush/users/dto'
import { usersPaginationConfig } from '@mush/users/pagination'
import { OffloadsEntity } from '@mush/offloads/offloads.entity'
import { OffloadsService } from '@mush/offloads/offloads.service'
import { offloadsPaginationConfig } from '@mush/offloads/pagination'

import { Auth } from '@mush/decorators'
import { ApiV1 } from '@mush/utils'
import { ERole, EPermission } from '@mush/enums'

@ApiTags('Admins')
@ApiBadGatewayResponse({
  status: 502,
  description: 'Something went wrong',
})
@Controller(ApiV1('admins'))
export class AdminsController {
  constructor(
    readonly usersService: UsersService,
    readonly offloadsService: OffloadsService,
  ) {}

  @Get()
  @Auth({ roles: [ERole.SUPERADMIN], permission: EPermission.READ_ADMINS })
  @ApiOperation({
    summary: 'Get list of all admins. Permission: READ_ADMINS',
  })
  @ApiResponse({
    status: 200,
    description: 'Will return the list of admins.',
    type: UsersEntity,
    isArray: true,
  })
  @ApiPaginationQuery(usersPaginationConfig)
  async getAllUsers(
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<UsersEntity>> {
    return this.usersService.findAll(query)
  }

  @Post()
  @Auth({ roles: [ERole.SUPERADMIN], permission: EPermission.CREATE_ADMINS })
  @ApiOperation({
    summary: 'Add a new admin user. Permission: CREATE_ADMINS',
  })
  @ApiBody({
    description: 'Model to add a new user.',
    type: CreateUserDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Will return the user data.',
    type: UsersEntity,
  })
  async createUser(@Body() data: CreateUserDto): Promise<UsersEntity> {
    return this.usersService.createUser(data)
  }

  @Put(':id')
  @Auth({ roles: [ERole.SUPERADMIN], permission: EPermission.UPDATE_ADMINS })
  @ApiOperation({
    summary:
      'Update an admin user. Permission: UPDATE_ADMINS. It will trigger 422 error if the user id is wrong or belongs to the superadmin.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  @ApiBody({
    description: 'Model to update an existing user.',
    type: UpdateUserDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Will return the user data.',
    type: UsersEntity,
  })
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserDto,
  ): Promise<UsersEntity> {
    return this.usersService.updateUser(id, data)
  }

  @Put('password/:id')
  @Auth({ roles: [ERole.SUPERADMIN], permission: EPermission.UPDATE_ADMINS })
  @ApiOperation({
    summary:
      "Change admin user's password. Permission: UPDATE_ADMINS. It will trigger 422 error if the user id is wrong or belongs to the superadmin.",
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  @ApiBody({
    description: "Model to change user's password.",
    type: ResetPasswordDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Will return the user data.',
    type: UsersEntity,
  })
  async changeUserPassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() { password }: ResetPasswordDto,
  ): Promise<UsersEntity> {
    return this.usersService.changeUserPassword(id, password)
  }

  @Put('active/:id')
  @Auth({ roles: [ERole.SUPERADMIN], permission: EPermission.UPDATE_ADMINS })
  @ApiOperation({
    summary:
      "Change admin user's active status. Permission: UPDATE_ADMINS. It will trigger 422 error if the user id is wrong or belongs to the superadmin.",
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  @ApiBody({
    description: "Model to change user's active status.",
    type: UpdateActiveStatusDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Will return the user data.',
    type: UsersEntity,
  })
  async updateUserActiveStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() { isActive }: UpdateActiveStatusDto,
  ): Promise<UsersEntity> {
    return this.usersService.updateUserActiveStatus(id, isActive)
  }

  @Delete(':id')
  @Auth({ roles: [ERole.SUPERADMIN], permission: EPermission.DELETE_ADMINS })
  @ApiOperation({
    summary:
      'Remove an admin. Permission: DELETE_ADMINS. It will trigger 422 error if the user id is wrong or belongs to the superadmin.',
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
  async removeUser(@Param('id', ParseIntPipe) id: number): Promise<Boolean> {
    return this.usersService.removeUser(id)
  }

  @Get(':id/offloads')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.READ_OFFLOADS,
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  @ApiPaginationQuery(offloadsPaginationConfig)
  @ApiOperation({
    summary:
      'Get list of all offloads of the user, whose id is provided. Permission: READ_OFFLOADS. Example of date limit: $btw: 2024-01-01 00:00:00, 2024-01-2 23:59:59 It is important to add hh:mm:ss in date limit for database to return the correct data.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Will return the list of offloads related to the user, whose id is provided.',
    type: OffloadsEntity,
    isArray: true,
  })
  async getAllOffloadsByUserId(
    @Param('id', ParseIntPipe) id: number,
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<OffloadsEntity>> {
    return this.offloadsService.findAllByUserId(id, query)
  }

  @Get('permissions/:id')
  @Auth({ roles: [ERole.SUPERADMIN], permission: EPermission.READ_ADMINS })
  @ApiOperation({
    summary:
      'Get list of all permissions of the admin user whose id is given in param. Permission: READ_ADMINS.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  @ApiResponse({
    status: 200,
    description: 'Will return the list of permissions the user has.',
    type: typeof EPermission,
    isArray: true,
  })
  async getUserPermissions(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<EPermission[]> {
    return this.usersService.getUserPermissions(id)
  }

  @Put('permissions/:id')
  @Auth({ roles: [ERole.SUPERADMIN], permission: EPermission.UPDATE_ADMINS })
  @ApiOperation({
    summary:
      "Update an admin user's permission list. Permission: UPDATE_ADMINS. It will trigger 422 error if the user id is wrong or belongs to the superadmin.",
  })
  @ApiBody({
    description: 'Model to update an existing user.',
    type: UpdateUserPermissionsDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Will return the user data.',
    type: UsersEntity,
  })
  async updateUserPermissions(
    @Param('id', ParseIntPipe) id: number,
    @Body() { permissions }: UpdateUserPermissionsDto,
  ): Promise<UsersEntity> {
    return this.usersService.updateUserPermissions(id, permissions)
  }
}
