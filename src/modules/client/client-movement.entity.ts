import { Column, Entity, Index, ManyToOne } from 'typeorm'

import { ApiProperty } from '@nestjs/swagger'

import { Offload } from '@mush/modules/offload/offload.entity'

import { DatedBasicEntity } from '@mush/core/basic-entities'
import { EClientMovementDirection } from '@mush/core/enums'

import { Client } from './client.entity'

@Entity({ name: 'client_movements' })
export class ClientMovement extends DatedBasicEntity {
  @ManyToOne(() => Client, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @Index()
  client: Client

  @ManyToOne(() => Offload, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  @Index()
  offload: Offload | null

  @ApiProperty({
    enum: EClientMovementDirection,
    description: 'OUT = відвантаження клієнту, IN = повернення/оплата',
  })
  @Column({
    type: 'enum',
    enum: EClientMovementDirection,
  })
  @Index()
  direction: EClientMovementDirection

  @ApiProperty({
    description:
      'Дата для відображення: для OUT — операційна дата відвантаження, для IN — момент внесення',
  })
  @Column({ type: 'timestamp' })
  @Index()
  eventDate: Date

  @ApiProperty({
    example: 25,
    description: 'Кількість ящиків (сума типів тари в цьому русі)',
  })
  @Column({ type: 'decimal', precision: 10, scale: 0, default: 0 })
  boxQuantity: number

  @ApiProperty({
    example: 1500,
    description: 'Сума грошей у цьому русі (грн)',
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  moneyAmount: number
}
