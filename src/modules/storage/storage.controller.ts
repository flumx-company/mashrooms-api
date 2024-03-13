import {
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
  Paginated,
} from 'nestjs-paginate'

import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common'
import {
  ApiBadGatewayResponse,
  ApiOperation,
  ApiParam,
  ApiParamOptions,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import { Auth } from '@mush/core/decorators'
import { EPermission, ERole } from '@mush/core/enums'
import { ApiV1 } from '@mush/core/utils'

import { CreateStorageDto } from './dto'
import { storagePaginationConfig } from './pagination'
import { Storage } from './storage.entity'
import { StorageService } from './storage.service'

@ApiTags('Storages')
@ApiBadGatewayResponse({
  status: 502,
  description: 'Something went wrong',
})
@Controller(ApiV1('storages'))
export class StorageController {
  constructor(readonly storageRepository: StorageService) {}

  @Get()
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.READ_STORAGES,
  })
  @ApiOperation({
    summary:
      'Get list of all storages. Role: SUPERADMIN, ADMIN. Permission: READ_STORAGES.',
  })
  @ApiResponse({
    status: 200,
    description: 'Will return the list of storages.',
    type: Storage,
    isArray: true,
  })
  @ApiPaginationQuery(storagePaginationConfig)
  async getAllVarieties(
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<Storage>> {
    return this.storageRepository.findAll(query)
  }
}
