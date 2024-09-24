import { Repository } from 'typeorm'

import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Batch } from '@mush/modules/batch/batch.entity'
import { BatchService } from '@mush/modules/batch/batch.service'
import { Category } from '@mush/modules/category/category.entity'
import { CategoryService } from '@mush/modules/category/category.service'
import { OffloadRecord } from '@mush/modules/offload-record/offload-record.entity'
import { StoreContainer } from '@mush/modules/store-container/store-container.entity'
import { Subbatch } from '@mush/modules/subbatch/subbatch.entity'
import { Wave } from '@mush/modules/wave/wave.entity'
import { WaveService } from '@mush/modules/wave/wave.service'

import { CError, Nullable } from '@mush/core/utils'

import { Yield } from './yield.entity'

@Injectable()
export class YieldService {
  constructor(
    @InjectRepository(Yield)
    private yieldRepository: Repository<Yield>,
    private readonly batchService: BatchService,
    private readonly categoryService: CategoryService,
    private readonly waveService: WaveService,
  ) {}

  async findAllByAllParameters({
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

  async findAllByWave({ waveId }: { waveId: number }): Promise<object> {
    const wave: Wave = await this.waveService.findWaveById(waveId)
    const response = {}

    if (!wave) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    const yields = await this.yieldRepository
      .createQueryBuilder('yield')
      .select()
      .leftJoinAndSelect('yield.category', 'category')
      .leftJoinAndSelect('yield.batch', 'batch')
      .leftJoinAndSelect('yield.variety', 'variety')
      .leftJoinAndSelect('yield.wave', 'wave')
      .where('wave.id = :waveId', { waveId })
      .getMany()

    yields.forEach(
      ({ category, date, variety, weight, boxQuantity, percent }) => {
        const dateString = `date_${date}`
        const categoryString = `category_ID_${category.id}_NAME_${category.name}`
        const varietyString = `variety_ID_${variety.id}_NAME_${variety.name}`
        const hasDate = response?.[dateString]
        const hasCategory = response?.[dateString]?.[categoryString]
        const hasVariety =
          response?.[dateString]?.[categoryString]?.[varietyString]
        const hasTotal = response?.[dateString]?.[categoryString]?.total

        if (!hasDate) {
          response[dateString] = {}
        }

        if (!hasCategory) {
          response[dateString][categoryString] = {}
        }

        if (!hasVariety) {
          response[dateString][categoryString][varietyString] = {
            weight,
            boxQuantity,
            percent,
          }
        }

        if (!hasTotal) {
          response[dateString][categoryString].total = {
            weight,
            boxQuantity,
            percent,
          }

          return
        }

        response[dateString][categoryString].total.weight += weight
        response[dateString][categoryString].total.boxQuantity += boxQuantity
        response[dateString][categoryString].total.percent += percent
      },
    )

    return response
  }

  async findAllByBatch({ batchId }: { batchId: number }) {
    const batch: Batch = await this.batchService.findBatchById(batchId)
    const response = { total: {} }

    if (!batch) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    const yields = await this.yieldRepository
      .createQueryBuilder('yield')
      .select()
      .leftJoinAndSelect('yield.category', 'category')
      .leftJoinAndSelect('yield.batch', 'batch')
      .leftJoinAndSelect('yield.variety', 'variety')
      .leftJoinAndSelect('yield.wave', 'wave')
      .where('batch.id = :batchId', { batchId })
      .getMany()

    yields.forEach(({ boxQuantity, category, percent, wave, weight }) => {
      const waveString = `wave_ID_${wave.id}_ORDER_${wave.order}`
      const categoryString = `category_ID_${category.id}_NAME_${category.name}`
      const hasWave = response[waveString]
      const hasWaveCategory = response[waveString]?.[categoryString]
      const hasTotalCategory = response.total[categoryString]

      if (!hasWave) {
        response[waveString] = {}
      }

      if (hasWaveCategory) {
        response[waveString][categoryString].boxQuantity += boxQuantity
        response[waveString][categoryString].percent += percent
        response[waveString][categoryString].weight += weight
      }

      if (!hasWaveCategory) {
        response[waveString][categoryString] = {
          boxQuantity,
          percent,
          weight,
        }
      }

      if (hasTotalCategory) {
        response.total[categoryString].boxQuantity += boxQuantity
        response.total[categoryString].percent += percent
        response.total[categoryString].weight += weight
        return
      }

      response.total[categoryString] = {
        boxQuantity,
        percent,
        weight,
      }
    })

    return response
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
    offloadRecords,
    byIdWaves,
    date,
    byBatchIdCategoryIdSubbatches,
  }: {
    offloadRecords: OffloadRecord[]
    byIdWaves: Record<number, Wave>
    byBatchIdCategoryIdSubbatches: Record<number, Record<number, Subbatch>>
    date: string
  }) {
    const sortedOffloadRecords = {}
    const yieldData = []

    offloadRecords.forEach((offloadRecord) => {
      const categoryId = offloadRecord.category.id
      const waveId = offloadRecord.wave.id
      const varietyId = offloadRecord.variety.id
      const offloadId = offloadRecord.id

      if (!sortedOffloadRecords[categoryId]) {
        sortedOffloadRecords[categoryId] = {}
      }

      if (!sortedOffloadRecords[categoryId]?.[waveId]) {
        sortedOffloadRecords[categoryId][waveId] = {}
      }

      if (!sortedOffloadRecords[categoryId]?.[waveId]?.[varietyId]) {
        sortedOffloadRecords[categoryId][waveId][varietyId] = {}
      }

      sortedOffloadRecords[categoryId][waveId][varietyId][offloadId] =
        offloadRecord
    })

    Object.keys(sortedOffloadRecords).forEach((categoryId) => {
      return Object.keys(sortedOffloadRecords[categoryId]).forEach((waveId) => {
        const batchId = byIdWaves[waveId].batch.id
        const compostWeight =
          byBatchIdCategoryIdSubbatches[batchId][categoryId].compostWeight

        return Object.keys(sortedOffloadRecords[categoryId][waveId]).forEach(
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

            Object.keys(
              sortedOffloadRecords[categoryId][waveId][varietyId],
            ).forEach((offloadId) => {
              const {
                netWeight,
                boxQuantity,
              }: {
                netWeight: number
                boxQuantity: number
              } = sortedOffloadRecords[categoryId][waveId][varietyId][offloadId]
              const percent: number = netWeight / compostWeight

              yieldItem.weight = Number.parseFloat(
                (yieldItem.weight + netWeight).toFixed(3),
              )
              yieldItem.boxQuantity = yieldItem.boxQuantity + boxQuantity
              yieldItem.percent = Number.parseFloat(
                (yieldItem.percent + percent).toFixed(5),
              )
            })

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
        let weight: number = yieldDataItem.weight
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
          percent: percent / 100,
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
