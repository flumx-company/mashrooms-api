import { Repository } from 'typeorm'

import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Batch } from '@mush/modules/batch/batch.entity'
import { BatchService } from '@mush/modules/batch/batch.service'
import { Category } from '@mush/modules/category/category.entity'
import { CategoryService } from '@mush/modules/category/category.service'
import { Offload } from '@mush/modules/offload/offload.entity'
import { StoreContainer } from '@mush/modules/store-container/store-container.entity'
import { Subbatch } from '@mush/modules/subbatch/subbatch.entity'
import { Wave } from '@mush/modules/wave/wave.entity'
import { WaveService } from '@mush/modules/wave/wave.service'

import { CError, Nullable } from '@mush/core/utils'

import { Yield } from './yield.entity'

const boxWeight = 0.4

@Injectable()
export class YieldService {
  constructor(
    @InjectRepository(Yield)
    private yieldRepository: Repository<Yield>,
    private readonly batchService: BatchService,
    private readonly categoryService: CategoryService,
    private readonly waveService: WaveService,
  ) {}

  async findAllByDate({
    date,
    batchId,
    categoryId,
    waveId,
  }: {
    date: string
    batchId: number
    categoryId: number
    waveId: number
  }): Promise<Yield[]> {
    const [batch, category, wave]: [
      batch: Batch,
      category: Category,
      wave: Wave,
    ] = await Promise.all([
      this.batchService.findBatchById(batchId),
      this.categoryService.findCategoryById(categoryId),
      this.waveService.findWaveById(waveId),
    ])

    if (!batch || !category || !wave) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    return this.yieldRepository
      .createQueryBuilder('yield')
      .select()
      .leftJoinAndSelect('yield.category', 'category')
      .leftJoinAndSelect('yield.batch', 'batch')
      .leftJoinAndSelect('yield.variety', 'variety')
      .leftJoinAndSelect('yield.wave', 'wave')
      .leftJoinAndSelect(
        'batch.subbatches',
        'subbatch',
        `batch.id = subbatch.batchId AND subbatch.categoryId = ${categoryId}`,
      )
      .where('date = :date', { date })
      .andWhere('batch.id = :batchId', { batchId })
      .andWhere('wave.id = :waveId', { waveId })
      .getMany()
  }

  findYieldByOffloadParameters({
    date,
    batchId,
    categoryId,
    varietyId,
    waveId,
  }: {
    date: string
    batchId: number
    categoryId: number
    varietyId: number
    waveId: number
  }): Promise<Yield> {
    return this.yieldRepository
      .createQueryBuilder('yield')
      .select()
      .leftJoinAndSelect('yield.category', 'category')
      .leftJoinAndSelect('yield.batch', 'batch')
      .leftJoinAndSelect('yield.variety', 'variety')
      .leftJoinAndSelect('yield.wave', 'wave')
      .where('date = :date', { date })
      .andWhere('batch.id = :batchId', { batchId })
      .andWhere('variety.id = :varietyId', { varietyId })
      .andWhere('category.id = :categoryId', { categoryId })
      .andWhere('wave.id = :waveId', { waveId })
      .getOne()
  }

  async createYields({
    offloads,
    byIdWaves,
    date,
    byBatchIdCategoryIdSubbatches,
    byIdStoreContainers,
  }: {
    offloads: Offload[]
    byIdWaves: Record<number, Wave>
    byBatchIdCategoryIdSubbatches: Record<number, Record<number, Subbatch>>
    byIdStoreContainers: Record<number, StoreContainer>
    date: string
  }) {
    const sortedOffloads = {}
    const yieldData = []

    offloads.forEach((offload) => {
      const categoryId = offload.category.id
      const waveId = offload.wave.id
      const varietyId = offload.variety.id
      const offloadId = offload.id

      if (!sortedOffloads[categoryId]) {
        sortedOffloads[categoryId] = {}
      }

      if (!sortedOffloads[categoryId]?.[waveId]) {
        sortedOffloads[categoryId][waveId] = {}
      }

      if (!sortedOffloads[categoryId]?.[waveId]?.[varietyId]) {
        sortedOffloads[categoryId][waveId][varietyId] = {}
      }

      sortedOffloads[categoryId][waveId][varietyId][offloadId] = offload
    })

    Object.keys(sortedOffloads).forEach((categoryId) => {
      return Object.keys(sortedOffloads[categoryId]).forEach((waveId) => {
        const batchId = byIdWaves[waveId].batch.id
        const compostWeight =
          byBatchIdCategoryIdSubbatches[batchId][categoryId].compostWeight

        return Object.keys(sortedOffloads[categoryId][waveId]).forEach(
          (varietyId) => {
            const yieldItem: {
              date: string
              category: object
              variety: object
              batch: object
              wave: object
              weight: number
              boxQuantity: number
              percent: number
            } = {
              date,
              category: { id: parseInt(categoryId) },
              variety: { id: parseInt(varietyId) },
              batch: { id: batchId },
              wave: { id: parseInt(waveId) },
              weight: 0,
              boxQuantity: 0,
              percent: 0,
            }

            Object.keys(sortedOffloads[categoryId][waveId][varietyId]).forEach(
              (offloadId) => {
                const {
                  weight,
                  amount,
                  storeContainer,
                }: {
                  weight: number
                  amount: number
                  storeContainer: StoreContainer
                } = sortedOffloads[categoryId][waveId][varietyId][offloadId]
                const multipleBoxWeight: number = amount * boxWeight
                const containerWeight: number =
                  byIdStoreContainers[storeContainer.id].weight
                const netWeight: number =
                  weight - multipleBoxWeight - containerWeight
                const percent: number = netWeight / compostWeight

                yieldItem.weight = Number.parseFloat(
                  (yieldItem.weight + netWeight).toFixed(3),
                )
                yieldItem.boxQuantity = yieldItem.boxQuantity + amount
                yieldItem.percent = Number.parseFloat(
                  (yieldItem.percent + percent).toFixed(5),
                )
              },
            )

            yieldData.push(yieldItem)
          },
        )
      })
    })

    const foundYields: Array<Nullable<Yield>> = await Promise.all(
      yieldData.map((yieldDataItem) => {
        return this.findYieldByOffloadParameters({
          date: yieldDataItem.date,
          categoryId: yieldDataItem.category.id,
          waveId: yieldDataItem.wave.id,
          varietyId: yieldDataItem.variety.id,
          batchId: yieldDataItem.batch.id,
        })
      }),
    )

    const newYields = await Promise.all(
      yieldData.map((yieldDataItem, index) => {
        const previousData: Yield = foundYields[index]
        let weight: number =
          yieldDataItem.weight + (previousData ? previousData.weight : 0)
        let boxQuantity: number = yieldDataItem.boxQuantity
        let percent: number = yieldDataItem.percent

        if (previousData) {
          weight += previousData.weight
          boxQuantity += previousData.boxQuantity
          percent += previousData.percent
        }

        return this.yieldRepository.create({
          ...(previousData || {}),
          date: yieldDataItem.date,
          category: yieldDataItem.category,
          variety: yieldDataItem.variety,
          batch: yieldDataItem.batch,
          wave: yieldDataItem.wave,
          weight,
          boxQuantity,
          percent,
        })
      }),
    )

    return Promise.all(
      newYields.map((yieldItem) => {
        return this.yieldRepository.save(yieldItem)
      }),
    )
  }
}
