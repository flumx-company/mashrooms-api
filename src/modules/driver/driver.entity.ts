import { Column, Entity, Index } from 'typeorm'

import { ApiProperty } from '@nestjs/swagger'

import { DatedBasicEntity } from '@mush/core/basic-entities'

@Entity({ name: 'drivers' })
export class Driver extends DatedBasicEntity {
  @ApiProperty({
    example: 'John',
    description: `Driver's first name. Max length is ${process.env.MAX_FIRST_NAME_LENGTH} characters.`,
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
    description: `Driver's last name. Max length is ${process.env.MAX_LAST_NAME_LENGTH} characters.`,
  })
  @Index()
  @Column({
    type: 'varchar',
    length: process.env.MAX_LAST_NAME_LENGTH,
    default: null,
    nullable: true,
  })
  lastName: string

  @ApiProperty({
    example: '380681234567',
    description: `Driver's telephone number. Max length is ${process.env.MAX_PHONE_LENGTH} characters.`,
  })
  @Index()
  @Column({
    type: 'varchar',
    length: process.env.MAX_PHONE_LENGTH,
    default: null,
    nullable: true,
  })
  phone: string
}
