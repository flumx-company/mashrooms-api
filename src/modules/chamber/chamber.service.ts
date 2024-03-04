import { Repository } from 'typeorm'

import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { CError, Nullable } from '@mush/core/utils'

import { Chamber } from './chamber.entity'
import { UpdateChamberDto } from './dto'

@Injectable()
export class ChamberService {
  constructor(
    @InjectRepository(Chamber)
    private chamberRepository: Repository<Chamber>,
  ) {}

  findAll(): Promise<Chamber[]> {
    return this.chamberRepository.find({
      order: {
        name: 'ASC',
      },
    })
  }

  findChamberById(id: number): Promise<Nullable<Chamber>> {
    return this.chamberRepository.findOneBy({ id })
  }

  async createChamber({
    name,
    area,
  }: {
    name: string
    area: number
  }): Promise<Chamber> {
    const newChamber: Chamber = await this.chamberRepository.create({
      name,
      area,
    })

    return this.chamberRepository.save(newChamber)
  }

  async updateChamber(id: number, { name, area }: UpdateChamberDto) {
    const foundChamber: Chamber = await this.findChamberById(id)

    if (!foundChamber) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    const updatedChamber: Chamber = await this.chamberRepository.create({
      ...foundChamber,
      name,
      area,
    })

    return this.chamberRepository.save(updatedChamber)
  }

  async removeChamber(id: number): Promise<Boolean> {
    const foundChamber: Nullable<Chamber> = await this.findChamberById(id)

    if (!foundChamber) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    try {
      await this.chamberRepository.remove(foundChamber)

      return true
    } catch (e) {
      return false
    }
  }
}
