import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import {
  ApiBadGatewayResponse,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiParamOptions,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import { Auth } from '@mush/core/decorators'
import { EPermission, ERole } from '@mush/core/enums'
import { ApiV1, CError } from '@mush/core/utils'

import { Wave } from '../wave/wave.entity'
import { Batch } from './batch.entity'
import { BatchService } from './batch.service'
import { CreateBatchDto, UpdateBatchDto } from './dto'

@ApiTags('Batches')
@ApiBadGatewayResponse({
  status: 502,
  description: 'Something went wrong',
})
@Controller(ApiV1('batches'))
export class BatchController {
  constructor(readonly batchService: BatchService) {}

  @Get()
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.READ_BATCHES,
  })
  @ApiQuery({
    name: 'year',
    type: 'string',
    example: '2023',
  })
  @ApiOperation({
    summary:
      'Get list of all batches. Role: SUPERADMIN, ADMIN. Permission: READ_BATCHES.',
  })
  async getAllBatches(@Query('year') year: string): Promise<Batch[]> {
    return this.batchService.findAllByYear(year)
  }

  @Get(':batchId')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.READ_BATCHES,
  })
  @ApiParam({
    name: 'batchId',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  @ApiOperation({
    summary:
      'Get the batch with the provided id. Role: SUPERADMIN, ADMIN. Permission: READ_BATCHES.',
  })
  async getBatchById(
    @Param('batchId', ParseIntPipe) batchId: number,
  ): Promise<Batch> {
    const foundBatch = await this.batchService.findBatchById(batchId)

    if (!foundBatch) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    return foundBatch
  }

  @Post()
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.CREATE_BATCHES,
  })
  @ApiOperation({
    summary:
      'Add a new batch. Role: SUPERADMIN, ADMIN. Permission: CREATE_BATCHES.',
  })
  @ApiBody({
    description: 'Model to add a new batch.',
    type: CreateBatchDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Will return the batch data.',
    type: Batch,
  })
  async createBatch(@Body() data: CreateBatchDto): Promise<Batch> {
    return this.batchService.createBatch(data)
  }

  @Put(':batchId')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.UPDATE_BATCHES,
  })
  @ApiParam({
    name: 'batchId',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  @ApiOperation({
    summary:
      'Add a new batch. Role: SUPERADMIN, ADMIN. Permission: UPDATE_BATCHES.',
  })
  @ApiBody({
    description: 'Model to add a new batch.',
    type: UpdateBatchDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Will return the batch data.',
    type: Batch,
  })
  async updateBatch(
    @Param('batchId', ParseIntPipe) batchId: number,
    @Body() data: UpdateBatchDto,
  ): Promise<Batch> {
    return this.batchService.updateBatch(batchId, data)
  }

  @Put(':batchId/wave/:waveOrder')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.UPDATE_BATCHES,
  })
  @ApiOperation({
    summary:
      'Add a new batch. Role: SUPERADMIN, ADMIN. Permission: UPDATE_BATCHES.',
  })
  @ApiParam({
    name: 'batchId',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  @ApiParam({
    name: 'waveOrder',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  @ApiResponse({
    status: 200,
    description: 'Will return the new wave.',
    type: Wave,
  })
  async changeWave(
    @Param('batchId', ParseIntPipe) batchId: number,
    @Param('waveOrder', ParseIntPipe) waveOrder: number,
  ): Promise<Wave> {
    return this.batchService.changeWave({ batchId, waveOrder })
  }

  @Put('end/:batchId')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.UPDATE_BATCHES,
  })
  @ApiOperation({
    summary:
      'Add a new batch. Role: SUPERADMIN, ADMIN. Permission: UPDATE_BATCHES.',
  })
  @ApiParam({
    name: 'batchId',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  @ApiResponse({
    status: 200,
    description: 'Will return the ended batch.',
    type: Batch,
  })
  async endBatch(
    @Param('batchId', ParseIntPipe) batchId: number,
  ): Promise<Batch> {
    return this.batchService.endBatch(batchId)
  }
}
