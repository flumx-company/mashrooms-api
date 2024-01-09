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
    const [foundClientById, foundClientByPhone] = await Promise.all([
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

    let response = true

    try {
      await this.clientsRepository.remove(foundClient)
    } catch (e) {
      response = false
    }

    return response
  }
}
