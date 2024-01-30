import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'
import * as dotenv from 'dotenv'

import { ApiProperty } from '@nestjs/swagger'

dotenv.config()

export class ResetPasswordDto {
  @IsString()
  @MaxLength(parseInt(process.env.MAX_PASSWORD_LENGTH))
  @MinLength(parseInt(process.env.MIN_PASSWORD_LENGTH))
  @IsNotEmpty()
  @ApiProperty({
    example: '123Abc!_z',
    description: 'Enter password.',
    type: String,
  })
  readonly password: string
}
