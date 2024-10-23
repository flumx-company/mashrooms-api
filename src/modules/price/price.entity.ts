import { Column, Entity, Index } from 'typeorm'

import { ApiProperty } from '@nestjs/swagger'

import { DatedBasicEntity } from '@mush/core/basic-entities'
import { EPriceTenant } from '@mush/core/enums'
import { formatDateToDateTime } from '@mush/core/utils'

@Entity({ name: 'prices' })
export class Price extends DatedBasicEntity {
  @ApiProperty({
    example: 'LITER',
    description: 'Enum: LITER, MEDICATED_LITER, BOX, KITCHEN. Payment entity.',
  })
  @Index()
  @Column({ type: 'enum', enum: EPriceTenant, nullable: true })
  tenant: EPriceTenant

  @ApiProperty({
    example: 200,
    description: 'Price in hryvna',
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number

  @ApiProperty({
    example: '2024-01-15',
    description: 'Date',
  })
  @Index()
  @Column({
    type: 'date',
    transformer: {
      from: (value: Date) => formatDateToDateTime({ value }),
      to: (value: string) => new Date(value),
    },
  })
  date: Date
}
