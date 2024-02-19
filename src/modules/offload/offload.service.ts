import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate'
import { Repository } from 'typeorm'

import { HttpException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Client } from '@mush/modules/client/client.entity'
import { ClientService } from '@mush/modules/client/client.service'
import { User } from '@mush/modules/core-module/user/user.entity'

import { EError } from '@mush/core/enums'
import { CError, Nullable } from '@mush/core/utils'

import { CreateOffloadDto } from './dto'
import { Offload } from './offload.entity'
import { offloadPaginationConfig } from './pagination/index'

@Injectable()
export class OffloadService {
  constructor(
    @InjectRepository(Offload)
    private offloadRepository: Repository<Offload>,
    private readonly clientService: ClientService,
  ) {}

  findAll(query: PaginateQuery): Promise<Paginated<Offload>> {
    return paginate(query, this.offloadRepository, offloadPaginationConfig)
  }

  findOffloadById(id: number): Promise<Nullable<Offload>> {
    return this.offloadRepository.findOneBy({ id })
  }

  findAllByUserId(
    userId: number,
    query: PaginateQuery,
  ): Promise<Paginated<Offload>> {
    const config = {
      ...offloadPaginationConfig,
      where: {
        users: {
          id: userId,
        },
      },
    }

    return paginate(query, this.offloadRepository, config)
  }

  findAllByClientId(
    clientId: number,
    query: PaginateQuery,
  ): Promise<Paginated<Offload>> {
    const config = {
      ...offloadPaginationConfig,
      where: {
        clients: {
          id: clientId,
        },
      },
    }

    return paginate(query, this.offloadRepository, config)
  }

  async createOffload({
    user,
    data,
  }: {
    user: User
    data: CreateOffloadDto
  }): Promise<Offload> {
    const { clientId } = data

    const client: Nullable<Client> = await this.clientService.findClientById(
      clientId,
    )

    if (!client) {
      throw new HttpException(CError[EError.NOT_FOUND_ID], EError.NOT_FOUND_ID)
    }

    const newOffload: Offload = await this.offloadRepository.create()
    newOffload.users = [user]
    newOffload.clients = [client]

    return this.offloadRepository.save(newOffload)
  }

  async removeOffload(id: number): Promise<Boolean> {
    const foundOffload: Nullable<Offload> = await this.findOffloadById(id)

    if (!foundOffload) {
      throw new HttpException(CError[EError.NOT_FOUND_ID], EError.NOT_FOUND_ID)
    }

    try {
      await this.offloadRepository.remove(foundOffload)
      return true
    } catch (e) {
      return false
    }
  }
}
