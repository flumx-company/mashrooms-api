import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate'
import { Repository } from 'typeorm'

import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Batch } from '@mush/modules/batch/batch.entity'
import { BatchService } from '@mush/modules/batch/batch.service'
import { Shift } from '@mush/modules/shift/shift.entity'
import { ShiftService } from '@mush/modules/shift/shift.service'

import { CError, Nullable, formatDateToDateTime, pick } from '@mush/core/utils'

import { CreateWateringDto } from './dto'
import { wateringPaginationConfig } from './pagination'
import { Watering } from './watering.entity'

@Injectable()
export class WateringService {
  constructor(
    @InjectRepository(Watering)
    private wateringRepository: Repository<Watering>,
    private readonly shiftService: ShiftService,
    private readonly batchService: BatchService,
  ) {}

  findAll(query: PaginateQuery): Promise<Paginated<Watering>> {
    return paginate(query, this.wateringRepository, wateringPaginationConfig)
  }

  async findWateringById(id: number): Promise<Nullable<Watering>> {
    const foundWatering = await this.wateringRepository.findOneBy({ id })

    if (!foundWatering) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    return foundWatering
  }

  async createWatering({
    volume,
    dateTimeFrom,
    dateTimeTo,
    target,
    drug,
    shiftId,
    batchId,
  }: CreateWateringDto & { shiftId: number; batchId: number }) {
    const [foundShift, foundBatch]: [Nullable<Shift>, Nullable<Batch>] =
      await Promise.all([
        this.shiftService.findShiftById(shiftId),
        this.batchService.findBatchById(batchId),
      ])

    if (!foundShift || !foundBatch) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    if (foundShift.dateTo) {
      throw new HttpException(CError.SHIFT_ENDED, HttpStatus.BAD_REQUEST)
    }

    if (foundBatch.dateTo) {
      throw new HttpException(CError.BATCH_ENDED, HttpStatus.BAD_REQUEST)
    }

    const updatedDateTimeFrom = formatDateToDateTime({
      value: new Date(dateTimeFrom),
      dateFrom: true,
      withTime: true,
      providesHours: true,
      providesMinutes: true,
    })
    const updatedDateTimeTo = formatDateToDateTime({
      value: new Date(dateTimeTo),
      dateFrom: true,
      withTime: true,
      providesHours: true,
      providesMinutes: true,
    })

    const newWatering: Watering = this.wateringRepository.create({
      volume,
      dateTimeFrom: updatedDateTimeFrom,
      dateTimeTo: updatedDateTimeTo,
      target,
      drug,
      shift: pick(foundShift, 'id'),
      batch: pick(foundBatch, 'id'),
    })

    return this.wateringRepository.save(newWatering)
  }

  async removeWatering(id: number) {
    const foundWatering = await this.findWateringById(id)

    try {
      this.wateringRepository.remove(foundWatering)
      return true
    } catch (e) {
      return false
    }
  }
}
