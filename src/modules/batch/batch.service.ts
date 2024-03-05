import { Repository } from 'typeorm'

import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Chamber } from '@mush/modules/chamber/chamber.entity'
import { ChamberService } from '@mush/modules/chamber/chamber.service'
import { Wave } from '@mush/modules/wave/wave.entity'
import { WaveService } from '@mush/modules/wave/wave.service'

import { CError, Nullable, formatDateToDateTime, pick } from '@mush/core/utils'

import { Batch } from './batch.entity'

@Injectable()
export class BatchService {
  constructor(
    @InjectRepository(Batch)
    private batchRepository: Repository<Batch>,
    private readonly chamberService: ChamberService,
    private readonly waveService: WaveService,
  ) {}

  findAll(): Promise<Batch[]> {
    return this.batchRepository.find({ relations: ['waves', 'chamber'] })
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
      relations: ['waves', 'chamber'],
    })
  }

  async createBatch({
    compostSupplier,
    compostWeight,
    briquetteQuantity,
    compostPrice,
    peatSupplier,
    peatWeight,
    peatPrice,
    waveQuantity,
    chamberId,
  }: {
    compostSupplier: string
    compostWeight: number
    briquetteQuantity: number
    compostPrice: number
    peatSupplier: string
    peatWeight: number
    peatPrice: number
    waveQuantity: number
    chamberId: number
  }): Promise<any> {
    const [lastBatch, foundChamber]: [Nullable<Batch>, Nullable<Chamber>] =
      await Promise.all([
        this.findLastBatch(),
        this.chamberService.findChamberById(chamberId),
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

    const newBatch: Batch = await this.batchRepository.create({
      name,
      compostSupplier,
      compostWeight,
      briquetteQuantity,
      compostPrice,
      peatSupplier,
      peatWeight,
      peatPrice,
      waveQuantity,
      dateFrom,
      dateTo: null,
      chamber: pick(foundChamber, 'id', 'name'),
    })
    const savedBatch = await this.batchRepository.save(newBatch)

    await this.waveService.createWave({
      batchId: savedBatch.id,
      dateFrom,
      order: 1,
    })

    return savedBatch
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
        withTime: false,
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
        withTime: true,
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
      throw new HttpException(CError.BATCH_CLOSED, HttpStatus.BAD_REQUEST)
    }

    if (foundWave.dateTo) {
      throw new HttpException(CError.WAVE_CLOSED, HttpStatus.BAD_REQUEST)
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
