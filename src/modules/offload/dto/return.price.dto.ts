import { IsArray, IsNotEmpty, IsNumber, Max, Min } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { CreateOffloadRecordDto } from '@mush/modules/offload-record/dto/create.offload.record.dto'

export class ReturnPriceDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(-99999999)
  @Max(99999999)
  @ApiProperty({
    example: 250,
    description: 'Enter the money paid in hryvna.',
    type: Number,
  })
  readonly price: number
}
