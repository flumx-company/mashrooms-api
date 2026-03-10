import { Column, Entity, Index, ManyToOne } from 'typeorm'
import { Transform } from 'class-transformer'

import { ApiProperty } from '@nestjs/swagger'

import { Category } from '@mush/modules/category/category.entity'
import { Variety } from '@mush/modules/variety/variety.entity'
import { Wave } from '@mush/modules/wave/wave.entity'

import { DatedBasicEntity } from '@mush/core/basic-entities'
import { formatDateToDateTime, dateOnlyStringToUTCDate, formatDateForClient } from '@mush/core/utils'

@Entity({ name: 'storages' })
export class Storage extends DatedBasicEntity {
  @ApiProperty({
    example: '15.01.2024',
    description: 'Storage date (день.месяц.год)',
  })
  @Index()
  @Transform(({ value }) => (value != null ? formatDateForClient(value) : value))
  @Column({
    type: 'date',
    transformer: {
      from: (value: Date) => formatDateToDateTime({ value, dateFrom: true }),
      to: (value: string) => dateOnlyStringToUTCDate(value) as Date,
    },
  })
  date: Date

  @ApiProperty({ example: 100, description: 'Stored mushrooms by kg' })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  amount: number

  @ManyToOne(() => Wave, (wave) => wave.storages)
  wave: Wave

  @ManyToOne(() => Variety, (variety) => variety.storages)
  variety: Variety

  @ManyToOne(() => Category, (category) => category.storages)
  category: Category
}
