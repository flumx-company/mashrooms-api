import { IsNotEmpty, IsNumber, Min } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { UpdateSubbatchDto } from '@mush/modules/subbatch/dto'

export class UpdateBatchDto {
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
  @IsNumber()
  @Min(1)
  @ApiProperty({
    example: 3,
    description: 'Enter the maximum possible number of waves.',
    type: Number,
  })
  readonly waveQuantity: number

  @IsNotEmpty()
  @ApiProperty({
    example: [
      {
        id: 1,
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
        id: 2,
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
    type: UpdateSubbatchDto,
    isArray: true,
  })
  readonly subbatches: UpdateSubbatchDto[]
}
