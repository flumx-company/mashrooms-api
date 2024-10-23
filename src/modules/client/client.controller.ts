import { ReturnBoxDto } from '@mush/modules/client/dto/return.box.dto';
import { Response as ExResponse } from 'express'
import {
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
  Paginated, FilterOperator, PaginateConfig,
} from 'nestjs-paginate';
import * as stream from 'stream'

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Res,
  StreamableFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import {
  ApiBadGatewayResponse,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiParamOptions,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import { Auth } from '@mush/core/decorators'
import { EFileCategory, EPermission, ERole } from '@mush/core/enums'
import { ApiV1, Nullable } from '@mush/core/utils'

import { FileUploadService } from '../file-upload/file-upload.service'
import { BufferedFile } from '../file-upload/file.model'
import { PublicFile } from '../file-upload/public-file.entity'
import { Client } from './client.entity'
import { ClientService } from './client.service'
import { AddClientFilesDto } from './dto'
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
  constructor(
    readonly clientService: ClientService,
    private fileUploadService: FileUploadService,
  ) {}

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
  @ApiParam({
    name: 'id',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  @ApiOperation({
    summary:
      'Get a client with the provided id. Role: SUPERADMIN, ADMIN. Permission: READ_CLIENTS.',
  })
  @ApiResponse({
    status: 200,
    description: 'Will return the client with the provided id.',
    type: Client,
    isArray: true,
  })
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
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor(EFileCategory.CLIENT_FILES))
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
  async createClient(
    @UploadedFiles() files: BufferedFile[],
    @Body() data: CreateClientDto,
  ): Promise<Client> {
    return this.clientService.createClient(data, files)
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

  @Put(':id/return-box')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.UPDATE_CLIENTS_BOX,
  })
  @ApiOperation({
    summary:
      'Update a client. Role: SUPERADMIN, ADMIN. Permission: UPDATE_CLIENTS_BOX',
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
  async updateBoxClient(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: ReturnBoxDto,
  ): Promise<Client> {
    return this.clientService.updateBoxClient(id, data)
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

  @Get(':id/files')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.READ_CLIENT_FILES,
  })
  @ApiOperation({
    summary:
      'Get files related to a client whose id is provided. Role: SUPERADMIN, ADMIN. Permission: READ_CLIENT_FILES.',
  })
  @ApiPaginationQuery({
    relations: [EFileCategory.CLIENT_FILES],
    sortableColumns: ['clientFiles.id', 'id'],
  } as PaginateConfig<PublicFile>)
  async getDocumentsByEmployeeId(
    @Param('id', ParseIntPipe) id: number,
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<PublicFile>> {
    return this.clientService.findClientDocuments(query, id);
  }

  @Post(':id/files')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.CREATE_CLIENT_FILES,
  })
  @ApiOperation({
    summary:
      'Adds files to the client whose id is provided. Role: SUPERADMIN, ADMIN. Permission: CREATE_CLIENT_FILES.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  @ApiBody({
    description:
      'Model to add new files related to the client whose id is provided.',
    type: AddClientFilesDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Will return the client data.',
    type: Client,
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor(EFileCategory.CLIENT_FILES))
  async addClientFiles(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: AddClientFilesDto, //NOTE: it needs to be declared here for dto check to run
    @UploadedFiles() files: BufferedFile[],
  ): Promise<Client> {
    return this.clientService.addClientFiles(id, files)
  }

  @Delete(':clientId/file/:fileId')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.DELETE_CLIENT_FILES,
  })
  @ApiOperation({
    summary:
      'Remove a file with fileId related to the client whose clientId is provided. Role: SUPERADMIN, ADMIN. Permission: DELETE_CLIENT_FILES.',
  })
  @ApiParam({
    name: 'clientId',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  @ApiParam({
    name: 'fileId',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  @ApiResponse({
    status: 200,
    description: 'Will return boolean result.',
    type: Boolean,
  })
  async removeClientFile(
    @Param('clientId', ParseIntPipe) clientId: number,
    @Param('fileId', ParseIntPipe) fileId: number,
  ): Promise<Boolean> {
    return this.clientService.removeClientFile(clientId, fileId)
  }

  @Get('file/:id')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.READ_CLIENT_FILES,
  })
  @ApiOperation({
    summary:
      'Render client file. Role: SUPERADMIN, ADMIN. Permission: READ_CLIENT_FILES.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  async getFileById(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: ExResponse,
  ) {
    const {
      fileInfo,
      stream,
    }: { fileInfo: PublicFile; stream: stream.Readable } =
      await this.fileUploadService.getFile(id, EFileCategory.CLIENT_FILES)

    return new StreamableFile(stream, {
      disposition: `inline filename="${fileInfo.name}`,
      type: fileInfo.type,
    })
  }

  @Get('file-dowload/:id')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.READ_CLIENT_FILES,
  })
  @ApiOperation({
    summary:
      'Download client file. Role: SUPERADMIN, ADMIN. Permission: READ_CLIENT_FILES.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  async downloadFileById(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: ExResponse,
  ) {
    const {
      fileInfo,
      stream,
    }: { fileInfo: PublicFile; stream: stream.Readable } =
      await this.fileUploadService.getFile(id, EFileCategory.CLIENT_FILES)

    res.set({
      'Content-Type': fileInfo.type,
      'Content-Disposition': `attachment; filename=${fileInfo.name}`,
    })

    return new StreamableFile(stream, {
      disposition: `inline filename="${fileInfo.name}`,
      type: fileInfo.type,
    })
  }
}
