import { Exclude } from 'class-transformer'

import { ApiProperty } from '@nestjs/swagger'

import { BufferedFile } from '@mush/modules/file-upload/file.model'

export class AddClientFilesDto {
  @Exclude()
  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    description: 'Select files for the client.',
    required: false,
  })
  readonly clientFiles: BufferedFile[]
}
