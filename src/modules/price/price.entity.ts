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
    example: 200,
    description: 'Price in hryvna',
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number

  @ApiProperty({
    example: '2024-01-15',
    description: 'Date',
  })
  @Column({
    type: 'date',
    transformer: {
      from: (value: Date) => formatDateToDateTime({ value }),
      to: (value: string) => new Date(value),
    },
  })
  date: Date
}
