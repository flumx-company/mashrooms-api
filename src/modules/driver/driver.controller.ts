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

import { User } from '@mush/modules/core-module/user/user.entity'

import { Auth } from '@mush/core/decorators'
import { EPermission, ERole } from '@mush/core/enums'
import { ApiV1 } from '@mush/core/utils'

import { Driver } from './driver.entity'
import { DriverService } from './driver.service'
import { CreateDriverDto } from './dto/create.driver.dto'
import { UpdateDriverDto } from './dto/update.driver.dto'
import { driverPaginationConfig } from './pagination/driver.pagination.config'

@ApiTags('Drivers')
@ApiBadGatewayResponse({
  status: 502,
  description: 'Something went wrong',
})
@Controller(ApiV1('drivers'))
export class DriverController {
  constructor(readonly driverService: DriverService) {}

  @Get()
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.READ_DRIVERS,
  })
  @ApiOperation({
    summary:
      'Get list of all drivers. Role: SUPERADMIN, ADMIN. Permission: READ_DRIVERS.',
  })
  @ApiResponse({
    status: 200,
    description: 'Will return the list of drivers.',
    type: Driver,
    isArray: true,
  })
  @ApiPaginationQuery(driverPaginationConfig)
  async getAllDrivers(
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<Driver>> {
    return this.driverService.findAll(query)
  }

  @Get('search/name/:name')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.READ_DRIVERS,
  })
  @ApiParam({
    name: 'name',
    type: 'string',
    example: 'Jack',
  } as ApiParamOptions)
  @ApiOperation({
    summary:
      'Get drivers with the provided name. Role: SUPERADMIN, ADMIN. Permission: READ_DRIVERS.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Will return the drivers who have matching first name or last name.',
    type: Driver,
    isArray: true,
  })
  async findDriversByName(@Param('name') name: string): Promise<Driver[]> {
    return this.driverService.findDriversByName(name)
  }

  @Post()
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.CREATE_DRIVERS,
  })
  @ApiOperation({
    summary:
      'Add a new drvier. Role: SUPERADMIN, ADMIN. Permission: CREATE_DRIVERS.',
  })
  @ApiBody({
    description: 'Model to add a new driver.',
    type: CreateDriverDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Will return the driver data.',
    type: Driver,
  })
  async createDriver(@Body() data: CreateDriverDto): Promise<Driver> {
    return this.driverService.createDriver(data)
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
    summary:
      'Update an driver. Role: SUPERADMIN, ADMIN. Permission: UPDATE_DRIVERS.',
  })
  @ApiBody({
    description: 'Model to update an existing driver.',
    type: UpdateDriverDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Will return the driver data.',
    type: User,
  })
  async updateDriver(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateDriverDto,
  ): Promise<Driver> {
    return this.driverService.updateDriver(id, data)
  }

  @Delete(':id')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.DELETE_DRIVERS,
  })
  @ApiOperation({
    summary:
      'Remove an driver. Role: SUPERADMIN, ADMIN. Permission: DELETE_DRIVERS.',
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
    return this.driverService.removeDriver(id)
  }
}
