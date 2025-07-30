import { Repository } from 'typeorm'

import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
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
    @Inject(forwardRef(() => ShiftService))
    private readonly shiftService: ShiftService,
    private readonly chamberService: ChamberService,
  ) {}

  findAllByDate(date, filters: { chamberId?: number; workId?: number; employeeId?: number } = {}): Promise<WorkRecord[]> {
    const qb = this.workRecordRepository
      .createQueryBuilder('workRecord')
      .where('workRecord.date = :date', { date })
      .leftJoinAndSelect('workRecord.shift', 'shift')
      .leftJoinAndSelect('workRecord.work', 'work')
      .leftJoinAndSelect('workRecord.chamber', 'chamber')
      .leftJoinAndSelect('shift.employee', 'employee')
      .select([
        'workRecord.id',
        'workRecord.date',
        // 'workRecord.percent',
        'workRecord.amount',
        'workRecord.reward',
        'workRecord.recordGroupId',
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

    if (filters.chamberId) {
      qb.andWhere('chamber.id = :chamberId', { chamberId: filters.chamberId })
    }
    if (filters.workId) {
      qb.andWhere('work.id = :workId', { workId: filters.workId })
    }
    if (filters.employeeId) {
      qb.andWhere('employee.id = :employeeId', { employeeId: filters.employeeId })
    }

    return qb.getMany()
  }

  getByShift(shiftId: string): any {
    return  this.workRecordRepository
      .createQueryBuilder('workRecord')
      .leftJoinAndSelect('workRecord.shift', 'shift') // Соединение с таблицей Shift
      .leftJoinAndSelect('workRecord.work', 'work') // Соединение с таблицей Shift
      .select([
        'workRecord.id',          // Поля из основной сущности Offload
        'workRecord.date',    // Дополнительные поля из Offload
        // 'workRecord.percent',    // Дополнительные поля из Offload
        'workRecord.amount',    // Дополнительные поля из Offload
        'workRecord.reward',    // Дополнительные поля из Offload
        'shift.id',             // Поля из связанной сущности Shift
        'work.id',             // Поля из связанной сущности Shift
        'work.isRegular',             // Поля из связанной сущности Shift
        'work.title',             // Поля из связанной сущности Shift
      ])
      .where('shift.id = :shiftId', { shiftId }) // Условие по id Shift
      .getMany();

  }

  async createWorkRecord(
    workId: number,
    { dividedAmount, date, employees, chamberId }: CreateWorkRecordDto,
  ): Promise<WorkRecord[]> {
    // const percentSum: number = employees.reduce(
    //   (accumulator, employee) => accumulator + employee.percent,
    //   0,
    // )
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
        return this.shiftService.findCurrentShiftBasic(id)
      }),
    )
    // if (percentSum !== 1) {
    //   throw new HttpException(CError.WRONG_PERCENT_SUM, HttpStatus.BAD_REQUEST)
    // }

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
      employees.map(({  reward, amount }, index) => {
        return this.workRecordRepository.create({
          date,
          amount,
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
    // const percentSum = employees.reduce(
    //   (accumulator, employee) => accumulator + employee.percent,
    //   0,
    // )
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
        return this.shiftService.findCurrentShiftBasic(id)
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

    // if (percentSum !== 1) {
    //   throw new HttpException(CError.WRONG_PERCENT_SUM, HttpStatus.BAD_REQUEST)
    // }

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
            amount: updatingData.amount,
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
