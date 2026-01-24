import { IsArray, IsNotEmpty, IsNumber, Max, Min, IsString, IsOptional, IsDateString, Matches } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { CreateOffloadRecordDto } from '@mush/modules/offload-record/dto/create.offload.record.dto'
import { YYYY_MM_DD_REGEX } from '@mush/core/utils'

export class CreateOffloadDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(-99999999)
  @Max(99999999)
  @ApiProperty({
    example: 250,
    description: 'Enter the money paid in hryvna.',
    type: Number,
  })
  readonly paidMoney: number

  @IsNumber()
  @IsNotEmpty()
  @Min(-99999999)
  @Max(99999999)
  @ApiProperty({
    example: 250,
    description: 'Enter the money paid in hryvna.',
    type: Number,
  })
  readonly priceTotal: number

  @IsNumber()
  @IsNotEmpty()
  @Min(-99999)
  @Max(99999)
  @ApiProperty({
    example: 250,
    description:
      'Enter the amount of the delivery containers by 1.7 kg, provided by the client.',
    type: Number,
  })
  readonly delContainer1_7In

  @IsNumber()
  @IsNotEmpty()
  @Min(-99999)
  @Max(99999)
  @ApiProperty({
    example: 250,
    description:
      'Enter amount of the delivery containers by 1.7 kg, taken by the client.',
    type: Number,
  })
  readonly delContainer1_7Out

  @IsNumber()
  @IsNotEmpty()
  @Min(-99999)
  @Max(99999)
  @ApiProperty({
    example: 250,
    description:
      'Enter the amount of the delivery containers by 0.5 kg, provided by the client.',
    type: Number,
  })
  readonly delContainer0_5In

  @IsNumber()
  @IsNotEmpty()
  @Min(-99999)
  @Max(99999)
  @ApiProperty({
    example: 250,
    description:
      'Enter the amount of the delivery containers by 0.5 kg, taken by the client.',
    type: Number,
  })
  readonly delContainer0_5Out

  @IsNumber()
  @IsNotEmpty()
  @Min(-99999)
  @Max(99999)
  @ApiProperty({
    example: 250,
    description:
      'Enter the amount of the delivery containers by 0.4 kg, provided by the client.',
    type: Number,
  })
  readonly delContainer0_4In

  @IsNumber()
  @IsNotEmpty()
  @Min(-99999)
  @Max(99999)
  @ApiProperty({
    example: 250,
    description:
      'Enter the amount of the delivery containers by 0.4 kg, taken by the client.',
    type: Number,
  })
  readonly delContainer0_4Out

  @IsNumber()
  @IsNotEmpty()
  @Min(-99999)
  @Max(99999)
  @ApiProperty({
    example: 250,
    description:
      'Enter the amount of the Schoeller delivery containers, provided by the client.',
    type: Number,
  })
  readonly delContainerSchoellerIn

  @IsNumber()
  @IsNotEmpty()
  @Min(-99999)
  @Max(99999)
  @ApiProperty({
    example: 250,
    description:
      'Enter the amount of the Schoeller delivery containers, taken by the client.',
    type: Number,
  })
  readonly delContainerSchoellerOut

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'Some notes',
    description: 'Notes for the offload',
    type: String,
    required: false,
  })
  readonly notes?: string

  @IsDateString()
  @IsOptional()
  @Matches(YYYY_MM_DD_REGEX)
  @ApiProperty({
    example: '2026-01-22',
    description: 'Date of offload creation. If not provided, current date will be used.',
    type: String,
    required: false,
  })
  readonly createdAt?: string

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    example: [1, 2],
    description: 'Массив id смен (shift), участвующих в отгрузке',
    type: [Number],
  })
  readonly loaderShiftIds: number[];

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    example: [
      [
        {
          recordName: 'Record 1',
          batchId: 1,
          waveId: 1,
          varietyId: 1,
          categoryId: 1,
          storeContainerId: 1,
          cuttingDate: '2024-03-27',
          boxQuantity: 2,
          weight: 5,
          pricePerKg: 12,
        },
      ],
    ],
    description:
      'Enter the array of arrays. Each of inner arrays is a group of offload records, which have same pricePerKg.',
    type: Array<Array<CreateOffloadRecordDto>>,
  })
  readonly offloadRecords
}
