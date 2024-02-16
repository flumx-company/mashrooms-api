import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate'
import { Repository } from 'typeorm'

import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Nullable } from '@mush/core/utils'

import { UpdateWorkDto } from './dto'
import { workPaginationConfig } from './pagination/work.pagination.config'
import { Work } from './work.entity'

@Injectable()
export class WorkService {
  constructor(
    @InjectRepository(Work)
    private workRepository: Repository<Work>,
  ) {}

  findAll(query: PaginateQuery): Promise<Paginated<Work>> {
    return paginate(query, this.workRepository, workPaginationConfig)
  }

  findWorkById(id: number): Promise<Nullable<Work>> {
    return this.workRepository.findOneBy({ id })
  }

  findWorkByTitle(title: string): Promise<Nullable<Work>> {
    return this.workRepository.findOneBy({ title })
  }

  async createWork({ title, isRegular, pay }: UpdateWorkDto): Promise<Work> {
    const foundWorkByTitle = await this.findWorkByTitle(title)

    if (foundWorkByTitle) {
      throw new HttpException(
        'There already exists a work title like this.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }

    const newWork: Work = this.workRepository.create({
      title,
      isRegular,
      pay,
    })

    return this.workRepository.save(newWork)
  }

  async updateWork(
    id: number,
    { title, isRegular, pay }: UpdateWorkDto,
  ): Promise<Work> {
    const [foundWorkById, foundWorkByTitle] = await Promise.all([
      this.findWorkById(id),
      this.findWorkByTitle(title),
    ])

    if (!foundWorkById) {
      throw new HttpException(
        'A work with this id does not exist.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }

    if (foundWorkByTitle && foundWorkByTitle.id !== id) {
      throw new HttpException(
        'There already exists a different work with this title.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }

    const updatedWork: Work = this.workRepository.create({
      ...foundWorkById,
      title,
      isRegular,
      pay,
    })

    return this.workRepository.save(updatedWork)
  }

  async removeWork(id: number): Promise<Boolean> {
    const foundWork: Nullable<Work> = await this.findWorkById(id)

    if (!foundWork) {
      throw new HttpException(
        'A work with this id does not exist.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }

    try {
      await this.workRepository.remove(foundWork)

      return true
    } catch (e) {
      return false
    }
  }
}
