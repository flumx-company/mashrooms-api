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

export class UpdateClientDto {
  @IsString()
  @MaxLength(parseInt(process.env.MAX_FIRST_NAME_LENGTH))
  @MinLength(1)
  @IsNotEmpty()
  @Matches(LATIN_CYRILLIC_LETTER_NAME_REGEX)
  @ApiProperty({
    example: 'John',
    description: 'Enter first name.',
    type: String,
  })
  readonly firstName: string

  @IsString()
  @MaxLength(parseInt(process.env.MAX_LAST_NAME_LENGTH))
  @MinLength(1)
  @IsNotEmpty()
  @Matches(LATIN_CYRILLIC_LETTER_NAME_REGEX)
  @ApiProperty({
    example: 'Johnson',
    description: 'Enter last name.',
    type: String,
  })
  readonly lastName: string

  @IsString()
  @MaxLength(parseInt(process.env.MAX_PATRONYMIC_LENGTH))
  @MinLength(1)
  @IsNotEmpty()
  @Matches(LATIN_CYRILLIC_LETTER_NAME_REGEX)
  @ApiProperty({
    example: 'Johnson',
    description: 'Enter patronymic.',
    type: String,
  })
  readonly patronymic: string

  @IsOptional()
  @IsString()
  @MaxLength(parseInt(process.env.MAX_NICKNAME_LENGTH))
  @MinLength(1)
  @ApiProperty({
    example: 'John Johnson',
    description: 'Enter nickname.',
    type: String,
  })
  readonly nickname: string

  @IsNotEmpty()
  @IsString()
  @Matches(PHONE_REGEX)
  @MaxLength(parseInt(process.env.MAX_PHONE_LENGTH))
  @ApiProperty({
    example: '380681234567',
    description: 'Enter the phone.',
    type: String,
  })
  readonly phone: string

  @IsNumber()
  @Min(-99999999)
  @Max(99999999)
  @ApiProperty({
    example: 0,
    description:
      'Enter the money debt. Positive number means the client owes the company. Negative number means the company owes the client.',
    type: Number,
  })
  readonly moneyDebt: number

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

  @IsNumber()
  @Min(-99999)
  @Max(99999)
  @ApiProperty({
    example: 0,
    description:
      'Enter the Schoeller delivery container debt. Positive number means the client owes the company. Negative number means the company owes the client.',
    type: Number,
  })
  readonly delContainerSchoellerDebt: number
}
