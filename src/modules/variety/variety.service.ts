import { Repository } from 'typeorm'

import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Transactional } from 'typeorm-transactional'

import { CError, Nullable } from '@mush/core/utils'

import { Variety } from './variety.entity'
import { ReorderVarietyDto } from './dto/reorder-variety.dto'

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

  findVarietyByIdWithRelations(id: number): Promise<Nullable<Variety>> {
    return this.varietyRepository.findOne({
      where: { id },
      relations: ['cuttings', 'storages', 'offloadRecords', 'yields'],
    })
  }

  findVarietyByName(name: string): Promise<Nullable<Variety>> {
    return this.varietyRepository.findOneBy({ name })
  }

  async createVariety({ name, isCutterPaid, order }: { name: string, isCutterPaid: boolean, order?: number }): Promise<Variety> {
    const foundVarietyByName = await this.findVarietyByName(name)

    if (foundVarietyByName) {
      throw new HttpException(
        CError.NAME_ALREADY_EXISTS,
        HttpStatus.BAD_REQUEST,
      )
    }

    const newVariety: Variety = await this.varietyRepository.create({
      name,
      isCutterPaid,
      order: order ?? 0,
    })

    return this.varietyRepository.save(newVariety)
  }

  async updateVariety(
    id: number,
    { name, isCutterPaid, order }: { name: string, isCutterPaid: boolean, order?: number },
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
      isCutterPaid,
      order: order ?? foundVarietyById.order ?? 0,
    })

    return this.varietyRepository.save(updatedVariety)
  }

  async removeVariety(id: number): Promise<Boolean> {
    const foundVariety: Nullable<Variety> =
      await this.findVarietyByIdWithRelations(id)

    if (!foundVariety) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    const { cuttings, storages, offloadRecords, yields } = foundVariety

    if (
      cuttings.length ||
      storages.length ||
      offloadRecords.length ||
      yields.length
    ) {
      throw new HttpException(
        CError.ENTITY_HAS_DEPENDENT_RELATIONS,
        HttpStatus.BAD_REQUEST,
      )
    }

    try {
      await this.varietyRepository.remove(foundVariety)
      return true
    } catch (e) {
      return false
    }
  }

  async getAllSortedByOrder(): Promise<Variety[]> {
    return this.varietyRepository.find({ order: { order: 'ASC' } });
  }

  @Transactional()
  async reorderVarieties(data: ReorderVarietyDto[]): Promise<Variety[]> {
    const updatedVarieties = [];

    for (const { id, order } of data) {
      const entity = await this.varietyRepository.preload({ id, order });

      if (!entity) {
        throw new HttpException(`Variety with ID ${id} not found`, HttpStatus.NOT_FOUND);
      }

      updatedVarieties.push(entity);
    }

    return await this.varietyRepository.save(updatedVarieties);
  }

}
