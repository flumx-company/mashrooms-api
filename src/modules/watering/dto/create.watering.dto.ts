import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

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

  @IsString()
  @MinLength(0)
  @MaxLength(50)
  @ApiProperty({
    example: '',
    description: 'Enter the drug if it was used.',
    type: String,
  })
  readonly drug: string
}
