import { ReturnContainersDto } from '@mush/modules/offload/dto/return.containers.dto';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate'
import { Repository, Transaction } from 'typeorm';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
// import { Transactional } from 'typeorm-transactional';
import { Batch } from '@mush/modules/batch/batch.entity'
import { BatchService } from '@mush/modules/batch/batch.service'
import { Category } from '@mush/modules/category/category.entity'
import { CategoryService } from '@mush/modules/category/category.service'
import { Client } from '@mush/modules/client/client.entity'
import { ClientService } from '@mush/modules/client/client.service'
import { ClientMovementService, sumBoxes } from '@mush/modules/client/client-movement.service'
import { User } from '@mush/modules/core-module/user/user.entity'
import { Driver } from '@mush/modules/driver/driver.entity'
import { DriverService } from '@mush/modules/driver/driver.service'
import { FileUploadService } from '@mush/modules/file-upload/file-upload.service'
import { BufferedFile } from '@mush/modules/file-upload/file.model'
import { PublicFile } from '@mush/modules/file-upload/public-file.entity'
import { OffloadRecordService } from '@mush/modules/offload-record/offload-record.service'
import { PriceService } from '@mush/modules/price/price.service'
import { Shift } from '@mush/modules/shift/shift.entity'
import { ShiftService } from '@mush/modules/shift/shift.service'
import { Storage } from '@mush/modules/storage/storage.entity'
import { StorageService } from '@mush/modules/storage/storage.service'
import { StoreContainer } from '@mush/modules/store-container/store-container.entity'
import { StoreContainerService } from '@mush/modules/store-container/store-container.service'
import { Subbatch } from '@mush/modules/subbatch/subbatch.entity'
import { Variety } from '@mush/modules/variety/variety.entity'
import { VarietyService } from '@mush/modules/variety/variety.service'
import { Wave } from '@mush/modules/wave/wave.entity'
import { WaveService } from '@mush/modules/wave/wave.service'
import { YieldService } from '@mush/modules/yield/yield.service'

import { EFileCategory, EPriceTenant } from '@mush/core/enums'
import {
  CError,
  Nullable,
  formatDateToDateTime,
  createdAtOperationalDayFromInstant,
  transformPaginateOperationalDayCreatedAtFilter,
} from '@mush/core/utils'

import { CreateOffloadDto, EditOffloadDto } from './dto'
import { Offload } from './offload.entity'
import { offloadPaginationConfig } from './pagination/index'
import { ShiftOffload } from './shift-offload.entity';
import {Transactional} from "typeorm-transactional";

const boxWeight = 0.4

@Injectable()
export class OffloadService {
  constructor(
    @InjectRepository(Offload)
    private offloadRepository: Repository<Offload>,
    @InjectRepository(ShiftOffload)
    private shiftOffloadRepository: Repository<ShiftOffload>,
    private readonly clientService: ClientService,
    private readonly clientMovementService: ClientMovementService,
    private readonly driverService: DriverService,
    private readonly batchService: BatchService,
    private readonly waveService: WaveService,
    private readonly storeContainerService: StoreContainerService,
    private readonly categoryService: CategoryService,
    private readonly varietyService: VarietyService,
    private readonly storageService: StorageService,
    private readonly yieldService: YieldService,
    private readonly offloadRecordService: OffloadRecordService,
    private readonly priceService: PriceService,
    private readonly shiftService: ShiftService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  findAll(query: PaginateQuery): Promise<Paginated<Offload>> {
    return paginate(
      transformPaginateOperationalDayCreatedAtFilter(query),
      this.offloadRepository,
      offloadPaginationConfig,
    )
  }

  findOffloadById(id: number): Promise<Nullable<Offload>> {
    return this.offloadRepository.findOneBy({ id })
  }

  findOffloadByIdWithRelations(id: number): Promise<Nullable<Offload>> {
    return this.offloadRepository.findOne({
      where: { id },
      relations: [
        'offloadRecords',
        'author',
        'offloadRecords.variety',
        'offloadRecords.wave',
        'offloadRecords.storeContainer',
        'offloadRecords.category',
        'offloadRecords.batch',
        'offloadRecords.batch.chamber',
        'client',
        'driver',
        'documents',
          'shiftOffloads.shift',
          'shiftOffloads.shift.employee',
        // 'loaderShifts',
        // 'loaderShifts.employee'
      ],
    })
  }

  //
  getByShift(shiftId: string): any {
    return  this.offloadRepository
      .createQueryBuilder('offload')
      // .leftJoinAndSelect('offload.loaderShifts', 'loaderShifts')
      .leftJoinAndSelect('offload.shiftOffloads', 'shiftOffloads')
      .leftJoinAndSelect('shiftOffloads.shift', 'shift')
      .select([
        'offload.id',
        'offload.boxTotalQuantity',
        'offload.isClosed',
        'offload.createdAt',
        'offload.paidMoney',
        'offload.priceTotal',
        'shiftOffloads',
        'shiftOffloads.shift.id',
      ])
      .where('shiftOffloads.shift.id = :shiftId', { shiftId })
      .orderBy('offload.createdAt', 'ASC')
      .getMany();
  }

  findAllByUserId(
    userId: number,
    query: PaginateQuery,
  ): Promise<Paginated<Offload>> {
    const config = {
      ...offloadPaginationConfig,
      where: {
        author: {
          id: userId,
        },
      },
    }

    return paginate(
      transformPaginateOperationalDayCreatedAtFilter(query),
      this.offloadRepository,
      config,
    )
  }

  findAllByClientId(
    clientId: number,
    query: PaginateQuery,
  ): Promise<Paginated<Offload>> {
    const config = {
      ...offloadPaginationConfig,
      where: {
        client: {
          id: clientId,
        },
      },
    }

    return paginate(
      transformPaginateOperationalDayCreatedAtFilter(query),
      this.offloadRepository,
      config,
    )
  }

  findOffloadByIdWithFiles(id: number): Promise<Nullable<Offload>> {
    return this.offloadRepository
      .createQueryBuilder('offload')
      .leftJoinAndSelect('offload.documents', EFileCategory.OFFLOAD_DOCUMENTS)
      .where('offload.id = :id', { id })
      .getOne()
  }

  @Transactional()
  async createOffload({
    clientId,
    driverId,
    loaderShiftIds,
    user,
    data,
    offloadId
  }: {
    clientId: number
    driverId: number
    loaderShiftIds: number[]
    user: User
    data: CreateOffloadDto,
    offloadId?: number
  }): Promise<Offload> {
    const [client, driver, shifts]: [
      Nullable<Client>,
      Nullable<Driver>,
      Shift[],
    ] = await Promise.all([
      this.clientService.findClientById(clientId),
      this.driverService.findDriverById(driverId),
      this.shiftService.findByIds(loaderShiftIds),
    ])
    const priceTotal = data.priceTotal;
    const byIdCategories: Record<number, Category | {}> = {}
    const byIdBatches: Record<number, Batch | {}> = {}
    const byIdStoreContainers: Record<number, StoreContainer | {}> = {}
    const byIdWaves: Record<number, Wave | {}> = {}
    const byIdVarieties: Record<number, Variety | {}> = {}
    const byBatchIdCategoryIdSubbatches: Record<
      number,
      Record<number, Subbatch> | {}
    > = {}
    const priceIdBase: number = Date.now()
    const newOffloadRecordData: Array<{
      batch: Partial<Batch>
      boxQuantity: number
      category: Partial<Category>
      cuttingDate: Date
      priceId: number
      pricePerKg: number
      storeContainer: Partial<StoreContainer>
      wave: Partial<Wave>
      weight: number
      // netWeight: number
      // shrinkedNetWeight: number
      variety: Partial<Variety>
      recordName: string
    }> = []
    const storageSubtractionData: Array<{
      date: Date
      amount: number
      waveId: number
      varietyId: number
      categoryId: number
    }> = []
    // date for yield entries will be taken from each offload record's cuttingDate
    let priceCounted: number = 0
    let boxTotalQuantity: number = 0
    const {
      offloadRecords,
      paidMoney,
      delContainer1_7In,
      delContainer1_7Out,
      delContainer0_5In,
      delContainer0_5Out,
      delContainer0_4In,
      delContainer0_4Out,
      delContainerSchoellerIn,
      delContainerSchoellerOut,
      notes,
      createdAt,
    } = data

    if (!client || !driver || !shifts.length) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    offloadRecords.forEach((offloadRecordPriceGroup) => {
      let commonPricePerKg = 0

      offloadRecordPriceGroup.forEach((record, index) => {
        console.warn('record', record)

        const {
          batchId,
          boxQuantity,
          categoryId,
          cuttingDate,
          pricePerKg,
          storeContainerId,
          waveId,
          varietyId,
          recordName,
        } = record

        if (!index) {
          commonPricePerKg = pricePerKg
        }

        if (index && pricePerKg !== commonPricePerKg) {
          throw new HttpException(CError.WRONG_PRICE, HttpStatus.BAD_REQUEST)
        }

        if (
          !batchId ||
          !boxQuantity ||
          !categoryId ||
          !cuttingDate ||
          !pricePerKg ||
          !storeContainerId ||
          !waveId ||
          !varietyId ||
          !recordName
        ) {
          throw new HttpException(
            CError.MISSING_OFFLOAD_RECORD_DATA,
            HttpStatus.BAD_REQUEST,
          )
        }

        if (!byIdBatches[batchId]) {
          byIdBatches[batchId] = {}
          byBatchIdCategoryIdSubbatches[batchId] = {}
        }

        if (!byIdWaves[waveId]) {
          byIdWaves[waveId] = {}
        }

        if (!byIdCategories[categoryId]) {
          byIdCategories[categoryId] = {}
        }

        if (!byIdVarieties[varietyId]) {
          byIdVarieties[varietyId] = {}
        }

        if (!byIdStoreContainers[storeContainerId]) {
          byIdStoreContainers[storeContainerId] = {}
        }

        storageSubtractionData.push({
          date: cuttingDate,
          amount: boxQuantity,
          waveId,
          varietyId,
          categoryId,
        })
      })
    })

    const foundCategories: Array<Nullable<Category>> = await Promise.all(
      Object.keys(byIdCategories).map((id) =>
        this.categoryService.findCategoryById(parseInt(id)),
      ),
    )
    const foundBatches: Array<Nullable<Batch>> = await Promise.all(
      Object.keys(byIdBatches).map((id) =>
        this.batchService.findBatchById(parseInt(id)),
      ),
    )
    const foundWaves: Array<Nullable<Wave>> = await Promise.all(
      Object.keys(byIdWaves).map((id) =>
        this.waveService.findWaveById(parseInt(id)),
      ),
    )
    const foundVarieties: Array<Nullable<Variety>> = await Promise.all(
      Object.keys(byIdVarieties).map((id) =>
        this.varietyService.findVarietyById(parseInt(id)),
      ),
    )
    const foundStoreContainers: Array<Nullable<StoreContainer>> =
      await Promise.all(
        Object.keys(byIdStoreContainers).map((id) =>
          this.storeContainerService.findStoreContainerById(parseInt(id)),
        ),
      )
    // const foundStorages: Array<Nullable<Storage>> = await Promise.all(
    //   storageSubtractionData.map(({ varietyId, waveId, categoryId, date }) => {
    //     return this.storageService.findByOffloadParameters({
    //       varietyId,
    //       waveId,
    //       categoryId,
    //       date,
    //     })
    //   }),
    // )
    foundCategories.forEach((category) => {
      if (!category) {
        throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
      }

      byIdCategories[category.id] = category as Category
    })
    foundBatches.forEach((batch) => {
      if (!batch) {
        throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
      }

      byIdBatches[batch.id] = batch as Batch
      byBatchIdCategoryIdSubbatches[batch.id] = {}

      batch.subbatches.forEach((subbatch) => {
        const categoryId = subbatch.category.id
        byBatchIdCategoryIdSubbatches[batch.id][categoryId] =
          subbatch as Subbatch
      })
    })
    foundWaves.forEach((wave) => {
      if (!wave) {
        throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
      }

      byIdWaves[wave.id] = wave as Wave
    })
    foundVarieties.forEach((variety) => {
      if (!variety) {
        throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
      }

      byIdVarieties[variety.id] = variety as Variety
    })
    foundStoreContainers.forEach((container) => {
      if (!container) {
        throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
      }

      byIdStoreContainers[container.id] = container as StoreContainer
    })

    const findStorageAndUpdate = async (data) => {
      const storage = await this.storageService.findByOffloadParameters({
        varietyId: data.varietyId,
        waveId: data.waveId,
        categoryId: data.categoryId,
        date: data.date,
      })

      if (!storage) {
        throw new HttpException(
          CError.WRONG_STORAGE_DATA,
          HttpStatus.BAD_REQUEST,
        )
      }

      if (data?.amount > storage.amount) {
        throw new HttpException(CError.WRONG_BOX_AMOUNT, HttpStatus.BAD_REQUEST)
      }

      const offloadAmount: number = data?.amount
      const remainedAmount: number = storage.amount - offloadAmount

      return remainedAmount
        ? this.storageService.updateStorage({ id: storage.id, amount: remainedAmount })
        : this.storageService.removeStorage(storage.id)
    }

    for (let item of storageSubtractionData) {
      await findStorageAndUpdate(item)
    }

    offloadRecords.forEach((offloadRecordPriceGroup, index) => {
      const priceId = parseInt(`${priceIdBase}${index}`)

      offloadRecordPriceGroup.forEach((record) => {
        const {
          batchId,
          boxQuantity,
          categoryId,
          cuttingDate,
          pricePerKg,
          storeContainerId,
          waveId,
          weight,
          varietyId,
          recordName,
        } = record

        if ((byIdWaves?.[waveId]?.['batch']?.id as number) !== batchId) {
          throw new HttpException(CError.WRONG_WAVE_ID, HttpStatus.BAD_REQUEST)
        }

        if (!byBatchIdCategoryIdSubbatches[batchId][categoryId]) {
          throw new HttpException(
            CError.WRONG_CATEGORY_ID,
            HttpStatus.BAD_REQUEST,
          )
        }

        const storeContainerWeight = +byIdStoreContainers[storeContainerId]['weight'] || 1
        // const allBoxWeight = boxQuantity * storeContainerWeight
        boxTotalQuantity += boxQuantity
        const sum = (+weight - (+boxQuantity * 0.4) - storeContainerWeight);
        const curPrice = (sum - (sum / 100)) * pricePerKg
        priceCounted += curPrice

        newOffloadRecordData.push({
          batch: { id: batchId },
          boxQuantity,
          category: { id: categoryId },
          cuttingDate,
          priceId,
          pricePerKg,
          storeContainer: { id: storeContainerId },
          wave: { id: waveId },
          weight,
          variety: { id: varietyId },
          recordName,
          // netWeight,
          // shrinkedNetWeight,
        })
      })
    })

    const {
      moneyDebt,
      delContainer1_7Debt,
      delContainer0_5Debt,
      delContainer0_4Debt,
      delContainerSchoellerDebt,
    } = client
    const newMoneyDebt = moneyDebt + priceTotal - paidMoney
    const delContainer1_7NewDebt =
      delContainer1_7Debt + delContainer1_7Out - delContainer1_7In
    const delContainer0_5NewDebt =
      delContainer0_5Debt + delContainer0_5Out - delContainer0_5In
    const delContainer0_4NewDebt =
      delContainer0_4Debt + delContainer0_4Out - delContainer0_4In
    const delContainerSchoellerNewDebt =
      delContainerSchoellerDebt +
      delContainerSchoellerOut -
      delContainerSchoellerIn

    const offObj: any = {
      author: user,
      client,
      driver,
      shiftOffloads: [],
      priceTotal,
      priceCounted,
      paidMoney,
      boxTotalQuantity,
      delContainer1_7In,
      delContainer1_7Out,
      delContainer0_5In,
      delContainer0_5Out,
      delContainer0_4In,
      delContainer0_4Out,
      delContainerSchoellerIn,
      delContainerSchoellerOut,
      notes,
      documents: [],
      offloadRecords: [],
    }

    // Если передана дата создания, используем её, иначе будет использована текущая дата (автоматически)
    if (createdAt) {
      // Преобразуем строку "YYYY-MM-DD" в Date объект
      // Устанавливаем время на начало дня в UTC
      const [year, month, day] = createdAt.split('-').map(Number)
      offObj.createdAt = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0))
    }

    if(offloadId) {
      offObj['id'] = offloadId
    }

    const newOffload: Offload = this.offloadRepository.create(offObj) as unknown as Offload

    const savedNewOffload = await this.offloadRepository.save(newOffload)

    await this.clientService.updateClientDebt({
      id: clientId,
      moneyDebt: newMoneyDebt,
      delContainer1_7Debt: delContainer1_7NewDebt,
      delContainer0_5Debt: delContainer0_5NewDebt,
      delContainer0_4Debt: delContainer0_4NewDebt,
      delContainerSchoellerDebt: delContainerSchoellerNewDebt,
    })

    console.warn('offload records final', newOffloadRecordData)

    const newOffloadRecords = await Promise.all(
      newOffloadRecordData.map((record) =>
        this.offloadRecordService.createOffloadRecord({
          ...record,
          offload: { id: savedNewOffload.id },
        }),
      ),
    )

    // Урожайность должна появляться сразу после сохранения отгрузки,
    // даты берутся из offloadRecord.cuttingDate внутри YieldService.
    await this.yieldService.createYields({
      date: '',
      offloadRecords: newOffloadRecords,
      byIdWaves: byIdWaves as Record<number, Wave>,
      byBatchIdCategoryIdSubbatches,
    })

    // после создания offload (savedNewOffload)
    // распределяем boxTotalQuantity между shifts
    if (shifts.length > 0 && boxTotalQuantity > 0) {
      const base = Math.floor(boxTotalQuantity / shifts.length);
      const extra = boxTotalQuantity % shifts.length;

      // Получаем цену за ящик для погрузчика при выгрузке
      const today = formatDateToDateTime({
        value: new Date(),
        withTime: false,
      }) as unknown as string;

      const priceData = await this.priceService.findPriceByClosestDate({
        tenant: EPriceTenant.BOX_OFFLOAD_LOADER,
        date: today,
      });

      const pricePerBox = priceData?.price || 0;

      for (let i = 0; i < shifts.length; i++) {
        const qty = base + (i < extra ? 1 : 0);
        const workAmount = qty * pricePerBox;

        await this.shiftOffloadRepository.save(
          this.shiftOffloadRepository.create({
            offload: savedNewOffload,
            shift: shifts[i],
            boxQuantity: qty,
            workAmount: workAmount,
          })
        );
      }
    }

    savedNewOffload.client = client
    await this.clientMovementService.recordOffloadCreate(savedNewOffload)

    return savedNewOffload
  }

  /**
   * Обновляет поле workAmount для всех существующих записей ShiftOffload
   */
  async updateWorkAmountForExistingShiftOffloads(): Promise<void> {
    const shiftOffloads = await this.shiftOffloadRepository.find({
      relations: ['offload'],
    });

    for (const shiftOffload of shiftOffloads) {
      if (shiftOffload.workAmount === 0 && shiftOffload.boxQuantity > 0) {
        // Получаем цену за ящик для погрузчика при выгрузке
        const offloadDate = createdAtOperationalDayFromInstant(
          shiftOffload.offload.createdAt,
        );

        const priceData = await this.priceService.findPriceByClosestDate({
          tenant: EPriceTenant.BOX_OFFLOAD_LOADER,
          date: offloadDate,
        });

        const pricePerBox = priceData?.price || 0;
        const workAmount = shiftOffload.boxQuantity * pricePerBox;

        await this.shiftOffloadRepository.update(
          { id: shiftOffload.id },
          { workAmount: workAmount }
        );
      }
    }
  }

  async removeOffload(id: number): Promise<Boolean> {
    const foundOffload: Nullable<Offload> =
      await this.findOffloadByIdWithRelations(id)

    if (!foundOffload) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    const { offloadRecords } = foundOffload

    if (offloadRecords.length) {
      throw new HttpException(
        CError.ENTITY_HAS_DEPENDENT_RELATIONS,
        HttpStatus.BAD_REQUEST,
      )
    }

    try {
      await this.offloadRepository.remove(foundOffload)
      return true
    } catch (e) {
      return false
    }
  }

  async editOffload({
    offloadId,
    data,
  }: {
    offloadId: number
    data: EditOffloadDto
  }): Promise<Offload> {
    const foundOffload = await this.offloadRepository
      .createQueryBuilder('offload')
      .select()
      .leftJoinAndSelect('offload.client', 'client')
      .where('offload.id = :offloadId', { offloadId })
      .getOne()

    if (!foundOffload) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    if(data.offloadItemsPrices?.length) {
      const prices = data.offloadItemsPrices.reduce((acc,  cur) => {
        acc[cur.priceId] = cur.pricePerKg;
        return acc;
      }, {})
      const offloadRecords = await this.offloadRecordService.findByPrices(Object.keys(prices))
      this.offloadRecordService.updateList(
        offloadRecords.map((i) => ({
          ...i,
          pricePerKg: prices[i.priceId]
        }))
      )
    }

    const {
      paidMoney,
      priceTotal,
      delContainer1_7In,
      delContainer1_7Out,
      delContainer0_5In,
      delContainer0_5Out,
      delContainer0_4In,
      delContainer0_4Out,
      delContainerSchoellerIn,
      delContainerSchoellerOut,
      isClosed,
      closureDescription,
      notes,
    } = data

    // const difference1_7 = delContainer1_7In - delContainer1_7Out
    // const difference0_5 = delContainer0_5In - delContainer0_5Out
    // const difference0_4 = delContainer0_4In - delContainer0_4Out
    // const differencerSchoeller =
    //   delContainerSchoellerIn - delContainerSchoellerOut

    // const {
    //   paidMoney: previousPaidMoney,
    //   delContainer1_7In: previous1_7In,
    //   delContainer1_7Out: previous1_7Out,
    //   delContainer0_5In: previous0_5In,
    //   delContainer0_5Out: previous0_5Out,
    //   delContainer0_4In: previous0_4In,
    //   delContainer0_4Out: previous0_4Out,
    //   delContainerSchoellerIn: previousSchoellerIn,
    //   delContainerSchoellerOut: previousSchoellerOut,
    // } = foundOffload


    const [updatedOffload]: [Offload] = await Promise.all([
      this.offloadRepository.create({
        ...foundOffload,
        isClosed,
        closureDescription,
        paidMoney: paidMoney,
        delContainer1_7In: delContainer1_7In,
        delContainer1_7Out: delContainer1_7Out,
        delContainer0_5In: delContainer0_5In,
        delContainer0_5Out: delContainer0_5Out,
        delContainer0_4In: delContainer0_4In,
        delContainer0_4Out: delContainer0_4Out,
        delContainerSchoellerIn: delContainerSchoellerIn,
        delContainerSchoellerOut: delContainerSchoellerOut,
        priceTotal,
        notes,
      }),
    ])

    // Правильно пересчитываем долг клиента при изменении цены отгрузки и оплаты
    // Старый долг от этой отгрузки = oldPriceTotal - oldPaidMoney
    // Новый долг от этой отгрузки = newPriceTotal - newPaidMoney
    // Изменение долга = (newPriceTotal - newPaidMoney) - (oldPriceTotal - oldPaidMoney)
    const oldPriceTotal = foundOffload.priceTotal;
    const oldPaidMoney = foundOffload.paidMoney;
    const newPriceTotal = priceTotal;
    const newPaidMoney = paidMoney;

    // Вычисляем изменение долга: разница в цене минус разница в оплате
    const debtChange = (newPriceTotal - newPaidMoney) - (oldPriceTotal - oldPaidMoney);

    // Обновляем долг клиента: добавляем изменение долга
    const newMoneyDebt = foundOffload.client.moneyDebt + debtChange;

    // Правильно пересчитываем долги по контейнерам
    // Вычисляем разницу между новыми и старыми значениями контейнеров
    const delContainer1_7Difference = (delContainer1_7Out - delContainer1_7In) -
      (foundOffload.delContainer1_7Out - foundOffload.delContainer1_7In);
    const delContainer0_5Difference = (delContainer0_5Out - delContainer0_5In) -
      (foundOffload.delContainer0_5Out - foundOffload.delContainer0_5In);
    const delContainer0_4Difference = (delContainer0_4Out - delContainer0_4In) -
      (foundOffload.delContainer0_4Out - foundOffload.delContainer0_4In);
    const delContainerSchoellerDifference = (delContainerSchoellerOut - delContainerSchoellerIn) -
      (foundOffload.delContainerSchoellerOut - foundOffload.delContainerSchoellerIn);

    // Обновляем долги по контейнерам: добавляем разницу
    const newDelContainer1_7Debt = foundOffload.client.delContainer1_7Debt + delContainer1_7Difference;
    const newDelContainer0_5Debt = foundOffload.client.delContainer0_5Debt + delContainer0_5Difference;
    const newDelContainer0_4Debt = foundOffload.client.delContainer0_4Debt + delContainer0_4Difference;
    const newDelContainerSchoellerDebt = foundOffload.client.delContainerSchoellerDebt + delContainerSchoellerDifference;

    this.clientService.updateClientDebt({
      id: foundOffload.client.id,
      moneyDebt: newMoneyDebt,
      delContainer1_7Debt: newDelContainer1_7Debt,
      delContainer0_5Debt: newDelContainer0_5Debt,
      delContainer0_4Debt: newDelContainer0_4Debt,
      delContainerSchoellerDebt: newDelContainerSchoellerDebt,
    })

    await this.clientMovementService.recordOffloadEdit(
      offloadId,
      foundOffload.client.id,
      {
        priceTotal: Number(oldPriceTotal) || 0,
        paidMoney: Number(oldPaidMoney) || 0,
        boxesOut: sumBoxes([
          foundOffload.delContainer0_4Out,
          foundOffload.delContainer0_5Out,
          foundOffload.delContainer1_7Out,
          foundOffload.delContainerSchoellerOut,
        ]),
        boxesIn: sumBoxes([
          foundOffload.delContainer0_4In,
          foundOffload.delContainer0_5In,
          foundOffload.delContainer1_7In,
          foundOffload.delContainerSchoellerIn,
        ]),
      },
      {
        priceTotal: Number(newPriceTotal) || 0,
        paidMoney: Number(newPaidMoney) || 0,
        boxesOut: sumBoxes([
          delContainer0_4Out,
          delContainer0_5Out,
          delContainer1_7Out,
          delContainerSchoellerOut,
        ]),
        boxesIn: sumBoxes([
          delContainer0_4In,
          delContainer0_5In,
          delContainer1_7In,
          delContainerSchoellerIn,
        ]),
      },
    )

    return this.offloadRepository.save(updatedOffload)
  }

  async getDocumentsByOffloadId(id: number): Promise<Nullable<PublicFile[]>> {
    const foundOffload = await this.findOffloadByIdWithFiles(id)

    if (!foundOffload) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    return foundOffload.documents
  }

  async addOffloadDocuments(
    id: number,
    files: BufferedFile[],
  ): Promise<Nullable<Offload>> {
    if (!files || !files.length) {
      throw new HttpException(CError.NO_FILE_PROVIDED, HttpStatus.BAD_REQUEST)
    }

    // files.forEach(({ mimetype }) => {
    //   if (mimetype !== 'application/pdf') {
    //     throw new HttpException(
    //       CError.WRONG_DOCUMENT_TYPE,
    //       HttpStatus.BAD_REQUEST,
    //     )
    //   }
    // })

    const foundOffload = await this.findOffloadByIdWithFiles(id)

    if (!foundOffload) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    const documentListData: PublicFile[] =
      await this.fileUploadService.uploadPublicFiles(files)

    const updatedEmployee: Offload = this.offloadRepository.create({
      ...foundOffload,
      documents: [...foundOffload.documents, ...documentListData],
    })

    return this.offloadRepository.save(updatedEmployee)
  }

  async removeOffloadDocument(offloadId: number, documentId: number) {
    const foundOffload: Nullable<Offload> = await this.findOffloadByIdWithFiles(
      offloadId,
    )

    if (!foundOffload) {
      throw new HttpException(
        CError.NOT_FOUND_EMPLOYEE_ID,
        HttpStatus.BAD_REQUEST,
      )
    }

    const foundDocument = foundOffload.documents.find(
      (doc) => doc.id === documentId,
    )

    if (!foundDocument) {
      throw new HttpException(
        CError.FILE_ID_NOT_RELATED,
        HttpStatus.BAD_REQUEST,
      )
    }

    try {
      await this.fileUploadService.deletePublicFile(documentId)
      const updatedOffloadDocumentList = [...foundOffload.documents]
      const removedDocumentIndex = updatedOffloadDocumentList.findIndex(
        (doc) => doc.id === documentId,
      )

      if (removedDocumentIndex > -1) {
        updatedOffloadDocumentList.splice(removedDocumentIndex, 1)
      }

      const updatedEmployee: Offload = this.offloadRepository.create({
        ...foundOffload,
        documents: updatedOffloadDocumentList,
      })

      this.offloadRepository.save(updatedEmployee)

      return true
    } catch (e) {
      return false
    }
  }

  // async editOffloadV2 ({
  //   offloadId,
  //   data
  // }: {
  //   offloadId: number
  //   user: User
  //   data: CreateOffloadDto
  // }): Promise<Offload> {
  //   const foundOffload = await this.offloadRepository
  //     .createQueryBuilder('offload')
  //     .select()
  //     .leftJoinAndSelect('offload.client', 'client')
  //     .where('offload.id = :offloadId', { offloadId })
  //     .getOne()
  //
  //   if (!foundOffload) {
  //     throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
  //   }
  //   const priceTotal = data.priceTotal;
  //   const byIdCategories: Record<number, Category | {}> = {}
  //   const byIdBatches: Record<number, Batch | {}> = {}
  //   const byIdStoreContainers: Record<number, StoreContainer | {}> = {}
  //   const byIdWaves: Record<number, Wave | {}> = {}
  //   const byIdVarieties: Record<number, Variety | {}> = {}
  //   const byBatchIdCategoryIdSubbatches: Record<
  //     number,
  //     Record<number, Subbatch> | {}
  //   > = {}
  //   const priceIdBase: number = Date.now()
  //   const newOffloadRecordData: Array<{
  //     batch: Partial<Batch>
  //     boxQuantity: number
  //     category: Partial<Category>
  //     cuttingDate: Date
  //     priceId: number
  //     pricePerKg: number
  //     storeContainer: Partial<StoreContainer>
  //     wave: Partial<Wave>
  //     weight: number
  //     // netWeight: number
  //     // shrinkedNetWeight: number
  //     variety: Partial<Variety>
  //   }> = []
  //   const storageSubtractionData: Array<{
  //     date: Date
  //     amount: number
  //     waveId: number
  //     varietyId: number
  //     categoryId: number
  //   }> = []
  //   const today: string = String(
  //     formatDateToDateTime({
  //       value: new Date(Date.now()),
  //     }),
  //   )
  //   let priceCounted: number = 0
  //   let boxTotalQuantity: number = 0
  //   const {
  //     offloadRecords,
  //     paidMoney,
  //     delContainer1_7In,
  //     delContainer1_7Out,
  //     delContainer0_5In,
  //     delContainer0_5Out,
  //     delContainer0_4In,
  //     delContainer0_4Out,
  //     delContainerSchoellerIn,
  //     delContainerSchoellerOut,
  //   } = data
  //
  //   offloadRecords.forEach((offloadRecordPriceGroup) => {
  //     let commonPricePerKg = 0
  //
  //     offloadRecordPriceGroup.forEach((record, index) => {
  //       const {
  //         batchId,
  //         boxQuantity,
  //         categoryId,
  //         cuttingDate,
  //         pricePerKg,
  //         storeContainerId,
  //         waveId,
  //         varietyId,
  //       } = record
  //
  //       if (!index) {
  //         commonPricePerKg = pricePerKg
  //       }
  //
  //       if (index && pricePerKg !== commonPricePerKg) {
  //         throw new HttpException(CError.WRONG_PRICE, HttpStatus.BAD_REQUEST)
  //       }
  //
  //       if (
  //         !batchId ||
  //         !boxQuantity ||
  //         !categoryId ||
  //         !cuttingDate ||
  //         !pricePerKg ||
  //         !storeContainerId ||
  //         !waveId ||
  //         !varietyId
  //       ) {
  //         throw new HttpException(
  //           CError.MISSING_OFFLOAD_RECORD_DATA,
  //           HttpStatus.BAD_REQUEST,
  //         )
  //       }
  //
  //       if (!byIdBatches[batchId]) {
  //         byIdBatches[batchId] = {}
  //         byBatchIdCategoryIdSubbatches[batchId] = {}
  //       }
  //
  //       if (!byIdWaves[waveId]) {
  //         byIdWaves[waveId] = {}
  //       }
  //
  //       if (!byIdCategories[categoryId]) {
  //         byIdCategories[categoryId] = {}
  //       }
  //
  //       if (!byIdVarieties[varietyId]) {
  //         byIdVarieties[varietyId] = {}
  //       }
  //
  //       if (!byIdStoreContainers[storeContainerId]) {
  //         byIdStoreContainers[storeContainerId] = {}
  //       }
  //
  //       storageSubtractionData.push({
  //         date: cuttingDate,
  //         amount: boxQuantity,
  //         waveId,
  //         varietyId,
  //         categoryId,
  //       })
  //     })
  //   })
  //
  //   const foundCategories: Array<Nullable<Category>> = await Promise.all(
  //     Object.keys(byIdCategories).map((id) =>
  //       this.categoryService.findCategoryById(parseInt(id)),
  //     ),
  //   )
  //   const foundBatches: Array<Nullable<Batch>> = await Promise.all(
  //     Object.keys(byIdBatches).map((id) =>
  //       this.batchService.findBatchById(parseInt(id)),
  //     ),
  //   )
  //   const foundWaves: Array<Nullable<Wave>> = await Promise.all(
  //     Object.keys(byIdWaves).map((id) =>
  //       this.waveService.findWaveById(parseInt(id)),
  //     ),
  //   )
  //   const foundVarieties: Array<Nullable<Variety>> = await Promise.all(
  //     Object.keys(byIdVarieties).map((id) =>
  //       this.varietyService.findVarietyById(parseInt(id)),
  //     ),
  //   )
  //   const foundStoreContainers: Array<Nullable<StoreContainer>> =
  //     await Promise.all(
  //       Object.keys(byIdStoreContainers).map((id) =>
  //         this.storeContainerService.findStoreContainerById(parseInt(id)),
  //       ),
  //     )
  //   const foundStorages: Array<Nullable<Storage>> = await Promise.all(
  //     storageSubtractionData.map(({ varietyId, waveId, categoryId, date }) => {
  //       return this.storageService.findByOffloadParameters({
  //         varietyId,
  //         waveId,
  //         categoryId,
  //         date,
  //       })
  //     }),
  //   )
  //   foundCategories.forEach((category) => {
  //     if (!category) {
  //       throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
  //     }
  //
  //     byIdCategories[category.id] = category as Category
  //   })
  //   foundBatches.forEach((batch) => {
  //     if (!batch) {
  //       throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
  //     }
  //
  //     byIdBatches[batch.id] = batch as Batch
  //     byBatchIdCategoryIdSubbatches[batch.id] = {}
  //
  //     batch.subbatches.forEach((subbatch) => {
  //       const categoryId = subbatch.category.id
  //       byBatchIdCategoryIdSubbatches[batch.id][categoryId] =
  //         subbatch as Subbatch
  //     })
  //   })
  //   foundWaves.forEach((wave) => {
  //     if (!wave) {
  //       throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
  //     }
  //
  //     byIdWaves[wave.id] = wave as Wave
  //   })
  //   foundVarieties.forEach((variety) => {
  //     if (!variety) {
  //       throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
  //     }
  //
  //     byIdVarieties[variety.id] = variety as Variety
  //   })
  //   foundStoreContainers.forEach((container) => {
  //     if (!container) {
  //       throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
  //     }
  //
  //     byIdStoreContainers[container.id] = container as StoreContainer
  //   })
  //   foundStorages.forEach((storage, index) => {
  //     if (!storage) {
  //       throw new HttpException(
  //         CError.WRONG_STORAGE_DATA,
  //         HttpStatus.BAD_REQUEST,
  //       )
  //     }
  //
  //     if (storageSubtractionData[index]?.amount > storage.amount) {
  //       throw new HttpException(CError.WRONG_BOX_AMOUNT, HttpStatus.BAD_REQUEST)
  //     }
  //   })
  //
  //   await Promise.all(
  //     foundStorages.map(({ id, amount: storedAmount }, index) => {
  //       const offloadAmount: number = storageSubtractionData[index]?.amount
  //       const remainedAmount: number = storedAmount - offloadAmount
  //
  //       return remainedAmount
  //         ? this.storageService.updateStorage({ id, amount: remainedAmount })
  //         : this.storageService.removeStorage(id)
  //     }),
  //   )
  //
  //   offloadRecords.forEach((offloadRecordPriceGroup, index) => {
  //     const priceId = parseInt(`${priceIdBase}${index}`)
  //
  //     offloadRecordPriceGroup.forEach((record) => {
  //       const {
  //         batchId,
  //         boxQuantity,
  //         categoryId,
  //         cuttingDate,
  //         pricePerKg,
  //         storeContainerId,
  //         waveId,
  //         weight,
  //         varietyId,
  //       } = record
  //
  //       if ((byIdWaves?.[waveId]?.['batch']?.id as number) !== batchId) {
  //         throw new HttpException(CError.WRONG_WAVE_ID, HttpStatus.BAD_REQUEST)
  //       }
  //
  //       if (!byBatchIdCategoryIdSubbatches[batchId][categoryId]) {
  //         throw new HttpException(
  //           CError.WRONG_CATEGORY_ID,
  //           HttpStatus.BAD_REQUEST,
  //         )
  //       }
  //
  //       const storeContainerWeight = +byIdStoreContainers[storeContainerId]['weight'] || 1
  //       // const allBoxWeight = boxQuantity * storeContainerWeight
  //       // const netWeight = weight - allBoxWeight
  //       // const shrinkedNetWeight = netWeight * 0.99
  //       // boxTotalQuantity += boxQuantity
  //       const sum = (+weight - (+boxQuantity * 0.4) - storeContainerWeight);
  //       const curPrice = (sum - (sum / 100)) * pricePerKg
  //       priceCounted += curPrice
  //
  //       newOffloadRecordData.push({
  //         batch: { id: batchId },
  //         boxQuantity,
  //         category: { id: categoryId },
  //         cuttingDate,
  //         priceId,
  //         pricePerKg,
  //         storeContainer: { id: storeContainerId },
  //         wave: { id: waveId },
  //         weight,
  //         variety: { id: varietyId },
  //         // netWeight,
  //         // shrinkedNetWeight,
  //       })
  //     })
  //   })
  //
  //
  //
  //   const newOffload: Offload = await this.offloadRepository.create({
  //     ...foundOffload,
  //     priceTotal,
  //     priceCounted,
  //     paidMoney,
  //     boxTotalQuantity,
  //     delContainer1_7In,
  //     delContainer1_7Out,
  //     delContainer0_5In,
  //     delContainer0_5Out,
  //     delContainer0_4In,
  //     delContainer0_4Out,
  //     delContainerSchoellerIn,
  //     delContainerSchoellerOut,
  //   })
  //
  //   const savedNewOffload = await this.offloadRepository.save(newOffload)
  //
  //   const newOffloadRecords = await Promise.all(
  //     newOffloadRecordData.map((record) =>
  //       this.offloadRecordService.createOffloadRecord({
  //         ...record,
  //         offload: { id: savedNewOffload.id },
  //       }),
  //     ),
  //   )
  //
  //
  //
  //   return savedNewOffload
  // }

  async closeOffload (offloadId) {
    const foundOffload = await this.offloadRepository
      .createQueryBuilder('offload')
      .select()
      .leftJoinAndSelect('offload.client', 'client')
      .leftJoinAndSelect('offload.offloadRecords', 'offloadRecords')
      .leftJoinAndSelect('offloadRecords.wave', 'wave')
      .leftJoinAndSelect('wave.batch', 'waveBatch')
      .leftJoinAndSelect('offloadRecords.batch', 'batch')
      .leftJoinAndSelect('offloadRecords.variety', 'variety')
      .leftJoinAndSelect('offloadRecords.category', 'categoryOffload')
      .leftJoinAndSelect('offloadRecords.storeContainer', 'storeContainer')
      .leftJoinAndSelect('batch.subbatches', 'subbatches')
      .leftJoinAndSelect('subbatches.category', 'category')
      .where('offload.id = :offloadId', { offloadId })
      .getOne()
    console.log('foundOffload', foundOffload)
    const {
      id: clientId,
      // moneyDebt,
      // delContainer1_7Debt,
      // delContainer0_5Debt,
      // delContainer0_4Debt,
      // delContainerSchoellerDebt,
    } = foundOffload.client
    const today: string = String(
      formatDateToDateTime({
        value: new Date(Date.now()),
      }),
    )
    const {
      offloadRecords,
      // paidMoney,
      // priceTotal,
      // delContainer1_7In,
      // delContainer1_7Out,
      // delContainer0_5In,
      // delContainer0_5Out,
      // delContainer0_4In,
      // delContainer0_4Out,
      // delContainerSchoellerIn,
      // delContainerSchoellerOut,
    } = foundOffload
    // const newMoneyDebt = moneyDebt + priceTotal - paidMoney
    // const delContainer1_7NewDebt =
    //   delContainer1_7Debt + delContainer1_7Out - delContainer1_7In
    // const delContainer0_5NewDebt =
    //   delContainer0_5Debt + delContainer0_5Out - delContainer0_5In
    // const delContainer0_4NewDebt =
    //   delContainer0_4Debt + delContainer0_4Out - delContainer0_4In
    // const delContainerSchoellerNewDebt =
    //   delContainerSchoellerDebt +
    //   delContainerSchoellerOut -
    //   delContainerSchoellerIn
    // await this.clientService.updateClientDebt({
    //   id: clientId,
    //   moneyDebt: newMoneyDebt,
    //   delContainer1_7Debt: delContainer1_7NewDebt,
    //   delContainer0_5Debt: delContainer0_5NewDebt,
    //   delContainer0_4Debt: delContainer0_4NewDebt,
    //   delContainerSchoellerDebt: delContainerSchoellerNewDebt,
    // })
    const newOffload: Offload = await this.offloadRepository.create({
      ...foundOffload,
      isClosed: true
    })

    await this.offloadRepository.save(newOffload);
  }

  async returnPrice(offloadId: number, price: number) {
    const foundOffload = await this.offloadRepository
      .createQueryBuilder('offload')
      .leftJoinAndSelect('offload.client', 'client')
      .where('offload.id = :offloadId', { offloadId })
      .getOne()
    const {
      id: clientId,
      moneyDebt,
      firstName,
      lastName,
      patronymic,
      nickname,
      phone,
      delContainer1_7Debt,
      delContainer0_5Debt,
      delContainer0_4Debt,
      delContainerSchoellerDebt,
    } = foundOffload.client
    const {
      paidMoney,
    } = foundOffload
    const newMoneyDebt = moneyDebt - price
    await this.clientService.updateClient(clientId, {
      moneyDebt: newMoneyDebt,
      firstName,
      lastName,
      patronymic,
      nickname,
      phone,
      delContainer1_7Debt,
      delContainer0_5Debt,
      delContainer0_4Debt,
      delContainerSchoellerDebt,
    })
    const newOffload: Offload = await this.offloadRepository.create({
      ...foundOffload,
      paidMoney: paidMoney + price
    })

    await this.offloadRepository.save(newOffload);
    await this.clientMovementService.recordReturnPrice(clientId, offloadId, price)
  }

  async returnContainers(offloadId: number, {
    delContainer1_7,
    delContainer0_5,
    delContainer0_4,
    delContainerSchoeller,
  }: ReturnContainersDto) {
    const foundOffload = await this.offloadRepository
      .createQueryBuilder('offload')
      .leftJoinAndSelect('offload.client', 'client')
      .where('offload.id = :offloadId', { offloadId })
      .getOne()
    const {
      id: clientId,
      moneyDebt,
      delContainer1_7Debt,
      delContainer0_5Debt,
      delContainer0_4Debt,
      delContainerSchoellerDebt,
    } = foundOffload.client

    const {
      delContainer0_5In,
      delContainer0_4In,
      delContainer1_7In,
      delContainerSchoellerIn,
    } = foundOffload
    const delContainer1_7NewDebt =
      delContainer1_7Debt - delContainer1_7
    const delContainer0_5NewDebt =
      delContainer0_5Debt - delContainer0_5
    const delContainer0_4NewDebt =
      delContainer0_4Debt - delContainer0_4
    const delContainerSchoellerNewDebt =
      delContainerSchoellerDebt - delContainerSchoeller
    await this.clientService.updateClientDebt({
      id: clientId,
      moneyDebt,
      delContainer1_7Debt: delContainer1_7NewDebt,
      delContainer0_5Debt: delContainer0_5NewDebt,
      delContainer0_4Debt: delContainer0_4NewDebt,
      delContainerSchoellerDebt: delContainerSchoellerNewDebt,
    })

    const newOffload: Offload = await this.offloadRepository.create({
      ...foundOffload,
      delContainer1_7In: delContainer1_7In + delContainer1_7,
      delContainer0_5In: delContainer0_5In + delContainer0_5,
      delContainer0_4In: delContainer0_4In + delContainer0_4,
      delContainerSchoellerIn: delContainerSchoellerIn + delContainerSchoeller,
    })
    await this.offloadRepository.save(newOffload);
    await this.clientMovementService.recordReturnContainers(
      clientId,
      offloadId,
      sumBoxes([delContainer1_7, delContainer0_5, delContainer0_4, delContainerSchoeller]),
    )
  }
}
