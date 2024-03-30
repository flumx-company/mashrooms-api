import { Repository } from 'typeorm'

import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { CError, Nullable } from '@mush/core/utils'

import { Category } from './category.entity'

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  findAll(): Promise<Category[]> {
    return this.categoryRepository.find()
  }

  findCategoryById(id: number): Promise<Nullable<Category>> {
    return this.categoryRepository.findOneBy({ id })
  }

  findCategoryByIdWithRelations(id: number): Promise<Nullable<Category>> {
    return this.categoryRepository.findOne({
      where: { id },
      relations: [
        'offloadRecords',
        'yields',
        'cuttings',
        'subbatches',
        'storages',
      ],
    })
  }

  findCategoryByName(name: string): Promise<Nullable<Category>> {
    return this.categoryRepository.findOneBy({ name })
  }

  async createCategory({
    name,
    description,
  }: {
    name: string
    description: string
  }): Promise<Category> {
    const foundCategoryByName = await this.findCategoryByName(name)

    if (foundCategoryByName) {
      throw new HttpException(
        CError.NAME_ALREADY_EXISTS,
        HttpStatus.BAD_REQUEST,
      )
    }

    const newCategory: Category = await this.categoryRepository.create({
      name,
      description,
    })

    return this.categoryRepository.save(newCategory)
  }

  async updateCategory(
    id: number,
    {
      name,
      description,
    }: {
      name: string
      description: string
    },
  ): Promise<Category> {
    const [foundCategoryById, foundCategoryByName]: Nullable<Category>[] =
      await Promise.all([
        this.findCategoryById(id),
        this.findCategoryByName(name),
      ])

    if (!foundCategoryById) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    if (foundCategoryByName && foundCategoryByName.id !== id) {
      throw new HttpException(
        CError.NAME_ALREADY_EXISTS,
        HttpStatus.BAD_REQUEST,
      )
    }

    const updatedCategory: Category = await this.categoryRepository.create({
      ...foundCategoryById,
      name,
      ...(description ? { description } : {}),
    })

    return this.categoryRepository.save(updatedCategory)
  }

  async removeCategory(id: number): Promise<Boolean> {
    const foundCategory: Nullable<Category> =
      await this.findCategoryByIdWithRelations(id)

    if (!foundCategory) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    const { offloadRecords, yields, cuttings, subbatches, storages } =
      foundCategory

    if (
      offloadRecords.length ||
      yields.length ||
      cuttings.length ||
      subbatches.length ||
      storages.length
    ) {
      throw new HttpException(
        CError.ENTITY_HAS_DEPENDENT_RELATIONS,
        HttpStatus.BAD_REQUEST,
      )
    }

    try {
      await this.categoryRepository.remove(foundCategory)
      return true
    } catch (e) {
      return false
    }
  }
}
