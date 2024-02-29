import { Column, Entity } from 'typeorm'

import { ApiProperty } from '@nestjs/swagger'

import { DatedBasicEntity } from '@mush/core/basic-entities'

@Entity({ name: 'varieties' })
export class Variety extends DatedBasicEntity {
  @ApiProperty({ example: '1 variety', description: 'Variety name' })
  @Column({ type: 'varchar', length: 35, default: null, nullable: true })
  name: string
}
