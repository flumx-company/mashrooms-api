import { Column, Entity } from 'typeorm'

import { ApiProperty } from '@nestjs/swagger'

import { DatedBasicEntity } from '@mush/core/basic-entities'

@Entity({ name: 'employees' })
export class Employee extends DatedBasicEntity {
  @ApiProperty({ example: 'John', description: "Employee's first name" })
  @Column({ type: 'varchar', length: 35, default: null, nullable: true })
  firstName: string

  @ApiProperty({ example: 'Johnson', description: "Employee's last name" })
  @Column({ type: 'varchar', length: 35, default: null, nullable: true })
  lastName: string

  @ApiProperty({
    example: '380681234567',
    description: "Employee's telephone number",
  })
  @Column({ type: 'varchar', length: 20, default: null, nullable: true })
  phone: string
}
