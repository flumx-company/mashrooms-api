import { Column, Entity } from 'typeorm'

import { ApiProperty } from '@nestjs/swagger'

import { DatedBasicEntity } from '@mush/core/basic-entities'

@Entity({ name: 'drivers' })
export class Driver extends DatedBasicEntity {
  @ApiProperty({ example: 'John', description: "Driver's first name" })
  @Column({ type: 'varchar', length: 35, default: null, nullable: true })
  firstName: string

  @ApiProperty({ example: 'Johnson', description: "Driver's last name" })
  @Column({ type: 'varchar', length: 35, default: null, nullable: true })
  lastName: string

  @ApiProperty({
    example: '380681234567',
    description: "Driver's telephone number",
  })
  @Column({ type: 'varchar', length: 20, default: null, nullable: true })
  phone: string
}
