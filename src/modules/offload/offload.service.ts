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
import { StoreContainer } from '@mush/modules/store-container/store-container.entity'
import { StoreContainerService } from '@mush/modules/store-container/store-container.service'
import { Variety } from '@mush/modules/variety/variety.entity'
import { VarietyService } from '@mush/modules/variety/variety.service'
import { Wave } from '@mush/modules/wave/wave.entity'
import { WaveService } from '@mush/modules/wave/wave.service'

import { EError } from '@mush/core/enums'
import { CError, Nullable } from '@mush/core/utils'

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
    data: CreateOffloadDto[][]
  }): Promise<Offload[]> {
    const [client, driver]: [Nullable<Client>, Nullable<Driver>] =
      await Promise.all([
        this.clientService.findClientById(clientId),
        this.driverService.findDriverById(driverId),
      ])
    const byIdCategories = {}
    const byIdBatches = {}
    const byIdStoreContainers = {}
    const byIdWaves = {}
    const byIdVarieties = {}
    const docId = Date.now()
    const newOffloadData = []

    if (!client || !driver) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    data.forEach((offloadPriceGroup) => {
      let commonPrice = 0

      offloadPriceGroup.forEach((offload, index) => {
        const {
          storeContainerId,
          batchId,
          categoryId,
          waveId,
          varietyId,
          price,
        } = offload

        if (!index) {
          commonPrice = price
        }

        if (index && price !== commonPrice) {
          throw new HttpException(CError.WRONG_PRICE, HttpStatus.BAD_REQUEST)
        }

        if (!byIdBatches[batchId]) {
          byIdBatches[batchId] = batchId
        }

        if (!byIdWaves[waveId]) {
          byIdWaves[waveId] = waveId
        }

        if (!byIdCategories[categoryId]) {
          byIdCategories[categoryId] = categoryId
        }

        if (!byIdVarieties[varietyId]) {
          byIdVarieties[varietyId] = varietyId
        }

        if (!byIdStoreContainers[storeContainerId]) {
          byIdStoreContainers[storeContainerId] = storeContainerId
        }
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

    foundCategories.forEach((category) => {
      if (!category) {
        throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
      }

      Object.keys(byIdCategories).forEach((id) => {
        byIdCategories[id] = category
      })
    })
    foundBatches.forEach((batch) => {
      if (!batch) {
        throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
      }

      Object.keys(byIdBatches).forEach((id) => {
        byIdBatches[id] = batch
      })
    })
    foundWaves.forEach((wave) => {
      if (!wave) {
        throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
      }

      Object.keys(byIdWaves).forEach((id) => {
        byIdWaves[id] = wave
      })
    })
    foundVarieties.forEach((variety) => {
      if (!variety) {
        throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
      }

      Object.keys(byIdVarieties).forEach((id) => {
        byIdVarieties[id] = variety
      })
    })
    foundStoreContainers.forEach((container) => {
      if (!container) {
        throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
      }

      Object.keys(byIdStoreContainers).forEach((id) => {
        byIdStoreContainers[id] = container
      })
    })

    data.forEach((offloadPriceGroup, index) => {
      const priceId = parseInt(`${docId}${index}`)

      offloadPriceGroup.forEach((offload) => {
        const {
          storeContainerId,
          batchId,
          categoryId,
          waveId,
          varietyId,
          cuttingDate,
          amount,
          price,
        } = offload

        newOffloadData.push({
          storeContainer: byIdStoreContainers[storeContainerId],
          batch: byIdBatches[batchId],
          category: byIdCategories[categoryId],
          wave: byIdWaves[waveId],
          variety: byIdVarieties[varietyId],
          cuttingDate,
          amount,
          price,
          docId,
          priceId,
          author: user,
        })
      })
    })

    const newOffloads: Offload[] = await Promise.all(
      newOffloadData.map((offload: Offload) =>
        this.offloadRepository.create(offload),
      ),
    )

    return Promise.all(
      newOffloads.map((offload) => this.offloadRepository.save(offload)),
    )
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
