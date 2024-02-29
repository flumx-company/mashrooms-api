import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common'
import {
  ApiBadGatewayResponse,
  ApiOperation,
  ApiParam,
  ApiParamOptions,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import { Auth } from '@mush/core/decorators'
import { EPermission, ERole } from '@mush/core/enums'
import { ApiV1 } from '@mush/core/utils'

import { Shift } from './shift.entity'
import { ShiftService } from './shift.service'

@ApiTags('Shifts')
@ApiBadGatewayResponse({
  status: 502,
  description: 'Something went wrong',
})
@Controller(ApiV1('shifts'))
export class ShiftController {
  constructor(readonly shiftService: ShiftService) {}

  @Get()
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.READ_SHIFTS,
  })
  @ApiOperation({
    summary:
      'Get list of all shifts. Role: SUPERADMIN, ADMIN. Permission: READ_SHIFTS.',
  })
  @ApiResponse({
    status: 200,
    description: 'Will return the list of shifts.',
    type: Shift,
    isArray: true,
  })
  async getAllShifts(): Promise<Shift[]> {
    return this.shiftService.findAll()
  }

  @Get('ongoing')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.READ_SHIFTS,
  })
  @ApiOperation({
    summary:
      'Get list of all ongoing shifts. Role: SUPERADMIN, ADMIN. Permission: READ_SHIFTS.',
  })
  @ApiResponse({
    status: 200,
    description: 'Will return the list of ongoing shifts.',
    type: Shift,
    isArray: true,
  })
  async getAllCurrentShifts(): Promise<Shift[]> {
    return this.shiftService.findAllCurrentShifts()
  }

  @Get('ongoing/employee/:employeeId')
  @ApiParam({
    name: 'employeeId',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  @ApiOperation({
    summary:
      'Get a shift with employee id and work records related to the shift. Role: SUPERADMIN, ADMIN. Permission: READ_SHIFTS.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Will return a shift with employee id and work records related to the shift.',
    type: Shift,
  })
  async getEmployeeCurrectShift(
    @Param('employeeId', ParseIntPipe) employeeId: number,
  ): Promise<Shift> {
    return this.shiftService.findCurrentShiftWithWorkRecords(employeeId)
  }

  @Post('employee/:id/start')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.CREATE_SHIFTS,
  })
  @ApiOperation({
    summary:
      'Begin an employee shift. Role: SUPERADMIN, ADMIN. Permission: CREATE_SHIFTS.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  @ApiResponse({
    status: 200,
    description:
      'Will create a new shift and set employee isActive status to true. Returns true on success',
    type: Boolean,
  })
  async beginShift(@Param('id', ParseIntPipe) id: number): Promise<Boolean> {
    return this.shiftService.beginShift(id)
  }

  @Post('employee/:id/end')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.UPDATE_SHIFTS,
  })
  @ApiOperation({
    summary:
      'End an employee shift. Role: SUPERADMIN, ADMIN. Permission: UPDATE_SHIFTS.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  @ApiResponse({
    status: 200,
    description:
      'Will end an ongoing shift and set employee isActive status to false. Returns false on success',
    type: Boolean,
  })
  async endShift(@Param('id', ParseIntPipe) id: number): Promise<Boolean> {
    return this.shiftService.endShift(id)
  }

  @Delete('delete/:id')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.DELETE_SHIFTS,
  })
  @ApiOperation({
    summary:
      'Remove an employee shift. Role: SUPERADMIN, ADMIN. Permission: DELETE_SHIFTS.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    example: 1,
  } as ApiParamOptions)
  async removeShift(@Param('id', ParseIntPipe) id: number): Promise<Boolean> {
    return this.shiftService.removeShift(id)
  }
}
