import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { PHONE_REGEX } from '@mush/core/utils'

export class LoginDto {
  @IsString()
  @Matches(PHONE_REGEX)
  @ApiProperty({
    example: '380681234567',
    description: 'Enter the phone.',
    type: String,
  })
  readonly phone: string

  @IsString()
  @MaxLength(15)
  @MinLength(6)
  @IsNotEmpty()
  @ApiProperty({
    example: '123Abc!_z',
    description: 'Enter password.',
    type: String,
  })
  readonly password: string
}
