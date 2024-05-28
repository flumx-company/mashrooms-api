import { IsNotEmpty, IsNumber, IsString, Min, IsOptional } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class CreateSubbatchDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 1,
    description: 'Enter the categoryId of the subbatch.',
    type: Number,
  })
  readonly categoryId: number

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @ApiProperty({
    example: 100,
    description: 'Enter the briquette quantity.',
    type: Number,
  })
  readonly briquetteQuantity: number


  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Compost supplier 1',
    description: 'Enter compost supplier.',
    type: String,
  })
  readonly compostSupplier: string

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @ApiProperty({
    example: 100,
    description: 'Enter the compost weight by kg.',
    type: Number,
  })
  readonly compostWeight: number

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2024-01-15',
    description: 'Enter the compost load date.',
    type: String,
  })
  readonly compostLoadDate: string

  @IsOptional()
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
