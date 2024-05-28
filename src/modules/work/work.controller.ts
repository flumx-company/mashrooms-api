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

import { Auth } from '@mush/core/decorators'
import { EPermission, ERole } from '@mush/core/enums'
import { ApiV1 } from '@mush/core/utils'

import { UpdateWorkDto } from './dto/update.work.dto'
import { workPaginationConfig } from './pagination'
import { Work } from './work.entity'
import { WorkService } from './work.service'

@ApiTags('Works')
@ApiBadGatewayResponse({
  status: 502,
  description: 'Something went wrong',
})
@Controller(ApiV1('works'))
export class WorkController {
  constructor(readonly workService: WorkService) {}

  @Get()
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.READ_WORKS,
  })
  @ApiOperation({
    summary:
      'Get list of all works. Role: SUPERADMIN, ADMIN. Permission: READ_WORKS.',
  })
  @ApiResponse({
    status: 200,
    description: 'Will return the list of works.',
    type: Work,
    isArray: true,
  })
  @ApiPaginationQuery(workPaginationConfig)
  async getAllWorks(
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<Work>> {
    return this.workService.findAll(query)
  }

  @Post()
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.CREATE_WORKS,
  })
  @ApiOperation({
    summary:
      'Add a new work. Role: SUPERADMIN, ADMIN. Permission: CREATE_WORKS.',
  })
  @ApiBody({
    description: 'Model to add a new work.',
    type: UpdateWorkDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Will return the work data.',
    type: Work,
  })
  async createWork(@Body() data: UpdateWorkDto): Promise<Work> {
    return this.workService.createWork(data)
  }

  @Put(':id')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.UPDATE_WORKS,
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  @ApiOperation({
    summary:
      'Update a work. Role: SUPERADMIN, ADMIN. Permission: UPDATE_WORKS.',
  })
  @ApiBody({
    description: 'Model to update an existing work.',
    type: UpdateWorkDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Will return the work data.',
    type: Work,
  })
  async updateWork(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateWorkDto,
  ): Promise<Work> {
    return this.workService.updateWork(id, data)
  }

  @Delete(':id')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.DELETE_WORKS,
  })
  @ApiOperation({
    summary:
      'Remove a work. Role: SUPERADMIN, ADMIN. Permission: DELETE_WORKS.',
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
  async removeWork(@Param('id', ParseIntPipe) id: number): Promise<Boolean> {
    return this.workService.removeWork(id)
  }
}
