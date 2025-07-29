import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe, Patch,
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

import { UpdateVarietyDto } from './dto'
import { ReorderVarietyDto } from './dto/reorder-variety.dto'
import { Variety } from './variety.entity'
import { VarietyService } from './variety.service'

@ApiTags('Varieties')
@ApiBadGatewayResponse({
  status: 502,
  description: 'Something went wrong',
})
@Controller(ApiV1('varieties'))
export class VarietyController {
  constructor(readonly varietyService: VarietyService) {}

  @Get()
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.READ_VARIETIES,
  })
  @ApiOperation({
    summary: 'Get list of all varieties. Role: SUPERADMIN, ADMIN. Permission: READ_VARIETIES.',
  })
  @ApiResponse({
    status: 200,
    description: 'Will return the list of varieties.',
    type: [Variety],
  })
  async getAllVarieties(): Promise<Variety[]> {
    return this.varietyService.getAllSortedByOrder();
  }

  @Post()
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.CREATE_VARIETIES,
  })
  @ApiOperation({
    summary:
      'Add a new variety. Role: SUPERADMIN, ADMIN. Permission: CREATE_VARIETIES.',
  })
  @ApiBody({
    description: 'Model to add a new variety.',
    type: UpdateVarietyDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Will return the variety data.',
    type: Variety,
  })
  async createCategory(@Body() data: UpdateVarietyDto): Promise<Variety> {
    return this.varietyService.createVariety(data)
  }

  @Put(':id')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.UPDATE_VARIETIES,
  })
  @ApiOperation({
    summary:
      'Update a variety. Role: SUPERADMIN, ADMIN. Permission: UPDATE_VARIETIES.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  @ApiBody({
    description: 'Model to update an existing variety.',
    type: UpdateVarietyDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Will return the variety data.',
    type: Variety,
  })
  async updateVariety(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateVarietyDto,
  ): Promise<Variety> {
    return this.varietyService.updateVariety(id, data)
  }

  @Patch('reorder')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.UPDATE_VARIETIES,
  })
  @ApiOperation({
    summary: 'Update order of multiple varieties. Role: SUPERADMIN, ADMIN. Permission: UPDATE_VARIETIES.',
  })
  @ApiBody({
    description: 'Array of objects with id and new order',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          order: { type: 'number' },
        },
        required: ['id', 'order'],
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Returns updated varieties with new order.',
    type: [Variety],
  })
  reorderVarieties(@Body() data: ReorderVarietyDto[]): Promise<Variety[]> {
    return this.varietyService.reorderVarieties(data);
  }

  @Delete(':id')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.DELETE_VARIETIES,
  })
  @ApiOperation({
    summary:
      'Remove a variety. Role: SUPERADMIN, ADMIN. Permission: DELETE_VARIETIES.',
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
  async removeVariety(@Param('id', ParseIntPipe) id: number): Promise<Boolean> {
    return this.varietyService.removeVariety(id)
  }
}
