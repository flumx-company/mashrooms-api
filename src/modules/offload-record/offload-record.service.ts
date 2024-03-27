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
      query,
      this.offloadRecordRepository,
      offloadRecordPaginationConfig,
    )
  }

  findAllByDate(date: string) {
    return this.offloadRecordRepository
      .createQueryBuilder('offload-record')
      .select()
      .leftJoinAndSelect('offload-record.batch', 'batch')
      .leftJoinAndSelect('offload-record.category', 'category')
      .leftJoinAndSelect('offload-record.variety', 'variety')
      .leftJoinAndSelect('offload-record.wave', 'wave')
      .leftJoinAndSelect('offload-record.storeContainer', 'storeContainer')
      .where('offload-record.createdAt like :date', { date: `${date}%` })
      .getMany()
  }

  async createOffloadRecord({
    batch,
    boxQuantity,
    category,
    cuttingDate,
    offload,
    priceId,
    pricePerBox,
    storeContainer,
    wave,
    weight,
    variety,
  }: {
    batch: Partial<Batch>
    boxQuantity: number
    category: Partial<Category>
    cuttingDate: Date
    offload: Partial<Offload>
    priceId: number
    pricePerBox: number
    storeContainer: Partial<StoreContainer>
    wave: Partial<Wave>
    weight: number
    variety: Partial<Variety>
  }): Promise<OffloadRecord> {
    const newOffloadRecord: OffloadRecord = this.offloadRecordRepository.create(
      {
        batch,
        boxQuantity,
        category,
        cuttingDate,
        offload,
        priceId,
        pricePerBox,
        storeContainer,
        wave,
        weight,
        variety,
      },
    )

    return this.offloadRecordRepository.save(newOffloadRecord)
  }
}
