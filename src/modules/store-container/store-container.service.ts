import { Repository } from 'typeorm'

import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { CError, Nullable } from '@mush/core/utils'

import { StoreContainer } from './store-container.entity'

@Injectable()
export class StoreContainerService {
  constructor(
    @InjectRepository(StoreContainer)
    private storeContainerRepository: Repository<StoreContainer>,
  ) {}

  findAll(): Promise<StoreContainer[]> {
    return this.storeContainerRepository.find()
  }

  findStoreContainerById(id: number): Promise<Nullable<StoreContainer>> {
    return this.storeContainerRepository.findOneBy({ id })
  }

  findStoreContainerByName(name: string): Promise<Nullable<StoreContainer>> {
    return this.storeContainerRepository.findOneBy({ name })
  }

  async createStoreContainer({
    name,
    weight,
  }: {
    name: string
    weight: number
  }): Promise<StoreContainer> {
    const foundStoreContainerByName = await this.findStoreContainerByName(name)

    if (foundStoreContainerByName) {
      throw new HttpException(
        CError.NAME_ALREADY_EXISTS,
        HttpStatus.BAD_REQUEST,
      )
    }

    const newStoreContainer: StoreContainer =
      await this.storeContainerRepository.create({
        name,
        weight,
      })

    return this.storeContainerRepository.save(newStoreContainer)
  }

  async updateStoreContainer(
    id: number,
    {
      name,
      weight,
    }: {
      name: string
      weight: number
    },
  ): Promise<StoreContainer> {
    const [
      foundStoreContainerById,
      foundStoreContainerByName,
    ]: Nullable<StoreContainer>[] = await Promise.all([
      this.findStoreContainerById(id),
      this.findStoreContainerByName(name),
    ])

    if (!foundStoreContainerById) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    if (foundStoreContainerByName && foundStoreContainerByName.id !== id) {
      throw new HttpException(
        CError.NAME_ALREADY_EXISTS,
        HttpStatus.BAD_REQUEST,
      )
    }

    const updatedStoreContainer: StoreContainer =
      await this.storeContainerRepository.create({
        ...foundStoreContainerById,
        name,
        weight,
      })

    return this.storeContainerRepository.save(updatedStoreContainer)
  }

  async removeStoreContainer(id: number): Promise<Boolean> {
    const foundStoreContainer: Nullable<StoreContainer> =
      await this.findStoreContainerById(id)

    if (!foundStoreContainer) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    try {
      await this.storeContainerRepository.remove(foundStoreContainer)
      return true
    } catch (e) {
      return false
    }
  }
}
