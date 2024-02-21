import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { ToBoolean } from '@mush/core/decorators'
import { LATIN_CYRILLIC_LETTER_TITLE_REGEX } from '@mush/core/utils'

export class UpdateWorkDto {
  @IsString()
  @MaxLength(parseInt(process.env.MAX_WORK_TITLE))
  @MinLength(1)
  @IsNotEmpty()
  @Matches(LATIN_CYRILLIC_LETTER_TITLE_REGEX)
  @ApiProperty({
    example: 'Take photos',
    description: `Work title. Max length is ${process.env.MAX_WORK_TITLE} characters.`,
    type: String,
  })
  readonly title: string

  @ToBoolean()
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
    description: "Work's regular status. Boolean value.",
    type: Boolean,
  })
  readonly isRegular: boolean

  @IsNumber()
  @ApiProperty({
    example: 150,
    description: "Work's price. Will be used as initial value.",
    type: Number,
  })
  readonly price: number
}
