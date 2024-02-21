import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { PHONE_REGEX } from '@mush/core/utils'

export class UpdateDriverDto {
  @IsString()
  @MaxLength(parseInt(process.env.MAX_FIRST_NAME_LENGTH))
  @MinLength(1)
  @IsNotEmpty()
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
  @ApiProperty({
    example: 'Johnson',
    description: 'Enter last name.',
    type: String,
  })
  readonly lastName: string

  @IsString()
  @IsNotEmpty()
  @Matches(PHONE_REGEX)
  @MaxLength(parseInt(process.env.MAX_PHONE_LENGTH))
  @ApiProperty({
    example: '380681234567',
    description: 'Enter the phone.',
    type: String,
  })
  readonly phone: string
}
