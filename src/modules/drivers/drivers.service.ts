import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

import { Nullable } from '@mush/core/utils'

import { DriversEntity } from './drivers.entity'
import { CreateDriverDto } from './dto/create.driver.dto'
import { UpdateDriverDto } from './dto/update.driver.dto'

@Injectable()
export class DriversService {
  constructor(
    @InjectRepository(DriversEntity)
    private driversRepository: Repository<DriversEntity>,
  ) {}

  findAll(): Promise<DriversEntity[]> {
    return this.driversRepository.find()
  }

  findDriverById(id: number): Promise<Nullable<DriversEntity>> {
    return this.driversRepository.findOneBy({ id })
  }

  findDriverByPhone(phone: string): Promise<Nullable<DriversEntity>> {
    return this.driversRepository.findOneBy({ phone })
  }

  async createDriver({
    firstName,
    lastName,
    phone,
  }: CreateDriverDto): Promise<DriversEntity> {
    const foundDriverByPhone = await this.findDriverByPhone(phone)

    if (foundDriverByPhone) {
      throw new HttpException(
        'A driver with this phone already exists.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }

    const newDriver: DriversEntity = this.driversRepository.create({
      firstName,
      lastName,
      phone,
    })

    return this.driversRepository.save(newDriver)
  }

  async updateDriver(
    id: number,
    { firstName, lastName, phone }: UpdateDriverDto,
  ): Promise<DriversEntity> {
    const [foundDriverById, foundDriverByPhone] = await Promise.all([
      this.findDriverById(id),
      this.findDriverByPhone(phone),
    ])

    if (!foundDriverById) {
      throw new HttpException(
        'A driver with this id does not exist.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }

    if (foundDriverByPhone && foundDriverByPhone.id !== id) {
      throw new HttpException(
        'There already exists a different driver with this phone.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }

    const updatedDriver: DriversEntity = this.driversRepository.create({
      ...foundDriverById,
      firstName,
      lastName,
      phone,
    })

    return this.driversRepository.save(updatedDriver)
  }

  async removeDriver(id: number): Promise<Boolean> {
    const foundDriver: Nullable<DriversEntity> = await this.findDriverById(id)

    if (!foundDriver) {
      throw new HttpException(
        'A driver with this id does not exist.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }

    let response = true

    try {
      await this.driversRepository.remove(foundDriver)
    } catch (e) {
      response = false
    }

    return response
  }
}
