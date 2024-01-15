import { IsNotEmpty, IsNumber } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class CreateOffloadDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 5,
    description: `Enter client's id.`,
    type: Number,
  })
  readonly clientId: number
}
