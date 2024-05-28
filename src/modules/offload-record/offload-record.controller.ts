import {
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
  Paginated,
} from 'nestjs-paginate'

import { Controller, Get } from '@nestjs/common'
import {
  ApiBadGatewayResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import { Auth } from '@mush/core/decorators'
import { EPermission, ERole } from '@mush/core/enums'
import { ApiV1 } from '@mush/core/utils'

import { OffloadRecord } from './offload-record.entity'
import { OffloadRecordService } from './offload-record.service'
import { offloadRecordPaginationConfig } from './pagination'

@ApiTags('Offload-records')
@ApiBadGatewayResponse({
  status: 502,
  description: 'Something went wrong',
})
@Controller(ApiV1('offload-records'))
export class OffloadRecordController {
  constructor(readonly offloadRecordService: OffloadRecordService) {}

  @Get()
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.READ_OFFLOAD_RECORDS,
  })
  @ApiOperation({
    summary:
      'Get list of all offload records. Role: SUPERADMIN, ADMIN. Permission: READ_OFFLOAD_RECORDS.',
  })
  @ApiResponse({
    status: 200,
    description: 'Will return the list of offload records.',
    type: OffloadRecord,
    isArray: true,
  })
  @ApiPaginationQuery(offloadRecordPaginationConfig)
  async getAllClients(
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<OffloadRecord>> {
    return this.offloadRecordService.findAll(query)
  }
}
