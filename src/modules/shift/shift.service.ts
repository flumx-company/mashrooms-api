import { Repository } from 'typeorm'

import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { EmployeeService } from '@mush/modules/employee/employee.service'

import { CError, Nullable, formatDateToDateTime } from '@mush/core/utils'

import { Shift } from './shift.entity'

@Injectable()
export class ShiftService {
  constructor(
    @InjectRepository(Shift)
    private shiftRepository: Repository<Shift>,
    private readonly employeeService: EmployeeService,
  ) {}

  findAll(): Promise<Shift[]> {
    return this.shiftRepository
      .createQueryBuilder('shift')
      .select(['shift.id', 'shift.dateFrom', 'shift.dateTo', 'employee.id'])
      .leftJoin('shift.employee', 'employee')
      .getMany()
  }

  findAllCurrentShifts(): Promise<Shift[]> {
    return this.shiftRepository
      .createQueryBuilder('shift')
      .where('shift.dateTo IS NULL')
      .select([
        'shift.id',
        'shift.dateFrom',
        'shift.dateTo',
        'employee.id',
        'employee.isActive',
        'employee.firstName',
        'employee.lastName',
        'employee.patronymic',
      ])
      .leftJoin('shift.employee', 'employee')
      .orderBy('employee.lastName', 'ASC')
      .getMany()
  }

  async findCurrentShiftWithEmployee(
    employeeId: number,
  ): Promise<Nullable<Shift>> {
    return this.shiftRepository
      .createQueryBuilder('shift')
      .where('shift.dateTo IS NULL')
      .innerJoinAndSelect('shift.employee', 'employee', 'employee.id = :id', {
        id: employeeId,
      })
      .getOne()
  }

  async findCurrentShiftWithEmployeeId(
    employeeId: number,
  ): Promise<Nullable<Shift>> {
    return this.shiftRepository
      .createQueryBuilder('shift')
      .where('shift.dateTo IS NULL')
      .innerJoin('shift.employee', 'employee', 'employee.id = :id', {
        id: employeeId,
      })
      .select(['shift.id', 'shift.dateFrom', 'shift.dateTo', 'employee.id'])
      .getOne()
  }

  async findCurrentShiftWithWorkRecords(
    employeeId: number,
  ): Promise<Nullable<Shift>> {
    return this.shiftRepository
      .createQueryBuilder('shift')
      .where('shift.dateTo IS NULL')
      .innerJoin('shift.employee', 'employee', 'employee.id = :id', {
        id: employeeId,
      })
      .innerJoin('shift.workRecords', 'workRecords')
      .innerJoin('workRecords.work', 'work')
      .select([
        'shift.id',
        'shift.dateFrom',
        'shift.dateTo',
        'employee.id',
        'workRecords.id',
        'workRecords.date',
        'workRecords.percent',
        'workRecords.percentAmount',
        'workRecords.reward',
        'work.id',
        'work.title',
        'work.isRegular',
      ])
      .orderBy('workRecords.date', 'ASC')
      .getOne()
  }

  async beginShift(employeeId: number) {
    const dateFrom = formatDateToDateTime({
      value: new Date(Date.now()),
      dateFrom: true,
      withTime: true,
    })

    const [employee, currentShift] = await Promise.all([
      this.employeeService.findEmployeeById(employeeId),
      this.findCurrentShiftWithEmployee(employeeId),
    ])

    if (!employee) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    if (employee?.isActive) {
      throw new HttpException(CError.ACTIVE_EMPLOYEE, HttpStatus.BAD_REQUEST)
    }

    if (currentShift) {
      throw new HttpException(
        CError.ONGOING_SHIFT_ALREADY_EXISTS,
        HttpStatus.BAD_REQUEST,
      )
    }

    try {
      const newShift: Shift = await this.shiftRepository.create({
        dateFrom,
        employee,
      })

      await Promise.all([
        this.shiftRepository.save(newShift),
        this.employeeService.updateEmployeeActiveStatus(employeeId, true),
      ])
      return true
    } catch {
      return false
    }
  }

  async endShift(employeeId: number) {
    const dateTo = formatDateToDateTime({
      value: new Date(Date.now()),
      dateFrom: false,
      withTime: true,
    })
    const [employee, currentShift] = await Promise.all([
      this.employeeService.findEmployeeById(employeeId),
      this.findCurrentShiftWithEmployee(employeeId),
    ])

    if (!employee) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    if (!employee?.isActive) {
      throw new HttpException(
        CError.NOT_FOUND_ONGOING_SHIFT,
        HttpStatus.BAD_REQUEST,
      )
    }

    if (!currentShift) {
      throw new HttpException(
        CError.NOT_FOUND_ONGOING_SHIFT,
        HttpStatus.BAD_REQUEST,
      )
    }

    try {
      const updatedShift: Shift = await this.shiftRepository.create({
        ...currentShift,
        dateTo,
      })

      await Promise.all([
        this.shiftRepository.save(updatedShift),
        this.employeeService.updateEmployeeActiveStatus(employeeId, false),
      ])
      return true
    } catch {
      return false
    }
  }

  async removeShift(id: number) {
    const foundShift = await this.shiftRepository
      .createQueryBuilder('shift')
      .where('shift.id = :id', { id })
      .leftJoinAndSelect('shift.employee', 'employee')
      .getOne()

    if (!foundShift) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    try {
      this.shiftRepository.remove(foundShift)
      return true
    } catch (e) {
      return false
    }
  }
}
