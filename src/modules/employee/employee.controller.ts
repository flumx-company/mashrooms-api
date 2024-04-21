import { Response as ExResponse } from 'express'
import {
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
  Paginated,
} from 'nestjs-paginate'
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
import { AnyFilesInterceptor, FilesInterceptor } from '@nestjs/platform-express'
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
import { AddEmployeeDocumentsDto, EditEmployeeAvatarDto } from './dto'
import { CreateEmployeeDto } from './dto/create.employee.dto'
import { UpdateEmployeeDto } from './dto/update.employee.dto'
import { Employee } from './employee.entity'
import { EmployeeService } from './employee.service'
import { employeePaginationConfig } from './pagination/employee.pagination.config'

@ApiTags('Employees')
@ApiBadGatewayResponse({
  status: 502,
  description: 'Something went wrong',
})
@Controller(ApiV1('employees'))
export class EmployeeController {
  constructor(
    readonly employeeService: EmployeeService,
    private fileUploadService: FileUploadService,
  ) {}

  @Get()
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.READ_EMPLOYEES,
  })
  @ApiOperation({
    summary:
      'Get list of all employees. Role: SUPERADMIN, ADMIN. Permission: READ_EMPLOYEES.',
  })
  @ApiPaginationQuery(employeePaginationConfig)
  async getAllEmployees(
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<Employee>> {
    return this.employeeService.findAll(query)
  }

  @Get(':id')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.READ_EMPLOYEES,
  })
  @ApiOperation({
    summary:
      'Get employee whose id was provided. Role: SUPERADMIN, ADMIN. Permission: READ_EMPLOYEES.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  async getEmployee(@Param('id', ParseIntPipe) id: number): Promise<Employee> {
    return this.employeeService.findEmployeeByIdWithRelations(id)
  }

  @Post()
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.CREATE_EMPLOYEES,
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(AnyFilesInterceptor())
  @ApiOperation({
    summary:
      'Add a new employee. Role: SUPERADMIN, ADMIN. Permission: CREATE_EMPLOYEES.',
  })
  @ApiBody({
    description: 'Model to add a new employee.',
    type: CreateEmployeeDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Will return the employee data.',
    type: Employee,
  })
  async createEmployee(
    @UploadedFiles() files: Array<BufferedFile>,
    @Body() data: CreateEmployeeDto,
  ): Promise<Employee> {
    return this.employeeService.createEmployee(data, files)
  }

  @Put(':id')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.UPDATE_EMPLOYEES,
  })
  @ApiOperation({
    summary:
      'Update an employee. Role: SUPERADMIN, ADMIN. Permission: UPDATE_EMPLOYEES.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  @ApiBody({
    description: 'Model to update an existing employee.',
    type: UpdateEmployeeDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Will return the employee data.',
    type: Employee,
  })
  async updateEmployee(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateEmployeeDto,
  ): Promise<Employee> {
    return this.employeeService.updateEmployee(id, data)
  }

  @Delete(':id')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.DELETE_EMPLOYEES,
  })
  @ApiOperation({
    summary:
      'Remove an employee. Role: SUPERADMIN, ADMIN. Permission: DELETE_EMPLOYEES',
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
  async removeEmployee(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Boolean> {
    return this.employeeService.removeEmployee(id)
  }

  @Get(':id/avatar')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.READ_EMPLOYEES,
  })
  @ApiOperation({
    summary:
      "Get employee's avatar stream whose id was provided. Role: SUPERADMIN, ADMIN. Permission: READ_EMPLOYEES.",
  })
  @ApiResponse({
    status: 200,
    description:
      'Will return avatar stream of an employee whose id is provided.',
    type: PublicFile,
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  async getEmployeeAvatar(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<StreamableFile> {
    return this.employeeService.findEmployeeAvatar(id)
  }

  @Put(':id/avatar')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.UPDATE_EMPLOYEES,
  })
  @ApiOperation({
    summary:
      'Change an avatar of the employee whose id was provided. Role: SUPERADMIN, ADMIN. Permission: UPDATE_EMPLOYEES.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  @ApiBody({
    description: 'Model to change avatar of the employee whose id is provided.',
    type: EditEmployeeAvatarDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Will return the employee data.',
    type: Employee,
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor(EFileCategory.EMPLOYEE_AVATARS))
  async changeEmployeeAvatar(
    @Body() data: EditEmployeeAvatarDto, //NOTE: it needs to be declared here for dto check to run
    @UploadedFiles() employeeAvatars: BufferedFile[],
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Employee> {
    return this.employeeService.changeEmployeeAvatar(id, employeeAvatars)
  }

  @Delete(':id/avatar')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.DELETE_CLIENT_FILES,
  })
  @ApiOperation({
    summary:
      'Remove an avatar of the employee whose id is provided. Role: SUPERADMIN, ADMIN. Permission: UPDATE_EMPLOYEES.',
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
  async removeEmployeeAvatar(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Boolean> {
    return this.employeeService.removeEmployeeAvatar(id)
  }

  @Get(':id/documents')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.READ_EMPLOYEE_DOCUMENTS,
  })
  @ApiOperation({
    summary:
      'Get documents related to an emplouyee whose id is provided. Role: SUPERADMIN, ADMIN. Permission: READ_EMPLOYEE_DOCUMENTS.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Will return documents related to an employee whose id is provided.',
    type: PublicFile,
    isArray: true,
  })
  async getDocumentsByEmployeeId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Nullable<PublicFile[]>> {
    return this.employeeService.getDocumentsByEmployeeId(id)
  }

  @Post(':id/documents')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.CREATE_EMPLOYEE_DOCUMENTS,
  })
  @ApiOperation({
    summary:
      'Adds documents to the employee whose id is provided. Role: SUPERADMIN, ADMIN. Permission: CREATE_EMPLOYEE_DOCUMENTS.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  @ApiBody({
    description:
      'Model to add new documents related to the employee whose id is provided.',
    type: AddEmployeeDocumentsDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Will return the employee data.',
    type: Employee,
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor(EFileCategory.EMPLOYEE_DOCUMENTS))
  async addClientFiles(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: AddEmployeeDocumentsDto, //NOTE: it needs to be declared here for dto check to run
    @UploadedFiles() files: BufferedFile[],
  ): Promise<Employee> {
    return this.employeeService.addEmployeeDocuments(id, files)
  }

  @Delete(':employeeId/document/:documentId')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.DELETE_EMPLOYEE_DOCUMENTS,
  })
  @ApiOperation({
    summary:
      'Remove an employee with documentId related to the employee whose employeeId is provided. Role: SUPERADMIN, ADMIN. Permission: DELETE_EMPLOYEE_DOCUMENTS.',
  })
  @ApiParam({
    name: 'employeeId',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  @ApiParam({
    name: 'documentId',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  @ApiResponse({
    status: 200,
    description: 'Will return boolean result.',
    type: Boolean,
  })
  async removeClientFile(
    @Param('employeeId', ParseIntPipe) employeeId: number,
    @Param('documentId', ParseIntPipe) documentId: number,
  ): Promise<Boolean> {
    return this.employeeService.removeEmployeeDocument(employeeId, documentId)
  }

  @Get('document/:id')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.READ_EMPLOYEE_DOCUMENTS,
  })
  @ApiOperation({
    summary:
      'Render employee document. Role: SUPERADMIN, ADMIN. Permission: READ_EMPLOYEE_DOCUMENTS.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  async getDocumentById(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: ExResponse,
  ) {
    const {
      fileInfo,
      stream,
    }: { fileInfo: PublicFile; stream: stream.Readable } =
      await this.fileUploadService.getFile(id, EFileCategory.EMPLOYEE_DOCUMENTS)

    return new StreamableFile(stream, {
      disposition: `inline filename="${fileInfo.name}`,
      type: fileInfo.type,
    })
  }

  @Get('document-download/:id')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.READ_EMPLOYEE_DOCUMENTS,
  })
  @ApiOperation({
    summary:
      'Download employee document. Role: SUPERADMIN, ADMIN. Permission: READ_EMPLOYEE_DOCUMENTS.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  async downloadDocumentById(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: ExResponse,
  ) {
    const {
      fileInfo,
      stream,
    }: { fileInfo: PublicFile; stream: stream.Readable } =
      await this.fileUploadService.getFile(id, EFileCategory.EMPLOYEE_DOCUMENTS)

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
