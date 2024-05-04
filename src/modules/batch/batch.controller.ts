import { FilesInterceptor } from '@nestjs/platform-express';
import { Response as ExResponse } from 'express';
import {
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
  Paginated, PaginateConfig,
} from 'nestjs-paginate';
import * as stream from 'stream'

import {
  Body,
  Controller, Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Res, StreamableFile, UploadedFiles, UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadGatewayResponse,
  ApiBody, ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiParamOptions,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Wave } from '@mush/modules/wave/wave.entity'

import { Auth } from '@mush/core/decorators'
import { EFileCategory, EPermission, ERole } from '@mush/core/enums';
import { ApiV1, CError } from '@mush/core/utils'
import { AddClientFilesDto } from '../client/dto';
import { FileUploadService } from '../file-upload/file-upload.service';
import { BufferedFile } from '../file-upload/file.model';
import { PublicFile } from '../file-upload/public-file.entity';

import { Batch } from './batch.entity'
import { BatchService } from './batch.service'
import { CreateBatchDto, UpdateBatchDto } from './dto'
import { batchPaginationConfig } from './pagination'
import { AddBatchFilesDto } from './pagination/add.batch.files.dto';

@ApiTags('Batches')
@ApiBadGatewayResponse({
  status: 502,
  description: 'Something went wrong',
})
@Controller(ApiV1('batches'))
export class BatchController {
  constructor(readonly batchService: BatchService, private fileUploadService: FileUploadService,) {}

  @Get()
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.READ_BATCHES,
  })
  @ApiOperation({
    summary:
      'Get list of all batches. Role: SUPERADMIN, ADMIN. Permission: READ_BATCHES.',
  })
  @ApiPaginationQuery(batchPaginationConfig)
  async getAllBatches(
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<Batch>> {
    return this.batchService.findAll(query)
  }

  @Get(':batchId')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.READ_BATCHES,
  })
  @ApiParam({
    name: 'batchId',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  @ApiOperation({
    summary:
      'Get the batch with the provided id. Role: SUPERADMIN, ADMIN. Permission: READ_BATCHES.',
  })
  async getBatchById(
    @Param('batchId', ParseIntPipe) batchId: number,
  ): Promise<Batch> {
    const foundBatch = await this.batchService.findBatchById(batchId)

    if (!foundBatch) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    return foundBatch
  }

  @Post()
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.CREATE_BATCHES,
  })
  @ApiOperation({
    summary:
      'Add a new batch. Role: SUPERADMIN, ADMIN. Permission: CREATE_BATCHES.',
  })
  @ApiBody({
    description: 'Model to add a new batch.',
    type: CreateBatchDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Will return the batch data.',
    type: Batch,
  })
  async createBatch(@Body() data: CreateBatchDto): Promise<Batch> {
    return this.batchService.createBatch(data)
  }

  @Put(':batchId')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.UPDATE_BATCHES,
  })
  @ApiParam({
    name: 'batchId',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  @ApiOperation({
    summary:
      'Add a new batch. Role: SUPERADMIN, ADMIN. Permission: UPDATE_BATCHES.',
  })
  @ApiBody({
    description: 'Model to add a new batch.',
    type: UpdateBatchDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Will return the batch data.',
    type: Batch,
  })
  async updateBatch(
    @Param('batchId', ParseIntPipe) batchId: number,
    @Body() data: UpdateBatchDto,
  ): Promise<Batch> {
    return this.batchService.updateBatch(batchId, data)
  }

  @Put(':batchId/wave/:waveOrder')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.UPDATE_BATCHES,
  })
  @ApiOperation({
    summary:
      'Add a new batch. Role: SUPERADMIN, ADMIN. Permission: UPDATE_BATCHES.',
  })
  @ApiParam({
    name: 'batchId',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  @ApiParam({
    name: 'waveOrder',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  @ApiResponse({
    status: 200,
    description: 'Will return the new wave.',
    type: Wave,
  })
  async changeWave(
    @Param('batchId', ParseIntPipe) batchId: number,
    @Param('waveOrder', ParseIntPipe) waveOrder: number,
  ): Promise<Wave> {
    return this.batchService.changeWave({ batchId, waveOrder })
  }

  @Put('end/:batchId')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.UPDATE_BATCHES,
  })
  @ApiOperation({
    summary:
      'Add a new batch. Role: SUPERADMIN, ADMIN. Permission: UPDATE_BATCHES.',
  })
  @ApiParam({
    name: 'batchId',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  @ApiResponse({
    status: 200,
    description: 'Will return the ended batch.',
    type: Batch,
  })
  async endBatch(
    @Param('batchId', ParseIntPipe) batchId: number,
  ): Promise<Batch> {
    return this.batchService.endBatch(batchId)
  }
  @Get(':id/files')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.READ_BATCH_DOCUMENTS,
  })
  @ApiOperation({
    summary:
      'Get files related to a batch whose id is provided. Role: SUPERADMIN, ADMIN. Permission: READ_BATCH_DOCUMENTS.',
  })
  @ApiPaginationQuery({
    relations: [EFileCategory.BATCH_DOCUMENTS],
    sortableColumns: ['documents.id', 'id'],
  } as PaginateConfig<PublicFile>)
  async getDocumentsByEmployeeId(
    @Param('id', ParseIntPipe) id: number,
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<PublicFile>> {
    return this.batchService.findBatchDocuments(query, id);
  }

  @Post(':id/files')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.CREATE_BATCH_FILES,
  })
  @ApiOperation({
    summary:
      'Adds files to the batch whose id is provided. Role: SUPERADMIN, ADMIN. Permission: CREATE_BATCH_FILES.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  @ApiBody({
    description:
      'Model to add new files related to the client whose id is provided.',
    type: AddBatchFilesDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Will return the client data.',
    type: Batch,
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor(EFileCategory.BATCH_DOCUMENTS))
  async addBatchFiles(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: AddClientFilesDto, //NOTE: it needs to be declared here for dto check to run
    @UploadedFiles() files: BufferedFile[],
  ): Promise<Batch> {
    return this.batchService.addBatchFiles(id, files)
  }

  @Delete(':batchId/file/:fileId')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.DELETE_BATCH_FILES,
  })
  @ApiOperation({
    summary:
      'Remove a file with fileId related to the batch whose batchId is provided. Role: SUPERADMIN, ADMIN. Permission: DELETE_BATCH_FILES.',
  })
  @ApiParam({
    name: 'batchId',
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
  async removeBatchFile(
    @Param('batchId', ParseIntPipe) batchId: number,
    @Param('fileId', ParseIntPipe) fileId: number,
  ): Promise<Boolean> {
    return this.batchService.removeClientFile(batchId, fileId)
  }

  @Get('file/:id')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.READ_BATCH_FILES,
  })
  @ApiOperation({
    summary:
      'Render client file. Role: SUPERADMIN, ADMIN. Permission: READ_BATCH_FILES.',
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
