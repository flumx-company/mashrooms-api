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

import { CError, Nullable, pick } from '@mush/core/utils'

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

    console.log({
      currentBatch,
      foundWave,
    })

    const newStorage: Storage = await this.storageRepository.create({
      date,
      amount,
      variety: pick(foundVariety, 'id', 'name'),
      wave: pick(foundWave, 'id'),
    })

    return this.storageRepository.save(newStorage)
  }
}
