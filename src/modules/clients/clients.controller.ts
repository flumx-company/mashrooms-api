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

import { UsersEntity } from '@users/users.entity'
import { Auth } from '@decorators/index'
import { ApiV1 } from '@utils/index'
import { ERole, EPermission } from '@enums/index'

import { ClientsService } from './clients.service'
import { ClientsEntity } from './clients.entity'
import { CreateClientDto } from './dto/create.client.dto'
import { UpdateClientDto } from './dto/update.client.dto'

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
    summary: 'Get list of all clients. Permission: READ_CLIENTS.',
  })
  async getAllUsers(): Promise<ClientsEntity[]> {
    return this.clientsService.findAll()
  }

  @Post()
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.CREATE_CLIENTS,
  })
  @ApiOperation({
    summary: 'Add a new client. Permission: CREATE_CLIENTS.',
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
    summary: 'Update an client. Permission: UPDATE_CLIENTS.',
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
    type: UsersEntity,
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
    summary: 'Remove an client. Permission: DELETE_CLIENTS.',
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
    return this.clientsService.removeClient(id)
  }
}
