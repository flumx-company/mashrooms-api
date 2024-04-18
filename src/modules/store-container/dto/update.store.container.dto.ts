import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
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
  @Max(99999999)
  @ApiProperty({
    example: 0.5,
    description: 'Enter the store container weight.',
    type: Number,
  })
  readonly weight: number
}
