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

    if(!search) {
      return this.shiftRepository.createQueryBuilder('shift')
      .leftJoinAndSelect('shift.employee', 'employee')
      .where('shift.dateTo IS NULL AND employee.isActive = :isActive', {
        isActive
      })
      .getMany()
    }
    return this.shiftRepository
      .createQueryBuilder('shift')
      .leftJoinAndSelect('shift.employee', 'employee')
      .where('shift.dateTo IS NULL AND employee.isActive = :isActive AND (employee.firstName like :search OR employee.lastName like :search OR employee.patronymic like :search)', {
        isActive,
        search: `%${search}%`
      })
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
  async findShift(
    shiftId: number,
  ): Promise<Nullable<Shift>> {
    return this.shiftRepository
      .createQueryBuilder('shift')
      .leftJoinAndSelect('shift.employee', 'employee')
      .where('shift.id = :id', {
        id: shiftId,
      })
      .getOne()
  }

  async findCurrentShiftWithEmployeeId(
    employeeId: number,
  ): Promise<Nullable<Shift>> {
    return this.shiftRepository
      .createQueryBuilder('shift')
      .innerJoin('shift.employee', 'employee')
      .leftJoinAndSelect('shift.workRecords', 'workRecord')
      .leftJoinAndSelect('shift.waterings', 'watering')
      .leftJoinAndSelect('shift.cuttings', 'cutting')
      .leftJoinAndSelect('watering.batch', 'batch')
      .leftJoinAndSelect('batch.chamber', 'chamber')
      .leftJoinAndSelect('watering.wave', 'wave')
      .leftJoinAndSelect('cutting.batch', 'batchCutting')
      .leftJoinAndSelect('batchCutting.chamber', 'chamberCutting')
      .leftJoinAndSelect('cutting.category', 'categoryCutting')
      .leftJoinAndSelect('cutting.wave', 'waveCutting')
      .leftJoinAndSelect('shift.loadings', 'loading')
      .leftJoinAndSelect('shift.offloadLoadings', 'offload')
      .leftJoinAndSelect('workRecord.work', 'work')
      .leftJoinAndSelect('cutting.variety', 'variety')
      .leftJoinAndSelect('loading.variety', 'varietyForLoading')
      .leftJoinAndSelect('loading.batch', 'batchLoading')
      .leftJoinAndSelect('batchLoading.chamber', 'chamberLoading')
      .leftJoinAndSelect('loading.category', 'categoryLoading')
      .leftJoinAndSelect('loading.wave', 'waveLoading')
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
        'cutting.trip',
        'loading.id',
        'loading.boxQuantity',
        'loading.trip',
        'loading.createdAt',
        'watering.id',
        'watering.drug',
        'watering.volume',
        'watering.target',
        'watering.id',
        'watering.dateTimeFrom',
        'watering.dateTimeTo',
        'batch.id',
        'batchCutting.id',
        'batchLoading.id',
        'categoryCutting.id',
        'categoryLoading.id',
        'chamber.id',
        'chamberCutting.id',
        'chamberLoading.id',
        'chamber.name',
        'chamberCutting.name',
        'chamberLoading.name',
        'waveCutting.id',
        'waveCutting.order',
        'waveLoading.order',
        'offload.id',
        'offload.boxTotalQuantity',
        'offload.createdAt',
        'offload.priceTotal',
        'offload.isClosed',
        'offload.paidMoney',
        'variety.id',
        'variety.name',
        'variety.isCutterPaid',
        'varietyForLoading.id',
        'varietyForLoading.name',
        'varietyForLoading.isCutterPaid',
      ])
      .where('shift.dateTo IS NULL AND shift.employee.id = :id', {
        id: employeeId,
      })
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
      .leftJoinAndSelect('watering.batch', 'batch')
      .leftJoinAndSelect('batch.chamber', 'chamber')
      .leftJoinAndSelect('watering.wave', 'wave')
      .leftJoinAndSelect('cutting.batch', 'batchCutting')
      .leftJoinAndSelect('batchCutting.chamber', 'chamberCutting')
      .leftJoinAndSelect('cutting.category', 'categoryCutting')
      .leftJoinAndSelect('cutting.wave', 'waveCutting')
      .leftJoinAndSelect('shift.loadings', 'loading')
      .leftJoinAndSelect('shift.offloadLoadings', 'offload')
      .leftJoinAndSelect('workRecord.work', 'work')
      .leftJoinAndSelect('cutting.variety', 'variety')
      .leftJoinAndSelect('loading.variety', 'varietyForLoading')
      .leftJoinAndSelect('loading.batch', 'batchLoading')
      .leftJoinAndSelect('batchLoading.chamber', 'chamberLoading')
      .leftJoinAndSelect('loading.category', 'categoryLoading')
      .leftJoinAndSelect('loading.wave', 'waveLoading')
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
        'cutting.trip',
        'cutting.waveId',
        'loading.id',
        'loading.boxQuantity',
        'loading.trip',
        'loading.createdAt',
        'loading.waveId',
        'watering.id',
        'watering.drug',
        'watering.volume',
        'watering.target',
        'watering.id',
        'watering.dateTimeFrom',
        'watering.dateTimeTo',
        'watering.waveId',
        'batch.id',
        'batchCutting.id',
        'batchLoading.id',
        'categoryCutting.id',
        'categoryLoading.id',
        'chamber.id',
        'chamberCutting.id',
        'chamberLoading.id',
        'chamber.name',
        'chamberCutting.name',
        'chamberLoading.name',
        'wave.id',
        'wave.order',
        'waveCutting.id',
        'waveCutting.order',
        'waveLoading.order',
        'offload.id',
        'offload.boxTotalQuantity',
        'offload.createdAt',
        'offload.priceTotal',
        'offload.isClosed',
        'offload.paidMoney',
        'variety.id',
        'variety.name',
        'variety.isCutterPaid',
        'varietyForLoading.id',
        'varietyForLoading.name',
        'varietyForLoading.isCutterPaid',
      ])
      .where('shift.dateTo IS NULL')
      .andWhere('employee.id = :employeeId', { employeeId })
      .orderBy('workRecord.date', 'ASC')
      .getOne()
  }

  async findShiftWithRelations(
    shiftId: number,
  ): Promise<Nullable<Shift>> {
    return this.shiftRepository
      .createQueryBuilder('shift')
      .innerJoin('shift.employee', 'employee')
      .leftJoinAndSelect('shift.workRecords', 'workRecord')
      .leftJoinAndSelect('shift.waterings', 'watering')
      .leftJoinAndSelect('watering.batch', 'batch')
      .leftJoinAndSelect('batch.chamber', 'chamber')
      .leftJoinAndSelect('watering.wave', 'wave')
      .leftJoinAndSelect('shift.cuttings', 'cutting')
      .leftJoinAndSelect('shift.loadings', 'loading')
      .leftJoinAndSelect('shift.offloadLoadings', 'offload')
      .leftJoinAndSelect('workRecord.work', 'work')
      .leftJoinAndSelect('cutting.variety', 'variety')
      .leftJoinAndSelect('loading.variety', 'varietyForLoading')
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
        'cutting.trip',
        'loading.id',
        'loading.boxQuantity',
        'loading.trip',
        'loading.createdAt',
        'watering.id',
        'watering.drug',
        'watering.volume',
        'watering.target',
        'watering.id',
        'watering.dateTimeFrom',
        'batch.chamber.name',
        'wave.order',
        'offload.id',
        'offload.boxTotalQuantity',
        'offload.createdAt',
        'offload.priceTotal',
        'offload.isClosed',
        'offload.paidMoney',
        'variety.id',
        'variety.name',
        'variety.isCutterPaid',
        'varietyForLoading.id',
        'varietyForLoading.name',
        'varietyForLoading.isCutterPaid',
      ])
      .where('shift.id = :shiftId', { shiftId })
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
      // firstMedLitrePrice,
      firstKitchenPrice,
      priceChanges,
      firstBoxCutterPrice,
      firstBoxOffloadLoaderPrice,
      firstBoxMushLoaderPrice,
    ]: [
      Nullable<Price>,
      Nullable<Price>,
      Price[],
      Nullable<Price>,
      Nullable<Price>,
      Nullable<Price>,

    ] = await Promise.all([
      this.priceService.findPriceByClosestDate({
        date: startDate as unknown as string,
        tenant: EPriceTenant.LITER,
      }),
      this.priceService.findPriceByClosestDate({
        date: startDate as unknown as string,
        tenant: EPriceTenant.KITCHEN,
      }),
      this.priceService.findAllTenantPricesWithinPeriod({
        dateFrom,
        dateTo,
      }),
      this.priceService.findPriceByClosestDate({
        date: startDate as unknown as string,
        tenant: EPriceTenant.BOX_CUTTER,
      }),
      this.priceService.findPriceByClosestDate({
        date: startDate as unknown as string,
        tenant: EPriceTenant.BOX_OFFLOAD_LOADER,
      }),
      this.priceService.findPriceByClosestDate({
        date: startDate as unknown as string,
        tenant: EPriceTenant.BOX_MUSH_LOADER,
      }),
    ])
    const hasFirstLitrePrice = Object.keys(firstLitrePrice || []).length
    // const hasFirstMedLitrePrice = Object.keys(firstMedLitrePrice || []).length

    const hasFirstBoxCutterPrice = Object.keys(firstBoxCutterPrice || []).length
    const hasFirstBoxOffloadLoaderPrice = Object.keys(firstBoxOffloadLoaderPrice || []).length
    const hasFirstBoxMushLoaderPrice = Object.keys(firstBoxMushLoaderPrice || []).length
    const hasFirstKitchenPrice = Object.keys(firstKitchenPrice || []).length

    if (!hasFirstLitrePrice) {
      throw new HttpException(CError.NO_LITER_PRICE, HttpStatus.BAD_REQUEST)
    }
    // if (!hasFirstMedLitrePrice) {
    //   throw new HttpException(
    //     CError.NO_MEDICATED_LITER_PRICE,
    //     HttpStatus.BAD_REQUEST,
    //   )
    // }
    if (!hasFirstBoxCutterPrice) {
      throw new HttpException(CError.NO_BOX_PRICE, HttpStatus.BAD_REQUEST)
    }
    if (!hasFirstBoxOffloadLoaderPrice) {
      throw new HttpException(CError.NO_BOX_PRICE, HttpStatus.BAD_REQUEST)
    }

    if (!hasFirstBoxMushLoaderPrice) {
      throw new HttpException(CError.NO_BOX_PRICE, HttpStatus.BAD_REQUEST)
    }
    if (!hasFirstKitchenPrice) {
      throw new HttpException(CError.NO_KITCHEN_PRICE, HttpStatus.BAD_REQUEST)
    }

    priceDirectory[EPriceTenant.LITER] = {
      [firstLitrePrice.date as unknown as string]: firstLitrePrice.price,
      default: firstLitrePrice.price,
    }
    priceDirectory[EPriceTenant.BOX_CUTTER] = {
      [firstBoxCutterPrice.date as unknown as string]: firstBoxCutterPrice.price,
      default: firstBoxCutterPrice.price,
    }
    priceDirectory[EPriceTenant.BOX_OFFLOAD_LOADER] = {
      [firstBoxOffloadLoaderPrice.date as unknown as string]: firstBoxOffloadLoaderPrice.price,
      default: firstBoxOffloadLoaderPrice.price
    }
    priceDirectory[EPriceTenant.BOX_MUSH_LOADER] = {
      [firstBoxMushLoaderPrice.date as unknown as string]: firstBoxMushLoaderPrice.price,
      default:firstBoxMushLoaderPrice.price
    }
    priceDirectory[EPriceTenant.KITCHEN] = {
      [firstKitchenPrice.date as unknown as string]: firstKitchenPrice.price,
      default: firstKitchenPrice.price,
    }

    priceChanges.forEach(({ tenant, date, price }) => {
      priceDirectory[tenant][date] = price
    })

    const getNearestPrice = ({ tenant, date }) => {
      let nearestDate

      Object.keys(priceDirectory[tenant] || {}).forEach((priceDate) => {
        if (priceDate && new Date(priceDate) <= new Date(date)) {
          nearestDate = priceDate
        }
      })

      return priceDirectory[tenant][nearestDate] || priceDirectory[tenant].default
    }

    cuttings.forEach(({ createdAt, boxQuantity, variety }) => {
      if (!variety.isCutterPaid) {
        return
      }

      const date = formatDateToDateTime({
        value: createdAt,
        withTime: false,
      }) as unknown as string
      const price = getNearestPrice({ tenant: EPriceTenant.BOX_CUTTER, date })
      const previousValue = wageDirectory?.[date] || 0
      wageDirectory[date] = boxQuantity * price + previousValue
    })

    loadings.forEach(({ createdAt, boxQuantity }) => {
      const date = formatDateToDateTime({
        value: createdAt,
        withTime: false,
      }) as unknown as string
      const price = getNearestPrice({ tenant: EPriceTenant.BOX_MUSH_LOADER, date })
      const previousValue = wageDirectory?.[date] || 0
      wageDirectory[date] = boxQuantity * price + previousValue
    })

    offloadLoadings.forEach(({ boxTotalQuantity, createdAt }) => {
      const date = formatDateToDateTime({
        value: createdAt,
        withTime: false,
      }) as unknown as string
      const price = getNearestPrice({ tenant: EPriceTenant.BOX_OFFLOAD_LOADER, date })
      const previousValue = wageDirectory?.[date] || 0
      wageDirectory[date] = boxTotalQuantity * price + previousValue
    })

    waterings.map((i) => {
      const date = String(i.dateTimeFrom).slice(0, 10)
      // const tenant = drug ? EPriceTenant.MEDICATED_LITER : EPriceTenant.LITER
      const tenant = EPriceTenant.LITER
      const price = getNearestPrice({ tenant, date })
      const previousValue = wageDirectory?.[date] || 0
      wageDirectory[date] = i.volume * price + previousValue
      i['price'] = i.volume * price
      return i;
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
    let bonus = newShiftData.bonus || 0
    let wageTotal = 0
    let remainedPayment = 0

    const calculateKitchenExpenses = (date: string) => {
      const slicedDate = date.slice(0, 10)
      const slidedDateTo = String(dateTo).slice(0, 10)
      const price = getNearestPrice({ date, tenant: EPriceTenant.KITCHEN })
      kitchenExpenses = kitchenExpenses + (price || 0)

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
      waterings: waterings,
      wage,
      bonus,
      wageTotal,
      remainedPayment,
    })

    return this.shiftRepository.save(updatedShift)
  }

  async getShiftCalculationsByEmployee(employeeId: number) {
    const shift: Shift = await this.findCurrentShiftWithRelations(employeeId)
// console.log(shift)
    if (!shift) {
      // throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
      console.warn(new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST))
      return
    }

    const {
      dateFrom: startDate,
      cuttings,
      loadings,
      offloadLoadings,
      waterings,
      workRecords,
    } = shift
    const customBonus =shift.customBonus
    const paidAmount = shift.paidAmount
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
      firstKitchenPrice,
      priceChanges,
      firstBoxCutterPrice,
      firstBoxOffloadLoaderPrice,
      firstBoxMushLoaderPrice,
    ]: [
      Nullable<Price>,
      Nullable<Price>,
      Price[],
      Nullable<Price>,
      Nullable<Price>,
      Nullable<Price>,
    ] = await Promise.all([
      this.priceService.findPriceByClosestDate({
        date: startDate as unknown as string,
        tenant: EPriceTenant.LITER,
      }),
      this.priceService.findPriceByClosestDate({
        date: startDate as unknown as string,
        tenant: EPriceTenant.KITCHEN,
      }),
      this.priceService.findAllTenantPricesWithinPeriod({
        dateFrom,
        dateTo,
      }),
      this.priceService.findPriceByClosestDate({
        date: startDate as unknown as string,
        tenant: EPriceTenant.BOX_CUTTER,
      }),
      this.priceService.findPriceByClosestDate({
        date: startDate as unknown as string,
        tenant: EPriceTenant.BOX_OFFLOAD_LOADER,
      }),
      this.priceService.findPriceByClosestDate({
        date: startDate as unknown as string,
        tenant: EPriceTenant.BOX_MUSH_LOADER,
      }),
    ])
    const hasFirstLitrePrice = Object.keys(firstLitrePrice || []).length
    const hasFirstKitchenPrice = Object.keys(firstKitchenPrice || []).length
    const hasFirstBoxCutterPrice = Object.keys(firstBoxCutterPrice || []).length
    const hasFirstBoxOffloadLoaderPrice = Object.keys(firstBoxOffloadLoaderPrice || []).length
    const hasFirstBoxMushLoaderPrice = Object.keys(firstBoxMushLoaderPrice || []).length

    if (!hasFirstLitrePrice) {
      console.warn(new HttpException(CError.NO_LITER_PRICE, HttpStatus.BAD_REQUEST))
      return
    }
    if (!hasFirstBoxCutterPrice) {
      console.warn(new HttpException(CError.NO_BOX_PRICE, HttpStatus.BAD_REQUEST))
      return
    }
    if (!hasFirstBoxOffloadLoaderPrice) {
      console.warn(new HttpException(CError.NO_BOX_PRICE, HttpStatus.BAD_REQUEST))
      return
    }

    if (!hasFirstBoxMushLoaderPrice) {
      console.warn(new HttpException(CError.NO_BOX_PRICE, HttpStatus.BAD_REQUEST))
      return
    }
    if (!hasFirstKitchenPrice) {
      console.warn(new HttpException(CError.NO_KITCHEN_PRICE, HttpStatus.BAD_REQUEST))
      return
    }

    priceDirectory[EPriceTenant.LITER] = {
      [firstLitrePrice.date as unknown as string]: firstLitrePrice.price,
      default: firstLitrePrice.price,
    }
    priceDirectory[EPriceTenant.BOX_CUTTER] = {
      [firstBoxCutterPrice.date as unknown as string]: firstBoxCutterPrice.price,
      default: firstBoxCutterPrice.price,
    }
    priceDirectory[EPriceTenant.BOX_OFFLOAD_LOADER] = {
      [firstBoxOffloadLoaderPrice.date as unknown as string]: firstBoxOffloadLoaderPrice.price,
      default: firstBoxOffloadLoaderPrice.price
    }
    priceDirectory[EPriceTenant.BOX_MUSH_LOADER] = {
      [firstBoxMushLoaderPrice.date as unknown as string]: firstBoxMushLoaderPrice.price,
      default:firstBoxMushLoaderPrice.price
    }
    priceDirectory[EPriceTenant.KITCHEN] = {
      [firstKitchenPrice.date as unknown as string]: firstKitchenPrice.price,
      default: firstKitchenPrice.price,
    }

    priceChanges.forEach(({ tenant, date, price }) => {
      priceDirectory[tenant][date] = price
    })

    const getNearestPrice = ({ tenant, date }) => {
      let nearestDate

      Object.keys(priceDirectory[tenant] || {}).forEach((priceDate) => {
        if (priceDate && new Date(priceDate) <= new Date(date)) {
          nearestDate = priceDate
        }
      })

      return priceDirectory[tenant][nearestDate] || priceDirectory[tenant].default
    }

    cuttings.forEach((i) => {
      i['price'] = 0
      if (!i.variety.isCutterPaid) {
        return
      }

      const date = formatDateToDateTime({
        value: i.createdAt,
        withTime: false,
      }) as unknown as string
      const price = getNearestPrice({ tenant: EPriceTenant.BOX_CUTTER, date })
      const previousValue = wageDirectory?.[date] || 0
      i['price'] = i.boxQuantity * price
      wageDirectory[date] = i.boxQuantity * price + previousValue
    })

    loadings.forEach((i) => {
      const date = formatDateToDateTime({
        value: i.createdAt,
        withTime: false,
      }) as unknown as string
      const price = getNearestPrice({ tenant: EPriceTenant.BOX_MUSH_LOADER, date })
      const previousValue = wageDirectory?.[date] || 0
      i['price'] = i.boxQuantity * price
      wageDirectory[date] = i.boxQuantity * price + previousValue
    })

    offloadLoadings.forEach((i) => {
      const date = formatDateToDateTime({
        value: i.createdAt,
        withTime: false,
      }) as unknown as string
      const price = getNearestPrice({ tenant: EPriceTenant.BOX_OFFLOAD_LOADER, date })
      const previousValue = wageDirectory?.[date] || 0
      i['price'] = i.boxTotalQuantity * price
      wageDirectory[date] = i.boxTotalQuantity * price + previousValue
    })

    waterings.forEach((i) => {
      const date = String(i.dateTimeFrom).slice(0, 10)
      const tenant = i.drug ? EPriceTenant.LITER : EPriceTenant.LITER
      const price = getNearestPrice({ tenant, date })
      const previousValue = wageDirectory?.[date] || 0
      console.log({
        volume: i.volume,
        price: price
      })
      i['price'] = i.volume * price
      wageDirectory[date] = i.volume * price + previousValue
    })

    workRecords.forEach((i) => {
      const previousValue = wageDirectory?.[i.date as unknown as string] || 0
      wageDirectory[i.date as unknown as string] =
        previousValue + i.percentAmount + i.reward
      i['price'] = i.percentAmount + i.reward
    })

    const workingDayNumber = Object.keys(wageDirectory).length
    const wage = Object.values(wageDirectory).reduce(
      (total, dayWage) => total + dayWage,
      0,
    )
    let kitchenExpenses = 0
    let bonus = shift.bonus || 0
    let wageTotal = 0
    let remainedPayment = 0

    const calculateKitchenExpenses = (date: string) => {
      const slicedDate = date.slice(0, 10)
      const slidedDateTo = String(dateTo).slice(0, 10)
      const priceData = getNearestPrice({ date, tenant: EPriceTenant.KITCHEN })
      kitchenExpenses = kitchenExpenses + (priceData?.price || 0)

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
    return {
      ...shift,
      kitchenExpenses,
      calendarDayNumber,
      workingDayNumber,
      wage,
      bonus,
      wageTotal,
      remainedPayment,
      waterings: waterings,
      workRecords,
      offloadLoadings,
      loadings,
      cuttings
    }
  }

  async getShiftCalculations(shiftId: number) {
    const shift: Shift = await this.findShiftWithRelations(shiftId)
    if (!shift) {
      // throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
      console.warn(new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST))
      return
    }

    const {
      dateFrom: startDate,
      cuttings,
      loadings,
      offloadLoadings,
      waterings,
      workRecords,
    } = shift
    const customBonus =shift.customBonus
    const paidAmount = shift.paidAmount
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
      firstKitchenPrice,
      priceChanges,
      firstBoxCutterPrice,
      firstBoxOffloadLoaderPrice,
      firstBoxMushLoaderPrice,
    ]: [
      Nullable<Price>,
      Nullable<Price>,
      Price[],
      Nullable<Price>,
      Nullable<Price>,
      Nullable<Price>,
    ] = await Promise.all([
      this.priceService.findPriceByClosestDate({
        date: startDate as unknown as string,
        tenant: EPriceTenant.LITER,
      }),
      this.priceService.findPriceByClosestDate({
        date: startDate as unknown as string,
        tenant: EPriceTenant.KITCHEN,
      }),
      this.priceService.findAllTenantPricesWithinPeriod({
        dateFrom,
        dateTo,
      }),
      this.priceService.findPriceByClosestDate({
        date: startDate as unknown as string,
        tenant: EPriceTenant.BOX_CUTTER,
      }),
      this.priceService.findPriceByClosestDate({
        date: startDate as unknown as string,
        tenant: EPriceTenant.BOX_OFFLOAD_LOADER,
      }),
      this.priceService.findPriceByClosestDate({
        date: startDate as unknown as string,
        tenant: EPriceTenant.BOX_MUSH_LOADER,
      }),
    ])
    const hasFirstLitrePrice = Object.keys(firstLitrePrice || []).length
    const hasFirstBoxCutterPrice = Object.keys(firstBoxCutterPrice || []).length
    const hasFirstBoxOffloadLoaderPrice = Object.keys(firstBoxOffloadLoaderPrice || []).length
    const hasFirstBoxMushLoaderPrice = Object.keys(firstBoxMushLoaderPrice || []).length
    const hasFirstKitchenPrice = Object.keys(firstKitchenPrice || []).length

    if (!hasFirstLitrePrice) {
      console.warn(new HttpException(CError.NO_LITER_PRICE, HttpStatus.BAD_REQUEST))
      return
    }

    if (!hasFirstBoxCutterPrice) {
      console.warn(new HttpException(CError.NO_BOX_PRICE, HttpStatus.BAD_REQUEST))
      return
    }
    if (!hasFirstBoxOffloadLoaderPrice) {
      console.warn(new HttpException(CError.NO_BOX_PRICE, HttpStatus.BAD_REQUEST))
      return
    }

    if (!hasFirstBoxMushLoaderPrice) {
      console.warn(new HttpException(CError.NO_BOX_PRICE, HttpStatus.BAD_REQUEST))
      return
    }
    if (!hasFirstKitchenPrice) {
      console.warn(new HttpException(CError.NO_KITCHEN_PRICE, HttpStatus.BAD_REQUEST))
      return
    }

    priceDirectory[EPriceTenant.LITER] = {
      [firstLitrePrice.date as unknown as string]: firstLitrePrice.price,
      default: firstLitrePrice.price,
    }
    priceDirectory[EPriceTenant.BOX_CUTTER] = {
      [firstBoxCutterPrice.date as unknown as string]: firstBoxCutterPrice.price,
      default: firstBoxCutterPrice.price,
    }
    priceDirectory[EPriceTenant.BOX_OFFLOAD_LOADER] = {
      [firstBoxOffloadLoaderPrice.date as unknown as string]: firstBoxOffloadLoaderPrice.price,
      default: firstBoxOffloadLoaderPrice.price
    }
    priceDirectory[EPriceTenant.BOX_MUSH_LOADER] = {
      [firstBoxMushLoaderPrice.date as unknown as string]: firstBoxMushLoaderPrice.price,
      default:firstBoxMushLoaderPrice.price
    }
    priceDirectory[EPriceTenant.KITCHEN] = {
      [firstKitchenPrice.date as unknown as string]: firstKitchenPrice.price,
      default: firstKitchenPrice.price,
    }

    priceChanges.forEach(({ tenant, date, price }) => {
      priceDirectory[tenant][date] = price
    })

    const getNearestPrice = ({ tenant, date }) => {
      let nearestDate

      Object.keys(priceDirectory[tenant] || {}).forEach((priceDate) => {
        if (priceDate && new Date(priceDate) <= new Date(date)) {
          nearestDate = priceDate
        }
      })

      return priceDirectory[tenant][nearestDate] || priceDirectory[tenant].default
    }

    cuttings.forEach(({ createdAt, boxQuantity, variety }) => {
      if (!variety.isCutterPaid) {
        return
      }

      const date = formatDateToDateTime({
        value: createdAt,
        withTime: false,
      }) as unknown as string
      const price = getNearestPrice({ tenant: EPriceTenant.BOX_CUTTER, date })
      const previousValue = wageDirectory?.[date] || 0
      wageDirectory[date] = boxQuantity * price + previousValue
    })

    loadings.forEach(({ createdAt, boxQuantity }) => {
      const date = formatDateToDateTime({
        value: createdAt,
        withTime: false,
      }) as unknown as string
      const price = getNearestPrice({ tenant: EPriceTenant.BOX_MUSH_LOADER, date })
      const previousValue = wageDirectory?.[date] || 0
      wageDirectory[date] = boxQuantity * price + previousValue
    })

    offloadLoadings.forEach(({ boxTotalQuantity, createdAt }) => {
      const date = formatDateToDateTime({
        value: createdAt,
        withTime: false,
      }) as unknown as string
      const price = getNearestPrice({ tenant: EPriceTenant.BOX_OFFLOAD_LOADER, date })
      const previousValue = wageDirectory?.[date] || 0
      wageDirectory[date] = boxTotalQuantity * price + previousValue
    })

    waterings.forEach(({ dateTimeFrom, drug, volume }) => {
      const date = String(dateTimeFrom).slice(0, 10)
      const tenant = drug ? EPriceTenant.LITER : EPriceTenant.LITER
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
    let bonus = shift.bonus || 0
    let wageTotal = 0
    let remainedPayment = 0

    const calculateKitchenExpenses = (date: string) => {
      const slicedDate = date.slice(0, 10)
      const slidedDateTo = String(dateTo).slice(0, 10)
      const priceData = getNearestPrice({ date, tenant: EPriceTenant.KITCHEN })
      console.log(priceData)
      kitchenExpenses = kitchenExpenses + (priceData?.price || 0)

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

    return {
      ...shift,
      kitchenExpenses,
      calendarDayNumber,
      workingDayNumber,
      wage,
      bonus,
      wageTotal,
      remainedPayment,
      cuttings,

    }
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

    await this.runShiftCalculations(employeeId, { dateTo })

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

    return this.runShiftCalculations(employeeId)
  }
}
