import { Exclude, Type } from 'class-transformer'
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { BufferedFile } from '@mush/modules/file-upload/file.model'

import { EFileCategory } from '@mush/core/enums'
import { LATIN_CYRILLIC_LETTER_NAME_REGEX, PHONE_REGEX } from '@mush/core/utils'

export class CreateClientDto {
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
    example: 'Johnovic',
    description: 'Enter patronymic.',
    type: String,
  })
  readonly patronymic: string

  @IsString()
  @MaxLength(parseInt(process.env.MAX_NICKNAME_LENGTH))
  @MinLength(1)
  @IsNotEmpty()
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
  readonly phone: string;

  @Exclude()
  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    description: 'Select files for feed.',
    required: false,
  })
  @IsOptional()
  readonly [EFileCategory.CLIENT_FILES]: BufferedFile[]

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(-99999999)
  @Max(99999999)
  @ApiProperty({
    example: 0,
    nullable: true,
    description:
      'Enter the money debt. Positive number means the client owes the company. Negative number means the company owes the client.',
    type: Number,
  })
  readonly moneyDebt: number

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(-99999)
  @Max(99999)
  @ApiProperty({
    example: 0,
    nullable: true,
    description:
      'Enter the 1.7 kg delivery container debt. Positive number means the client owes the company. Negative number means the company owes the client.',
    type: Number,
  })
  readonly delContainer1_7Debt: number

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(-99999)
  @Max(99999)
  @ApiProperty({
    example: 0,
    nullable: true,
    description:
      'Enter the 0.5 kg delivery container debt. Positive number means the client owes the company. Negative number means the company owes the client.',
    type: Number,
  })
  readonly delContainer0_5Debt: number

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(-99999)
  @Max(99999)
  @ApiProperty({
    example: 0,
    nullable: true,
    description:
      'Enter the 0.4 kg delivery container debt. Positive number means the client owes the company. Negative number means the company owes the client.',
    type: Number,
  })
  readonly delContainer0_4Debt: number

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(-99999)
  @Max(99999)
  @ApiProperty({
    example: 0,
    nullable: true,
    description:
      'Enter the Schoeller delivery container debt. Positive number means the client owes the company. Negative number means the company owes the client.',
    type: Number,
  })
  readonly delContainerSchoellerDebt: number
}
