import { IsString, MaxLength, MinLength, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateEmployeeDto {
  @IsString()
  @MaxLength(35)
  @MinLength(1)
  @IsNotEmpty()
  @ApiProperty({
    example: 'John',
    description: 'Enter first name.',
    type: String,
  })
  readonly firstName: string

  @IsString()
  @MaxLength(35)
  @MinLength(1)
  @IsNotEmpty()
  @ApiProperty({
    example: 'Johnson',
    description: 'Enter last name.',
    type: String,
  })
  readonly lastName: string
}
