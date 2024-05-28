import { Repository } from 'typeorm'

import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { CategoryService } from '@mush/modules/category/category.service'

import { CError } from '@mush/core/utils'

import { CreateSubbatchDto, UpdateSubbatchDto } from './dto'
import { Subbatch } from './subbatch.entity'

@Injectable()
export class SubbatchService {
  constructor(
    @InjectRepository(Subbatch)
    private subbatchRepository: Repository<Subbatch>,
    private readonly categoryService: CategoryService,
  ) {}

  async createSubbatch({
    categoryId,
    compostSupplier,
    compostWeight,
    compostLoadDate,
    compostPrice,
    briquetteQuantity
  }: CreateSubbatchDto): Promise<Subbatch> {
    const category = await this.categoryService.findCategoryById(categoryId)

    if (!category) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    const newSubbatch = this.subbatchRepository.create({
      category,
      compostSupplier,
      compostWeight,
      compostLoadDate,
      compostPrice,
      briquetteQuantity
    })

    return this.subbatchRepository.save(newSubbatch)
  }

  async updateSubbatch({
    id,
    compostSupplier,
    compostWeight,
    compostLoadDate,
    compostPrice,

    briquetteQuantity
  }: UpdateSubbatchDto) {
    const subbatch = await this.categoryService.findCategoryById(id)

    if (!subbatch) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    const updatedSubbatch = this.subbatchRepository.create({
      ...subbatch,
      compostSupplier,
      compostWeight,
      compostLoadDate,
      compostPrice,
      briquetteQuantity
    })

    return this.subbatchRepository.save(updatedSubbatch)
  }
}
