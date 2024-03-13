import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate'
import { Repository } from 'typeorm'

import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

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
  ) {}

  findAll(query: PaginateQuery): Promise<Paginated<Storage>> {
    return paginate(query, this.storageRepository, storagePaginationConfig)
  }

  findById(id: number): Promise<Nullable<Storage>> {
    return this.storageRepository.findOneBy({ id })
  }

  async findAllTodayStoragesByWaveId(waveId: number): Promise<object> {
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
      .where('storage.date like :date', { date: `%${today}%` })
      .andWhere('wave.id = :id', { id: waveId })
      .select(['storage.id', 'storage.amount', 'storage.date', 'variety.id'])
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
  }: {
    date: string
    amount: number
    waveId: number
    varietyId: number
    chamberId: number
  }): Promise<Storage> {
    const [foundChamber, foundWave, foundVariety]: [
      Nullable<Chamber>,
      Nullable<Wave>,
      Nullable<Variety>,
    ] = await Promise.all([
      this.chamberService.findChamberByIdWithBatches(chamberId),
      this.waveService.findWaveById(waveId),
      this.varietyService.findVarietyById(varietyId),
    ])

    if (!foundChamber || !foundWave || !foundVariety) {
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
}
