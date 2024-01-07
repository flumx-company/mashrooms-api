import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiBadGatewayResponse,
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

import { UsersEntity } from '@users/users.entity'

import { ERole, EPermission } from '@enums/index'
import { CurrentUser, Auth } from '@decorators/index'
import { ApiV1 } from '@utils/index'

import { OffloadsService } from './offloads.service'
import { OffloadsEntity } from './offloads.entity'
import { offloadsPaginationConfig } from './pagination/index'

@ApiTags('Offloads')
@ApiBadGatewayResponse({
  status: 502,
  description: 'Something went wrong',
})
@Controller(ApiV1('offloads'))
export class OffloadsController {
  constructor(readonly offloadsService: OffloadsService) {}

  @Get()
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.READ_OFFLOADS,
  })
  @ApiOperation({
    summary:
      'Get list of all offloads. Permission: READ_OFFLOADS. Example of date limit: $btw: 2024-01-01 00:00:00, 2024-01-2 23:59:59 It is important to add hh:mm:ss in date limit for database to return the correct data.',
  })
  @ApiResponse({
    status: 200,
    description: 'Will return the offload data.',
    type: OffloadsEntity,
    isArray: true,
  })
  @ApiPaginationQuery(offloadsPaginationConfig)
  async getAllOffloads(
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<OffloadsEntity>> {
    return this.offloadsService.findAll(query)
  }

  @Post()
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.CREATE_OFFLOADS,
  })
  @ApiOperation({
    summary: 'Add a new offload. Permission: CREATE_OFFLOADS.',
  })
  @ApiResponse({
    status: 200,
    description: 'Will return the offload data.',
    type: OffloadsEntity,
  })
  async createOffload(
    @CurrentUser() user: UsersEntity,
  ): Promise<OffloadsEntity> {
    return this.offloadsService.createOffload({ user })
  }

  @Delete(':id')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.DELETE_OFFLOADS,
  })
  @ApiOperation({
    summary: 'Remove an offload. Permission: DELETE_OFFLOADS.',
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
  async removeOffload(@Param('id', ParseIntPipe) id: number): Promise<Boolean> {
    return this.offloadsService.removeOffload(id)
  }
}
