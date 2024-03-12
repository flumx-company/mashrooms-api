import { Repository } from 'typeorm'

import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { CError, Nullable } from '@mush/core/utils'

import { Wave } from './wave.entity'

@Injectable()
export class WaveService {
  constructor(
    @InjectRepository(Wave)
    private waveRepository: Repository<Wave>,
  ) {}

  async findLastWave(batchId: number): Promise<Wave> {
    return this.waveRepository
      .createQueryBuilder('wave')
      .innerJoin('wave.batch', 'batch')
      .where('batch.id = :batchId', { batchId })
      .orderBy('wave.id', 'DESC')
      .getOne()
  }

  async findWaveById(id): Promise<Wave> {
    return this.waveRepository.findOne({ where: { id }, relations: ['batch'] })
  }

  async createWave({
    batchId,
    dateFrom,
    order,
  }: {
    batchId: number
    dateFrom: string
    order: number
  }): Promise<Wave> {
    const newWave: Wave = await this.waveRepository.create({
      order,
      dateFrom,
      dateTo: null,
      batch: { id: batchId },
    })

    return this.waveRepository.save(newWave)
  }

  async endWave({ id, dateTo }: { id: number; dateTo: string }): Promise<Wave> {
    const foundWave: Nullable<Wave> = await this.findWaveById(id)

    if (!foundWave) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    const updatedWave: Wave = await this.waveRepository.create({
      ...foundWave,
      dateTo,
    })

    return this.waveRepository.save(updatedWave)
  }
}
