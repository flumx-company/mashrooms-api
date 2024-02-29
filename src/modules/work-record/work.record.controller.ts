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

import { Auth } from '@mush/core/decorators'
import { EPermission, ERole } from '@mush/core/enums'
import { ApiV1 } from '@mush/core/utils'

import { CreateWorkRecordDto } from './dto'
import { WorkRecord } from './work.record.entity'
import { WorkRecordService } from './work.record.service'

@ApiTags('Work Records')
@ApiBadGatewayResponse({
  status: 502,
  description: 'Something went wrong',
})
@Controller(ApiV1('work-records'))
export class WorkRecordController {
  constructor(readonly workRecordService: WorkRecordService) {}

  @Post('work/:workId')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.CREATE_WORK_RECORDS,
  })
  @ApiParam({
    name: 'workId',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  @ApiOperation({
    summary:
      'Add a new work record. Role: SUPERADMIN, ADMIN. Permission: CREATE_WORK_RECORDS.',
  })
  @ApiBody({
    description: 'Model to add a new work record.',
    type: CreateWorkRecordDto,
  })
  @ApiResponse({
    status: 200,
    description:
      'Will return the work record list with related work, shift, employeeId.',
    type: WorkRecord,
    isArray: true,
  })
  async createWorkRecord(
    @Param('workId', ParseIntPipe) workId: number,
    @Body() data: CreateWorkRecordDto,
  ) {
    return this.workRecordService.createWorkRecord(workId, data)
  }
}
