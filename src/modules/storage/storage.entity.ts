import { Column, Entity, Index, ManyToOne } from 'typeorm'

import { ApiProperty } from '@nestjs/swagger'

import { Category } from '@mush/modules/category/category.entity'
import { Variety } from '@mush/modules/variety/variety.entity'
import { Wave } from '@mush/modules/wave/wave.entity'

import { DatedBasicEntity } from '@mush/core/basic-entities'
import { formatDateToDateTime } from '@mush/core/utils'

@Entity({ name: 'storages' })
export class Storage extends DatedBasicEntity {
  @ApiProperty({
    example: '2024-01-15',
    description: 'Storage date',
  })
  @Index()
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
