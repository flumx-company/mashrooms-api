import {
  IsBoolean,
  IsEnum,
  IsNotEmpty, IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger'

import { ToBoolean } from '@mush/core/decorators'
import { EPaymentMethod } from '@mush/core/enums'

export class UpdateShiftDto {
  @IsOptional()
  @ToBoolean()
  @IsBoolean()
  @ApiProperty({
    example: false,
    description:
      'The status indicates if an employee has returned the knife. Boolean value.',
    type: Boolean,
  })
  readonly returnsKnife: boolean

  @IsOptional()
  @ToBoolean()
  @IsBoolean()
  @ApiProperty({
    example: false,
    description:
      'The status indicates if an employee has returned the bed sheets. Boolean value.',
    type: Boolean,
  })
  readonly returnsBedSheets: boolean

  @IsOptional()
  @ToBoolean()
  @IsBoolean()
  @ApiProperty({
    example: false,
    description:
      'The status indicates if an employee has returned the wardrobe key. Boolean value.',
    type: Boolean,
  })
  readonly returnsWardrobeKey: boolean

  @IsOptional()
  @ToBoolean()
  @IsBoolean()
  @ApiProperty({
    example: false,
    description:
      'The status indicates if an employee has covered the kitchen expanses. Boolean value.',
    type: Boolean,
  })
  readonly paysForKitchen: boolean

  @IsOptional()
  @IsString()
  @IsEnum(EPaymentMethod)
  @ApiProperty({
    example: EPaymentMethod.CASH,
    description: 'The payment method used for "paysForKitchen" status.',
    type: String,
  })
  readonly kitchenPaymentMethod: EPaymentMethod

  @IsOptional()
  @ApiProperty({
    example: 0,
    description: 'This bonus is given by the employer whenever he decides.',
    type: Number,
  })
  readonly customBonus: number

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiProperty({
    example: 'Description for the custom bonus.',
    description: 'Description for the custom bonus.',
    type: String,
  })
  readonly customBonusDescription: string

  @IsOptional()
  @ApiProperty({
    example: 0,
    description: 'Enter the price.',
    type: Number,
  })
  readonly paidAmount: number

  @IsOptional()
  @ApiProperty({
    example: 0,
    description: 'Enter the bonus.',
    type: Number,
  })
  readonly bonus: number
}
