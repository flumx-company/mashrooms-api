import { Column, Entity, ManyToOne, OneToMany } from 'typeorm'

import { ApiProperty } from '@nestjs/swagger'

import { Client } from '@mush/modules/client/client.entity'
import { User } from '@mush/modules/core-module/user/user.entity'
import { Driver } from '@mush/modules/driver/driver.entity'
import { OffloadRecord } from '@mush/modules/offload-record/offload-record.entity'

import { DatedBasicEntity } from '@mush/core/basic-entities'

@Entity({ name: 'offloads' })
export class Offload extends DatedBasicEntity {
  @ManyToOne(() => User, (user) => user.offloads, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
    orphanedRowAction: 'delete',
  })
  author: User

  @ManyToOne(() => Client, (client) => client.offloads, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
    orphanedRowAction: 'delete',
  })
  client: Client

  @ManyToOne(() => Driver, (driver) => driver.offloads, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
    orphanedRowAction: 'delete',
  })
  driver: Driver

  @OneToMany(() => OffloadRecord, (record) => record.offload)
  offloadRecords: OffloadRecord[]

  @ApiProperty({
    example: 200,
    description: 'Total price of the mushrooms in hryvna',
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  priceTotal: number

  @ApiProperty({
    example: 200,
    description: 'The money paid in hryvna',
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  paidMoney: number

  @ApiProperty({
    example: 200,
    description:
      'The amount of the delivery containers by 1.7 kg, provided by the client.',
  })
  @Column({ type: 'decimal', precision: 5, scale: 0, default: 0 })
  delContainer1_7In: number

  @ApiProperty({
    example: 200,
    description:
      'The amount of the delivery containers by 1.7 kg, taken by the client.',
  })
  @Column({ type: 'decimal', precision: 5, scale: 0, default: 0 })
  delContainer1_7Out: number

  @ApiProperty({
    example: 200,
    description:
      'The amount of the delivery containers by 0.5 kg, provided by the client.',
  })
  @Column({ type: 'decimal', precision: 5, scale: 0, default: 0 })
  delContainer0_5In: number

  @ApiProperty({
    example: 200,
    description:
      'The amount of the delivery containers by 0.5 kg, taken by the client.',
  })
  @Column({ type: 'decimal', precision: 5, scale: 0, default: 0 })
  delContainer0_5Out: number

  @ApiProperty({
    example: 200,
    description:
      'The amount of the delivery containers by 0.4 kg, provided by the client.',
  })
  @Column({ type: 'decimal', precision: 5, scale: 0, default: 0 })
  delContainer0_4In: number

  @ApiProperty({
    example: 200,
    description:
      'The amount of the delivery containers by 0.4 kg, taken by the client.',
  })
  @Column({ type: 'decimal', precision: 5, scale: 0, default: 0 })
  delContainer0_4Out: number

  @ApiProperty({
    example: 200,
    description:
      'The amount of the Schoeller delivery containers, provided by the client.',
  })
  @Column({ type: 'decimal', precision: 5, scale: 0, default: 0 })
  delContainerSchoellerIn: number

  @ApiProperty({
    example: 200,
    description:
      'The amount of the Schoeller delivery containers, taken by the client.',
  })
  @Column({ type: 'decimal', precision: 5, scale: 0, default: 0 })
  delContainerSchoellerOut: number

  @ApiProperty({
    example: true,
    description: "User's active status. Boolean value.",
  })
  @Column({ type: 'boolean', default: false, nullable: true })
  isClosed: boolean

  @ApiProperty({
    example: 'Offload closure description',
    description: 'Offload closure description',
  })
  @Column({ type: 'varchar', length: 255, default: null, nullable: true })
  closureDescription: string
}
