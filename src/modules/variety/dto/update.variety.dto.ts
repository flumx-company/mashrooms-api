import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { ToBoolean } from '@mush/core/decorators'

export class UpdateVarietyDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(35)
  @ApiProperty({
    example: 'Variety name',
    description: 'Enter the variety name.',
    type: String,
  })
  readonly name: string

  @ToBoolean()
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
    description: 'Enter boolean value if an employee is unreliable.',
    type: Boolean,
  })
  readonly isCutterPaid: boolean
}
