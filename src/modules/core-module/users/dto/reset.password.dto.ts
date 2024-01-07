import {
  IsString,
  MaxLength,
  MinLength,
  IsNotEmpty,
  Matches,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

import { PASSWORD_REGEX } from '@utils/index'

export class ResetPasswordDto {
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
}

// (?=.*[0-9]) - строка содержит хотя бы одно число;
// (?=.*[!@#$%^&*_]) - строка содержит хотя бы один спецсимвол;
// (?=.*[a-z]) - строка содержит хотя бы одну латинскую букву в нижнем регистре;
// (?=.*[A-Z]) - строка содержит хотя бы одну латинскую букву в верхнем регистре;
// [0-9a-zA-Z!@#$%^&*_]{8,} - строка состоит не менее, чем из 8 вышеупомянутых символов.
