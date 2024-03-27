import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  Matches,
  Max,
  Min,
} from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { YYYY_MM_DD_REGEX } from '@mush/core/utils'

export class CreateOffloadRecordDto {
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
  @Min(1)
  @Max(99999)
  @ApiProperty({
    example: 20,
    description: 'Enter box quantity.',
    type: Number,
  })
  readonly boxQuantity: number

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 5,
    description: 'Enter categoryId.',
    type: Number,
  })
  readonly categoryId: number

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
  @Min(-99999999)
  @Max(99999999)
  @ApiProperty({
    example: 250,
    description: 'Enter price per kg in hryvna.',
    type: Number,
  })
  readonly pricePerBox: number

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 5,
    description: 'Enter storeContainerId.',
    type: Number,
  })
  readonly storeContainerId: number

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
    example: 20,
    description: 'Enter weight in kg.',
    type: Number,
  })
  readonly weight: number

  @IsNumber()
  @IsNotEmpty()
  @Min(-99999999)
  @Max(99999999)
  @ApiProperty({
    example: 5,
    description: 'Enter varietyId.',
    type: Number,
  })
  readonly varietyId: number
}
