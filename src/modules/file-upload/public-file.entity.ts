import { Column, Entity, ManyToMany } from 'typeorm'

import { ApiProperty } from '@nestjs/swagger'

import { Client } from '@mush/modules/client/client.entity'
import { Employee } from '@mush/modules/employee/employee.entity'
import { Offload } from '@mush/modules/offload/offload.entity'

import { DatedBasicEntity } from '@mush/core/basic-entities'

@Entity({ name: 'public_file' })
export class PublicFile extends DatedBasicEntity {
  @Column()
  @ApiProperty({
    example: 'file url',
  })
  url: string

  @Column()
  @ApiProperty({
    example: 'file key',
  })
  key: string

  @Column()
  @ApiProperty({
    example: 'file type',
  })
  type: string

  @Column()
  @ApiProperty({
    example: 'file name',
  })
  name: string

  @ManyToMany(() => Client, (clients) => clients.files)
  clientFiles: Client[]

  @ManyToMany(() => Employee, (employees) => employees.avatars)
  employeeAvatars: Employee[]

  @ManyToMany(() => Employee, (employees) => employees.documents)
  employeeDocuments: Employee[]

  @ManyToMany(() => Offload, (offloads) => offloads.documents)
  offloadDocuments: Offload[]
}
