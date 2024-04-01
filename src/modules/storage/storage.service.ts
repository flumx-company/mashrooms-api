import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate'
import { Repository } from 'typeorm'

import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Category } from '@mush/modules/category/category.entity'
import { CategoryService } from '@mush/modules/category/category.service'
import { Chamber } from '@mush/modules/chamber/chamber.entity'
import { ChamberService } from '@mush/modules/chamber/chamber.service'
import { Variety } from '@mush/modules/variety/variety.entity'
import { VarietyService } from '@mush/modules/variety/variety.service'
import { Wave } from '@mush/modules/wave/wave.entity'
import { WaveService } from '@mush/modules/wave/wave.service'

import { CError, Nullable, formatDateToDateTime, pick } from '@mush/core/utils'

import { storagePaginationConfig } from './pagination'
import { Storage } from './storage.entity'

@Injectable()
export class StorageService {
  constructor(
    @InjectRepository(Storage)
    private storageRepository: Repository<Storage>,
    private readonly chamberService: ChamberService,
    private readonly waveService: WaveService,
    private readonly varietyService: VarietyService,
    private readonly categoryService: CategoryService,
  ) {}

  findAll(query: PaginateQuery): Promise<Paginated<Storage>> {
    return paginate(query, this.storageRepository, storagePaginationConfig)
  }

  findAllByBatchId(batchId: number): Promise<Storage[]> {
    return this.storageRepository
      .createQueryBuilder('storage')
      .select()
      .leftJoinAndSelect('storage.variety', 'variety')
      .leftJoinAndSelect('storage.wave', 'wave')
      .leftJoinAndSelect('storage.category', 'category')
      .leftJoinAndSelect('wave.batch', 'batch')
      .leftJoinAndSelect('batch.chamber', 'chamber')
      .where('batch.id = :batchId', { batchId })
      .getMany()
  }

  findByOffloadParameters({
    varietyId,
    waveId,
    categoryId,
    date,
  }: {
    varietyId: number
    waveId: number
    categoryId: number
    date: Date
  }): Promise<Storage> {
    return this.storageRepository
      .createQueryBuilder('storage')
      .select()
      .leftJoinAndSelect('storage.variety', 'variety')
      .leftJoinAndSelect('storage.wave', 'wave')
      .leftJoinAndSelect('storage.category', 'category')
      .where('storage.date = :date', { date })
      .andWhere('variety.id = :varietyId', { varietyId })
      .andWhere('wave.id = :waveId', { waveId })
      .andWhere('category.id = :categoryId', { categoryId })
      .getOne()
  }

  findById(id: number): Promise<Nullable<Storage>> {
    return this.storageRepository.findOneBy({ id })
  }

  async findAllTodayStoragesByWaveId({
    waveId,
    categoryId,
  }: {
    waveId: number
    categoryId: number
  }): Promise<object> {
    const today = String(
      formatDateToDateTime({
        value: new Date(Date.now()),
      }),
    )
    const byVarietyStorageList = {}

    const foundStorages = await this.storageRepository
      .createQueryBuilder('storage')
      .leftJoinAndSelect('storage.wave', 'wave')
      .leftJoinAndSelect('storage.variety', 'variety')
      .leftJoinAndSelect('storage.category', 'category')
      .where('storage.date like :date', { date: `%${today}%` })
      .andWhere('wave.id = :waveId', { waveId })
      .andWhere('category.id = :categoryId', { categoryId })
      .select([
        'storage.id',
        'storage.amount',
        'storage.date',
        'variety.id',
        'category.id',
      ])
      .getMany()

    foundStorages.forEach(({ variety, amount, id }) => {
      byVarietyStorageList[variety.id] = {
        amount,
        id,
      }
    })

    return byVarietyStorageList
  }

  async createStorage({
    date,
    amount,
    waveId,
    varietyId,
    chamberId,
    categoryId,
  }: {
    date: string
    amount: number
    waveId: number
    varietyId: number
    chamberId: number
    categoryId: number
  }): Promise<Storage> {
    const [foundChamber, foundWave, foundVariety, foundCategory]: [
      Nullable<Chamber>,
      Nullable<Wave>,
      Nullable<Variety>,
      Nullable<Category>,
    ] = await Promise.all([
      this.chamberService.findChamberByIdWithRelations(chamberId),
      this.waveService.findWaveById(waveId),
      this.varietyService.findVarietyById(varietyId),
      this.categoryService.findCategoryById(categoryId),
    ])

    if (!foundChamber || !foundWave || !foundVariety || !foundCategory) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    const currentBatch = foundChamber.batches.find((batch) => !batch.dateTo)

    if (!currentBatch) {
      throw new HttpException(
        CError.CHAMBER_HAS_NO_OPEN_BATCH,
        HttpStatus.BAD_REQUEST,
      )
    }

    if (currentBatch.id !== foundWave.batch.id) {
      throw new HttpException(
        CError.WAVE_NOT_RELATED_TO_CHAMBER,
        HttpStatus.BAD_REQUEST,
      )
    }

    const newStorage: Storage = await this.storageRepository.create({
      date,
      amount,
      variety: pick(foundVariety, 'id', 'name'),
      wave: pick(foundWave, 'id'),
      category: pick(foundCategory, 'id'),
    })

    return this.storageRepository.save(newStorage)
  }

  async updateStorage({
    id,
    amount,
  }: {
    id: number
    amount: number
  }): Promise<Storage> {
    const foundStorage = await this.findById(id)

    if (!foundStorage) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    const newStorage: Storage = await this.storageRepository.create({
      ...foundStorage,
      amount,
    })

    return this.storageRepository.save(newStorage)
  }

  async removeStorage(id: number): Promise<Boolean> {
    const foundStorage: Nullable<Storage> = await this.findById(id)

    if (!foundStorage) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    let response = true

    try {
      await this.storageRepository.remove(foundStorage)
    } catch (e) {
      response = false
    }

    return response
  }
}
