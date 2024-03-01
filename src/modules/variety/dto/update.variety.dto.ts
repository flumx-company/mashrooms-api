import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

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
}
