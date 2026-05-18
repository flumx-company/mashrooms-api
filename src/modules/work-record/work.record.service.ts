import { Repository } from 'typeorm'

import { HttpException, HttpStatus, Injectable, Inject, forwardRef } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Transactional } from 'typeorm-transactional'
import { PaginateQuery, Paginated } from 'nestjs-paginate'

import { Chamber } from '@mush/modules/chamber/chamber.entity'
import { ChamberService } from '@mush/modules/chamber/chamber.service'
import { Employee } from '@mush/modules/employee/employee.entity'
import { EmployeeService } from '@mush/modules/employee/employee.service'
import { Shift } from '@mush/modules/shift/shift.entity'
import { ShiftService } from '@mush/modules/shift/shift.service'
import { Work } from '@mush/modules/work/work.entity'
import { WorkService } from '@mush/modules/work/work.service'

import {
  CError,
  Nullable,
  normalizeUtcCalendarDateString,
  pick,
} from '@mush/core/utils'

import { CreateWorkRecordDto, GroupedWorkRecordResponseDto } from './dto'
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

  findAllByDate(date, filters: { chamberId?: number; workId?: number; shiftId?: number; employeeId?: number; workType?: string; isRegular?: boolean; recordGroupId?: number } = {}): Promise<WorkRecord[]> {
    const calendarDate = normalizeUtcCalendarDateString(date) ?? date
    const qb = this.workRecordRepository
      .createQueryBuilder('workRecord')
      .where('workRecord.date = :date', { date: calendarDate })
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
      .orderBy('workRecord.createdAt', 'DESC')
      .addOrderBy('work.title', 'ASC')

    if (filters.chamberId) {
      qb.andWhere('chamber.id = :chamberId', { chamberId: filters.chamberId })
    }
    if (filters.workId) {
      qb.andWhere('work.id = :workId', { workId: filters.workId })
    }
    if (filters.shiftId) {
      qb.andWhere('shift.id = :shiftId', { shiftId: filters.shiftId })
    }
    if (filters.employeeId) {
      qb.andWhere('employee.id = :employeeId', { employeeId: filters.employeeId })
    }
    if (filters.workType) {
      qb.andWhere('work.workType = :workType', { workType: filters.workType })
    }
    if (filters.isRegular !== undefined) {
      qb.andWhere('work.isRegular = :isRegular', { isRegular: filters.isRegular })
    }
    if (filters.recordGroupId) {
      qb.andWhere('workRecord.recordGroupId = :recordGroupId', { recordGroupId: filters.recordGroupId })
    }

    return qb.getMany()
  }

  findAll(): Promise<WorkRecord[]> {
    const qb = this.workRecordRepository
      .createQueryBuilder('workRecord')
      .leftJoinAndSelect('workRecord.shift', 'shift')
      .leftJoinAndSelect('workRecord.work', 'work')
      .leftJoinAndSelect('workRecord.chamber', 'chamber')
      .leftJoinAndSelect('shift.employee', 'employee')
      .select([
        'workRecord.id',
        'workRecord.date',
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
      .orderBy('workRecord.createdAt', 'DESC')
      .addOrderBy('workRecord.date', 'DESC')
      .addOrderBy('work.title', 'ASC')

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
      .orderBy('workRecord.date', 'ASC')
      .addOrderBy('work.title', 'ASC')
      .getMany();

  }

  @Transactional()
  async createWorkRecord(
    workId: number,
    { dividedAmount, date, employees, chamberId }: CreateWorkRecordDto,
  ): Promise<WorkRecord[]> {
    const calendarDate =
      normalizeUtcCalendarDateString(date) ?? date
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
          date: calendarDate,
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

  @Transactional()
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

  @Transactional()
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

  async getGroupedWorkRecords(query: PaginateQuery): Promise<Paginated<GroupedWorkRecordResponseDto>> {
    console.log('=== getGroupedWorkRecords ===')
    console.log('Query object:', JSON.stringify(query, null, 2))
    
    // Получаем все записи о работах с фильтрацией
    const qb = this.workRecordRepository
      .createQueryBuilder('workRecord')
      .leftJoinAndSelect('workRecord.shift', 'shift')
      .leftJoinAndSelect('workRecord.work', 'work')
      .leftJoinAndSelect('workRecord.chamber', 'chamber')
      .leftJoinAndSelect('shift.employee', 'employee')
      .select([
        'workRecord.id',
        'workRecord.date',
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

    // Применяем фильтры
    // Получаем параметры из query напрямую
    const queryParams = query as any
    console.log('Raw queryParams:', queryParams)
    
    // Пробуем разные способы получения параметров
    const date = queryParams.date || queryParams.filter?.date
    const chamberId = (queryParams.chamberId || queryParams.filter?.chamberId) ? Number(queryParams.chamberId || queryParams.filter?.chamberId) : null
    const workId = (queryParams.workId || queryParams.filter?.workId) ? Number(queryParams.workId || queryParams.filter?.workId) : null
    const shiftId = (queryParams.shiftId || queryParams.filter?.shiftId) ? Number(queryParams.shiftId || queryParams.filter?.shiftId) : null
    const employeeId = (queryParams.employeeId || queryParams.filter?.employeeId) ? Number(queryParams.employeeId || queryParams.filter?.employeeId) : null
    const workType = queryParams.workType || queryParams.filter?.workType
    const isRegular = (queryParams.isRegular !== undefined || queryParams.filter?.isRegular !== undefined) ? 
      (queryParams.isRegular === 'true' || queryParams.filter?.isRegular === 'true') : null
    const recordGroupId = (queryParams.recordGroupId || queryParams.filter?.recordGroupId) ? Number(queryParams.recordGroupId || queryParams.filter?.recordGroupId) : null

    console.log('Extracted filter values:', { 
      date, 
      chamberId, 
      workId, 
      shiftId, 
      employeeId, 
      workType, 
      isRegular, 
      recordGroupId 
    })

    if (date) {
      const calendarDate = normalizeUtcCalendarDateString(date) ?? date
      console.log('Applying date filter:', calendarDate)
      qb.andWhere('workRecord.date = :date', { date: calendarDate })
    }
    
    if (chamberId) {
      console.log('Applying chamberId filter:', chamberId)
      qb.andWhere('chamber.id = :chamberId', { chamberId })
    }
    
    if (workId) {
      console.log('Applying workId filter:', workId)
      qb.andWhere('work.id = :workId', { workId })
    }
    
    if (shiftId) {
      console.log('Applying shiftId filter:', shiftId)
      qb.andWhere('shift.id = :shiftId', { shiftId })
    }

    if (employeeId) {
      console.log('Applying employeeId filter:', employeeId)
      qb.andWhere('employee.id = :employeeId', { employeeId })
    }

    if (workType) {
      console.log('Applying workType filter:', workType)
      qb.andWhere('work.workType = :workType', { workType })
    }

    if (isRegular !== null) {
      console.log('Applying isRegular filter:', isRegular)
      qb.andWhere('work.isRegular = :isRegular', { isRegular })
    }

    if (recordGroupId) {
      console.log('Applying recordGroupId filter:', recordGroupId)
      qb.andWhere('workRecord.recordGroupId = :recordGroupId', { recordGroupId })
    }

    qb.orderBy('workRecord.date', 'DESC')
      .addOrderBy('work.title', 'ASC')

    console.log('Final SQL Query:', qb.getSql())
    console.log('SQL Parameters:', qb.getParameters())

    const workRecords = await qb.getMany()
    console.log('Found workRecords count:', workRecords.length)

    // Трансформируем данные как в функции на фронтенде
    const grouped = workRecords.reduce((acc: Record<string, any>, item) => {
      // Добавляем дату в ключ группировки, чтобы работы за разные даты не объединялись
      const itemDate = typeof item.date === 'string' ? item.date : item.date.toISOString().split('T')[0]
      const key = `${item.work.id}_${item.chamber.id}_${itemDate}`
      const extendedItem = {
        ...item,
        employeeId: item.shift?.employee?.id || null
      }

      if (!acc[key]) {
        acc[key] = {
          type: "exist",
          createdAt: itemDate,
          work: item.work,
          workId: item.work.id,
          recordGroupId: item.recordGroupId,
          chamber: item.chamber,
          chamberId: item.chamber.id,
          items: [],
          initialItems: []
        }
      }

      acc[key].items.push(extendedItem)
      acc[key].initialItems.push({ ...extendedItem })
      return acc
    }, {})

    // Вычисляем сумму для каждой группы
    const groupedWithSum: GroupedWorkRecordResponseDto[] = Object.values(grouped).map(group => ({
      ...group,
      sum: group.items
        .reduce((sum, i) => sum + (Number(i.amount) || 0), 0)
        .toFixed(2)
    }))

    // Применяем пагинацию к группированным данным
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 10
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit

    const paginatedData: GroupedWorkRecordResponseDto[] = groupedWithSum.slice(startIndex, endIndex)

    const totalPages = Math.ceil(groupedWithSum.length / limit)

    const meta: any = {
      itemsPerPage: limit,
      totalItems: groupedWithSum.length,
      currentPage: page,
      totalPages,
      sortBy: query.sortBy || [['createdAt', 'DESC']],
      searchBy: query.searchBy || [],
      search: query.search || '',
      filter: query.filter || {}
    }

    return {
      data: paginatedData,
      meta,
      links: {
        first: `?page=1&limit=${limit}`,
        previous: page > 1 ? `?page=${page - 1}&limit=${limit}` : '',
        current: `?page=${page}&limit=${limit}`,
        next: page < totalPages ? `?page=${page + 1}&limit=${limit}` : '',
        last: `?page=${totalPages}&limit=${limit}`
      }
    } as Paginated<GroupedWorkRecordResponseDto>
  }

  async getGroupedWorkRecordsWithFilters(
    query: PaginateQuery, 
    filters: {
      date?: string;
      chamberId?: number;
      workId?: number;
      shiftId?: number;
      employeeId?: number;
      workType?: string;
      isRegular?: boolean;
      recordGroupId?: number;
    }
  ): Promise<Paginated<GroupedWorkRecordResponseDto>> {
    console.log('=== getGroupedWorkRecordsWithFilters ===')
    console.log('Filters:', filters)
    
    // Получаем все записи о работах с фильтрацией
    const qb = this.workRecordRepository
      .createQueryBuilder('workRecord')
      .leftJoinAndSelect('workRecord.shift', 'shift')
      .leftJoinAndSelect('workRecord.work', 'work')
      .leftJoinAndSelect('workRecord.chamber', 'chamber')
      .leftJoinAndSelect('shift.employee', 'employee')
      .select([
        'workRecord.id',
        'workRecord.date',
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

    // Применяем фильтры
    if (filters.date) {
      const calendarDate =
        normalizeUtcCalendarDateString(filters.date) ?? filters.date
      console.log('Applying date filter:', calendarDate)
      qb.andWhere('workRecord.date = :date', { date: calendarDate })
    }
    
    if (filters.chamberId) {
      console.log('Applying chamberId filter:', filters.chamberId)
      qb.andWhere('chamber.id = :chamberId', { chamberId: filters.chamberId })
    }
    
    if (filters.workId) {
      console.log('Applying workId filter:', filters.workId)
      qb.andWhere('work.id = :workId', { workId: filters.workId })
    }
    
    if (filters.shiftId) {
      console.log('Applying shiftId filter:', filters.shiftId)
      qb.andWhere('shift.id = :shiftId', { shiftId: filters.shiftId })
    }

    if (filters.employeeId) {
      console.log('Applying employeeId filter:', filters.employeeId)
      qb.andWhere('employee.id = :employeeId', { employeeId: filters.employeeId })
    }

    if (filters.workType) {
      console.log('Applying workType filter:', filters.workType)
      qb.andWhere('work.workType = :workType', { workType: filters.workType })
    }

    if (filters.isRegular !== undefined) {
      console.log('Applying isRegular filter:', filters.isRegular)
      qb.andWhere('work.isRegular = :isRegular', { isRegular: filters.isRegular })
    }

    if (filters.recordGroupId) {
      console.log('Applying recordGroupId filter:', filters.recordGroupId)
      qb.andWhere('workRecord.recordGroupId = :recordGroupId', { recordGroupId: filters.recordGroupId })
    }

    qb.orderBy('workRecord.date', 'DESC')
      .addOrderBy('work.title', 'ASC')

    console.log('Final SQL Query:', qb.getSql())
    console.log('SQL Parameters:', qb.getParameters())

    const workRecords = await qb.getMany()
    console.log('Found workRecords count:', workRecords.length)

    // Трансформируем данные как в функции на фронтенде
    const grouped = workRecords.reduce((acc: Record<string, any>, item) => {
      // Добавляем дату в ключ группировки, чтобы работы за разные даты не объединялись
      const itemDate = typeof item.date === 'string' ? item.date : item.date.toISOString().split('T')[0]
      const key = `${item.work.id}_${item.chamber.id}_${itemDate}`
      const extendedItem = {
        ...item,
        employeeId: item.shift?.employee?.id || null
      }

      if (!acc[key]) {
        acc[key] = {
          type: "exist",
          createdAt: itemDate,
          work: item.work,
          workId: item.work.id,
          recordGroupId: item.recordGroupId,
          chamber: item.chamber,
          chamberId: item.chamber.id,
          items: [],
          initialItems: []
        }
      }

      acc[key].items.push(extendedItem)
      acc[key].initialItems.push({ ...extendedItem })
      return acc
    }, {})

    // Вычисляем сумму для каждой группы
    const groupedWithSum: GroupedWorkRecordResponseDto[] = Object.values(grouped).map(group => ({
      ...group,
      sum: group.items
        .reduce((sum, i) => sum + (Number(i.amount) || 0), 0)
        .toFixed(2)
    }))

    // Применяем пагинацию к группированным данным
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 10
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit

    const paginatedData: GroupedWorkRecordResponseDto[] = groupedWithSum.slice(startIndex, endIndex)

    const totalPages = Math.ceil(groupedWithSum.length / limit)

    const meta: any = {
      itemsPerPage: limit,
      totalItems: groupedWithSum.length,
      currentPage: page,
      totalPages,
      sortBy: query.sortBy || [['createdAt', 'DESC']],
      searchBy: query.searchBy || [],
      search: query.search || '',
      filter: query.filter || {}
    }

    return {
      data: paginatedData,
      meta,
      links: {
        first: `?page=1&limit=${limit}`,
        previous: page > 1 ? `?page=${page - 1}&limit=${limit}` : '',
        current: `?page=${page}&limit=${limit}`,
        next: page < totalPages ? `?page=${page + 1}&limit=${limit}` : '',
        last: `?page=${totalPages}&limit=${limit}`
      }
    } as Paginated<GroupedWorkRecordResponseDto>
  }
}
