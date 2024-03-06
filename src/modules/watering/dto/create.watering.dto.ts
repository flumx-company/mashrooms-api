import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { ToBoolean } from '@mush/core/decorators'
import { EWaterTarget } from '@mush/core/enums'
import { YYYY_MM_DD_T_HH_MM_REGEX } from '@mush/core/utils'

export class CreateWateringDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 200,
    description: 'Enter the water volume by litres.',
    type: Number,
  })
  readonly volume: number

  @IsDateString()
  @IsNotEmpty()
  @Matches(YYYY_MM_DD_T_HH_MM_REGEX)
  @ApiProperty({
    example: '2024-03-06T10:15',
    description: 'Enter the date and time of watering start.',
    type: String,
  })
  readonly dateTimeFrom: string

  @IsDateString()
  @IsNotEmpty()
  @Matches(YYYY_MM_DD_T_HH_MM_REGEX)
  @ApiProperty({
    example: '2024-03-06T10:45',
    description: 'Enter the date and time of watering end.',
    type: String,
  })
  readonly dateTimeTo: string

  @IsString()
  @IsEnum(EWaterTarget)
  @ApiProperty({
    example: EWaterTarget.MUSHROOM,
    description: 'Enter the water target: MUSHROOM, PEAT.',
    type: String,
  })
  readonly target: EWaterTarget

  @ToBoolean()
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
    description:
      'tatus indicates if drugs were used in watering. Boolean value.',
    type: Boolean,
  })
  readonly hasDrug: boolean
}
