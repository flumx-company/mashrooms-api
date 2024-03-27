import { IsNotEmpty, Max, Min } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class CreateCuttingDto {
  @IsNotEmpty()
  @Min(1)
  @Max(99999)
  @ApiProperty({
    example: 5,
    description: 'Enter the quantity of boxes that were gathered.',
    type: Number,
  })
  readonly boxQuantity: number

  @IsNotEmpty()
  @ApiProperty({
    example: 2,
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
  readonly cutterShiftId: number

  @IsNotEmpty()
  @ApiProperty({
    example: 1,
    description: 'Enter the shiftId of the loader.',
    type: Number,
  })
  readonly loaderShiftId: number

  @IsNotEmpty()
  @ApiProperty({
    example: 1,
    description: 'Enter the varietyId of the cut mushrooms.',
    type: Number,
  })
  readonly varietyId: number
}
