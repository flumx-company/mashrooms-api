import { Column, Entity, ManyToOne } from 'typeorm'
import { Transform } from 'class-transformer'

import { ApiProperty } from '@nestjs/swagger'

import { Batch } from '@mush/modules/batch/batch.entity'
import { Category } from '@mush/modules/category/category.entity'

import { DatedBasicEntity } from '@mush/core/basic-entities'
import { formatDateToDateTime, dateOnlyStringToUTCDate, formatDateForClient } from '@mush/core/utils'

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
    example: '15.01.2024',
    description: 'Compost load date (день.месяц.год)',
  })
  @Transform(({ value }) => (value != null ? formatDateForClient(value) : value))
  @Column({
    type: 'date',
    default: null,
    nullable: true,
    transformer: {
      from: (value: Date) => {
        return formatDateToDateTime({ value })
      },
      to: (value: string) => {
        return value ? (dateOnlyStringToUTCDate(value) as Date) : null;
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
  @Column({ type: 'decimal', precision: 10, scale: 2, default: null, nullable: true })
  compostWeight: number

  @ApiProperty({ example: 100, description: 'Compost price' })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: null, nullable: true })
  compostPrice: number
}
