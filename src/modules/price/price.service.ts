import { Between, LessThanOrEqual, Repository } from 'typeorm'

import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { EPriceTenant } from '@mush/core/enums'
import {
  CError,
  EmptyObject,
  Nullable,
  findWrongEnumValue,
  formatDateToDateTime,
} from '@mush/core/utils'

import { Price } from './price.entity'

@Injectable()
export class PriceService {
  constructor(
    @InjectRepository(Price)
    private priceRepository: Repository<Price>,
  ) {}

  findAll(): Promise<Price[]> {
    return this.priceRepository.find({
      order: {
        tenant: 'ASC',
        date: 'ASC',
      },
    })
  }

  findAllByTenant(tenant): Promise<Price[]> {
    if (
      findWrongEnumValue({
        $enum: EPriceTenant,
        value: tenant,
      })
    ) {
      throw new HttpException(CError.INVALID_TENANT, HttpStatus.BAD_REQUEST)
    }

    return this.priceRepository.find({
      where: {
        tenant,
      },
      order: {
        date: 'ASC',
      },
    })
  }

  findPriceById(id: number): Promise<Nullable<Price>> {
    return this.priceRepository.findOneBy({ id })
  }

  async findPriceByClosestDate({
    date,
    tenant,
  }: {
    date: string
    tenant: EPriceTenant
  }): Promise<Price> {
    if (findWrongEnumValue({ $enum: EPriceTenant, value: tenant })) {
      throw new HttpException(CError.INVALID_TENANT, HttpStatus.BAD_REQUEST)
    }

    const foundPrice = await this.priceRepository.findOne({
      where: {
        tenant,
        date: LessThanOrEqual(new Date(`${date} 00:00:00:000`)),
      },
      order: { date: 'DESC' },
    })

    return foundPrice
  }

  async findAllTenantPricesWithinPeriod({ dateFrom, dateTo }) {
    return this.priceRepository.find({
      where: {
        date: Between(dateFrom, dateTo),
      },
    })
  }

  async findAllTenantCurrentPrices(): Promise<Array<Price | EmptyObject>> {
    const today: string = String(
      formatDateToDateTime({ value: new Date(Date.now()) }),
    ) //TODO: refactor
    const promises = []

    Object.values(EPriceTenant).forEach((tenant) => {
      promises.push(
        this.findPriceByClosestDate({
          tenant,
          date: today,
        }).then((response) => {
          return response || {}
        }),
      )
    })

    return Promise.all(promises)
  }

  async createPrice({
    tenant,
    price,
    date,
  }: {
    tenant: EPriceTenant
    price: number
    date: string
  }): Promise<Price> {
    const newPrice: Price = await this.priceRepository.create({
      tenant,
      price,
      date: `${date} 00:00:00:000`,
    })

    return this.priceRepository.save(newPrice)
  }

  async updatePrice(id: number, price: number) {
    const foundPrice = await this.findPriceById(id)

    if (!foundPrice) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    const updatedPrice: Price = await this.priceRepository.create({
      ...foundPrice,
      price,
    })

    return this.priceRepository.save(updatedPrice)
  }

  async removePrice(id: number): Promise<Boolean> {
    const foundPrice: Nullable<Price> = await this.findPriceById(id)

    if (!foundPrice) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    try {
      await this.priceRepository.remove(foundPrice)

      return true
    } catch (e) {
      return false
    }
  }
}
