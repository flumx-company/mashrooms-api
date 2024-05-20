import { Exclude } from 'class-transformer'
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { BufferedFile } from '@mush/modules/file-upload/file.model'

import { ToBoolean } from '@mush/core/decorators'
import { EFileCategory, ERegion } from '@mush/core/enums'
import {
  BANK_CARD_NUMBER_REGEX,
  LATIN_CYRILLIC_LETTER_NAME_REGEX,
  PHONE_REGEX,
} from '@mush/core/utils'

export class CreateEmployeeDto {
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

  @IsString()
  @Matches(PHONE_REGEX)
  @MaxLength(parseInt(process.env.MAX_PHONE_LENGTH))
  @IsNotEmpty()
  @ApiProperty({
    example: '380681234567',
    description: 'Enter the phone.',
    type: String,
  })
  readonly phone: string

  @IsOptional()
  @IsString()
  @Matches(BANK_CARD_NUMBER_REGEX)
  @Length(parseInt(process.env.MAX_BANK_CARD_NUMBER_LENGTH))
  @ApiProperty({
    example: '5375111122223333',
    description: 'Enter the bank card.',
    type: String,
  })
  readonly bankCard: string

  @IsString()
  @IsEnum(ERegion)
  @ApiProperty({
    example: ERegion.DNIPRO,
    description: 'Enter the region.',
    type: String,
  })
  readonly region: ERegion

  @IsString()
  @MaxLength(parseInt(process.env.MAX_TOWN_LENGTH))
  @MinLength(1)
  @IsOptional()
  @ApiProperty({
    example: 'Нью-Васюкі',
    description: 'Enter the town. Optional',
    type: String,
  })
  readonly town: string

  @ToBoolean()
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
    description: 'Enter boolean value if an employee is unreliable.',
    type: Boolean,
  })
  readonly isUnreliable: boolean

  @ToBoolean()
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
    description: 'Enter boolean value if an employee has any criminal records.',
    type: Boolean,
  })
  readonly hasCriminalRecord: boolean;

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
  readonly [EFileCategory.EMPLOYEE_AVATARS]: BufferedFile[];

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
  readonly [EFileCategory.EMPLOYEE_DOCUMENTS]: BufferedFile[]
}
