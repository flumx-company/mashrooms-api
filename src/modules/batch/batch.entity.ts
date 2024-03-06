import { Column, Entity, ManyToOne, OneToMany } from 'typeorm'

import { ApiProperty } from '@nestjs/swagger'

import { Chamber } from '@mush/modules/chamber/chamber.entity'
import { Wave } from '@mush/modules/wave/wave.entity'

import { DatedBasicEntity } from '@mush/core/basic-entities'
import { formatDateToDateTime } from '@mush/core/utils'

@Entity({ name: 'batches' })
export class Batch extends DatedBasicEntity {
  @ApiProperty({
    example: '2024-01',
    description: 'Batch name',
  })
  @Column({ type: 'varchar', length: 8, default: null, nullable: true })
  name: string

  @ApiProperty({
    example: 'Compost Supplier 1',
    description: 'Compost supplier name',
  })
  @Column({ type: 'varchar', length: 50, default: null, nullable: true })
  compostSupplier: string

  @ApiProperty({ example: 100, description: 'Compost weight by kg' })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  compostWeight: number

  @ApiProperty({ example: 100, description: 'Briquette quantity' })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  briquetteQuantity: number

  @ApiProperty({ example: 100, description: 'Compost price' })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  compostPrice: number

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

  @ApiProperty({ example: 3, description: 'Maximum possible wave quantity' })
  @Column({ type: 'decimal', precision: 3, scale: 0, default: 0 })
  @ApiProperty({
    example: '2024-01-15',
    description: 'Batch start date',
  })
  @Column({
    type: 'date',
    transformer: {
      from: (value: Date) => {
        return formatDateToDateTime({ value, dateFrom: true })
      },
      to: (value: string) => {
        return new Date(value)
      },
    },
  })
  dateFrom: Date

  @ApiProperty({
    example: '2024-01-15',
    description: 'Batch end date',
  })
  @Column({
    type: 'date',
    default: null,
    transformer: {
      from: (value: Date) => {
        return formatDateToDateTime({ value, dateFrom: false })
      },
      to: (value: string) => {
        return value ? new Date(value) : value
      },
    },
  })
  dateTo: Date

  @ApiProperty({ example: 3, description: 'Maximum wave quantity' })
  @Column({ type: 'decimal', precision: 2, scale: 0, default: 0 })
  waveQuantity: number

  @ManyToOne(() => Chamber, (chamber) => chamber.batches)
  chamber: Chamber

  @OneToMany(() => Wave, (wave) => wave.batch)
  waves: Wave[]
}
