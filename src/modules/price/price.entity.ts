import { Column, Entity } from 'typeorm'

import { ApiProperty } from '@nestjs/swagger'

import { DatedBasicEntity } from '@mush/core/basic-entities'
import { EPriceTenant } from '@mush/core/enums'
import { formatDateToDateTime } from '@mush/core/utils'

@Entity({ name: 'prices' })
export class Price extends DatedBasicEntity {
  @ApiProperty({
    example: 'BARREL',
    description: 'Enum: BARREL, BOX, KITCHEN. Payment entity.',
  })
  @Column({ type: 'enum', enum: EPriceTenant, default: EPriceTenant.BARREL })
  tenant: EPriceTenant

  @ApiProperty({
    example: '20.00',
    description: 'Category description',
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: string

  @ApiProperty({
    example: '2024-01-15 23:00:00',
    description: 'Start time',
  })
  @Column({
    type: 'date',
    transformer: {
      from: (value: string) => new Date(value),
      to: (value: Date) => formatDateToDateTime(value),
    },
  })
  startTime: Date

  @ApiProperty({
    example: '2024-01-15 23:59:59',
    description: 'End time',
  })
  @Column({
    type: 'date',
    transformer: {
      from: (value: string) => new Date(value),
      to: (value: Date) => formatDateToDateTime(value),
    },
  })
  endTime: Date
}
