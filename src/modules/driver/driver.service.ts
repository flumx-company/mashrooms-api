import { Repository } from 'typeorm'

import { HttpException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { EError } from '@mush/core/enums'
import { CError, Nullable } from '@mush/core/utils'

import { Driver } from './driver.entity'
import { CreateDriverDto } from './dto/create.driver.dto'
import { UpdateDriverDto } from './dto/update.driver.dto'

@Injectable()
export class DriverService {
  constructor(
    @InjectRepository(Driver)
    private driverRepository: Repository<Driver>,
  ) {}

  findAll(): Promise<Driver[]> {
    return this.driverRepository.find()
  }

  findDriverById(id: number): Promise<Nullable<Driver>> {
    return this.driverRepository.findOneBy({ id })
  }

  findDriverByPhone(phone: string): Promise<Nullable<Driver>> {
    return this.driverRepository.findOneBy({ phone })
  }

  async createDriver({
    firstName,
    lastName,
    phone,
  }: CreateDriverDto): Promise<Driver> {
    const foundDriverByPhone = await this.findDriverByPhone(phone)

    if (foundDriverByPhone) {
      throw new HttpException(
        CError[EError.PHONE_ALREADY_EXISTS],
        EError.PHONE_ALREADY_EXISTS,
      )
    }

    const newDriver: Driver = this.driverRepository.create({
      firstName,
      lastName,
      phone,
    })

    return this.driverRepository.save(newDriver)
  }

  async updateDriver(
    id: number,
    { firstName, lastName, phone }: UpdateDriverDto,
  ): Promise<Driver> {
    const [foundDriverById, foundDriverByPhone] = await Promise.all([
      this.findDriverById(id),
      this.findDriverByPhone(phone),
    ])

    if (!foundDriverById) {
      throw new HttpException(CError[EError.NOT_FOUND_ID], EError.NOT_FOUND_ID)
    }

    if (foundDriverByPhone && foundDriverByPhone.id !== id) {
      throw new HttpException(
        CError[EError.PHONE_ALREADY_EXISTS],
        EError.PHONE_ALREADY_EXISTS,
      )
    }

    const updatedDriver: Driver = this.driverRepository.create({
      ...foundDriverById,
      firstName,
      lastName,
      phone,
    })

    return this.driverRepository.save(updatedDriver)
  }

  async removeDriver(id: number): Promise<Boolean> {
    const foundDriver: Nullable<Driver> = await this.findDriverById(id)

    if (!foundDriver) {
      throw new HttpException(CError[EError.NOT_FOUND_ID], EError.NOT_FOUND_ID)
    }

    let response = true

    try {
      await this.driverRepository.remove(foundDriver)
    } catch (e) {
      response = false
    }

    return response
  }
}
