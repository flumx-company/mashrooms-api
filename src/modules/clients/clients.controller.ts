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
import {
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
  Paginated,
} from 'nestjs-paginate'

import { Auth } from '@mush/core/decorators'
import { ApiV1, Nullable } from '@mush/core/utils'
import { ERole, EPermission } from '@mush/core/enums'

import { ClientsService } from './clients.service'
import { ClientsEntity } from './clients.entity'
import { CreateClientDto } from './dto/create.client.dto'
import { UpdateClientDto } from './dto/update.client.dto'
import { clientsPaginationConfig } from './pagination'

@ApiTags('Clients')
@ApiBadGatewayResponse({
  status: 502,
  description: 'Something went wrong',
})
@Controller(ApiV1('clients'))
export class ClientsController {
  constructor(readonly clientsService: ClientsService) {}

  @Get()
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.READ_CLIENTS,
  })
  @ApiOperation({
    summary:
      'Get list of all clients. Role: SUPERADMIN, ADMIN. Permission: READ_CLIENTS.',
  })
  @ApiResponse({
    status: 200,
    description: 'Will return the list of clients.',
    type: ClientsEntity,
    isArray: true,
  })
  @ApiPaginationQuery(clientsPaginationConfig)
  async getAllClients(
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<ClientsEntity>> {
    return this.clientsService.findAll(query)
  }

  @Get(':id')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.READ_CLIENTS,
  })
  @ApiOperation({
    summary:
      'Get a client with the provided id. Role: SUPERADMIN, ADMIN. Permission: READ_CLIENTS.',
  })
  @ApiResponse({
    status: 200,
    description: 'Will return the a client with the provided id.',
    type: ClientsEntity,
    isArray: true,
  })
  @ApiPaginationQuery(clientsPaginationConfig)
  async getClientById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Nullable<ClientsEntity>> {
    return this.clientsService.getClientById(id)
  }

  @Post()
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.CREATE_CLIENTS,
  })
  @ApiOperation({
    summary:
      'Add a new client. Role: SUPERADMIN, ADMIN. Permission: CREATE_CLIENTS.',
  })
  @ApiBody({
    description: 'Model to add a new client.',
    type: CreateClientDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Will return the client data.',
    type: ClientsEntity,
  })
  async createClient(@Body() data: CreateClientDto): Promise<ClientsEntity> {
    return this.clientsService.createClient(data)
  }

  @Put(':id')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.UPDATE_CLIENTS,
  })
  @ApiOperation({
    summary:
      'Update a client. Role: SUPERADMIN, ADMIN. Permission: UPDATE_CLIENTS.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  @ApiBody({
    description: 'Model to update an existing client.',
    type: UpdateClientDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Will return the client data.',
    type: ClientsEntity,
  })
  async updateClient(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateClientDto,
  ): Promise<ClientsEntity> {
    return this.clientsService.updateClient(id, data)
  }

  @Delete(':id')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.DELETE_CLIENTS,
  })
  @ApiOperation({
    summary:
      'Remove a client. Role: SUPERADMIN, ADMIN. Permission: DELETE_CLIENTS.',
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
  async removeClient(@Param('id', ParseIntPipe) id: number): Promise<Boolean> {
    return this.clientsService.removeClient(id)
  }
}
