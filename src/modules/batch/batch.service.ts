import { EFileCategory } from '@mush/core/enums';
import { PaginateQuery, Paginated, paginate, FilterOperator } from 'nestjs-paginate'
import { Repository } from 'typeorm'

import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Transactional } from 'typeorm-transactional'

import { Chamber } from '@mush/modules/chamber/chamber.entity'
import { ChamberService } from '@mush/modules/chamber/chamber.service'
import { CreateSubbatchDto } from '@mush/modules/subbatch/dto'
import { SubbatchService } from '@mush/modules/subbatch/subbatch.service'
import { Wave } from '@mush/modules/wave/wave.entity'
import { WaveService } from '@mush/modules/wave/wave.service'

import {
  CError,
  Nullable,
  formatDateToDateTime,
  pick,
  getCurrentYearUTC,
  getOperationalCalendarDateString,
  getOperationalYesterdayDateString,
} from '@mush/core/utils'
import { Client } from '@mush/modules/client/client.entity';
import { FileUploadService } from '@mush/modules/file-upload/file-upload.service';
import { BufferedFile } from '@mush/modules/file-upload/file.model';
import { PublicFile } from '@mush/modules/file-upload/public-file.entity';

import { Subbatch } from '@mush/modules/subbatch/subbatch.entity'
import { Batch } from './batch.entity'
import { CreateBatchDto, UpdateBatchDto } from './dto'
import { batchPaginationConfig } from './pagination'

@Injectable()
export class BatchService {
  constructor(
    @InjectRepository(Batch)
    private batchRepository: Repository<Batch>,
    private readonly chamberService: ChamberService,
    private readonly waveService: WaveService,
    private readonly subbatchService: SubbatchService,
    @InjectRepository(PublicFile)
    private publicFileRepository: Repository<PublicFile>,
    private readonly fileUploadService: FileUploadService,
  ) {}

  findAll(query: PaginateQuery): Promise<Paginated<Batch>> {
    return paginate(query, this.batchRepository, batchPaginationConfig)
  }

  async findBatchById(id): Promise<Batch> {
    return this.batchRepository.findOne({
      where: { id },
      relations: [
        'waves',
        'chamber',
        'waterings',
        'waterings.wave',
        'subbatches',
        'subbatches.category',
      ],
    })
  }
//{
//    waveQuantity: number
//    chamberId: number
//    subbatches: CreateSubbatchDto[]
//  }
  @Transactional()
  async createBatch({
    waveQuantity,
    chamberId,
    subbatches,
    peatSupplier,
    peatWeight,
    peatLoadDate,
    peatPrice,
    name: customName,
  }: CreateBatchDto): Promise<Batch> {
    const foundChamber: Nullable<Chamber> =
      await this.chamberService.findChamberByIdWithRelations(chamberId)
    const currentYear: number = getCurrentYearUTC()
    const dateFrom: string = String(
      formatDateToDateTime({
        value: new Date(Date.now()),
        dateFrom: true,
        withTime: true,
      }),
    )
    const batchesThisYear: number = await this.batchRepository
      .createQueryBuilder('batch')
      .where('YEAR(batch.dateFrom) = :year', { year: currentYear })
      .getCount()
    const newBatchNumber: number = batchesThisYear + 1
    const newBatchNumberValue: string =
      newBatchNumber < 10 ? `0${newBatchNumber}` : String(newBatchNumber)
    const defaultName: string = `${currentYear}-${newBatchNumberValue}`
    const trimmed: string =
      typeof customName === 'string' ? customName.trim() : ''
    const name: string = trimmed || defaultName

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
      waveQuantity,
      peatSupplier,
      peatWeight,
      peatLoadDate,
      peatPrice,
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

  @Transactional()
  async updateBatch(
    id: number,
    {
      waveQuantity,
      subbatches,
      peatSupplier,
      peatWeight,
      peatLoadDate,
      peatPrice,
      name,
    }: UpdateBatchDto,
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
      waveQuantity,
      peatSupplier,
      peatWeight,
      peatLoadDate,
      peatPrice,
      ...(name !== undefined
        ? { name: name.trim() || foundBatch.name }
        : {}),
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
    const today = `${getOperationalCalendarDateString()} 00:00:00:000`
    const yesterday = `${getOperationalYesterdayDateString()} 23:59:59:999`

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

  findBatchDocuments(
    query: PaginateQuery,
    id: number,
  ): Promise<Paginated<PublicFile>> {
    const updatedQuery = {
      ...query,
      'filter': {
        "batchDocuments.id": `${id}`
      }
    };
    return paginate(updatedQuery, this.publicFileRepository, {
      relations: [EFileCategory.BATCH_DOCUMENTS],
      sortableColumns: ['batchDocuments.id', 'id'],
      filterableColumns: {
        ['batchDocuments.id']: [FilterOperator.EQ],
      },
    });
  }

  @Transactional()
  async addBatchFiles(
    id: number,
    batchDocuments: BufferedFile[],
  ): Promise<Nullable<Batch>> {
    if (!batchDocuments || !batchDocuments.length) {
      throw new HttpException(CError.NO_FILE_PROVIDED, HttpStatus.BAD_REQUEST)
    }

    const foundBatch = await this.findBatchById(id)

    if (!foundBatch) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    const fileListData: PublicFile[] =
      await this.fileUploadService.uploadPublicFiles(batchDocuments)

    const promises = fileListData.map(item => {
      const data = this.publicFileRepository.create({
        ...item,
        batchDocuments: [foundBatch]
      })

      return this.publicFileRepository.save(data);
    });

    await Promise.all(promises);
    return foundBatch;
  }

  async removeClientFile(clientId: number, fileId: number) {
    const foundClient: Nullable<Batch> =
      await this.findBatchById(clientId)

    if (!foundClient) {
      throw new HttpException(
        CError.NOT_FOUND_CLIENT_ID,
        HttpStatus.BAD_REQUEST,
      )
    }
    return await this.fileUploadService.deletePublicFile(fileId)
  }
}
