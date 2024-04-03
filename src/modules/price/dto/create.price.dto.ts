import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { EPriceTenant } from '@mush/core/enums'
import { YYYY_MM_DD_REGEX } from '@mush/core/utils'

export class CreatePriceDto {
  @IsString()
  @IsEnum(EPriceTenant)
  @ApiProperty({
    example: EPriceTenant.BOX,
    description: 'Enter the tenant.',
    type: String,
  })
  readonly tenant: EPriceTenant

  @IsNotEmpty()
  @ApiProperty({
    example: 200,
    description: 'Enter the price.',
    type: Number,
  })
  readonly price: number

  @IsDateString()
  @IsNotEmpty()
  @Matches(YYYY_MM_DD_REGEX)
  @ApiProperty({
    example: '2024-01-25',
    description: 'Enter the date.',
    type: String,
  })
  readonly date: string
}
