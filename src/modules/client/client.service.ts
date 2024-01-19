import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate'
import { Repository } from 'typeorm'

import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Nullable } from '@mush/core/utils'

import { Client } from './client.entity'
import { CreateClientDto } from './dto/create.client.dto'
import { UpdateClientDto } from './dto/update.client.dto'
import { clientPaginationConfig } from './pagination'

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) {}

  findAll(query: PaginateQuery): Promise<Paginated<Client>> {
    return paginate(query, this.clientRepository, clientPaginationConfig)
  }

  findClientById(id: number): Promise<Nullable<Client>> {
    return this.clientRepository.findOneBy({ id })
  }

  findClientByPhone(phone: string): Promise<Nullable<Client>> {
    return this.clientRepository.findOneBy({ phone })
  }

  async createClient({
    firstName,
    lastName,
    phone,
  }: CreateClientDto): Promise<Client> {
    const foundClientByPhone = await this.findClientByPhone(phone)

    if (foundClientByPhone) {
      throw new HttpException(
        'A client with this phone already exists.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }

    const newClient: Client = this.clientRepository.create({
      firstName,
      lastName,
      phone,
    })

    return this.clientRepository.save(newClient)
  }

  async updateClient(
    id: number,
    { firstName, lastName, phone }: UpdateClientDto,
  ): Promise<Client> {
    const [foundClientById, foundClientByPhone]: Nullable<Client>[] =
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

    const updatedClient: Client = this.clientRepository.create({
      ...foundClientById,
      firstName,
      lastName,
      phone,
    })

    return this.clientRepository.save(updatedClient)
  }

  async removeClient(id: number): Promise<Boolean> {
    const foundClient: Nullable<Client> = await this.findClientById(id)

    if (!foundClient) {
      throw new HttpException(
        'A client with this id does not exist.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }

    try {
      await this.clientRepository.remove(foundClient)
      return true
    } catch (e) {
      return false
    }
  }

  async getClientById(id: number): Promise<Client> {
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
