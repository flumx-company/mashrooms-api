import {
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
  Paginated,
} from 'nestjs-paginate'

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
  ApiBadGatewayResponse,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiParamOptions,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import {
  CreateUserDto,
  ResetPasswordDto,
  UpdateActiveStatusDto,
  UpdateSuperadminDto,
  UpdateUserDto,
  UpdateUserPermissionsDto,
} from '@mush/modules/core-module/user/dto'
import { userPaginationConfig } from '@mush/modules/core-module/user/pagination'
import { User } from '@mush/modules/core-module/user/user.entity'
import { UserService } from '@mush/modules/core-module/user/user.service'
import { Offload } from '@mush/modules/offload/offload.entity'
import { OffloadService } from '@mush/modules/offload/offload.service'
import { offloadPaginationConfig } from '@mush/modules/offload/pagination'

import { Auth } from '@mush/core/decorators'
import { EPermission, ERole } from '@mush/core/enums'
import { ApiV1 } from '@mush/core/utils'

@ApiTags('Admins')
@ApiBadGatewayResponse({
  status: 502,
  description: 'Something went wrong',
})
@Controller(ApiV1('admins'))
export class AdminController {
  constructor(
    readonly userService: UserService,
    readonly offloadService: OffloadService,
  ) {}

  @Get()
  @Auth({ roles: [ERole.SUPERADMIN], permission: EPermission.READ_ADMINS })
  @ApiOperation({
    summary:
      'Get list of all admins. Role: SUPERADMIN. Permission: READ_ADMINS',
  })
  @ApiResponse({
    status: 200,
    description: 'Will return the list of admins.',
    type: User,
    isArray: true,
  })
  @ApiPaginationQuery(userPaginationConfig)
  async getAllUsers(
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<User>> {
    return this.userService.findAll(query)
  }

  @Post()
  @Auth({ roles: [ERole.SUPERADMIN], permission: EPermission.CREATE_ADMINS })
  @ApiOperation({
    summary:
      'Add a new admin user. Role: SUPERADMIN. Permission: CREATE_ADMINS',
  })
  @ApiBody({
    description: 'Model to add a new user.',
    type: CreateUserDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Will return the user data.',
    type: User,
  })
  async createUser(@Body() data: CreateUserDto): Promise<User> {
    return this.userService.createUser(data)
  }

  @Put(':id')
  @Auth({ roles: [ERole.SUPERADMIN], permission: EPermission.UPDATE_ADMINS })
  @ApiOperation({
    summary:
      'Update an admin user. Role: SUPERADMIN. Permission: UPDATE_ADMINS. It will trigger 422 error if the user id is wrong or belongs to the superadmin.',
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
    type: User,
  })
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUser(id, data)
  }

  @Put('superadmin/:id')
  @Auth({ roles: [ERole.SUPERADMIN] })
  @ApiOperation({
    summary:
      'Update an superadmin user. Role: SUPERADMIN. It will trigger 422 error if the user id does not belong to the superadmin.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  @ApiBody({
    description: 'Model to update an existing user.',
    type: UpdateSuperadminDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Will return the user data.',
    type: User,
  })
  async updateSuperadmin(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateSuperadminDto,
  ): Promise<User> {
    return this.userService.updateSuperadmin(id, data)
  }

  @Put('password/:id')
  @Auth({ roles: [ERole.SUPERADMIN], permission: EPermission.UPDATE_ADMINS })
  @ApiOperation({
    summary:
      "Change admin user's password. Role: SUPERADMIN. Permission: UPDATE_ADMINS. It will trigger 422 error if the user id is wrong or belongs to the superadmin.",
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
    type: User,
  })
  async changeUserPassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() { password }: ResetPasswordDto,
  ): Promise<User> {
    return this.userService.changeUserPassword(id, password)
  }

  @Put('active/:id')
  @Auth({ roles: [ERole.SUPERADMIN], permission: EPermission.UPDATE_ADMINS })
  @ApiOperation({
    summary:
      "Change admin user's active status. Role: SUPERADMIN. Permission: UPDATE_ADMINS. It will trigger 422 error if the user id is wrong or belongs to the superadmin.",
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
    type: User,
  })
  async updateUserActiveStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() { isActive }: UpdateActiveStatusDto,
  ): Promise<User> {
    return this.userService.updateUserActiveStatus(id, isActive)
  }

  @Delete(':id')
  @Auth({ roles: [ERole.SUPERADMIN], permission: EPermission.DELETE_ADMINS })
  @ApiOperation({
    summary:
      'Remove an admin. Role: SUPERADMIN. Permission: DELETE_ADMINS. It will trigger 422 error if the user id is wrong or belongs to the superadmin.',
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
    return this.userService.removeUser(id)
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
  @ApiPaginationQuery(offloadPaginationConfig)
  @ApiOperation({
    summary:
      'Get list of all offloads of the user, whose id is provided. Role: SUPERADMIN, ADMIN. Permission: READ_OFFLOADS. Example of date limit: $btw: 2024-01-01 00:00:00, 2024-01-2 23:59:59 It is important to add hh:mm:ss in date limit for database to return the correct data.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Will return the list of offloads related to the user, whose id is provided.',
    type: Offload,
    isArray: true,
  })
  async getAllOffloadsByUserId(
    @Param('id', ParseIntPipe) id: number,
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<Offload>> {
    return this.offloadService.findAllByUserId(id, query)
  }

  @Get('permissions/:id')
  @Auth({ roles: [ERole.SUPERADMIN], permission: EPermission.READ_ADMINS })
  @ApiOperation({
    summary:
      'Get list of all permissions of the admin user whose id is given in param. Role: SUPERADMIN. Permission: READ_ADMINS.',
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
    return this.userService.getUserPermissions(id)
  }

  @Put('permissions/:id')
  @Auth({ roles: [ERole.SUPERADMIN], permission: EPermission.UPDATE_ADMINS })
  @ApiOperation({
    summary:
      "Update an admin user's permission list. Role: SUPERADMIN. Permission: UPDATE_ADMINS. It will trigger 422 error if the user id is wrong or belongs to the superadmin.",
  })
  @ApiBody({
    description: 'Model to update an existing user.',
    type: UpdateUserPermissionsDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Will return the user data.',
    type: User,
  })
  async updateUserPermissions(
    @Param('id', ParseIntPipe) id: number,
    @Body() { permissions }: UpdateUserPermissionsDto,
  ): Promise<User> {
    return this.userService.updateUserPermissions(id, permissions)
  }
}
