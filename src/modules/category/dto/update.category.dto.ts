import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class UpdateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  @ApiProperty({
    example: 'Category name',
    description: 'Enter the category name.',
    type: String,
  })
  readonly name: string

  @IsString()
  @MaxLength(255)
  @ApiProperty({
    example: 'Category description',
    description: 'Enter the category description.',
    type: String,
  })
  readonly description: string
}
