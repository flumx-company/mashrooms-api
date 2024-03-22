import { Repository } from 'typeorm'

import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Offload } from '@mush/modules/offload/offload.entity'
import { StoreContainer } from '@mush/modules/store-container/store-container.entity'
import { Subbatch } from '@mush/modules/subbatch/subbatch.entity'
import { Wave } from '@mush/modules/wave/wave.entity'

import { Nullable } from '@mush/core/utils'

import { Yield } from './yield.entity'

const boxWeight = 0.4

@Injectable()
export class YieldService {
  constructor(
    @InjectRepository(Yield)
    private yieldRepository: Repository<Yield>,
  ) {}

  findYieldByOffloadParameters({
    date,
    categoryId,
    batchId,
    varietyId,
    waveId,
  }: {
    date: string
    categoryId: number
    batchId: number
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
      .andWhere('category.id = :categoryId', { categoryId })
      .andWhere('batch.id = :batchId', { batchId })
      .andWhere('variety.id = :varietyId', { varietyId })
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
        const previousData = foundYields[index]
        let weight =
          yieldDataItem.weight + (previousData ? previousData.weight : 0)
        let boxQuantity = yieldDataItem.boxQuantity
        let percent = yieldDataItem.percent

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
