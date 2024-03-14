import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate'
import { Repository } from 'typeorm'

import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Chamber } from '@mush/modules/chamber/chamber.entity'
import { ChamberService } from '@mush/modules/chamber/chamber.service'
import { CreateSubbatchDto } from '@mush/modules/subbatch/dto'
import { SubbatchService } from '@mush/modules/subbatch/subbatch.service'
import { Wave } from '@mush/modules/wave/wave.entity'
import { WaveService } from '@mush/modules/wave/wave.service'

import { CError, Nullable, formatDateToDateTime, pick } from '@mush/core/utils'

import { Subbatch } from '../subbatch/subbatch.entity'
import { Batch } from './batch.entity'
import { UpdateBatchDto } from './dto'
import { batchPaginationConfig } from './pagination'

@Injectable()
export class BatchService {
  constructor(
    @InjectRepository(Batch)
    private batchRepository: Repository<Batch>,
    private readonly chamberService: ChamberService,
    private readonly waveService: WaveService,
    private readonly subbatchService: SubbatchService,
  ) {}

  findAll(query: PaginateQuery): Promise<Paginated<Batch>> {
    return paginate(query, this.batchRepository, batchPaginationConfig)
  }

  async findLastBatch(): Promise<Batch> {
    return this.batchRepository
      .createQueryBuilder('batch')
      .orderBy('batch.id', 'DESC')
      .getOne()
  }

  async findBatchById(id): Promise<Batch> {
    return this.batchRepository.findOne({
      where: { id },
      relations: ['waves', 'chamber', 'waterings'],
    })
  }

  async createBatch({
    briquetteQuantity,
    waveQuantity,
    chamberId,
    subbatches,
  }: {
    briquetteQuantity: number
    waveQuantity: number
    chamberId: number
    subbatches: CreateSubbatchDto[]
  }): Promise<Batch> {
    const [lastBatch, foundChamber]: [Nullable<Batch>, Nullable<Chamber>] =
      await Promise.all([
        this.findLastBatch(),
        this.chamberService.findChamberByIdWithBatches(chamberId),
      ])
    const currentYear: number = new Date().getFullYear()
    const dateFrom: string = String(
      formatDateToDateTime({
        value: new Date(Date.now()),
        dateFrom: true,
        withTime: true,
      }),
    )
    const lastBatchYear: Nullable<number> =
      lastBatch && parseInt(lastBatch.name.slice(0, 4))
    const lastBatchNumber: number =
      lastBatch && parseInt(lastBatch.name.slice(5, 7))
    const newBatchNumber: number =
      lastBatchYear === currentYear ? lastBatchNumber + 1 : 1
    const newBatchNumberValue: string =
      newBatchNumber < 10 ? `0${newBatchNumber}` : String(newBatchNumber)
    const name: string = `${currentYear}-${newBatchNumberValue}`

    if (!foundChamber) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    const hasChamberBatches = foundChamber.batches.length
    const isChamberLastBatchEnded =
      hasChamberBatches && Boolean(foundChamber.batches[0].dateTo)

    if (hasChamberBatches && !isChamberLastBatchEnded) {
      throw new HttpException(
        CError.CHAMBER_HAS_OPEN_BATCH,
        HttpStatus.BAD_REQUEST,
      )
    }

    const createdSubbatches: Subbatch[] = await Promise.all(
      subbatches.map((subbatch) =>
        this.subbatchService.createSubbatch(subbatch),
      ),
    )

    const newBatch: Batch = await this.batchRepository.create({
      name,
      briquetteQuantity,
      waveQuantity,
      dateFrom,
      dateTo: null,
      chamber: pick(foundChamber, 'id', 'name'),
      subbatches: createdSubbatches,
    })
    const savedBatch = await this.batchRepository.save(newBatch)

    await this.waveService.createWave({
      batchId: savedBatch.id,
      dateFrom,
      order: 1,
    })

    return savedBatch
  }

  async updateBatch(
    id: number,
    { briquetteQuantity, waveQuantity, subbatches }: UpdateBatchDto,
  ): Promise<Batch> {
    const foundBatch: Nullable<Batch> = await this.findBatchById(id)

    if (!foundBatch) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    const updatedSubbatches: Subbatch[] = await Promise.all(
      subbatches.map((subbatch) =>
        this.subbatchService.updateSubbatch(subbatch),
      ),
    )

    const updatedBatch: Batch = this.batchRepository.create({
      ...foundBatch,
      briquetteQuantity,
      waveQuantity,
      subbatches: updatedSubbatches,
    })

    return this.batchRepository.save(updatedBatch)
  }

  async changeWave({
    batchId,
    waveOrder,
  }: {
    batchId: number
    waveOrder: number
  }): Promise<Nullable<Wave>> {
    const [foundBatch, foundWave]: [Nullable<Batch>, Nullable<Wave>] =
      await Promise.all([
        this.findBatchById(batchId),
        this.waveService.findLastWave(batchId),
      ])

    if (!foundBatch || !foundWave) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    const isOrderNext = waveOrder === foundWave.order + 1
    const meetsOrderLimit = foundBatch.waveQuantity >= waveOrder
    const today = String(
      formatDateToDateTime({
        value: new Date(Date.now()),
        dateFrom: true,
        withTime: true,
      }),
    )
    const yesterday = String(
      formatDateToDateTime({
        value: new Date(new Date().setDate(new Date().getDate() - 1)),
        dateFrom: false,
        withTime: true,
      }),
    )

    if (!isOrderNext || !meetsOrderLimit) {
      throw new HttpException(CError.WRONG_WAVE_ORDER, HttpStatus.BAD_REQUEST)
    }

    const [_, newWave]: Array<Nullable<Wave>> = await Promise.all([
      this.waveService.endWave({ id: foundWave.id, dateTo: yesterday }),
      this.waveService.createWave({
        batchId: foundBatch.id,
        dateFrom: today,
        order: waveOrder,
      }),
    ])

    return newWave
  }

  async endBatch(id) {
    const dateTo: string = String(
      formatDateToDateTime({
        value: new Date(Date.now()),
        dateFrom: false,
        withTime: false,
      }),
    )
    const [foundBatch, foundWave]: [Nullable<Batch>, Nullable<Wave>] =
      await Promise.all([
        this.findBatchById(id),
        this.waveService.findLastWave(id),
      ])

    if (!foundBatch || !foundWave) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    if (foundBatch.dateTo) {
      throw new HttpException(CError.BATCH_ENDED, HttpStatus.BAD_REQUEST)
    }

    if (foundWave.dateTo) {
      throw new HttpException(CError.WAVE_ENDED, HttpStatus.BAD_REQUEST)
    }

    const [_, updatedBatch]: [Wave, Batch] = await Promise.all([
      this.waveService.endWave({ id: foundWave.id, dateTo }),
      this.batchRepository.create({
        ...foundBatch,
        dateTo,
      }),
    ])

    return this.batchRepository.save(updatedBatch)
  }
}
