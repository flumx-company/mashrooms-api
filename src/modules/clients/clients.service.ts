import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate'
import { Repository } from 'typeorm'

import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Nullable } from '@mush/core/utils'

import { ClientsEntity } from './clients.entity'
import { CreateClientDto } from './dto/create.client.dto'
import { UpdateClientDto } from './dto/update.client.dto'
import { clientsPaginationConfig } from './pagination'

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(ClientsEntity)
    private clientsRepository: Repository<ClientsEntity>,
  ) {}

  findAll(query: PaginateQuery): Promise<Paginated<ClientsEntity>> {
    return paginate(query, this.clientsRepository, clientsPaginationConfig)
  }

  findClientById(id: number): Promise<Nullable<ClientsEntity>> {
    return this.clientsRepository.findOneBy({ id })
  }

  findClientByPhone(phone: string): Promise<Nullable<ClientsEntity>> {
    return this.clientsRepository.findOneBy({ phone })
  }

  async createClient({
    firstName,
    lastName,
    phone,
  }: CreateClientDto): Promise<ClientsEntity> {
    const foundClientByPhone = await this.findClientByPhone(phone)

    if (foundClientByPhone) {
      throw new HttpException(
        'A client with this phone already exists.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }

    const newClient: ClientsEntity = this.clientsRepository.create({
      firstName,
      lastName,
      phone,
    })

    return this.clientsRepository.save(newClient)
  }

  async updateClient(
    id: number,
    { firstName, lastName, phone }: UpdateClientDto,
  ): Promise<ClientsEntity> {
    const [foundClientById, foundClientByPhone]: Nullable<ClientsEntity>[] =
      await Promise.all([
        this.findClientById(id),
        this.findClientByPhone(phone),
      ])

    if (!foundClientById) {
      throw new HttpException(
        'A client with this id does not exist.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }

    if (foundClientByPhone && foundClientByPhone.id !== id) {
      throw new HttpException(
        'There already exists a different client with this phone.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }

    const updatedClient: ClientsEntity = this.clientsRepository.create({
      ...foundClientById,
      firstName,
      lastName,
      phone,
    })

    return this.clientsRepository.save(updatedClient)
  }

  async removeClient(id: number): Promise<Boolean> {
    const foundClient: Nullable<ClientsEntity> = await this.findClientById(id)

    if (!foundClient) {
      throw new HttpException(
        'A client with this id does not exist.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }

    try {
      await this.clientsRepository.remove(foundClient)
      return true
    } catch (e) {
      return false
    }
  }

  async getClientById(id: number): Promise<ClientsEntity> {
    const foundClient = await this.findClientById(id)

    if (!foundClient) {
      throw new HttpException(
        'There is no client with this id.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }

    return foundClient
  }
}
