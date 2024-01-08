import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate'

import { UsersEntity } from '@mush/users/users.entity'

import { Nullable } from '@mush/utils'

import { OffloadsEntity } from './offloads.entity'
import { offloadsPaginationConfig } from './pagination/index'

@Injectable()
export class OffloadsService {
  constructor(
    @InjectRepository(OffloadsEntity)
    private offloadsRepository: Repository<OffloadsEntity>,
  ) {}

  findAll(query: PaginateQuery): Promise<Paginated<OffloadsEntity>> {
    return paginate(query, this.offloadsRepository, offloadsPaginationConfig)
  }

  findOffloadById(id: number): Promise<Nullable<OffloadsEntity>> {
    return this.offloadsRepository.findOneBy({ id })
  }

  findAllByUserId(
    userId: number,
    query: PaginateQuery,
  ): Promise<Paginated<OffloadsEntity>> {
    const _config = {
      ...offloadsPaginationConfig,
      where: {
        user: {
          id: userId,
        },
      },
    }

    return paginate(query, this.offloadsRepository, _config)
  }

  async createOffload({
    user,
  }: {
    user: UsersEntity
  }): Promise<OffloadsEntity> {
    const newOffload: OffloadsEntity = await this.offloadsRepository.create()
    newOffload.user = user

    return this.offloadsRepository.save(newOffload)
  }

  async removeOffload(id: number): Promise<Boolean> {
    const foundOffload: Nullable<OffloadsEntity> =
      await this.findOffloadById(id)

    if (!foundOffload) {
      throw new HttpException(
        'An offload with this id does not exist.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }

    try {
      await this.offloadsRepository.remove(foundOffload)
      return true
    } catch (e) {
      return false
    }
  }
}
