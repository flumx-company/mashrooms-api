import { Exclude } from 'class-transformer'

import { ApiProperty } from '@nestjs/swagger'

import { BufferedFile } from '@mush/modules/file-upload/file.model'

import { EFileCategory } from '@mush/core/enums'

export class EditEmployeeAvatarDto {
  @Exclude()
  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    description: 'Select avatar for the employee.',
    required: false,
  })
  readonly [EFileCategory.EMPLOYEE_AVATARS]: BufferedFile[]
}
