import { Column, Entity, ManyToOne } from 'typeorm'

import { ApiProperty } from '@nestjs/swagger'

import { Batch } from '@mush/modules/batch/batch.entity'
import { Category } from '@mush/modules/category/category.entity'

import { DatedBasicEntity } from '@mush/core/basic-entities'
import { formatDateToDateTime } from '@mush/core/utils'

@Entity({ name: 'subbatch' })
export class Subbatch extends DatedBasicEntity {
  @ManyToOne(() => Batch, (batch) => batch.subbatches)
  batch: Batch

  @ManyToOne(() => Category, (category) => category.subbatches)
  category: Category

  @ApiProperty({ example: 100, description: 'Briquette quantity' })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  briquetteQuantity: number
  
  @ApiProperty({
    example: '2024-01-15',
    description: 'Compost load date',
  })
  @Column({
    type: 'date',
    transformer: {
      from: (value: Date) => {
        return formatDateToDateTime({ value })
      },
      to: (value: string) => {
        return new Date(value)
      },
    },
  })
  compostLoadDate: Date

  @ApiProperty({
    example: 'Compost Supplier 1',
    description: 'Compost supplier name',
  })
  @Column({ type: 'varchar', length: 50, default: null, nullable: true })
  compostSupplier: string

  @ApiProperty({ example: 100, description: 'Compost weight by kg' })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  compostWeight: number

  @ApiProperty({ example: 100, description: 'Compost price' })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  compostPrice: number

  @ApiProperty({
    example: '2024-01-15',
    description: 'Peat load date',
  })
  @Column({
    type: 'date',
    transformer: {
      from: (value: Date) => {
        return formatDateToDateTime({ value })
      },
      to: (value: string) => {
        return new Date(value)
      },
    },
  })
  peatLoadDate: Date

  @ApiProperty({
    example: 'Peat Supplier 1',
    description: 'Peat supplier name',
  })
  @Column({ type: 'varchar', length: 50, default: null, nullable: true })
  peatSupplier: string

  @ApiProperty({ example: 100, description: 'Peat weight by kg' })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  peatWeight: number

  @ApiProperty({ example: 100, description: 'Peat price' })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  peatPrice: number
}
