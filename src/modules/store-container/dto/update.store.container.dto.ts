import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class UpdateStoreContainerDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(35)
  @ApiProperty({
    example: 'Store container name',
    description: 'Enter the store container name.',
    type: String,
  })
  readonly name: string

  @IsNumber()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(11)
  @ApiProperty({
    example: 'Store container weight',
    description: 'Enter the store container weight.',
    type: Number,
  })
  readonly weight: number
}
