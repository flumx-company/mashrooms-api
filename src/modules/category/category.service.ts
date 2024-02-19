import { Repository } from 'typeorm'

import { HttpException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { EError } from '@mush/core/enums'
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
        CError[EError.NAME_ALREADY_EXISTS],
        EError.NAME_ALREADY_EXISTS,
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
      throw new HttpException(CError[EError.NOT_FOUND_ID], EError.NOT_FOUND_ID)
    }

    if (foundCategoryByName && foundCategoryByName.id !== id) {
      throw new HttpException(
        CError[EError.NAME_ALREADY_EXISTS],
        EError.NAME_ALREADY_EXISTS,
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
    const foundCategory: Nullable<Category> = await this.findCategoryById(id)

    if (!foundCategory) {
      throw new HttpException(CError[EError.NOT_FOUND_ID], EError.NOT_FOUND_ID)
    }

    try {
      await this.categoryRepository.remove(foundCategory)
      return true
    } catch (e) {
      return false
    }
  }
}
