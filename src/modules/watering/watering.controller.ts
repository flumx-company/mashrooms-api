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

import { CreateWateringDto } from './dto'
import { wateringPaginationConfig } from './pagination'
import { Watering } from './watering.entity'
import { WateringService } from './watering.service'

@ApiTags('Waterings')
@ApiBadGatewayResponse({
  status: 502,
  description: 'Something went wrong',
})
@Controller(ApiV1('waterings'))
export class WateringController {
  constructor(readonly wateringService: WateringService) {}

  @Get()
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.READ_WATERINGS,
  })
  @ApiOperation({
    summary:
      'Get list of all waterings. Role: SUPERADMIN, ADMIN. Permission: READ_WATERING.',
  })
  @ApiPaginationQuery(wateringPaginationConfig)
  @ApiResponse({
    status: 200,
    description: 'Will return the list of waterings.',
    type: Watering,
    isArray: true,
  })
  async getAllShifts(
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<Watering>> {
    return this.wateringService.findAll(query)
  }

  @Get(':wateringId')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.READ_WATERINGS,
  })
  @ApiOperation({
    summary:
      'Get watering with the provided id. Role: SUPERADMIN, ADMIN. Permission: READ_WATERINGS.',
  })
  @ApiParam({
    name: 'wateringId',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  @ApiResponse({
    status: 200,
    description: 'Will return the watering with provided id.',
    type: Watering,
  })
  async getWateringById(
    @Param('wateringId', ParseIntPipe) wateringId: number,
  ): Promise<Watering> {
    return this.wateringService.findWateringById(wateringId)
  }

  @Post('batch/:batchId/shift/:shiftId')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.CREATE_WATERINGS,
  })
  @ApiOperation({
    summary:
      'Add a new watering. Role: SUPERADMIN, ADMIN. Permission: CREATE_WATERINGS.',
  })
  @ApiParam({
    name: 'batchId',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  @ApiParam({
    name: 'shiftId',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  @ApiBody({
    description: 'Model to add a new watering.',
    type: CreateWateringDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Will return the watering data.',
    type: Watering,
  })
  async createPrice(
    @Param('batchId', ParseIntPipe) batchId: number,
    @Param('shiftId', ParseIntPipe) shiftId: number,
    @Body() data: CreateWateringDto,
  ): Promise<Watering> {
    return this.wateringService.createWatering({ ...data, batchId, shiftId })
  }

  @Delete(':wateringId')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.DELETE_WATERINGS,
  })
  @ApiOperation({
    summary:
      'Remove a watering by id. Role: SUPERADMIN, ADMIN. Permission: DELETE_WATERINGS',
  })
  @ApiParam({
    name: 'wateringId',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  @ApiResponse({
    status: 200,
    description: 'Will return boolean result.',
    type: Boolean,
  })
  async removeEmployee(
    @Param('wateringId', ParseIntPipe) wateringId: number,
  ): Promise<Boolean> {
    return this.wateringService.removeWatering(wateringId)
  }
}
