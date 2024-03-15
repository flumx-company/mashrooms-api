import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  Min,
} from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

interface WorkRecordEmployee {
  employeeId: number
  percent: number
  reward: number
  id: number
}

export class UpdateWorkRecordDto {
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
      { employeeId: 1, percent: 0.45, reward: 0, id: 13 },
      { employeeId: 1, percent: 0.55, reward: 100, id: 14 },
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
    description: 'Provide chamberId.',
    type: Number,
  })
  readonly chamberId: number

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @ApiProperty({
    example: 1,
    description: 'Provide workId.',
    type: Number,
  })
  readonly workId: number
}
