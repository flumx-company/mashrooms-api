import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate'
import { Repository } from 'typeorm'

import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Batch } from '@mush/modules/batch/batch.entity'
import { BatchService } from '@mush/modules/batch/batch.service'
import { Category } from '@mush/modules/category/category.entity'
import { CategoryService } from '@mush/modules/category/category.service'
import { Client } from '@mush/modules/client/client.entity'
import { ClientService } from '@mush/modules/client/client.service'
import { User } from '@mush/modules/core-module/user/user.entity'
import { Driver } from '@mush/modules/driver/driver.entity'
import { DriverService } from '@mush/modules/driver/driver.service'
import { OffloadRecord } from '@mush/modules/offload-record/offload-record.entity'
import { OffloadRecordService } from '@mush/modules/offload-record/offload-record.service'
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

import { CError, Nullable, formatDateToDateTime } from '@mush/core/utils'

import { CreateOffloadDto } from './dto'
import { Offload } from './offload.entity'
import { offloadPaginationConfig } from './pagination/index'

@Injectable()
export class OffloadService {
  constructor(
    @InjectRepository(Offload)
    private offloadRepository: Repository<Offload>,
    private readonly clientService: ClientService,
    private readonly driverService: DriverService,
    private readonly batchService: BatchService,
    private readonly waveService: WaveService,
    private readonly storeContainerService: StoreContainerService,
    private readonly categoryService: CategoryService,
    private readonly varietyService: VarietyService,
    private readonly storageService: StorageService,
    private readonly yieldService: YieldService,
    private readonly offloadRecordService: OffloadRecordService,
  ) {}

  findAll(query: PaginateQuery): Promise<Paginated<Offload>> {
    return paginate(query, this.offloadRepository, offloadPaginationConfig)
  }

  findOffloadById(id: number): Promise<Nullable<Offload>> {
    return this.offloadRepository.findOneBy({ id })
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

    return paginate(query, this.offloadRepository, config)
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

    return paginate(query, this.offloadRepository, config)
  }

  async createOffload({
    clientId,
    driverId,
    user,
    data,
  }: {
    clientId: number
    driverId: number
    user: User
    data: CreateOffloadDto
  }): Promise<Offload> {
    const [client, driver]: [Nullable<Client>, Nullable<Driver>] =
      await Promise.all([
        this.clientService.findClientById(clientId),
        this.driverService.findDriverById(driverId),
      ])
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
      pricePerBox: number
      storeContainer: Partial<StoreContainer>
      wave: Partial<Wave>
      weight: number
      variety: Partial<Variety>
    }> = []
    const storageSubtractionData: Array<{
      date: Date
      amount: number
      waveId: number
      varietyId: number
      categoryId: number
    }> = []
    const today: string = String(
      formatDateToDateTime({
        value: new Date(Date.now()),
      }),
    )
    let priceTotal: number = 0
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
    } = data

    if (!client || !driver) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    offloadRecords.forEach((offloadRecordPriceGroup) => {
      let commonPricePerBox = 0

      offloadRecordPriceGroup.forEach((record, index) => {
        const {
          batchId,
          boxQuantity,
          categoryId,
          cuttingDate,
          pricePerBox,
          storeContainerId,
          waveId,
          varietyId,
        } = record

        if (!index) {
          commonPricePerBox = pricePerBox
        }

        if (index && pricePerBox !== commonPricePerBox) {
          throw new HttpException(CError.WRONG_PRICE, HttpStatus.BAD_REQUEST)
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

    const foundStorages: Array<Nullable<Storage>> = await Promise.all(
      storageSubtractionData.map(({ varietyId, waveId, categoryId, date }) => {
        return this.storageService.findByOffloadParameters({
          varietyId,
          waveId,
          categoryId,
          date,
        })
      }),
    )

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

    foundStorages.forEach((storage, index) => {
      if (!storage) {
        throw new HttpException(
          CError.WRONG_STORAGE_DATA,
          HttpStatus.BAD_REQUEST,
        )
      }

      if (storageSubtractionData[index]?.amount > storage.amount) {
        throw new HttpException(CError.WRONG_BOX_AMOUNT, HttpStatus.BAD_REQUEST)
      }
    })

    await Promise.all(
      foundStorages.map(({ id, amount: storedAmount }, index) => {
        const offloadAmount: number = storageSubtractionData[index]?.amount
        const remainedAmount: number = storedAmount - offloadAmount

        return remainedAmount
          ? this.storageService.updateStorage({ id, amount: remainedAmount })
          : this.storageService.removeStorage(id)
      }),
    )

    offloadRecords.forEach((offloadRecordPriceGroup, index) => {
      const priceId = parseInt(`${priceIdBase}${index}`)

      offloadRecordPriceGroup.forEach((record) => {
        const {
          batchId,
          boxQuantity,
          categoryId,
          cuttingDate,
          pricePerBox,
          storeContainerId,
          waveId,
          weight,
          varietyId,
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

        priceTotal += pricePerBox * boxQuantity
        newOffloadRecordData.push({
          batch: { id: batchId },
          boxQuantity,
          category: { id: categoryId },
          cuttingDate,
          priceId,
          pricePerBox,
          storeContainer: { id: storeContainerId },
          wave: { id: waveId },
          weight,
          variety: { id: varietyId },
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

    const newOffload: Offload = await this.offloadRepository.create({
      author: user,
      client,
      driver,
      previousMoneyDebt: moneyDebt,
      priceTotal,
      paidMoney,
      newMoneyDebt: newMoneyDebt,
      delContainer1_7PreviousDebt: delContainer1_7Debt,
      delContainer1_7In,
      delContainer1_7Out,
      delContainer1_7NewDebt,
      delContainer0_5PreviousDebt: delContainer0_5Debt,
      delContainer0_5In,
      delContainer0_5Out,
      delContainer0_5NewDebt,
      delContainer0_4PreviousDebt: delContainer0_4Debt,
      delContainer0_4In,
      delContainer0_4Out,
      delContainer0_4NewDebt,
      delContainerSchoellerPreviousDebt: delContainerSchoellerDebt,
      delContainerSchoellerIn,
      delContainerSchoellerOut,
      delContainerSchoellerNewDebt,
    })

    const savedNewOffload = await this.offloadRepository.save(newOffload)

    await this.clientService.updateClientDebt({
      id: clientId,
      moneyDebt: newMoneyDebt,
      delContainer1_7Debt: delContainer1_7NewDebt,
      delContainer0_5Debt: delContainer0_5NewDebt,
      delContainer0_4Debt: delContainer0_4NewDebt,
      delContainerSchoellerDebt: delContainerSchoellerNewDebt,
    })

    await Promise.all(
      newOffloadRecordData.map((record) =>
        this.offloadRecordService.createOffloadRecord({
          ...record,
          offload: { id: savedNewOffload.id },
        }),
      ),
    )

    const foundTodayOffloadRecords: OffloadRecord[] =
      await this.offloadRecordService.findAllByDate(today)

    const yieldUpdatingdOffloadRecords: OffloadRecord[] =
      foundTodayOffloadRecords.filter(({ category, wave, variety }) => {
        return (
          byIdCategories[category.id] &&
          byIdWaves[wave.id] &&
          byIdVarieties[variety.id]
        )
      })

    await this.yieldService.createYields({
      date: today,
      offloadRecords: yieldUpdatingdOffloadRecords,
      byIdWaves: byIdWaves as Record<number, Wave>,
      byBatchIdCategoryIdSubbatches,
      byIdStoreContainers: byIdStoreContainers as Record<
        number,
        StoreContainer
      >,
    })

    return savedNewOffload
  }

  async removeOffload(id: number): Promise<Boolean> {
    const foundOffload: Nullable<Offload> = await this.findOffloadById(id)

    if (!foundOffload) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    try {
      await this.offloadRepository.remove(foundOffload)
      return true
    } catch (e) {
      return false
    }
  }
}
