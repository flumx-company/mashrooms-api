import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  Matches,
  Min,
} from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { YYYY_MM_DD_REGEX } from '@mush/core/utils'

interface WorkRecordEmployee {
  employeeId: number
  percent: number
  reward: number
}

export class CreateWorkRecordDto {
  @IsDateString()
  @IsNotEmpty()
  @Matches(YYYY_MM_DD_REGEX)
  @ApiProperty({
    example: '2024-01-25',
    description: 'Enter the work date.',
    type: String,
  })
  readonly date: string

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @ApiProperty({
    example: 1000,
    description: 'Enter the amount which will be divided among the employee.',
    type: Number,
  })
  readonly dividedAmount: number

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @ApiProperty({
    example: [
      { employeeId: 1, percent: 0.45, reward: 0 },
      { employeeId: 1, percent: 0.55, reward: 100 },
    ],
    description:
      'Provide an array of objects with employeeId, percent and reward.',
    type: Object,
    isArray: true,
  })
  readonly employees: WorkRecordEmployee[]

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @ApiProperty({
    example: 1,
    description: 'Provide chamber id.',
    type: Number,
  })
  readonly chamberId: number
}
