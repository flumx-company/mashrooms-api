import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { ToBoolean } from '@mush/core/decorators'
import { EPermission, EPosition } from '@mush/core/enums'
import {
  LATIN_CYRILLIC_LETTER_NAME_REGEX,
  PASSWORD_REGEX,
  PHONE_REGEX,
} from '@mush/core/utils'

export class CreateUserDto {
  @IsString()
  @MaxLength(20)
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
  @MaxLength(50)
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
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'test@gmail.com',
    description: 'Enter the email address.',
    type: String,
  })
  readonly email: string

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
  @MinLength(8)
  @IsNotEmpty()
  @Matches(PASSWORD_REGEX)
  @ApiProperty({
    example: '123Abc!_z',
    description: 'Enter password.',
    type: String,
  })
  readonly password: string

  @IsArray()
  @ApiProperty({
    example: Object.values(EPermission).filter(
      (permission) => !permission.includes('ADMINS'),
    ),
    description: 'Add permissions.',
    type: Array,
  })
  readonly permissions: EPermission[]

  @IsString()
  @IsEnum(EPosition)
  @ApiProperty({
    example: EPosition.FOREMAN,
    description: 'Enter the position.',
    type: String,
  })
  readonly position: EPosition

  @ToBoolean()
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
    description: 'Enter the active status boolean value.',
    type: Boolean,
  })
  readonly isActive: boolean
}