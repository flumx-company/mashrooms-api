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
import { EPermission, EPriceTenant, ERole } from '@mush/core/enums'
import { ApiV1, EmptyObject } from '@mush/core/utils'

import { CreatePriceDto, UpdatePriceDto } from './dto'
import { Price } from './price.entity'
import { PriceService } from './price.service'

@ApiTags('Prices')
@ApiBadGatewayResponse({
  status: 502,
  description: 'Something went wrong',
})
@Controller(ApiV1('prices'))
export class PriceController {
  constructor(readonly priceService: PriceService) {}

  @Get()
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.READ_PRICES,
  })
  @ApiOperation({
    summary:
      'Get list of all prices. Role: SUPERADMIN, ADMIN. Permission: READ_PRICES.',
  })
  async getAllPrices(): Promise<Price[]> {
    return this.priceService.findAll()
  }

  @Get('current')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.READ_PRICES,
  })
  @ApiOperation({
    summary:
      'Get list of the current prices of all tenants. Role: SUPERADMIN, ADMIN. Permission: READ_PRICES.',
  })
  async getAllCurrentPrices(): Promise<Array<Price | EmptyObject>> {
    return this.priceService.findAllTenantCurrentPrices()
  }

  @Get('tenant/:tenant')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.READ_PRICES,
  })
  @ApiOperation({
    summary:
      'Get list of all prices of particular tenant. Role: SUPERADMIN, ADMIN. Permission: READ_PRICES.',
  })
  @ApiParam({
    name: 'tenant',
    type: String as unknown as EPriceTenant,
    example: 1,
  } as ApiParamOptions)
  async getAllPricesByTenant(
    @Param('tenant') tenant: EPriceTenant,
  ): Promise<Price[]> {
    return this.priceService.findAllByTenant(tenant)
  }

  @Get('tenant/:tenant/date/:date')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.READ_PRICES,
  })
  @ApiOperation({
    summary:
      'Get list of all prices. Role: SUPERADMIN, ADMIN. Permission: READ_PRICES.',
  })
  @ApiParam({
    name: 'tenant',
    type: String as unknown as EPriceTenant,
    example: 1,
  } as ApiParamOptions)
  @ApiParam({
    name: 'date',
    type: 'string',
    example: '2025-10-10',
  } as ApiParamOptions)
  async getTenantPriceByDate(
    @Param('tenant') tenant: EPriceTenant,
    @Param('date') date: string,
  ): Promise<Price | EmptyObject> {
    return this.priceService.findPriceByClosestDate({ date, tenant })
  }

  @Post()
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.CREATE_PRICES,
  })
  @ApiOperation({
    summary:
      'Add a new price. Role: SUPERADMIN, ADMIN. Permission: CREATE_PRICES.',
  })
  @ApiBody({
    description: 'Model to add a new price.',
    type: CreatePriceDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Will return the price data.',
    type: Price,
  })
  async createPrice(@Body() data: CreatePriceDto): Promise<Price> {
    return this.priceService.createPrice(data)
  }

  @Put(':id')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.UPDATE_PRICES,
  })
  @ApiOperation({
    summary:
      'Update a price. Role: SUPERADMIN, ADMIN. Permission: UPDATE_PRICES.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  @ApiBody({
    description: 'Model to update an existing category.',
    type: UpdatePriceDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Will return the category data.',
    type: Price,
  })
  async updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() { price }: UpdatePriceDto,
  ): Promise<Price> {
    return this.priceService.updatePrice(id, price)
  }

  @Delete(':id')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.DELETE_PRICES,
  })
  @ApiOperation({
    summary:
      'Remove a price. Role: SUPERADMIN, ADMIN. Permission: DELETE_PRICES.',
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
  async removeOffload(@Param('id', ParseIntPipe) id: number): Promise<Boolean> {
    return this.priceService.removePrice(id)
  }
}
