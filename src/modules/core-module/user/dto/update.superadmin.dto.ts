import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator'
import * as dotenv from 'dotenv'

import { ApiProperty } from '@nestjs/swagger'

import { LATIN_CYRILLIC_LETTER_NAME_REGEX, PHONE_REGEX } from '@mush/core/utils'

dotenv.config()

export class UpdateSuperadminDto {
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
    description: 'Enter first name.',
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
    description: 'Enter first name.',
    type: String,
  })
  readonly patronymic: string

  @IsString()
  @IsEmail()
  @MaxLength(parseInt(process.env.MAX_PATRONYMIC_LENGTH))
  @ApiProperty({
    example: 'test@gmail.com',
    description: 'Enter the email address.',
    type: String,
  })
  readonly email: string

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
}
