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

  async findAll(waveId?: number): Promise<object[]> {
    // Сначала получаем все сорта
    const allVarieties = await this.yieldRepository
      .createQueryBuilder('yield')
      .select(['variety.id', 'variety.name'])
      .leftJoin('yield.variety', 'variety')
      .groupBy('variety.id')
      .addGroupBy('variety.name')
      .getRawMany()

    const yieldsQuery = this.yieldRepository
      .createQueryBuilder('yield')
      .leftJoinAndSelect('yield.category', 'category')
      .leftJoinAndSelect('yield.variety', 'variety')
      .leftJoinAndSelect('yield.wave', 'wave')

    // Добавляем фильтр по waveId если передан
    if (waveId) {
      yieldsQuery.where('wave.id = :waveId', { waveId })
    }

    const yields = await yieldsQuery
      .orderBy('category.name', 'ASC')
      .addOrderBy('yield.date', 'ASC')
      .addOrderBy('variety.name', 'ASC')
      .getMany()

    // Группируем результаты по категориям и датам
    const groupedByCategory = {}
    
    yields.forEach((yieldData) => {

      const categoryId = yieldData.category.id
      const categoryName = yieldData.category.name
      const date = yieldData.date
      const varietyId = yieldData.variety.id
      const varietyName = yieldData.variety.name
      
      if (!groupedByCategory[categoryId]) {
        groupedByCategory[categoryId] = {
          category: {
            id: categoryId,
            name: categoryName,
            description: yieldData.category.description,
            createdAt: yieldData.category.createdAt,
            updatedAt: yieldData.category.updatedAt
          },
          dailyData: {}
        }
      }
      
      if (!groupedByCategory[categoryId].dailyData[date]) {
        groupedByCategory[categoryId].dailyData[date] = {
          date: date,
          varieties: {},
          totals: {
            weight: 0,
            boxQuantity: 0
          }
        }
      }
      
      // Добавляем данные по сорту
      groupedByCategory[categoryId].dailyData[date].varieties[varietyName] = {
        id: varietyId,
        weight: Number(yieldData.weight) || 0,
        boxQuantity: Number(yieldData.boxQuantity) || 0
      }
      
      // Суммируем в общие данные за день
      groupedByCategory[categoryId].dailyData[date].totals.weight += Number(yieldData.weight) || 0
      groupedByCategory[categoryId].dailyData[date].totals.boxQuantity += Number(yieldData.boxQuantity) || 0
    })

    // Преобразуем dailyData из объекта в массив и заполняем недостающие сорта
    Object.keys(groupedByCategory).forEach(categoryId => {
      const dailyDataArray = []
      Object.keys(groupedByCategory[categoryId].dailyData).forEach(date => {
        const dayData = groupedByCategory[categoryId].dailyData[date]
        
        // Добавляем все сорта, которых нет в этом дне
        allVarieties.forEach(variety => {
          if (!dayData.varieties[variety.variety_name]) {
            dayData.varieties[variety.variety_name] = {
              id: variety.variety_id,
              weight: 0,
              boxQuantity: 0
            }
          }
        })
        
        dayData.totals.weight = Math.round(dayData.totals.weight * 100) / 100
        dayData.totals.boxQuantity = Math.round(dayData.totals.boxQuantity)
        
        dailyDataArray.push(dayData)
      })
      groupedByCategory[categoryId].dailyData = dailyDataArray
    })

    return Object.values(groupedByCategory)
  }

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
    const yields = await this.yieldRepository
      .createQueryBuilder('yield')
      .select([
        'SUM(yield.weight) as weight',
        'SUM(yield.boxQuantity) as boxQuantity',
        'SUM(yield.percent) as percent',
        'category.id as category_id',
        'category.name as category_name',
        'category.description as category_description',
        'category.createdAt as category_createdAt',
        'category.updatedAt as category_updatedAt',
        'variety.id as variety_id',
        'variety.name as variety_name',
        'variety.isCutterPaid as variety_isCutterPaid',
        'variety.createdAt as variety_createdAt',
        'variety.updatedAt as variety_updatedAt',
        'wave.id as wave_id',
        'wave.order as wave_order',
        'wave.dateFrom as wave_dateFrom',
        'wave.dateTo as wave_dateTo',
        'batch.id as batch_id',
        'batch.chamber as batch_chamber',
        'batch.createdAt as batch_createdAt',
        'batch.updatedAt as batch_updatedAt',
      ])
      .leftJoin('yield.category', 'category')
      .leftJoin('yield.batch', 'batch')
      .leftJoin('yield.variety', 'variety')
      .leftJoin('yield.wave', 'wave')
      .where('wave.id = :waveId', { waveId })
      .groupBy('wave.id')
      .addGroupBy('wave.order')
      .addGroupBy('wave.dateFrom')
      .addGroupBy('wave.dateTo')
      .addGroupBy('category.id')
      .addGroupBy('variety.id')
      .addGroupBy('batch.id')
      .getRawMany()

    return yields
  }

  async findAllByWaveAndDate({ waveId, date }: { waveId: number; date: string }): Promise<object> {
    const yields = await this.yieldRepository
      .createQueryBuilder('yield')
      .select([
        'SUM(yield.weight) as weight',
        'SUM(yield.boxQuantity) as boxQuantity',
        'SUM(yield.percent) as percent',
        'category.id as category_id',
        'category.name as category_name',
        'category.description as category_description',
        'category.createdAt as category_createdAt',
        'category.updatedAt as category_updatedAt',
        'variety.id as variety_id',
        'variety.name as variety_name',
        'variety.isCutterPaid as variety_isCutterPaid',
        'variety.createdAt as variety_createdAt',
        'variety.updatedAt as variety_updatedAt',
        'wave.id as wave_id',
        'wave.order as wave_order',
        'wave.dateFrom as wave_dateFrom',
        'wave.dateTo as wave_dateTo',
        'batch.id as batch_id',
        'batch.chamber as batch_chamber',
        'batch.createdAt as batch_createdAt',
        'batch.updatedAt as batch_updatedAt',
      ])
      .leftJoin('yield.category', 'category')
      .leftJoin('yield.batch', 'batch')
      .leftJoin('yield.variety', 'variety')
      .leftJoin('yield.wave', 'wave')
      .where('wave.id = :waveId', { waveId })
      .andWhere("DATE_FORMAT(wave.dateFrom, '%Y-%m-%d') = :date", { date })
      .groupBy('wave.id')
      .addGroupBy('wave.order')
      .addGroupBy('wave.dateFrom')
      .addGroupBy('wave.dateTo')
      .addGroupBy('category.id')
      .addGroupBy('variety.id')
      .addGroupBy('batch.id')
      .getRawMany()

    return yields
  }

  async findAllByBatch({ batchId }: { batchId: number }) {
    const yields = await this.yieldRepository
      .createQueryBuilder('yield')
      .select(['batch.chamber','batch.id', 'SUM(yield.weight) as weight','SUM(yield.boxQuantity) as boxQuantity', 'SUM(yield.percent) as percent', 'category', 'variety', 'wave.order'])
      .leftJoin('yield.category', 'category')
      .leftJoin('yield.batch', 'batch')
      .leftJoin('yield.variety', 'variety')
      .leftJoin('yield.wave', 'wave')
      .where('batch.id = :batchId', { batchId })
      .groupBy('wave.order')
      .addGroupBy('category.id')
      .addGroupBy('variety.id')
      .getRawMany()

    // yields.forEach(({ boxQuantity, category, percent, wave, weight }) => {
    //   const waveString = `wave_ID_${wave.id}_ORDER_${wave.order}`
    //   const categoryString = `category_ID_${category.id}_NAME_${category.name}`
    //   const hasWave = response[waveString]
    //   const hasWaveCategory = response[waveString]?.[categoryString]
    //   const hasTotalCategory = response.total[categoryString]
    //
    //   if (!hasWave) {
    //     response[waveString] = {}
    //   }
    //
    //   if (hasWaveCategory) {
    //     response[waveString][categoryString].boxQuantity += boxQuantity
    //     response[waveString][categoryString].percent += percent
    //     response[waveString][categoryString].weight += weight
    //   }
    //
    //   if (!hasWaveCategory) {
    //     response[waveString][categoryString] = {
    //       boxQuantity,
    //       percent,
    //       weight,
    //     }
    //   }
    //
    //   if (hasTotalCategory) {
    //     response.total[categoryString].boxQuantity += boxQuantity
    //     response.total[categoryString].percent += percent
    //     response.total[categoryString].weight += weight
    //     return
    //   }
    //
    //   response.total[categoryString] = {
    //     boxQuantity,
    //     percent,
    //     weight,
    //   }
    // })

    return yields
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
    byBatchIdCategoryIdSubbatches,
  }: {
    offloadRecords: OffloadRecord[]
    byIdWaves: Record<number, Wave>
    byBatchIdCategoryIdSubbatches: Record<number, Record<number, Subbatch>>
    date: string
  }) {
    const sortedOffloadRecords = {}
    const yieldData = []

    // Группируем по category -> wave -> variety -> date -> offloadId
    offloadRecords.forEach((offloadRecord) => {
      const categoryId = offloadRecord.category.id
      const waveId = offloadRecord.wave.id
      const varietyId = offloadRecord.variety.id
      const offloadId = offloadRecord.id
      const dateKey = String(offloadRecord.cuttingDate).slice(0, 10)

      if (!sortedOffloadRecords[categoryId]) {
        sortedOffloadRecords[categoryId] = {}
      }

      if (!sortedOffloadRecords[categoryId]?.[waveId]) {
        sortedOffloadRecords[categoryId][waveId] = {}
      }

      if (!sortedOffloadRecords[categoryId]?.[waveId]?.[varietyId]) {
        sortedOffloadRecords[categoryId][waveId][varietyId] = {}
      }

      if (!sortedOffloadRecords[categoryId][waveId][varietyId]?.[dateKey]) {
        sortedOffloadRecords[categoryId][waveId][varietyId][dateKey] = {}
      }

      sortedOffloadRecords[categoryId][waveId][varietyId][dateKey][offloadId] =
        offloadRecord
    })

    Object.keys(sortedOffloadRecords).forEach((categoryId) => {
      return Object.keys(sortedOffloadRecords[categoryId]).forEach((waveId) => {
        const batchId = byIdWaves[waveId].batch.id
        const compostWeightRaw =
          byBatchIdCategoryIdSubbatches?.[batchId]?.[categoryId]?.compostWeight
        const compostWeight = Number(compostWeightRaw)

        return Object.keys(sortedOffloadRecords[categoryId][waveId]).forEach(
          (varietyId) => {
            const byDate = sortedOffloadRecords[categoryId][waveId][varietyId]
            Object.keys(byDate).forEach((dateKey) => {
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
                date: dateKey,
                category: { id: parseInt(categoryId) },
                variety: { id: parseInt(varietyId) },
                batch: { id: batchId },
                wave: { id: parseInt(waveId) },
                weight: 0,
                boxQuantity: 0,
                percent: 0,
              }

              Object.keys(byDate[dateKey]).forEach((offloadId) => {
                const data = byDate[dateKey][offloadId]
                const netWeight = Number(data.netWeight ?? data.weight ?? 0)
                const boxQuantity = Number(data.boxQuantity ?? 0)
                const storeContainerWeight = Number(data.storeContainer?.weight ?? 0)
                const weight = netWeight - (boxQuantity * 0.4) - storeContainerWeight
                const percent: number =
                  Number.isFinite(compostWeight) && compostWeight > 0
                    ? weight / compostWeight
                    : 0

                yieldItem.weight = Number.parseFloat(
                  (yieldItem.weight + (Number.isFinite(weight) ? weight : 0)).toFixed(3),
                )
                yieldItem.boxQuantity = yieldItem.boxQuantity + boxQuantity
                yieldItem.percent = Number.parseFloat(
                  (Number(yieldItem.percent) + (Number.isFinite(percent) ? percent : 0)).toFixed(5),
                )
              })

              yieldData.push(yieldItem)
            })
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
          weight += Number(previousData.weight)
          boxQuantity += Number(previousData.boxQuantity)
          percent += Number(previousData.percent)
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
          percent: percent,
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
