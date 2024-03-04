import { Repository } from 'typeorm'

import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { EmployeeService } from '@mush/modules/employee/employee.service'

import { CError, Nullable, pick } from '@mush/core/utils'

import { Chamber } from '../chamber/chamber.entity'
import { ChamberService } from '../chamber/chamber.service'
import { Employee } from '../employee/employee.entity'
import { Shift } from '../shift/shift.entity'
import { ShiftService } from '../shift/shift.service'
import { Work } from '../work/work.entity'
import { WorkService } from '../work/work.service'
import { CreateWorkRecordDto } from './dto'
import { WorkRecord } from './work.record.entity'

@Injectable()
export class WorkRecordService {
  constructor(
    @InjectRepository(WorkRecord)
    private workRecordRepository: Repository<WorkRecord>,
    private readonly workService: WorkService,
    private readonly employeeService: EmployeeService,
    private readonly shiftService: ShiftService,
    private readonly chamberService: ChamberService,
  ) {}

  async createWorkRecord(
    workId: number,
    { dividedAmount, date, employees, chamberId }: CreateWorkRecordDto,
  ) {
    const percentSum = employees.reduce(
      (accumulator, employee) => accumulator + employee.percent,
      0,
    )

    if (percentSum !== 1) {
      throw new HttpException(CError.WRONG_PERCENT_SUM, HttpStatus.BAD_REQUEST)
    }

    const foundChamber: Nullable<Chamber> =
      await this.chamberService.findChamberById(chamberId)

    if (!foundChamber) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    const foundWork: Nullable<Work> = await this.workService.findWorkById(
      workId,
    )

    if (!foundWork) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    const foundEmployees: Array<Nullable<Employee>> = await Promise.all(
      employees.map(({ employeeId }) => {
        return this.employeeService.findEmployeeById(employeeId)
      }),
    )

    foundEmployees.forEach((employee) => {
      if (!employee) {
        throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
      }

      if (!employee.isActive) {
        throw new HttpException(
          CError.INACTIVE_EMPLOYEE,
          HttpStatus.BAD_REQUEST,
        )
      }
    })

    const foundShifts: Array<Nullable<Shift>> = await Promise.all(
      foundEmployees.map(({ id }) => {
        return this.shiftService.findCurrentShiftWithEmployeeId(id)
      }),
    )

    foundShifts.forEach((shift) => {
      if (!shift) {
        throw new HttpException(CError.NO_ONGOING_SHIFT, HttpStatus.BAD_REQUEST)
      }
    })

    const createdWorkRecords = await Promise.all(
      employees.map(({ percent, reward }, index) => {
        return this.workRecordRepository.create({
          date,
          percent,
          percentAmount: dividedAmount * percent,
          reward,
          work: pick(foundWork, 'id', 'title', 'isRegular'),
          shift: foundShifts[index],
          chamber: pick(foundChamber, 'id', 'name'),
        })
      }),
    )
    const savedWorkRecords = await Promise.all(
      createdWorkRecords.map((record) => {
        return this.workRecordRepository.save(record)
      }),
    )

    return savedWorkRecords
  }
}
