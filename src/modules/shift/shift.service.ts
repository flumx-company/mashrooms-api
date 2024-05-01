import * as dotenv from 'dotenv'
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate'
import { Repository } from 'typeorm'

import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { EmployeeService } from '@mush/modules/employee/employee.service'
import { Price } from '@mush/modules/price/price.entity'
import { PriceService } from '@mush/modules/price/price.service'

import { EPriceTenant } from '@mush/core/enums'
import { CError, Nullable, formatDateToDateTime } from '@mush/core/utils'

import { shiftPaginationConfig } from './pagination/shift.pagiantion.config'
import { Shift } from './shift.entity'

const automaticBonusMinimumDayNumber = parseInt(
  process.env.AUTOMATIC_WAGE_BONUS_MINIMUM_DAY_AMOUNT,
)
const automaticBonusPercent = parseFloat(
  process.env.AUTOMATIC_WAGE_BONUS_PERCENT,
)

@Injectable()
export class ShiftService {
  constructor(
    @InjectRepository(Shift)
    private shiftRepository: Repository<Shift>,
    private readonly employeeService: EmployeeService,
    private readonly priceService: PriceService,
  ) {}

  findAll(query: PaginateQuery): Promise<Paginated<Shift>> {
    return paginate(query, this.shiftRepository, shiftPaginationConfig)
  }

  findAllCurrentShifts(search: string): Promise<Shift[]> {
    const isActive: boolean = true;
    return this.shiftRepository
      .createQueryBuilder('shift')
      //.leftJoin('shift.cuttings', 'cutting')
      .where('shift.dateTo IS NULL')
      .leftJoin('shift.employee', 'employee')
      .where('employee.isActive = :isActive AND employee.firstName like :search AND employee.lastName like :search AND employee.patronymic like :search', {
        isActive,
        search
      })
     // .leftJoin('shift.loadings', 'loading')
      //.leftJoin('shift.offloadLoadings', 'offload')
    //  .leftJoin('shift.waterings', 'watering')
    //  .leftJoin('shift.workRecords', 'workRecord')
     // .leftJoin('workRecord.work', 'work')
     // .select([
      //   'cutting.id',
      //   'cutting.boxQuantity',
      //   'employee.id',
       //  'employee.isActive',
      //   'employee.firstName',
       //  'employee.lastName',
       //  'employee.patronymic',
      //   'offload.id',
      //   'offload.boxTotalQuantity',
     //    'shift.id',
     //    'shift.dateFrom',
     //    'shift.dateTo',
    //     'watering.id',
 //        'watering.drug',
   //      'watering.volume',
    //     'workRecord.id',
    //     'workRecord.date',
     //    'workRecord.percent',
    //     'workRecord.percentAmount',
   //      'workRecord.reward',
    //     'work.id',
    //     'work.title',
     //    'work.isRegular',
    //   ])
     //  .orderBy('employee.lastName', 'ASC')
      .getMany()
  }

  async findCurrentShiftWithEmployee(
    employeeId: number,
  ): Promise<Nullable<Shift>> {
    return this.shiftRepository
      .createQueryBuilder('shift')
      .innerJoinAndSelect('shift.employee', 'employee', 'employee.id = :id', {
        id: employeeId,
      })
      .where('shift.dateTo IS NULL AND shift.employee.id = :id', {
        id: employeeId,
      })
      .getOne()
  }

  async findCurrentShiftWithEmployeeId(
    employeeId: number,
  ): Promise<Nullable<Shift>> {
    return this.shiftRepository
      .createQueryBuilder('shift')
      .innerJoinAndSelect('shift.employee', 'employee', 'employee.id = :id', {
        id: employeeId,
      })
      .where('shift.dateTo IS NULL AND shift.employee.id = :id', {
        id: employeeId,
      })
      .leftJoinAndSelect('shift.workRecords', 'workRecord')
      .leftJoinAndSelect('shift.waterings', 'watering')
      .leftJoinAndSelect('shift.cuttings', 'cutting')
      .leftJoinAndSelect('shift.loadings', 'loading')
      .leftJoinAndSelect('workRecord.work', 'work')
      .select([
        'shift.id',
        'shift.dateFrom',
        'shift.dateTo',
        'employee.id',
        'cutting.id',
        'cutting.boxQuantity',
        'watering.id',
        'watering.drug',
        'watering.volume',
        'workRecord.id',
        'workRecord.date',
        'workRecord.percent',
        'workRecord.percentAmount',
        'workRecord.reward',
        'work.id',
        'work.title',
        'work.isRegular',
      ])
      .getOne()
  }

  async findCurrentShiftWithRelations(
    employeeId: number,
  ): Promise<Nullable<Shift>> {
    return this.shiftRepository
      .createQueryBuilder('shift')
      .innerJoin('shift.employee', 'employee')
      .leftJoinAndSelect('shift.workRecords', 'workRecord')
      .leftJoinAndSelect('shift.waterings', 'watering')
      .leftJoinAndSelect('shift.cuttings', 'cutting')
      .leftJoinAndSelect('shift.loadings', 'loading')
      .leftJoinAndSelect('shift.offloadLoadings', 'offload')
      .leftJoinAndSelect('workRecord.work', 'work')
      .leftJoinAndSelect('cutting.variety', 'variety')
      .select([
        'shift.id',
        'shift.dateFrom',
        'shift.dateTo',
        'shift.returnsKnife',
        'shift.returnsBedSheets',
        'shift.returnsWardrobeKey',
        'shift.paysForKitchen',
        'shift.kitchenPaymentMethod',
        'shift.kitchenExpenses',
        'shift.calendarDayNumber',
        'shift.workingDayNumber',
        'shift.wage',
        'shift.bonus',
        'shift.customBonus',
        'shift.customBonusDescription',
        'shift.wageTotal',
        'shift.paidAmount',
        'shift.remainedPayment',
        'employee.id',
        'workRecord.id',
        'workRecord.date',
        'workRecord.percent',
        'workRecord.percentAmount',
        'workRecord.reward',
        'work.id',
        'work.title',
        'work.isRegular',
        'cutting.id',
        'cutting.boxQuantity',
        'cutting.createdAt',
        'loading.id',
        'loading.boxQuantity',
        'loading.createdAt',
        'watering.id',
        'watering.drug',
        'watering.volume',
        'watering.id',
        'watering.dateTimeFrom',
        'offload.id',
        'offload.boxTotalQuantity',
        'offload.createdAt',
        'variety.id',
        'variety.isCutterPaid',
      ])
      .where('shift.dateTo IS NULL')
      .andWhere('employee.id = :employeeId', { employeeId })
      .orderBy('workRecord.date', 'ASC')
      .getOne()
  }

  async runShiftCalculations(
    shiftId: number,
    newShiftData?: Partial<Shift>,
  ): Promise<Shift> {
    const shift: Shift = await this.findCurrentShiftWithRelations(shiftId)

    if (!shift) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    const {
      dateFrom: startDate,
      cuttings,
      loadings,
      offloadLoadings,
      waterings,
      workRecords,
    } = shift
    const customBonus =
      newShiftData && isFinite(newShiftData?.customBonus)
        ? newShiftData.customBonus
        : shift.customBonus
    const paidAmount =
      newShiftData && isFinite(newShiftData?.paidAmount)
        ? newShiftData.paidAmount
        : shift.paidAmount
    const dateFrom = formatDateToDateTime({
      value: new Date(startDate),
      withTime: true,
      dateFrom: true,
    })
    const dateTo = formatDateToDateTime({
      value: new Date(),
      withTime: true,
      dateFrom: false,
    })
    const dateFromTime = new Date(dateFrom).getTime()
    const dateToTime = new Date(dateTo).getTime()
    const durationMilisecond = dateToTime - dateFromTime
    const calendarDayNumber = Math.ceil(
      durationMilisecond / (1000 * 60 * 60 * 24),
    )
    const priceDirectory: object = {}
    const wageDirectory: Record<string, number> = {}

    const [
      firstLitrePrice,
      firstMedLitrePrice,
      firstBoxPrice,
      firstKitchenPrice,
      priceChanges,
    ]: [
      Nullable<Price>,
      Nullable<Price>,
      Nullable<Price>,
      Nullable<Price>,
      Price[],
    ] = await Promise.all([
      this.priceService.findPriceByClosestDate({
        date: startDate as unknown as string,
        tenant: EPriceTenant.LITER,
      }),
      this.priceService.findPriceByClosestDate({
        date: startDate as unknown as string,
        tenant: EPriceTenant.MEDICATED_LITER,
      }),
      this.priceService.findPriceByClosestDate({
        date: startDate as unknown as string,
        tenant: EPriceTenant.BOX,
      }),

      this.priceService.findPriceByClosestDate({
        date: startDate as unknown as string,
        tenant: EPriceTenant.KITCHEN,
      }),
      this.priceService.findAllTenantPricesWithinPeriod({
        dateFrom,
        dateTo,
      }),
    ])
    const hasFirstLitrePrice = Object.keys(firstLitrePrice || []).length
    const hasFirstMedLitrePrice = Object.keys(firstMedLitrePrice || []).length
    const hasFirstBoxPrice = Object.keys(firstBoxPrice || []).length
    const hasFirstKitchenPrice = Object.keys(firstKitchenPrice || []).length

    if (!hasFirstLitrePrice) {
      throw new HttpException(CError.NO_LITER_PRICE, HttpStatus.BAD_REQUEST)
    }
    if (!hasFirstMedLitrePrice) {
      throw new HttpException(
        CError.NO_MEDICATED_LITER_PRICE,
        HttpStatus.BAD_REQUEST,
      )
    }
    if (!hasFirstBoxPrice) {
      throw new HttpException(CError.NO_BOX_PRICE, HttpStatus.BAD_REQUEST)
    }
    if (!hasFirstKitchenPrice) {
      throw new HttpException(CError.NO_KITCHEN_PRICE, HttpStatus.BAD_REQUEST)
    }

    priceDirectory[EPriceTenant.LITER] = {
      [firstLitrePrice.date as unknown as string]: firstLitrePrice.price,
    }
    priceDirectory[EPriceTenant.MEDICATED_LITER] = {
      [firstMedLitrePrice.date as unknown as string]: firstMedLitrePrice.price,
    }
    priceDirectory[EPriceTenant.BOX] = {
      [firstBoxPrice.date as unknown as string]: firstBoxPrice.price,
    }
    priceDirectory[EPriceTenant.KITCHEN] = {
      [firstKitchenPrice.date as unknown as string]: firstKitchenPrice.price,
    }

    priceChanges.forEach(({ tenant, date, price }) => {
      priceDirectory[tenant][date] = price
    })

    const getNearestPrice = ({ tenant, date }) => {
      let nearestDate

      Object.keys(priceDirectory[tenant]).forEach((priceDate) => {
        if (new Date(priceDate) <= new Date(date)) {
          nearestDate = priceDate
        }
      })

      return priceDirectory[tenant][nearestDate]
    }

    cuttings.forEach(({ createdAt, boxQuantity, variety }) => {
      if (!variety.isCutterPaid) {
        return
      }

      const date = formatDateToDateTime({
        value: createdAt,
        withTime: false,
      }) as unknown as string
      const price = getNearestPrice({ tenant: EPriceTenant.BOX, date })
      const previousValue = wageDirectory?.[date] || 0
      wageDirectory[date] = boxQuantity * price + previousValue
    })

    loadings.forEach(({ createdAt, boxQuantity }) => {
      const date = formatDateToDateTime({
        value: createdAt,
        withTime: false,
      }) as unknown as string
      const price = getNearestPrice({ tenant: EPriceTenant.BOX, date })
      const previousValue = wageDirectory?.[date] || 0
      wageDirectory[date] = boxQuantity * price + previousValue
    })

    offloadLoadings.forEach(({ boxTotalQuantity, createdAt }) => {
      const date = formatDateToDateTime({
        value: createdAt,
        withTime: false,
      }) as unknown as string
      const price = getNearestPrice({ tenant: EPriceTenant.BOX, date })
      const previousValue = wageDirectory?.[date] || 0
      wageDirectory[date] = boxTotalQuantity * price + previousValue
    })

    waterings.forEach(({ dateTimeFrom, drug, volume }) => {
      const date = String(dateTimeFrom).slice(0, 10)
      const tenant = drug ? EPriceTenant.MEDICATED_LITER : EPriceTenant.LITER
      const price = getNearestPrice({ tenant, date })
      const previousValue = wageDirectory?.[date] || 0
      wageDirectory[date] = volume * price + previousValue
    })

    workRecords.forEach(({ date, percentAmount, reward = 0 }) => {
      const previousValue = wageDirectory?.[date as unknown as string] || 0
      wageDirectory[date as unknown as string] =
        previousValue + percentAmount + reward
    })

    const workingDayNumber = Object.keys(wageDirectory).length
    const wage = Object.values(wageDirectory).reduce(
      (total, dayWage) => total + dayWage,
      0,
    )
    let kitchenExpenses = 0
    let bonus = 0
    let wageTotal = 0
    let remainedPayment = 0

    const calculateKitchenExpenses = (date: string) => {
      const slicedDate = date.slice(0, 10)
      const slidedDateTo = String(dateTo).slice(0, 10)
      const price = getNearestPrice({ date, tenant: EPriceTenant.KITCHEN })

      kitchenExpenses = kitchenExpenses + price

      if (slicedDate !== slidedDateTo) {
        const nextDateDateFormat = new Date(date).setDate(
          new Date(date).getDate() + 1,
        )

        const nextDate = formatDateToDateTime({
          value: new Date(nextDateDateFormat),
          withTime: false,
        }) as unknown as string

        return calculateKitchenExpenses(nextDate)
      }
    }

    calculateKitchenExpenses(dateFrom as unknown as string)

    if (workingDayNumber >= automaticBonusMinimumDayNumber) {
      bonus = wage * automaticBonusPercent
    }

    wageTotal = wage + bonus + customBonus - kitchenExpenses
    remainedPayment = wageTotal - paidAmount

    const updatedShift: Shift = await this.shiftRepository.create({
      ...shift,
      ...(newShiftData || {}),
      kitchenExpenses,
      calendarDayNumber,
      workingDayNumber,
      wage,
      bonus,
      wageTotal,
      remainedPayment,
    })

    return this.shiftRepository.save(updatedShift)
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
 
    const newShift: Shift = await this.shiftRepository.create({
      dateFrom,
      employee,
    })

    await this.shiftRepository.save(newShift);
    await this.employeeService.updateEmployeeActiveStatus(employeeId, true)
    return true
  }

  async endShift(employeeId: number) {
    const dateTo = formatDateToDateTime({
      value: new Date(Date.now()),
      dateFrom: false,
      withTime: true,
    }) as Date
    const [employee, currentShift] = await Promise.all([
      this.employeeService.findEmployeeById(employeeId),
      this.findCurrentShiftWithEmployee(employeeId),
    ])

    if (!employee) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    if (!employee?.isActive || !currentShift) {
      throw new HttpException(
        CError.NOT_FOUND_ONGOING_SHIFT,
        HttpStatus.BAD_REQUEST,
      )
    }

    
    await this.runShiftCalculations(currentShift.id, { dateTo })

    await this.employeeService.updateEmployeeActiveStatus(employeeId, false)
    
    return true
   
  }

  async removeShift(id: number) {
    const foundShift = await this.shiftRepository
      .createQueryBuilder('shift')
      .where('shift.id = :id', { id })
      .leftJoinAndSelect('shift.employee', 'employee')
      .leftJoinAndSelect('shift.workRecords', 'workRecords')
      .leftJoinAndSelect('shift.waterings', 'waterings')
      .leftJoinAndSelect('shift.cuttings', 'cuttings')
      .leftJoinAndSelect('shift.loadings', 'loadings')
      .leftJoinAndSelect('shift.offloadLoadings', 'offloadLoadings')
      .getOne()

    if (!foundShift) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    const { workRecords, waterings, cuttings, loadings, offloadLoadings } =
      foundShift

    if (
      workRecords.length ||
      waterings.length ||
      cuttings.length ||
      loadings.length ||
      offloadLoadings.length
    ) {
      throw new HttpException(
        CError.ENTITY_HAS_DEPENDENT_RELATIONS,
        HttpStatus.BAD_REQUEST,
      )
    }

    
    await this.shiftRepository.remove(foundShift)
    return true
  }

  async findShiftById(id: number): Promise<Nullable<Shift>> {
    return this.shiftRepository.findOneBy({ id })
  }

  async getOngoingEmployeeShift(employeeId: number) {
    const [employee, currentShift] = await Promise.all([
      this.employeeService.findEmployeeById(employeeId),
      this.findCurrentShiftWithEmployee(employeeId),
    ])

    if (!employee) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    if (!employee?.isActive || !currentShift) {
      throw new HttpException(
        CError.NOT_FOUND_ONGOING_SHIFT,
        HttpStatus.BAD_REQUEST,
      )
    }

    return this.runShiftCalculations(currentShift.id)
  }
}
