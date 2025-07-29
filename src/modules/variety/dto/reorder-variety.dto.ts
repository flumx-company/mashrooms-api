import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsNotEmpty } from 'class-validator'

export class ReorderVarietyDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 1,
    description: 'ID сорта',
  })
  readonly id: number

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 1,
    description: 'Новый порядковый номер сорта',
  })
  readonly order: number
} 