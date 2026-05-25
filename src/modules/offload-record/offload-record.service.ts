import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate'
import { Repository } from 'typeorm'

import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Batch } from '../batch/batch.entity'
import { Category } from '../category/category.entity'
import { Offload } from '../offload/offload.entity'
import { StoreContainer } from '../store-container/store-container.entity'
import { Variety } from '../variety/variety.entity'
import { Wave } from '../wave/wave.entity'
import {
  getCreatedAtUtcBoundsForCalendarDate,
  normalizeJournalDateParam,
  transformPaginateOperationalDayCreatedAtFilter,
} from '@mush/core/utils'

import { OffloadRecord } from './offload-record.entity'
import { offloadRecordPaginationConfig } from './pagination'

@Injectable()
export class OffloadRecordService {
  constructor(
    @InjectRepository(OffloadRecord)
    private offloadRecordRepository: Repository<OffloadRecord>,
  ) {}

  findAll(query: PaginateQuery): Promise<Paginated<OffloadRecord>> {
    return paginate(
      transformPaginateOperationalDayCreatedAtFilter(query),
      this.offloadRecordRepository,
      offloadRecordPaginationConfig,
    )
  }

  async updateList(records: OffloadRecord[]): Promise<OffloadRecord[]> {
    return Promise.all(records.map(i => {
      return this.offloadRecordRepository.save(this.offloadRecordRepository.create(i))
    }))
  }
  findByPrices(ids: any): Promise<OffloadRecord[]> {
    return this.offloadRecordRepository
      .createQueryBuilder('offloadRecord')
      .where('offloadRecord.priceId IN (:...ids)', { ids })
      .getMany();
  }

  findAllByDate(date: string) {
    const ymd = normalizeJournalDateParam(date)
    const { startUtc, endUtc } = getCreatedAtUtcBoundsForCalendarDate(ymd)

    return this.offloadRecordRepository
      .createQueryBuilder('offload-record')
      .select()
      .leftJoinAndSelect('offload-record.batch', 'batch')
      .leftJoinAndSelect('offload-record.category', 'category')
      .leftJoinAndSelect('offload-record.variety', 'variety')
      .leftJoinAndSelect('offload-record.wave', 'wave')
      .leftJoinAndSelect('offload-record.storeContainer', 'storeContainer')
      .where('offload-record.createdAt >= :startUtc', { startUtc })
      .andWhere('offload-record.createdAt < :endUtc', { endUtc })
      .getMany()
  }

  async createOffloadRecord({
    batch,
    boxQuantity,
    category,
    cuttingDate,
    offload,
    priceId,
    pricePerKg,
    storeContainer,
    wave,
    weight,
    variety,
    recordName
  }: {
    batch: Partial<Batch>
    boxQuantity: number
    category: Partial<Category>
    cuttingDate: Date
    offload: Partial<Offload>
    priceId: number
    pricePerKg: number
    storeContainer: Partial<StoreContainer>
    wave: Partial<Wave>
    weight: number
    variety: Partial<Variety>
    recordName: Partial<string>
  }): Promise<OffloadRecord> {
    const newOffloadRecord: OffloadRecord = this.offloadRecordRepository.create(
      {
        batch,
        boxQuantity,
        category,
        cuttingDate,
        offload,
        priceId,
        pricePerKg,
        storeContainer,
        wave,
        weight,
        variety,
        recordName
      },
    )

    return this.offloadRecordRepository.save(newOffloadRecord)
  }
}
