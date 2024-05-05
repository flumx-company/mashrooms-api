import { IsNotEmpty, IsNumber, Min } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { CreateSubbatchDto } from '@mush/modules/subbatch/dto'

export class CreateBatchDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @ApiProperty({
    example: 3,
    description: 'Enter the maximum possible number of waves.',
    type: Number,
  })
  readonly waveQuantity: number

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @ApiProperty({
    example: 1,
    description: 'Enter the chamber id.',
    type: Number,
  })
  readonly chamberId: number

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Peat supplier 1',
    description: 'Enter peat supplier.',
    type: String,
  })
  readonly peatSupplier: string

  @IsOptional()
  @IsNumber()
  @Min(1)
  @ApiProperty({
    example: 100,
    description: 'Enter the peat weight by kg.',
    type: Number,
  })
  readonly peatWeight: number

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: '2024-01-25',
    description: 'Enter the peat load date.',
    type: String,
  })
  readonly peatLoadDate: string

  @IsOptional()
  @IsNumber()
  @Min(1)
  @ApiProperty({
    example: 100,
    description: 'Enter the peat price.',
    type: Number,
  })
  readonly peatPrice: number
  
  @IsNotEmpty()
  @ApiProperty({
    example: [
      {
        categoryId: 1,
        compostSupplier: 'Compost supplier 1',
        compostWeight: 100,
        compostLoadDate: '2024-01-15',
        compostPrice: 100,
        peatSupplier: 'Peat supplier 1',
        peatWeight: 100,
        peatLoadDate: '2024-01-25',
        peatPrice: 100,
      },
      {
        categoryId: 2,
        compostSupplier: 'Compost supplier 2',
        compostWeight: 100,
        compostLoadDate: '2024-01-15',
        compostPrice: 100,
        peatSupplier: 'Peat supplier 2',
        peatWeight: 100,
        peatLoadDate: '2024-01-25',
        peatPrice: 100,
      },
    ],
    description: 'Enter the subbatch data.',
    type: CreateSubbatchDto,
    isArray: true,
  })
  readonly subbatches: CreateSubbatchDto[]
}
