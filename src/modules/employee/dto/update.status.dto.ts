import { IsBoolean, IsNotEmpty } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { ToBoolean } from '@mush/core/decorators'

export class UpdateActiveStatusDto {
  @ToBoolean()
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
    description: 'Enter employee active status boolean value.',
    type: Boolean,
  })
  readonly isActive: boolean
}
