import { Request as ExRequest } from 'express'

import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
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

import { User } from '../core-module/user/user.entity'
import { Cutting } from './cutting.entity'
import { CuttingService } from './cutting.service'
import { CreateCuttingDto } from './dto'

@ApiTags('Cuttings')
@ApiBadGatewayResponse({
  status: 502,
  description: 'Something went wrong',
})
@Controller(ApiV1('cuttings'))
export class CuttingController {
  constructor(readonly cuttingService: CuttingService) {}

  @Get()
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.READ_CUTTINGS,
  })
  @ApiOperation({
    summary:
      'Get list of all cuttings. Role: SUPERADMIN, ADMIN. Permission: READ_CUTTINGS.',
  })
  async getAllCuttings(): Promise<Cutting[]> {
    return this.cuttingService.findAll()
  }

  @Post('category/:categoryId/batch/:batchId/wave/:waveId')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.CREATE_CUTTINGS,
  })
  @ApiParam({
    name: 'categoryId',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  @ApiParam({
    name: 'batchId',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  @ApiParam({
    name: 'waveId',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  @ApiOperation({
    summary:
      'Add a new cutting. Role: SUPERADMIN, ADMIN. Permission: CREATE_CUTTINGS.',
  })
  @ApiBody({
    description: 'Model to add a new cutting.',
    type: CreateCuttingDto,
    isArray: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Will return the cutting data.',
    type: Cutting,
  })
  async createCutting(
    @Req() request: ExRequest,
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Param('batchId', ParseIntPipe) batchId: number,
    @Param('waveId', ParseIntPipe) waveId: number,
    @Body() data: CreateCuttingDto[],
  ): Promise<Cutting[]> {
    return this.cuttingService.createCutting({
      categoryId,
      batchId,
      waveId,
      data,
      author: request['user'] as User,
    })
  }
}
