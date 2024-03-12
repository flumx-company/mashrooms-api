import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class CreateStorageDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2024-01-15',
    description: 'Enter the compost load date.',
    type: String,
  })
  readonly date: string

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @ApiProperty({
    example: 100,
    description: 'Enter the amount of boxes with mushrooms.',
    type: Number,
  })
  readonly amount: number
}
