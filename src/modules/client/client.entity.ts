import { Column, Entity, JoinTable, ManyToMany } from 'typeorm'

import { ApiProperty } from '@nestjs/swagger'

import { PublicFile } from '@mush/modules/file-upload/public-file.entity'
import { Offload } from '@mush/modules/offload/offload.entity'

import { DatedBasicEntity } from '@mush/core/basic-entities'

@Entity({ name: 'clients' })
export class Client extends DatedBasicEntity {
  @ApiProperty({
    example: 'John',
    description: "Client's first name. Max length is 35 characters.",
  })
  @Column({
    type: 'varchar',
    length: process.env.MAX_FIRST_NAME_LENGTH,
    default: null,
    nullable: true,
  })
  firstName: string

  @ApiProperty({
    example: 'Johnson',
    description: "Client's last name. Max length is 35 characters.",
  })
  @Column({
    type: 'varchar',
    length: process.env.MAX_LAST_NAME_LENGTH,
    default: null,
    nullable: true,
  })
  lastName: string

  @ApiProperty({
    example: 'son of Jeremy',
    description: "Client's patronymic. Max length is 35 characters.",
  })
  @Column({
    type: 'varchar',
    length: process.env.MAX_PATRONYMIC_LENGTH,
    default: null,
    nullable: true,
  })
  patronymic: string

  @ApiProperty({
    example: '380681234567',
    description: "Client's telephone number. Max length is 20 characters.",
  })
  @Column({
    type: 'varchar',
    length: process.env.MAX_PHONE_LENGTH,
    default: null,
    nullable: true,
  })
  phone: string

  @ManyToMany(() => Offload, (offload) => offload.clients)
  @JoinTable()
  offloads: Offload[]

  @ManyToMany(() => PublicFile, (publicFile) => publicFile.clientFiles)
  @JoinTable()
  files: PublicFile[]
}
