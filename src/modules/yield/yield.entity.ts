import { Column, Entity, ManyToOne } from 'typeorm'

import { ApiProperty } from '@nestjs/swagger'

import { Batch } from '@mush/modules/batch/batch.entity'
import { Category } from '@mush/modules/category/category.entity'
import { Variety } from '@mush/modules/variety/variety.entity'
import { Wave } from '@mush/modules/wave/wave.entity'

import { DatedBasicEntity } from '@mush/core/basic-entities'
import { formatDateToDateTime } from '@mush/core/utils'

@Entity({ name: 'yields' })
export class Yield extends DatedBasicEntity {
  @ManyToOne(() => Category, (category) => category.yields)
  category: Category

  @ManyToOne(() => Variety, (variety) => variety.yields)
  variety: Variety

  @ManyToOne(() => Batch, (batch) => batch.yields)
  batch: Batch

  @ManyToOne(() => Wave, (wave) => wave.yields)
  wave: Wave

  @ApiProperty({
    example: '2024-01-15',
    description: 'date',
  })
  @Column({
    type: 'date',
    transformer: {
      from: (value: Date) => formatDateToDateTime({ value }),
      to: (value: string) => new Date(value),
    },
  })
  date: Date

  @ApiProperty({
    example: true,
    description: 'Weight in kg.',
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  weight: number

  @ApiProperty({
    example: true,
    description: 'Box quantity.',
  })
  @Column({ type: 'decimal', precision: 5, scale: 0, default: 0 })
  boxQuantity: number

  @ApiProperty({
    example: true,
    description: 'Percentage value. Example: 0.15 means 15%.',
  })
  @Column({ type: 'decimal', precision: 6, scale: 5, default: 0 })
  percent: number
}
