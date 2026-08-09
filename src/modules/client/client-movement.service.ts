import { Repository } from 'typeorm'

import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Offload } from '@mush/modules/offload/offload.entity'

import { EClientMovementDirection } from '@mush/core/enums'
import { CError, Nullable } from '@mush/core/utils'

import { Client } from './client.entity'
import { ClientMovement } from './client-movement.entity'

function sumBoxes(parts: Array<number | string | null | undefined>): number {
  return parts.reduce<number>((acc, v) => acc + (Number(v) || 0), 0)
}

@Injectable()
export class ClientMovementService {
  constructor(
    @InjectRepository(ClientMovement)
    private movementRepository: Repository<ClientMovement>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(Offload)
    private offloadRepository: Repository<Offload>,
  ) {}

  async createMovement(params: {
    clientId: number
    offloadId?: number | null
    direction: EClientMovementDirection
    eventDate: Date
    boxQuantity?: number
    moneyAmount?: number
  }): Promise<ClientMovement | null> {
    const boxQuantity = Number(params.boxQuantity) || 0
    const moneyAmount = Number(params.moneyAmount) || 0

    // Порожні рухи не пишемо
    if (boxQuantity === 0 && moneyAmount === 0) {
      return null
    }

    const movement = this.movementRepository.create({
      client: { id: params.clientId } as Client,
      offload: params.offloadId ? ({ id: params.offloadId } as Offload) : null,
      direction: params.direction,
      eventDate: params.eventDate,
      boxQuantity,
      moneyAmount,
    })

    return this.movementRepository.save(movement)
  }

  /** OUT + опційний IN при створенні відвантаження */
  async recordOffloadCreate(offload: Offload): Promise<void> {
    const clientId = offload.client?.id
    if (!clientId) return

    const boxesOut = sumBoxes([
      offload.delContainer0_4Out,
      offload.delContainer0_5Out,
      offload.delContainer1_7Out,
      offload.delContainerSchoellerOut,
    ])
    const boxesIn = sumBoxes([
      offload.delContainer0_4In,
      offload.delContainer0_5In,
      offload.delContainer1_7In,
      offload.delContainerSchoellerIn,
    ])
    const priceTotal = Number(offload.priceTotal) || 0
    const paidMoney = Number(offload.paidMoney) || 0
    const operationalDate = offload.createdAt
      ? new Date(offload.createdAt)
      : new Date()
    const now = new Date()

    await this.createMovement({
      clientId,
      offloadId: offload.id,
      direction: EClientMovementDirection.OUT,
      eventDate: operationalDate,
      boxQuantity: boxesOut,
      moneyAmount: priceTotal,
    })

    if (paidMoney > 0 || boxesIn > 0) {
      await this.createMovement({
        clientId,
        offloadId: offload.id,
        direction: EClientMovementDirection.IN,
        eventDate: now,
        boxQuantity: boxesIn,
        moneyAmount: paidMoney,
      })
    }
  }

  /** Оновлення OUT і додавання IN по дельтах при edit відвантаження */
  async recordOffloadEdit(
    offloadId: number,
    clientId: number,
    prev: {
      priceTotal: number
      paidMoney: number
      boxesOut: number
      boxesIn: number
    },
    next: {
      priceTotal: number
      paidMoney: number
      boxesOut: number
      boxesIn: number
    },
  ): Promise<void> {
    const outMovement = await this.movementRepository.findOne({
      where: {
        offload: { id: offloadId },
        direction: EClientMovementDirection.OUT,
      },
      relations: ['offload', 'client'],
    })

    if (outMovement) {
      outMovement.moneyAmount = next.priceTotal
      outMovement.boxQuantity = next.boxesOut
      await this.movementRepository.save(outMovement)
    } else if (next.priceTotal > 0 || next.boxesOut > 0) {
      await this.createMovement({
        clientId,
        offloadId,
        direction: EClientMovementDirection.OUT,
        eventDate: new Date(),
        boxQuantity: next.boxesOut,
        moneyAmount: next.priceTotal,
      })
    }

    const paidDelta = next.paidMoney - prev.paidMoney
    const boxesInDelta = next.boxesIn - prev.boxesIn
    if (paidDelta > 0 || boxesInDelta > 0) {
      await this.createMovement({
        clientId,
        offloadId,
        direction: EClientMovementDirection.IN,
        eventDate: new Date(),
        boxQuantity: Math.max(0, boxesInDelta),
        moneyAmount: Math.max(0, paidDelta),
      })
    }
  }

  async recordReturnPrice(
    clientId: number,
    offloadId: number,
    price: number,
  ): Promise<void> {
    await this.createMovement({
      clientId,
      offloadId,
      direction: EClientMovementDirection.IN,
      eventDate: new Date(),
      boxQuantity: 0,
      moneyAmount: price,
    })
  }

  async recordReturnContainers(
    clientId: number,
    offloadId: number,
    boxes: number,
  ): Promise<void> {
    await this.createMovement({
      clientId,
      offloadId,
      direction: EClientMovementDirection.IN,
      eventDate: new Date(),
      boxQuantity: boxes,
      moneyAmount: 0,
    })
  }

  async recordManualDebtReturn(clientId: number, money: number): Promise<void> {
    await this.createMovement({
      clientId,
      offloadId: null,
      direction: EClientMovementDirection.IN,
      eventDate: new Date(),
      boxQuantity: 0,
      moneyAmount: money,
    })
  }

  async recordManualBoxReturn(clientId: number, boxes: number): Promise<void> {
    await this.createMovement({
      clientId,
      offloadId: null,
      direction: EClientMovementDirection.IN,
      eventDate: new Date(),
      boxQuantity: boxes,
      moneyAmount: 0,
    })
  }

  /** Додає рухи з відвантажень, для яких ще немає OUT-запису */
  async ensureBackfillFromOffloads(clientId: number): Promise<void> {
    const existingOutOffloadIds = (
      await this.movementRepository
        .createQueryBuilder('m')
        .select('DISTINCT offload.id', 'offloadId')
        .leftJoin('m.offload', 'offload')
        .where('m.clientId = :clientId', { clientId })
        .andWhere('m.direction = :direction', {
          direction: EClientMovementDirection.OUT,
        })
        .andWhere('offload.id IS NOT NULL')
        .getRawMany()
    )
      .map((r) => Number(r.offloadId))
      .filter(Boolean)

    const offloads = await this.offloadRepository.find({
      where: { client: { id: clientId } },
      order: { id: 'ASC' },
    })

    for (const offload of offloads) {
      if (existingOutOffloadIds.includes(offload.id)) continue

      const boxesOut = sumBoxes([
        offload.delContainer0_4Out,
        offload.delContainer0_5Out,
        offload.delContainer1_7Out,
        offload.delContainerSchoellerOut,
      ])
      const boxesIn = sumBoxes([
        offload.delContainer0_4In,
        offload.delContainer0_5In,
        offload.delContainer1_7In,
        offload.delContainerSchoellerIn,
      ])
      const priceTotal = Number(offload.priceTotal) || 0
      const paidMoney = Number(offload.paidMoney) || 0
      const operationalDate = offload.createdAt
        ? new Date(offload.createdAt)
        : new Date()
      let inDate = operationalDate
      if (offload.updatedAt && offload.createdAt) {
        const created = new Date(offload.createdAt).getTime()
        const updated = new Date(offload.updatedAt).getTime()
        if (updated > created + 60_000) {
          inDate = new Date(offload.updatedAt)
        }
      }

      if (priceTotal > 0 || boxesOut > 0) {
        await this.createMovement({
          clientId,
          offloadId: offload.id,
          direction: EClientMovementDirection.OUT,
          eventDate: operationalDate,
          boxQuantity: boxesOut,
          moneyAmount: priceTotal,
        })
      }

      if (paidMoney > 0 || boxesIn > 0) {
        await this.createMovement({
          clientId,
          offloadId: offload.id,
          direction: EClientMovementDirection.IN,
          eventDate: inDate,
          boxQuantity: boxesIn,
          moneyAmount: paidMoney,
        })
      }
    }
  }

  async getMovementsByClientId(
    clientId: number,
    query: { page?: number | string; limit?: number | string } = {},
  ): Promise<{
    data: ClientMovement[]
    meta: {
      itemsPerPage: number
      totalItems: number
      currentPage: number
      totalPages: number
    }
  }> {
    const client: Nullable<Client> = await this.clientRepository.findOneBy({
      id: clientId,
    })
    if (!client) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    const page = Math.max(1, Number(query.page) || 1)
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 40))

    // Backfill только на первой странице — не гоняем на каждый «Завантажити ще»
    if (page === 1) {
      await this.ensureBackfillFromOffloads(clientId)
    }

    const totalItems = await this.movementRepository.count({
      where: { client: { id: clientId } },
    })
    const totalPages = Math.max(1, Math.ceil(totalItems / limit) || 1)

    const data = await this.movementRepository
      .createQueryBuilder('m')
      .leftJoinAndSelect('m.offload', 'offload')
      .where('m.clientId = :clientId', { clientId })
      .orderBy('m.eventDate', 'DESC')
      // OUT before IN on the same day (alphabetically OUT > IN)
      .addOrderBy('m.direction', 'DESC')
      .addOrderBy('m.id', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany()

    return {
      data,
      meta: {
        itemsPerPage: limit,
        totalItems,
        currentPage: page,
        totalPages,
      },
    }
  }
}

export { sumBoxes }
