import { Exclude } from 'class-transformer'

import { ApiProperty } from '@nestjs/swagger'

import { BufferedFile } from '@mush/modules/file-upload/file.model'

import { EFileCategory } from '@mush/core/enums'

export class AddOffloadDocumentsDto {
  @Exclude()
  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    description: 'Select documents for the offload.',
    required: false,
  })
  readonly [EFileCategory.OFFLOAD_DOCUMENTS]: BufferedFile[]
}
