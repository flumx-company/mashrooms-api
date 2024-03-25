import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common'
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

import { Yield } from './yield.entity'
import { YieldService } from './yield.service'

@ApiTags('Yields')
@ApiBadGatewayResponse({
  status: 502,
  description: 'Something went wrong',
})
@Controller(ApiV1('yields'))
export class YieldController {
  constructor(readonly yieldService: YieldService) {}

  @Get('batch/:batchId/category/:categoryId/wave/:waveId/date/:date')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.READ_YIELDS,
  })
  @ApiOperation({
    summary:
      'Get list of all yields per day. Role: SUPERADMIN, ADMIN. Permission: READ_YIELDS.',
  })
  @ApiParam({
    name: 'batchId',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  @ApiParam({
    name: 'categoryId',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  @ApiParam({
    name: 'waveId',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  @ApiParam({
    name: 'date',
    type: 'string',
    example: '2024-03-22',
  } as ApiParamOptions)
  @ApiResponse({
    status: 200,
    description: 'Will return the list of yields.',
    type: Yield,
    isArray: true,
  })
  async getAllYields(
    @Param('batchId', ParseIntPipe) batchId: number,
    @Param('waveId', ParseIntPipe) waveId: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Param('date') date: string,
  ): Promise<Yield[]> {
    return this.yieldService.findAllByDate({
      batchId,
      categoryId,
      waveId,
      date,
    })
  }
}
