import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { ToBoolean } from '@mush/core/decorators'

export class EditOffloadDto {
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

  @ToBoolean()
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
    description: 'Enter boolean value if the offload is closed.',
    type: Boolean,
  })
  readonly isClosed: boolean

  @IsString()
  @MaxLength(255)
  @ApiProperty({
    example: 'Offload closure description',
    description: 'Offload closure description',
    type: String,
  })
  readonly closureDescription: string
}
