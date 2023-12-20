import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiBadGatewayResponse,
  ApiBody,
  ApiResponse,
  ApiParam,
  ApiParamOptions,
} from "@nestjs/swagger";
import { UsersEntity } from "../core-module/users/users.entity";

import { ApiV1 } from "src/core/utils/versions";
import { Auth } from "src/core/decorators/auth.decorator";
import { ERole } from "../core-module/users/enums/roles";
import { EPermission } from "../core-module/users/enums/permissions";
import { ClientsService } from "./clients.service";
import { ClientsEntity } from "./clients.entity";
import { CreateClientDto } from "./dto/create.client.dto";
import { UpdateClientDto } from "./dto/update.client.dto";

@ApiTags("Clients")
@ApiBadGatewayResponse({
  status: 502,
  description: "Something went wrong",
})
@Controller(ApiV1("clients"))
export class ClientsController {
  constructor(readonly clientsService: ClientsService) {}

  @Get()
  @Auth({ role: ERole.SUPERADMIN, permission: EPermission.READ_CLIENTS })
  @ApiOperation({
    summary: "Get list of all clients",
  })
  async getAllUsers(): Promise<ClientsEntity[]> {
    return this.clientsService.findAll();
  }

  @Post()
  @Auth({ role: ERole.ADMIN, permission: EPermission.CREATE_CLIENTS })
  @ApiOperation({
    summary: "Add a new client",
  })
  @ApiBody({
    description: "Model to add a new client.",
    type: CreateClientDto,
  })
  @ApiResponse({
    status: 200,
    description: "Will return the client data.",
    type: ClientsEntity,
  })
  async createClient(@Body() data: CreateClientDto): Promise<ClientsEntity> {
    return this.clientsService.createClient(data);
  }

  @Put()
  @Auth({ role: ERole.ADMIN, permission: EPermission.UPDATE_CLIENTS })
  @ApiOperation({
    summary: "Update an client.",
  })
  @ApiBody({
    description: "Model to update an existing client.",
    type: UpdateClientDto,
  })
  @ApiResponse({
    status: 200,
    description: "Will return the client data.",
    type: UsersEntity,
  })
  async updateClient(@Body() data: UpdateClientDto): Promise<ClientsEntity> {
    return this.clientsService.updateClient(data);
  }

  @Delete(":id")
  @Auth({ role: ERole.ADMIN, permission: EPermission.DELETE_CLIENTS })
  @ApiOperation({
    summary: "Remove an client.",
  })
  @ApiParam({
    name: "id",
    type: "number",
    example: 1,
  } as ApiParamOptions)
  @ApiResponse({
    status: 200,
    description: "Will return boolean result.",
    type: Boolean,
  })
  async removeUser(@Param("id") id: string): Promise<Boolean> {
    return this.clientsService.removeClient(parseInt(id));
  }
}
