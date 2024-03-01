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

import { Chamber } from './chamber.entity'
import { ChamberService } from './chamber.service'
import { UpdateChamberDto } from './dto'

@ApiTags('Chambers')
@ApiBadGatewayResponse({
  status: 502,
  description: 'Something went wrong',
})
@Controller(ApiV1('chambers'))
export class ChamberController {
  constructor(readonly chamberService: ChamberService) {}

  @Get()
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.READ_CHAMBERS,
  })
  @ApiOperation({
    summary:
      'Get list of all chambers. Role: SUPERADMIN, ADMIN. Permission: READ_CHAMBERS.',
  })
  async getAllChambers(): Promise<Chamber[]> {
    return this.chamberService.findAll()
  }

  @Post()
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.CREATE_CHAMBERS,
  })
  @ApiOperation({
    summary:
      'Add a new price. Role: SUPERADMIN, ADMIN. Permission: CREATE_CHAMBERS.',
  })
  @ApiBody({
    description: 'Model to add a new price.',
    type: UpdateChamberDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Will return the price data.',
    type: Chamber,
  })
  async createChamber(@Body() data: UpdateChamberDto): Promise<Chamber> {
    return this.chamberService.createChamber(data)
  }

  @Put(':chamberId')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.UPDATE_CHAMBERS,
  })
  @ApiOperation({
    summary:
      'Update a price. Role: SUPERADMIN, ADMIN. Permission: UPDATE_CHAMBERS.',
  })
  @ApiParam({
    name: 'chamberId',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  @ApiBody({
    description: 'Model to update an existing chamber.',
    type: UpdateChamberDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Will return the chamber data.',
    type: Chamber,
  })
  async updateCategory(
    @Param('chamberId', ParseIntPipe) chamberId: number,
    @Body() data: UpdateChamberDto,
  ): Promise<Chamber> {
    return this.chamberService.updateChamber(chamberId, data)
  }

  @Delete(':chamberId')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.DELETE_CHAMBERS,
  })
  @ApiOperation({
    summary:
      'Remove a price. Role: SUPERADMIN, ADMIN. Permission: DELETE_CHAMBERS.',
  })
  @ApiParam({
    name: 'chamberId',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  @ApiResponse({
    status: 200,
    description: 'Will return boolean result.',
    type: Boolean,
  })
  async removeOffload(
    @Param('chamberId', ParseIntPipe) chamberId: number,
  ): Promise<Boolean> {
    return this.chamberService.removeChamber(chamberId)
  }
}
