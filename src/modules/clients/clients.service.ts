import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

import { Nullable } from '@mush/core/utils'

import { ClientsEntity } from './clients.entity'
import { CreateClientDto } from './dto/create.client.dto'
import { UpdateClientDto } from './dto/update.client.dto'

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(ClientsEntity)
    private clientsRepository: Repository<ClientsEntity>,
  ) {}

  findAll(): Promise<ClientsEntity[]> {
    return this.clientsRepository.find()
  }

  findClientById(id: number): Promise<Nullable<ClientsEntity>> {
    return this.clientsRepository.findOneBy({ id })
  }

  async createClient({
    firstName,
    lastName,
    phone,
  }: CreateClientDto): Promise<ClientsEntity> {
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
    const foundClient: Nullable<ClientsEntity> = await this.findClientById(id)

    if (!foundClient) {
      throw new HttpException(
        'A client with this id does not exist.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }

    const updatedClient: ClientsEntity = this.clientsRepository.create({
      ...foundClient,
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

    let response = true

    try {
      await this.clientsRepository.remove(foundClient)
    } catch (e) {
      response = false
    }

    return response
  }
}
