import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  IsOptional
} from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { LATIN_CYRILLIC_LETTER_NAME_REGEX, PHONE_REGEX } from '@mush/core/utils'

export class ReturnBoxDto {
  @IsNumber()
  @Min(-99999)
  @Max(99999)
  @ApiProperty({
    example: 0,
    description:
      'Enter the 1.7 kg delivery container debt. Positive number means the client owes the company. Negative number means the company owes the client.',
    type: Number,
  })
  readonly delContainer1_7Debt: number

  @IsNumber()
  @Min(-99999)
  @Max(99999)
  @ApiProperty({
    example: 0,
    description:
      'Enter the 0.5 kg delivery container debt. Positive number means the client owes the company. Negative number means the company owes the client.',
    type: Number,
  })
  readonly delContainer0_5Debt: number

  @IsNumber()
  @Min(-99999)
  @Max(99999)
  @ApiProperty({
    example: 0,
    description:
      'Enter the 0.4 kg delivery container debt. Positive number means the client owes the company. Negative number means the company owes the client.',
    type: Number,
  })
  readonly delContainer0_4Debt: number
}
