import { Column, Entity, Index } from 'typeorm'
import { Transform } from 'class-transformer'

import { ApiProperty } from '@nestjs/swagger'

import { DatedBasicEntity } from '@mush/core/basic-entities'
import { EPriceTenant } from '@mush/core/enums'
import { formatDateToDateTime, dateOnlyStringToUTCDate, formatDateForClient } from '@mush/core/utils'

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
    example: '15.01.2024',
    description: 'Date (день.месяц.год)',
  })
  @Index()
  @Transform(({ value }) => (value != null ? formatDateForClient(value) : value))
  @Column({
    type: 'date',
    transformer: {
      from: (value: Date) => formatDateToDateTime({ value }),
      to: (value: string) => dateOnlyStringToUTCDate(value) as Date,
    },
  })
  date: Date
}
