import { Column, Entity, OneToMany } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'

import { OffloadsEntity } from '@mush/modules/offloads/offloads.entity'

import { DatedBasicEntity } from '@mush/core/basic-entities'

@Entity({ name: 'clients' })
export class ClientsEntity extends DatedBasicEntity {
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

  @OneToMany(() => OffloadsEntity, (offload) => offload.client)
  offloads: OffloadsEntity[]
}
