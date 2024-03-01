import { Repository } from 'typeorm'

import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { CError, Nullable } from '@mush/core/utils'

import { Variety } from './variety.entity'

@Injectable()
export class VarietyService {
  constructor(
    @InjectRepository(Variety)
    private varietyRepository: Repository<Variety>,
  ) {}

  findAll(): Promise<Variety[]> {
    return this.varietyRepository.find()
  }

  findVarietyById(id: number): Promise<Nullable<Variety>> {
    return this.varietyRepository.findOneBy({ id })
  }

  findVarietyByName(name: string): Promise<Nullable<Variety>> {
    return this.varietyRepository.findOneBy({ name })
  }

  async createVariety({ name }: { name: string }): Promise<Variety> {
    const foundVarietyByName = await this.findVarietyByName(name)

    if (foundVarietyByName) {
      throw new HttpException(
        CError.NAME_ALREADY_EXISTS,
        HttpStatus.BAD_REQUEST,
      )
    }

    const newVariety: Variety = await this.varietyRepository.create({
      name,
    })

    return this.varietyRepository.save(newVariety)
  }

  async updateVariety(
    id: number,
    {
      name,
    }: {
      name: string
    },
  ): Promise<Variety> {
    const [foundVarietyById, foundVarietyByName]: Nullable<Variety>[] =
      await Promise.all([
        this.findVarietyById(id),
        this.findVarietyByName(name),
      ])

    if (!foundVarietyById) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    if (foundVarietyByName && foundVarietyByName.id !== id) {
      throw new HttpException(
        CError.NAME_ALREADY_EXISTS,
        HttpStatus.BAD_REQUEST,
      )
    }

    const updatedVariety: Variety = await this.varietyRepository.create({
      ...foundVarietyById,
      name,
    })

    return this.varietyRepository.save(updatedVariety)
  }

  async removeVariety(id: number): Promise<Boolean> {
    const foundVariety: Nullable<Variety> = await this.findVarietyById(id)

    if (!foundVariety) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    try {
      await this.varietyRepository.remove(foundVariety)
      return true
    } catch (e) {
      return false
    }
  }
}
