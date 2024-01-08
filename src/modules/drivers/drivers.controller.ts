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
  ApiTags,
  ApiOperation,
  ApiBadGatewayResponse,
  ApiBody,
  ApiResponse,
  ApiParam,
  ApiParamOptions,
} from '@nestjs/swagger'

import { UsersEntity } from '@mush/modules/core-module/users/users.entity'

import { ERole, EPermission } from '@mush/core/enums'
import { ApiV1 } from '@mush/core/utils'
import { Auth } from '@mush/core/decorators'

import { DriversService } from './drivers.service'
import { DriversEntity } from './drivers.entity'
import { CreateDriverDto } from './dto/create.driver.dto'
import { UpdateDriverDto } from './dto/update.driver.dto'

@ApiTags('Drivers')
@ApiBadGatewayResponse({
  status: 502,
  description: 'Something went wrong',
})
@Controller(ApiV1('drivers'))
export class DriversController {
  constructor(readonly driversService: DriversService) {}

  @Get()
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.READ_DRIVERS,
  })
  @ApiOperation({
    summary: 'Get list of all drivers. Role: SUPERADMIN, ADMIN. Permission: READ_DRIVERS.',
  })
  async getAllDrivers(): Promise<DriversEntity[]> {
    return this.driversService.findAll()
  }

  @Post()
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.CREATE_DRIVERS,
  })
  @ApiOperation({
    summary: 'Add a new drvier. Role: SUPERADMIN, ADMIN. Permission: CREATE_DRIVERS.',
  })
  @ApiBody({
    description: 'Model to add a new driver.',
    type: CreateDriverDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Will return the driver data.',
    type: DriversEntity,
  })
  async createDriver(@Body() data: CreateDriverDto): Promise<DriversEntity> {
    return this.driversService.createDriver(data)
  }

  @Put(':id')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.UPDATE_DRIVERS,
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  @ApiOperation({
    summary: 'Update an driver. Role: SUPERADMIN, ADMIN. Permission: UPDATE_DRIVERS.',
  })
  @ApiBody({
    description: 'Model to update an existing driver.',
    type: UpdateDriverDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Will return the driver data.',
    type: UsersEntity,
  })
  async updateDriver(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateDriverDto,
  ): Promise<DriversEntity> {
    return this.driversService.updateDriver(id, data)
  }

  @Delete(':id')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.DELETE_DRIVERS,
  })
  @ApiOperation({
    summary: 'Remove an driver. Role: SUPERADMIN, ADMIN. Permission: DELETE_DRIVERS.',
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
  async removeUser(@Param('id', ParseIntPipe) id: number): Promise<Boolean> {
    return this.driversService.removeDriver(id)
  }
}
