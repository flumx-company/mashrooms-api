import { Column, Entity, ManyToOne } from 'typeorm'

import { ApiProperty } from '@nestjs/swagger'

import { Batch } from '@mush/modules/batch/batch.entity'
import { Category } from '@mush/modules/category/category.entity'
import { Client } from '@mush/modules/client/client.entity'
import { User } from '@mush/modules/core-module/user/user.entity'
import { Driver } from '@mush/modules/driver/driver.entity'
import { StoreContainer } from '@mush/modules/store-container/store-container.entity'
import { Variety } from '@mush/modules/variety/variety.entity'
import { Wave } from '@mush/modules/wave/wave.entity'

import { DatedBasicEntity } from '@mush/core/basic-entities'
import { formatDateToDateTime } from '@mush/core/utils'

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

  @ManyToOne(
    () => StoreContainer,
    (storeContainer) => storeContainer.offloads,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      nullable: false,
      orphanedRowAction: 'delete',
    },
  )
  storeContainer: StoreContainer

  @ManyToOne(() => Category, (category) => category.offloads, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
    orphanedRowAction: 'delete',
  })
  category: Category

  @ManyToOne(() => Wave, (wave) => wave.offloads, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
    orphanedRowAction: 'delete',
  })
  wave: Wave

  @ManyToOne(() => Variety, (variety) => variety.offloads, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
    orphanedRowAction: 'delete',
  })
  variety: Variety

  @ManyToOne(() => Batch, (batch) => batch.offloads, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
    orphanedRowAction: 'delete',
  })
  batch: Batch

  @ApiProperty({
    example: '2024-01-15',
    description: 'Cutting date',
  })
  @Column({
    type: 'date',
    transformer: {
      from: (value: Date) => formatDateToDateTime({ value }),
      to: (value: string) => new Date(value),
    },
  })
  cuttingDate: Date

  @ApiProperty({
    example: true,
    description: 'Weight in kg.',
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  weight: number

  @ApiProperty({
    example: true,
    description: 'Box amounnt.',
  })
  @Column({ type: 'decimal', precision: 5, scale: 0, default: 0 })
  amount: number

  @ApiProperty({
    example: 200,
    description: 'Price in hryvna',
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number

  @ApiProperty({
    example: true,
    description: 'Commmon id for all offloads in the document.',
  })
  @Column({ type: 'decimal', precision: 15, scale: 0, default: 0 })
  docId: number

  @ApiProperty({
    example: true,
    description:
      'Commmon id for all offloads in one price group of the document.',
  })
  @Column({ type: 'decimal', precision: 16, scale: 0, default: 0 })
  priceId: number
}
