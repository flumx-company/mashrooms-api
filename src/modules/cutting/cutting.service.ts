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

  getGroupedByDay(date: string): Promise<Cutting[]> {
    return this.cuttingRepository
    .createQueryBuilder('cutting')
    .select(['batch.chamber', 'COUNT(*) as count', 'chamber', 'category'])
    .leftJoin('cutting.batch', 'batch')
    .leftJoin('cutting.category', 'category')
    .leftJoin('batch.chamber', 'chamber')
    .where('cutting.createdAt like :date', { date: `${date}%` })
    .groupBy('batch.chamber')
    .addGroupBy('category.id')
    .getRawMany();
  }

  
  findAll(date: string, chamber: string, category:string): Promise<Cutting[]> {
    return this.cuttingRepository
      .createQueryBuilder('cutting')
      .leftJoinAndSelect('cutting.batch', 'batch')
      .leftJoinAndSelect('cutting.wave', 'wave')
      .leftJoinAndSelect('cutting.variety', 'variety')
      .leftJoinAndSelect('cutting.category', 'category')
      .leftJoinAndSelect('cutting.cutterShift', 'cutterShift')
      .leftJoinAndSelect('cutterShift.employee', 'employeeCutter')
      .leftJoinAndSelect('cutting.loaderShift', 'loaderShift')
      .leftJoinAndSelect('loaderShift.employee', 'employeeLoader')
      .leftJoinAndSelect('batch.chamber', 'chamber')
      .where('cutting.createdAt like :date AND chamber.id = :chamber AND category.id = :category', { chamber, category , date: `${date}%`})
      .getMany();
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
      this.storageService.findAllTodayStoragesByWaveId({ waveId, categoryId }),
    ])

    if (!category || !batch || !wave) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    data.forEach(({ cutterShiftId, loaderShiftId, varietyId, boxQuantity }) => {
      if (
        boxQuantity > 99999 ||
        boxQuantity < 1 ||
        !Number.isInteger(boxQuantity)
      ) {
        throw new HttpException(
          CError.BOX_QUANTITY_EXCEEDS_LIMIT,
          HttpStatus.BAD_REQUEST,
        )
      }

      if (!byIdShifts[cutterShiftId]) {
        byIdShifts[cutterShiftId] = cutterShiftId
      }

      if (!byIdShifts[loaderShiftId]) {
        byIdShifts[loaderShiftId] = loaderShiftId
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
      (data || []).map(
        ({ boxQuantity, trip, varietyId, cutterShiftId, loaderShiftId }) =>
          this.cuttingRepository.create({
            boxQuantity,
            trip,
            category,
            variety: byIdVarieties[varietyId],
            batch,
            wave,
            cutterShift: byIdShifts[cutterShiftId],
            loaderShift: byIdShifts[loaderShiftId],
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
        const id = byVarietyIdStorages[varietyId].id
        const amount = byVarietyIdStorages[varietyId].amount

        if (id) {
          return this.storageService.updateStorage({
            id,
            amount,
          })
        }

        return this.storageService.createStorage({
          date: today,
          amount,
          waveId,
          varietyId: parseInt(varietyId),
          chamberId: batch.chamber.id,
          categoryId,
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
