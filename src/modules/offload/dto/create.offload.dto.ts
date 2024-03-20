import { IsDateString, IsNotEmpty, IsNumber, Matches } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { YYYY_MM_DD_REGEX } from '@mush/core/utils'

export class CreateOffloadDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 5,
    description: 'Enter batchId.',
    type: Number,
  })
  readonly batchId: number

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 5,
    description: 'Enter waveId.',
    type: Number,
  })
  readonly waveId: number

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 5,
    description: 'Enter varietyId.',
    type: Number,
  })
  readonly varietyId: number

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 5,
    description: 'Enter categoryId.',
    type: Number,
  })
  readonly categoryId: number

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 5,
    description: 'Enter storeContainerId.',
    type: Number,
  })
  readonly storeContainerId: number

  @IsDateString()
  @IsNotEmpty()
  @Matches(YYYY_MM_DD_REGEX)
  @ApiProperty({
    example: '2024-01-25',
    description: 'Enter the cutting date.',
    type: String,
  })
  readonly cuttingDate: string

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 20,
    description: 'Enter box amount.',
    type: Number,
  })
  readonly amount: number

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 20,
    description: 'Enter weight in kg.',
    type: Number,
  })
  readonly weight: number

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 250,
    description: 'Enter price per kg in hryvna.',
    type: Number,
  })
  readonly price: number
}
