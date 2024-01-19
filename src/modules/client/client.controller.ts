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
import { ApiV1, Nullable } from '@mush/core/utils'

import { Client } from './client.entity'
import { ClientService } from './client.service'
import { CreateClientDto } from './dto/create.client.dto'
import { UpdateClientDto } from './dto/update.client.dto'
import { clientPaginationConfig } from './pagination'

@ApiTags('Clients')
@ApiBadGatewayResponse({
  status: 502,
  description: 'Something went wrong',
})
@Controller(ApiV1('clients'))
export class ClientController {
  constructor(readonly clientService: ClientService) {}

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
    type: Client,
    isArray: true,
  })
  @ApiPaginationQuery(clientPaginationConfig)
  async getAllClients(
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<Client>> {
    return this.clientService.findAll(query)
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
    type: Client,
    isArray: true,
  })
  @ApiPaginationQuery(clientPaginationConfig)
  async getClientById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Nullable<Client>> {
    return this.clientService.getClientById(id)
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
    type: Client,
  })
  async createClient(@Body() data: CreateClientDto): Promise<Client> {
    return this.clientService.createClient(data)
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
    type: Client,
  })
  async updateClient(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateClientDto,
  ): Promise<Client> {
    return this.clientService.updateClient(id, data)
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
    return this.clientService.removeClient(id)
  }
}
