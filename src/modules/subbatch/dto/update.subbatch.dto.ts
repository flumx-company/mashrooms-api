import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class UpdateSubbatchDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 1,
    description: 'Enter the id of the subbatch.',
    type: Number,
  })
  readonly id: number

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @ApiProperty({
    example: 100,
    description: 'Enter the briquette quantity.',
    type: Number,
  })
  readonly briquetteQuantity: number


  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Compost supplier 1',
    description: 'Enter compost supplier.',
    type: String,
  })
  readonly compostSupplier: string

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @ApiProperty({
    example: 100,
    description: 'Enter the compost weight by kg.',
    type: Number,
  })
  readonly compostWeight: number

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2024-01-15',
    description: 'Enter the compost load date.',
    type: String,
  })
  readonly compostLoadDate: string

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @ApiProperty({
    example: 100,
    description: 'Enter the compost price.',
    type: Number,
  })
  readonly compostPrice: number
}
