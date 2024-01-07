import { Column, Entity } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'

import { DatedBasicEntity } from '@basic-entities/index'

@Entity({ name: 'clients' })
export class ClientsEntity extends DatedBasicEntity {
  @ApiProperty({
    example: 'John',
    description: "User's first name",
  })
  @Column({
    length: 35,
    default: null,
    nullable: true,
  })
  firstName: string

  @ApiProperty({
    example: 'Johnson',
    description: "User's last name",
  })
  @Column({
    length: 35,
    default: null,
    nullable: true,
  })
  lastName: string

  @ApiProperty({
    example: '+380681234567',
    description: 'Enter the phone.',
    type: String,
  })
  readonly phone: string
}
