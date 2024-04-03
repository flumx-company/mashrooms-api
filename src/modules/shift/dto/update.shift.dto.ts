import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { ToBoolean } from '@mush/core/decorators'
import { EPaymentMethod } from '@mush/core/enums'

export class UpdateShiftDto {
  @ToBoolean()
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: false,
    description:
      'The status indicates if an employee has returned the knife. Boolean value.',
    type: Boolean,
  })
  readonly returnsKnife: boolean

  @ToBoolean()
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: false,
    description:
      'The status indicates if an employee has returned the bed sheets. Boolean value.',
    type: Boolean,
  })
  readonly returnsBedSheets: boolean

  @ToBoolean()
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: false,
    description:
      'The status indicates if an employee has returned the wardrobe key. Boolean value.',
    type: Boolean,
  })
  readonly returnsWardrobeKey: boolean

  @ToBoolean()
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: false,
    description:
      'The status indicates if an employee has covered the kitchen expanses. Boolean value.',
    type: Boolean,
  })
  readonly paysForKitchen: boolean

  @IsString()
  @IsEnum(EPaymentMethod)
  @ApiProperty({
    example: EPaymentMethod.CASH,
    description: 'The payment method used for "paysForKitchen" status.',
    type: String,
  })
  readonly kitchenPaymentMethod: EPaymentMethod

  @IsNotEmpty()
  @ApiProperty({
    example: 0,
    description: 'This bonus is given by the employer whenever he decides.',
    type: Number,
  })
  readonly customBonus: number

  @IsString()
  @MaxLength(255)
  @ApiProperty({
    example: 'Description for the custom bonus.',
    description: 'Description for the custom bonus.',
    type: String,
  })
  readonly customBonusDescription: string

  @IsNotEmpty()
  @ApiProperty({
    example: 0,
    description: 'Enter the price.',
    type: Number,
  })
  readonly paidAmount: number
}
