import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class UpdateChamberDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Chamber 1',
    description: 'Enter the chamber name.',
    type: String,
  })
  readonly name: string

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @ApiProperty({
    example: 3,
    description: 'Enter the maximum possible wave quantity.',
    type: Number,
  })
  readonly waveQuantity: number

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @ApiProperty({
    example: 100,
    description: 'Enter the chamber area by m2.',
    type: Number,
  })
  readonly area: number
}
