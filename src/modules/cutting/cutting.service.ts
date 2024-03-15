import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate'
import { Repository } from 'typeorm'

import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Batch } from '@mush/modules/batch/batch.entity'
import { BatchService } from '@mush/modules/batch/batch.service'
import { Category } from '@mush/modules/category/category.entity'
import { CategoryService } from '@mush/modules/category/category.service'
import { User } from '@mush/modules/core-module/user/user.entity'
import { Shift } from '@mush/modules/shift/shift.entity'
import { ShiftService } from '@mush/modules/shift/shift.service'
import { Storage } from '@mush/modules/storage/storage.entity'
import { StorageService } from '@mush/modules/storage/storage.service'
import { Variety } from '@mush/modules/variety/variety.entity'
import { VarietyService } from '@mush/modules/variety/variety.service'
import { Wave } from '@mush/modules/wave/wave.entity'
import { WaveService } from '@mush/modules/wave/wave.service'

import { CError, formatDateToDateTime, pick } from '@mush/core/utils'

import { Cutting } from './cutting.entity'
import { CreateCuttingDto } from './dto'
import { cuttingPaginationConfig } from './pagination'

type CuttingGeneralDataType = {
  categoryId: number
  batchId: number
  waveId: number
  author: User
}

@Injectable()
export class CuttingService {
  constructor(
    @InjectRepository(Cutting)
    private cuttingRepository: Repository<Cutting>,
    private categoryService: CategoryService,
    private varietyService: VarietyService,
    private batchService: BatchService,
    private waveService: WaveService,
    private shiftService: ShiftService,
    private storageService: StorageService,
  ) {}

  findAll(query: PaginateQuery): Promise<Paginated<Cutting>> {
    return paginate(query, this.cuttingRepository, cuttingPaginationConfig)
  }

  async createCutting({
    categoryId,
    batchId,
    waveId,
    data,
    author,
  }: CuttingGeneralDataType & {
    data: CreateCuttingDto[]
  }): Promise<Cutting[]> {
    const byVarietyIdStorages = {}
    const byIdShifts = {}
    const byIdVarieties = {}
    const today = String(
      formatDateToDateTime({
        value: new Date(Date.now()),
      }),
    )
    const [category, batch, wave, foundTodayStorages]: [
      Category,
      Batch,
      Wave,
      object,
    ] = await Promise.all([
      this.categoryService.findCategoryById(categoryId),
      this.batchService.findBatchById(batchId),
      this.waveService.findWaveById(waveId),
      this.storageService.findAllTodayStoragesByWaveId(waveId),
    ])

    if (!category || !batch || !wave) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    data.forEach(({ shiftId, varietyId }) => {
      if (!byIdShifts[shiftId]) {
        byIdShifts[shiftId] = shiftId
      }

      if (!byIdVarieties[varietyId]) {
        byIdVarieties[varietyId] = varietyId
      }
    })

    const shifts: Shift[] = await Promise.all(
      Object.keys(byIdShifts).map((id) =>
        this.shiftService.findShiftById(Number(id)),
      ),
    )

    const varieties: Variety[] = await Promise.all(
      Object.keys(byIdVarieties).map((id) =>
        this.varietyService.findVarietyById(Number(id)),
      ),
    )

    shifts.forEach((shift) => {
      if (!shift) {
        throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
      }

      if (shift.dateTo) {
        throw new HttpException(CError.SHIFT_ENDED, HttpStatus.BAD_REQUEST)
      }

      byIdShifts[shift.id] = shift
    })

    varieties.forEach((variety) => {
      if (!variety) {
        throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
      }

      byIdVarieties[variety.id] = variety
    })

    const createdCuttings = await Promise.all(
      (data || []).map(({ boxQuantity, trip, varietyId, shiftId }) =>
        this.cuttingRepository.create({
          boxQuantity,
          trip,
          category,
          variety: byIdVarieties[varietyId],
          batch,
          wave,
          shift: byIdShifts[shiftId],
          author: pick(
            author,
            'id',
            'firstName',
            'lastName',
            'patronymic',
            'role',
            'position',
          ),
        }),
      ),
    )

    createdCuttings.forEach(({ variety, boxQuantity }) => {
      const previouslySavedItemId: number = foundTodayStorages?.[variety.id]?.id
      const previouslySavedValue: number =
        foundTodayStorages?.[variety.id]?.amount
      const previousValue: number = byVarietyIdStorages?.[variety.id]?.amount

      byVarietyIdStorages[variety.id] = {
        amount: boxQuantity + (previousValue || previouslySavedValue || 0),
        id: previouslySavedItemId || null,
      }
    })

    await Promise.all(
      Object.keys(byVarietyIdStorages).map((varietyId) => {
        const previouslySavedItemId = byVarietyIdStorages[varietyId].id
        const amount = byVarietyIdStorages[varietyId].amount

        if (previouslySavedItemId) {
          return this.storageService.updateStorage({
            id: previouslySavedItemId,
            amount,
          })
        }

        return this.storageService.createStorage({
          date: today,
          amount,
          waveId,
          varietyId: Number(varietyId),
          chamberId: batch.chamber.id,
        })
      }),
    )

    return Promise.all(
      createdCuttings.map((cutting) => {
        return this.cuttingRepository.save(cutting)
      }),
    )
  }
}
