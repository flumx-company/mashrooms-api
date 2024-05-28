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
    description:
      'Will return the yields for a specific batch, category, wave, date.',
    type: Yield,
    isArray: true,
  })
  async findAllByAllParameters(
    @Param('batchId', ParseIntPipe) batchId: number,
    @Param('waveId', ParseIntPipe) waveId: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Param('date') date: string,
  ): Promise<Yield[]> {
    return this.yieldService.findAllByAllParameters({
      batchId,
      categoryId,
      waveId,
      date,
    })
  }

  @Get('wave/:waveId')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.READ_YIELDS,
  })
  @ApiOperation({
    summary:
      'Get yields for a specific wave. Role: SUPERADMIN, ADMIN. Permission: READ_YIELDS.',
  })
  @ApiParam({
    name: 'waveId',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  @ApiResponse({
    status: 200,
    description: 'Will return yields of a specific wave.',
    type: Yield,
    isArray: true,
  })
  async getAllWaveYields(
    @Param('waveId', ParseIntPipe) waveId: number,
  ): Promise<object> {
    return this.yieldService.findAllByWave({
      waveId,
    })
  }

  @Get('batch/:batchId')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.READ_YIELDS,
  })
  @ApiOperation({
    summary:
      'Get yields for a specific batch. Role: SUPERADMIN, ADMIN. Permission: READ_YIELDS.',
  })
  @ApiParam({
    name: 'batchId',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  @ApiResponse({
    status: 200,
    description: 'Will return of yields of a specific batch.',
    type: Yield,
    isArray: true,
  })
  async getAllBatchYields(
    @Param('batchId', ParseIntPipe) batchId: number,
  ): Promise<object> {
    return this.yieldService.findAllByBatch({
      batchId,
    })
  }
}
