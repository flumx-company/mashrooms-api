import { Repository } from 'typeorm'

import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { CError, pick } from '@mush/core/utils'

import { Batch } from '../batch/batch.entity'
import { BatchService } from '../batch/batch.service'
import { Category } from '../category/category.entity'
import { CategoryService } from '../category/category.service'
import { User } from '../core-module/user/user.entity'
import { Shift } from '../shift/shift.entity'
import { ShiftService } from '../shift/shift.service'
import { Variety } from '../variety/variety.entity'
import { VarietyService } from '../variety/variety.service'
import { Wave } from '../wave/wave.entity'
import { WaveService } from '../wave/wave.service'
import { Cutting } from './cutting.entity'
import { CreateCuttingDto } from './dto'

type CuttingGeneralDataType = {
  categoryId: number
  varietyId: number
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
  ) {}

  findAll(): Promise<Cutting[]> {
    return this.cuttingRepository.find()
  }

  async createCutting({
    categoryId,
    varietyId,
    batchId,
    waveId,
    data,
    author,
  }: CuttingGeneralDataType & {
    data: CreateCuttingDto[]
  }): Promise<Cutting[]> {
    const [category, variety, batch, wave]: [Category, Variety, Batch, Wave] =
      await Promise.all([
        this.categoryService.findCategoryById(categoryId),
        this.varietyService.findVarietyById(varietyId),
        this.batchService.findBatchById(batchId),
        this.waveService.findWaveById(waveId),
      ])

    if (!category || !variety || !batch || !wave) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    const shifts: Shift[] = await Promise.all(
      (data || []).map(({ shiftId }) =>
        this.shiftService.findShiftById(shiftId),
      ),
    )

    shifts.forEach((shift) => {
      if (!shift) {
        throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
      }

      if (shift.dateTo) {
        throw new HttpException(CError.SHIFT_ENDED, HttpStatus.BAD_REQUEST)
      }
    })

    const createdCuttings = await Promise.all(
      (data || []).map(({ boxQuantity, trip }, index) =>
        this.cuttingRepository.create({
          boxQuantity,
          trip,
          category,
          variety,
          batch,
          wave,
          shift: shifts[index],
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

    return Promise.all(
      createdCuttings.map((cutting) => {
        return this.cuttingRepository.save(cutting)
      }),
    )
  }
}
