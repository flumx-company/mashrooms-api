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
import { LATIN_CYRILLIC_LETTER_NAME_REGEX, PHONE_REGEX } from '@mush/core/utils'

const availablePermissions = Object.values(EPermission).filter(
  (permission) => !permission.includes('ADMINS'),
)

export class UpdateUserDto {
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

  @IsArray()
  @ApiProperty({
    example: availablePermissions,
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
