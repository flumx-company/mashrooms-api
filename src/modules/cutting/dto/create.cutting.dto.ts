import { IsNotEmpty } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class CreateCuttingDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 200,
    description: 'Enter the quantity of boxes that were gathered.',
    type: Number,
  })
  readonly boxQuantity: number

  @IsNotEmpty()
  @ApiProperty({
    example: 200,
    description: 'Enter the trip number.',
    type: Number,
  })
  readonly trip: number

  @IsNotEmpty()
  @ApiProperty({
    example: 1,
    description: 'Enter the shiftId of the cutter.',
    type: Number,
  })
  readonly shiftId: number
}
