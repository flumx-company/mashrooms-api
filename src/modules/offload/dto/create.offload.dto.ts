import { IsArray, IsNotEmpty, IsNumber, Max, Min } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { CreateOffloadRecordDto } from '@mush/modules/offload-record/dto/create.offload.record.dto'

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

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    example: [
      [
        {
          batchId: 1,
          waveId: 1,
          varietyId: 1,
          categoryId: 1,
          storeContainerId: 1,
          cuttingDate: '2024-03-27',
          boxQuantity: 2,
          weight: 5,
          pricePerBox: 12,
        },
      ],
    ],
    description:
      'Enter the array of arrays. Each of inner arrays is a group of offload records, which have same pricePerBox.',
    type: Array<Array<CreateOffloadRecordDto>>,
  })
  readonly offloadRecords
}
