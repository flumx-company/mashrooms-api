import { Repository } from 'typeorm'

import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

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

  findDriversByName(name: string): Promise<Driver[]> {
    return this.driverRepository
      .createQueryBuilder('driver')
      .select()
      .where('driver.firstName like :name', { name: `%${name}%` })
      .orWhere('driver.lastName like :name', { name: `%${name}%` })
      .getMany()
  }

  async createDriver({
    firstName,
    lastName,
    phone,
  }: CreateDriverDto): Promise<Driver> {
    const foundDriverByPhone = await this.findDriverByPhone(phone)

    if (foundDriverByPhone) {
      throw new HttpException(
        CError.PHONE_ALREADY_EXISTS,
        HttpStatus.BAD_REQUEST,
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
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    if (foundDriverByPhone && foundDriverByPhone.id !== id) {
      throw new HttpException(
        CError.PHONE_ALREADY_EXISTS,
        HttpStatus.BAD_REQUEST,
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
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
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
