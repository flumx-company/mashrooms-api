import { Column, Entity, JoinTable, ManyToMany } from 'typeorm'

import { ApiProperty } from '@nestjs/swagger'

import { Offload } from '@mush/modules/offload/offload.entity'

import { DatedBasicEntity } from '@mush/core/basic-entities'

@Entity({ name: 'clients' })
export class Client extends DatedBasicEntity {
  @ApiProperty({
    example: 'John',
    description: "Client's first name",
  })
  @Column({
    type: 'varchar',
    length: 35,
    default: null,
    nullable: true,
  })
  firstName: string

  @ApiProperty({
    example: 'Johnson',
    description: "Client's last name",
  })
  @Column({
    type: 'varchar',
    length: 35,
    default: null,
    nullable: true,
  })
  lastName: string

  @ApiProperty({
    example: '380681234567',
    description: "Client's telephone number",
  })
  @Column({ type: 'varchar', length: 20, default: null, nullable: true })
  phone: string

  @ManyToMany(() => Offload, (offload) => offload.clients)
  @JoinTable()
  offloads: Offload[]
}
