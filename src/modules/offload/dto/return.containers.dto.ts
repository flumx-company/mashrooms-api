import { IsArray, IsNotEmpty, IsNumber, Max, Min } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { CreateOffloadRecordDto } from '@mush/modules/offload-record/dto/create.offload.record.dto'

export class ReturnContainersDto {
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
  readonly delContainer1_7

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
  readonly delContainer0_5


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
  readonly delContainer0_4

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
  readonly delContainerSchoeller
}