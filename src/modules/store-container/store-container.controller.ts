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

import { UpdateStoreContainerDto } from './dto'
import { StoreContainer } from './store-container.entity'
import { StoreContainerService } from './store-container.service'

@ApiTags('StoreContainers')
@ApiBadGatewayResponse({
  status: 502,
  description: 'Something went wrong',
})
@Controller(ApiV1('store-containers'))
export class StoreContainerController {
  constructor(readonly storeContainerService: StoreContainerService) {}

  @Get()
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.READ_STORE_CONTAINERS,
  })
  @ApiOperation({
    summary:
      'Get list of all store containers. Role: SUPERADMIN, ADMIN. Permission: READ_STORE_CONTAINERS.',
  })
  async getAllVarieties(): Promise<StoreContainer[]> {
    return this.storeContainerService.findAll()
  }

  @Post()
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.CREATE_STORE_CONTAINERS,
  })
  @ApiOperation({
    summary:
      'Add a new store container. Role: SUPERADMIN, ADMIN. Permission: CREATE_STORE_CONTAINERS.',
  })
  @ApiBody({
    description: 'Model to add a new store container.',
    type: UpdateStoreContainerDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Will return the store container data.',
    type: StoreContainer,
  })
  async createCategory(
    @Body() data: UpdateStoreContainerDto,
  ): Promise<StoreContainer> {
    return this.storeContainerService.createStoreContainer(data)
  }

  @Put(':id')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.UPDATE_STORE_CONTAINERS,
  })
  @ApiOperation({
    summary:
      'Update a store container. Role: SUPERADMIN, ADMIN. Permission: UPDATE_STORE_CONTAINERS.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  @ApiBody({
    description: 'Model to update an existing store container.',
    type: UpdateStoreContainerDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Will return the store container data.',
    type: StoreContainer,
  })
  async updateVariety(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateStoreContainerDto,
  ): Promise<StoreContainer> {
    return this.storeContainerService.updateStoreContainer(id, data)
  }

  @Delete(':id')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.DELETE_STORE_CONTAINERS,
  })
  @ApiOperation({
    summary:
      'Remove a store container. Role: SUPERADMIN, ADMIN. Permission: DELETE_STORE_CONTAINERS.',
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
    return this.storeContainerService.removeStoreContainer(id)
  }
}
