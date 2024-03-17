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
import { UpdateWorkRecordDto } from './dto/update.work.record'
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

  findAllByDate(date): Promise<WorkRecord[]> {
    return this.workRecordRepository
      .createQueryBuilder('workRecord')
      .where('workRecord.date = :date', { date })
      .leftJoinAndSelect('workRecord.shift', 'shift')
      .leftJoinAndSelect('workRecord.work', 'work')
      .leftJoinAndSelect('workRecord.chamber', 'chamber')
      .leftJoinAndSelect('shift.employee', 'employee')
      .select([
        'workRecord.id',
        'workRecord.date',
        'workRecord.percent',
        'workRecord.percentAmount',
        'workRecord.reward',
        'workRecord.recordGoupId',
        'shift.id',
        'shift.dateFrom',
        'shift.dateTo',
        'employee.id',
        'employee.firstName',
        'employee.lastName',
        'employee.patronymic',
        'work.id',
        'work.title',
        'work.isRegular',
        'work.price',
        'chamber.id',
        'chamber.name',
        'chamber.area',
      ])
      .orderBy('work.title', 'ASC')
      .getMany()
  }

  async createWorkRecord(
    workId: number,
    { dividedAmount, date, employees, chamberId }: CreateWorkRecordDto,
  ): Promise<WorkRecord[]> {
    const percentSum: number = employees.reduce(
      (accumulator, employee) => accumulator + employee.percent,
      0,
    )
    const recordGroupId: number = Date.now()
    const [foundChamber, foundWork]: [Nullable<Chamber>, Nullable<Work>] =
      await Promise.all([
        this.chamberService.findChamberById(chamberId),
        this.workService.findWorkById(workId),
      ])
    const foundEmployees: Array<Nullable<Employee>> = await Promise.all(
      employees.map(({ employeeId }) => {
        return this.employeeService.findEmployeeById(employeeId)
      }),
    )
    const foundShifts: Array<Nullable<Shift>> = await Promise.all(
      foundEmployees.map(({ id }) => {
        return this.shiftService.findCurrentShiftWithEmployeeId(id)
      }),
    )

    if (percentSum !== 1) {
      throw new HttpException(CError.WRONG_PERCENT_SUM, HttpStatus.BAD_REQUEST)
    }

    if (!foundChamber || !foundWork) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

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

    foundShifts.forEach((shift) => {
      if (!shift) {
        throw new HttpException(CError.NO_ONGOING_SHIFT, HttpStatus.BAD_REQUEST)
      }
    })

    const createdWorkRecords: WorkRecord[] = await Promise.all(
      employees.map(({ percent, reward }, index) => {
        return this.workRecordRepository.create({
          date,
          percent,
          percentAmount: dividedAmount * percent,
          reward,
          work: pick(foundWork, 'id', 'title', 'isRegular'),
          shift: foundShifts[index],
          chamber: pick(foundChamber, 'id', 'name'),
          recordGroupId,
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

  async updateWorkRecord(
    recordGroupId: number,
    { dividedAmount, employees, chamberId, workId }: UpdateWorkRecordDto,
  ): Promise<WorkRecord[]> {
    const percentSum = employees.reduce(
      (accumulator, employee) => accumulator + employee.percent,
      0,
    )
    const [foundChamber, foundWork]: [Nullable<Chamber>, Nullable<Work>] =
      await Promise.all([
        this.chamberService.findChamberById(chamberId),
        this.workService.findWorkById(workId),
      ])
    const foundEmployees: Array<Nullable<Employee>> = await Promise.all(
      employees.map(({ employeeId }) => {
        return this.employeeService.findEmployeeById(employeeId)
      }),
    )
    const foundShifts: Array<Nullable<Shift>> = await Promise.all(
      foundEmployees.map(({ id }) => {
        return this.shiftService.findCurrentShiftWithEmployeeId(id)
      }),
    )
    const foundWorkGroupRecords: WorkRecord[] =
      await this.workRecordRepository.find({
        where: {
          recordGroupId,
        },
      })
    const foundEditedRecords: Array<Nullable<WorkRecord>> = await Promise.all(
      employees.map(({ id }) => {
        return this.workRecordRepository.findOneBy({ id })
      }),
    )
    const byEmployeeShifts = {}

    if (percentSum !== 1) {
      throw new HttpException(CError.WRONG_PERCENT_SUM, HttpStatus.BAD_REQUEST)
    }

    if (!foundChamber || !foundWork) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

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

    foundShifts.forEach((shift) => {
      if (!shift) {
        throw new HttpException(CError.NO_ONGOING_SHIFT, HttpStatus.BAD_REQUEST)
      }

      byEmployeeShifts[shift.employee.id] = shift.id
    })

    foundEditedRecords.forEach((record) => {
      if (!record) {
        throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
      }

      if (record.recordGroupId !== recordGroupId) {
        throw new HttpException(
          CError.WRONG_RECORD_GROUP_ID,
          HttpStatus.BAD_REQUEST,
        )
      }
    })

    const updatedRecords: Array<Nullable<WorkRecord>> = await Promise.all(
      foundWorkGroupRecords.map(async (foundRecord) => {
        const updatingData = employees.find(
          (newEmployeeData) => newEmployeeData.id === foundRecord.id,
        )

        if (!updatingData) {
          await this.workRecordRepository.remove(foundRecord)
          return null
        }

        const updatedRecord: WorkRecord =
          await this.workRecordRepository.create({
            ...foundRecord,
            percent: updatingData.percent,
            percentAmount: dividedAmount * updatingData.percent,
            reward: updatingData.reward,
            work: foundWork,
            shift: byEmployeeShifts[updatingData.employeeId],
            chamber: foundChamber,
            recordGroupId,
          })

        return this.workRecordRepository.save(updatedRecord)
      }),
    )

    return updatedRecords.filter((record) => record)
  }

  async removeWorkRecord(recordGroupId: number): Promise<Boolean> {
    const foundWorkGroupRecords: WorkRecord[] =
      await this.workRecordRepository.find({
        where: {
          recordGroupId,
        },
      })

    try {
      await Promise.all(
        foundWorkGroupRecords.map((record) =>
          this.workRecordRepository.remove(record),
        ),
      )

      return true
    } catch (e) {
      return false
    }
  }
}
