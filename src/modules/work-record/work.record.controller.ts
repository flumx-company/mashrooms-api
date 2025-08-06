import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import {
  ApiBadGatewayResponse,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiParamOptions,
  ApiResponse,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger'
import {
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
  Paginated,
} from 'nestjs-paginate'

import { Auth } from '@mush/core/decorators'
import { EPermission, ERole } from '@mush/core/enums'
import { ApiV1 } from '@mush/core/utils'

import { CreateWorkRecordDto, GroupedWorkRecordResponseDto } from './dto'
import { UpdateWorkRecordDto } from './dto/update.work.record'
import { WorkRecord } from './work.record.entity'
import { WorkRecordService } from './work.record.service'
import { groupedWorkRecordPaginationConfig } from './pagination'

@ApiTags('Work Records')
@ApiBadGatewayResponse({
  status: 502,
  description: 'Something went wrong',
})
@Controller(ApiV1('work-records'))
export class WorkRecordController {
  constructor(readonly workRecordService: WorkRecordService) {}

  @Get()
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.READ_WORK_RECORDS,
  })
  @ApiOperation({
    summary:
      'Get grouped work records with pagination. Role: SUPERADMIN, ADMIN. Permission: READ_WORK_RECORDS.',
  })
  @ApiQuery({
    name: 'date',
    required: false,
    type: String,
    description: 'Дата для фильтрации записей (формат: YYYY-MM-DD)',
    example: '2025-08-04',
  })
  @ApiQuery({
    name: 'chamberId',
    required: false,
    type: Number,
    description: 'ID камеры (chamber) для фильтрации',
    example: 1,
  })
  @ApiQuery({
    name: 'workId',
    required: false,
    type: Number,
    description: 'ID работы (work) для фильтрации',
    example: 2,
  })
  @ApiQuery({
    name: 'shiftId',
    required: false,
    type: Number,
    description: 'ID смены (shift) для фильтрации',
    example: 17,
  })
  @ApiQuery({
    name: 'chamberId',
    required: false,
    type: Number,
    description: 'ID камеры (chamber) для фильтрации',
    example: 1,
  })
  @ApiQuery({
    name: 'employeeId',
    required: false,
    type: Number,
    description: 'ID сотрудника (employee) для фильтрации',
    example: 5,
  })
  @ApiQuery({
    name: 'workType',
    required: false,
    type: String,
    description: 'Тип работы (WATERING, CUTTING, CUSTOM)',
    example: 'CUSTOM',
  })
  @ApiQuery({
    name: 'isRegular',
    required: false,
    type: Boolean,
    description: 'Регулярная ли работа (true/false)',
    example: true,
  })
  @ApiQuery({
    name: 'recordGroupId',
    required: false,
    type: Number,
    description: 'ID группы записей',
    example: 12345,
  })
  @ApiResponse({
    status: 200,
    description: 'Will return grouped work records with pagination.',
    type: GroupedWorkRecordResponseDto,
    isArray: true,
  })
  @ApiPaginationQuery(groupedWorkRecordPaginationConfig)
  async getGroupedWorkRecords(
    @Paginate() query: PaginateQuery,
    @Query('date') date?: string,
    @Query('chamberId') chamberId?: number,
    @Query('workId') workId?: number,
    @Query('shiftId') shiftId?: number,
    @Query('employeeId') employeeId?: number,
    @Query('workType') workType?: string,
    @Query('isRegular') isRegular?: boolean,
    @Query('recordGroupId') recordGroupId?: number,
  ): Promise<Paginated<GroupedWorkRecordResponseDto>> {
    return this.workRecordService.getGroupedWorkRecordsWithFilters(query, {
      date,
      chamberId,
      workId,
      shiftId,
      employeeId,
      workType,
      isRegular,
      recordGroupId
    })
  }

  @Get('work')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.READ_WORK_RECORDS,
  })
  @ApiQuery({
    name: 'date',
    required: false,
    type: String,
    description: 'Дата для фильтрации записей (формат: YYYY-MM-DD)',
    example: '2025-08-04',
  })
  @ApiQuery({
    name: 'chamberId',
    required: false,
    type: Number,
    description: 'ID камеры (chamber) для фильтрации',
  })
  @ApiQuery({
    name: 'workId',
    required: false,
    type: Number,
    description: 'ID работы (work) для фильтрации',
  })
  @ApiQuery({
    name: 'shiftId',
    required: false,
    type: Number,
    description: 'ID смены (shift) для фильтрации',
  })
  @ApiQuery({
    name: 'employeeId',
    required: false,
    type: Number,
    description: 'ID сотрудника (employee) для фильтрации',
  })
  @ApiQuery({
    name: 'workType',
    required: false,
    type: String,
    description: 'Тип работы (WATERING, CUTTING, CUSTOM)',
  })
  @ApiQuery({
    name: 'isRegular',
    required: false,
    type: Boolean,
    description: 'Регулярная ли работа (true/false)',
  })
  @ApiQuery({
    name: 'recordGroupId',
    required: false,
    type: Number,
    description: 'ID группы записей',
  })
  @ApiOperation({
    summary:
      'Find work records by filters. Role: SUPERADMIN, ADMIN. Permission: READ_WORK_RECORDS.',
  })
  @ApiResponse({
    status: 200,
    description: 'Will return the work records by filters.',
    type: WorkRecord,
    isArray: true,
  })
  async getWorkRecordsByDate(
    @Query('date') date?: string,
    @Query('chamberId') chamberId?: number,
    @Query('workId') workId?: number,
    @Query('shiftId') shiftId?: number,
    @Query('employeeId') employeeId?: number,
    @Query('workType') workType?: string,
    @Query('isRegular') isRegular?: boolean,
    @Query('recordGroupId') recordGroupId?: number,
  ) {
    return this.workRecordService.findAllByDate(date, { 
      chamberId, 
      workId, 
      shiftId, 
      employeeId, 
      workType, 
      isRegular, 
      recordGroupId 
    })
  }

  @Post('work/:workId')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.CREATE_WORK_RECORDS,
  })
  @ApiParam({
    name: 'workId',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  @ApiOperation({
    summary:
      'Add a new work record. Role: SUPERADMIN, ADMIN. Permission: CREATE_WORK_RECORDS.',
  })
  @ApiBody({
    description: 'Model to add a new work record.',
    type: CreateWorkRecordDto,
  })
  @ApiResponse({
    status: 200,
    description:
      'Will return the work record list with related work, shift, employeeId.',
    type: WorkRecord,
    isArray: true,
  })
  async createWorkRecord(
    @Param('workId', ParseIntPipe) workId: number,
    @Body() data: CreateWorkRecordDto,
  ): Promise<WorkRecord[]> {
    return this.workRecordService.createWorkRecord(workId, data)
  }

  @Put(':recordGroupId')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.UPDATE_WORK_RECORDS,
  })
  @ApiParam({
    name: 'recordGroupId',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  @ApiOperation({
    summary:
      'Edit a work record. Role: SUPERADMIN, ADMIN. Permission: UPDATE_WORK_RECORDS.',
  })
  @ApiBody({
    description: 'Model to edit a work record.',
    type: UpdateWorkRecordDto,
  })
  @ApiResponse({
    status: 200,
    description:
      'Will return the work record list with related work, shift, employeeId.',
    type: WorkRecord,
    isArray: true,
  })
  async updateWorkRecord(
    @Param('recordGroupId', ParseIntPipe) recordGroupId: number,
    @Body() data: UpdateWorkRecordDto,
  ): Promise<WorkRecord[]> {
    return this.workRecordService.updateWorkRecord(recordGroupId, data)
  }

  @Delete(':recordGroupId')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.DELETE_WORK_RECORDS,
  })
  @ApiParam({
    name: 'recordGroupId',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  @ApiOperation({
    summary:
      'Edit a work record. Role: SUPERADMIN, ADMIN. Permission: DELETE_WORK_RECORDS.',
  })
  @ApiResponse({
    status: 200,
    description: 'Will return boolean result.',
    type: Boolean,
  })
  async removeWorkRecord(
    @Param('recordGroupId', ParseIntPipe) recordGroupId: number,
  ): Promise<Boolean> {
    return this.workRecordService.removeWorkRecord(recordGroupId)
  }
}
