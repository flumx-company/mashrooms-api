import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate'
import { Repository } from 'typeorm'

import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { CError, Nullable } from '@mush/core/utils'

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

  async createWork({ title, isRegular, price }: UpdateWorkDto): Promise<Work> {
    const foundWorkByTitle = await this.findWorkByTitle(title)

    if (foundWorkByTitle) {
      throw new HttpException(
        CError.TITLE_ALREADY_EXISTS,
        HttpStatus.BAD_REQUEST,
      )
    }

    const newWork: Work = this.workRepository.create({
      title,
      isRegular,
      price,
    })

    return this.workRepository.save(newWork)
  }

  async updateWork(
    id: number,
    { title, isRegular, price }: UpdateWorkDto,
  ): Promise<Work> {
    const [foundWorkById, foundWorkByTitle] = await Promise.all([
      this.findWorkById(id),
      this.findWorkByTitle(title),
    ])

    if (!foundWorkById) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    if (foundWorkByTitle && foundWorkByTitle.id !== id) {
      throw new HttpException(
        CError.TITLE_ALREADY_EXISTS,
        HttpStatus.BAD_REQUEST,
      )
    }

    const updatedWork: Work = this.workRepository.create({
      ...foundWorkById,
      title,
      isRegular,
      price,
    })

    return this.workRepository.save(updatedWork)
  }

  async removeWork(id: number): Promise<Boolean> {
    const foundWork: Nullable<Work> = await this.findWorkById(id)

    if (!foundWork) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    try {
      await this.workRepository.remove(foundWork)

      return true
    } catch (e) {
      return false
    }
  }
}
