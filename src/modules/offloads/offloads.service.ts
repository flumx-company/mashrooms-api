import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate'

import { UsersEntity } from '@mush/modules/core-module/users/users.entity'
import { ClientsService } from '@mush/modules/clients/clients.service'
import { ClientsEntity } from '@mush/modules/clients/clients.entity'

import { Nullable } from '@mush/core/utils'

import { OffloadsEntity } from './offloads.entity'
import { offloadsPaginationConfig } from './pagination/index'
import { CreateOffloadDto } from './dto'

@Injectable()
export class OffloadsService {
  constructor(
    @InjectRepository(OffloadsEntity)
    private offloadsRepository: Repository<OffloadsEntity>,
    private readonly clientsService: ClientsService,
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
    const config = {
      ...offloadsPaginationConfig,
      where: {
        user: {
          id: userId,
        },
      },
    }

    return paginate(query, this.offloadsRepository, config)
  }

  findAllByClientId(
    clientId: number,
    query: PaginateQuery,
  ): Promise<Paginated<OffloadsEntity>> {
    const config = {
      ...offloadsPaginationConfig,
      where: {
        client: {
          id: clientId,
        },
      },
    }

    return paginate(query, this.offloadsRepository, config)
  }

  async createOffload({
    user,
    data,
  }: {
    user: UsersEntity
    data: CreateOffloadDto
  }): Promise<OffloadsEntity> {
    const { clientId } = data

    const client: Nullable<ClientsEntity> =
      await this.clientsService.findClientById(clientId)

    if (!client) {
      throw new HttpException(
        'A client with this id does not exist.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }

    const newOffload: OffloadsEntity = await this.offloadsRepository.create()
    newOffload.user = user
    newOffload.client = client

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
