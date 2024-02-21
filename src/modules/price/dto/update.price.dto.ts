import { IsNotEmpty } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class UpdatePriceDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 200,
    description: 'Enter the price.',
    type: Number,
  })
  readonly price: number
}
