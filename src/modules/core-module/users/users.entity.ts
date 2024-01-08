import { Column, Entity, OneToMany } from 'typeorm'
import { Exclude } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

import { OffloadsEntity } from '@mush/offloads/offloads.entity'

import { DatedBasicEntity } from '@mush/basic-entities'
import { ERole, EPermission, EPosition } from '@mush/enums'

@Entity({ name: 'users' })
export class UsersEntity extends DatedBasicEntity {
  @ApiProperty({ example: 'John', description: "User's name" })
  @Column({ length: 35, default: null, nullable: true })
  firstName: string

  @ApiProperty({ example: 'Johnson', description: "User's name" })
  @Column({ length: 35, default: null, nullable: true })
  lastName: string

  @ApiProperty({
    example: 'test@email.com',
    description: "User's email",
  })
  @Column({ type: 'varchar', default: null, nullable: true })
  email: string

  @ApiProperty({
    example: '+380681234567',
    description: "User's telephone number",
  })
  @Column({ type: 'varchar', default: null, nullable: true })
  phone: string

  @ApiProperty({
    example: '123Abc!',
    description: "User's password",
  })
  @Exclude({ toPlainOnly: true }) //TODO: hide password in response
  @Column({ type: 'varchar', default: null, nullable: true })
  password: string

  @ApiProperty({
    example: 1,
    description:
      "User's role. 1 - admin, 2 - superadmin. Admin role  will be added automatically",
  })
  @Column({ type: 'enum', enum: ERole, default: ERole.ADMIN })
  role: ERole

  @ApiProperty({
    example: EPosition.FOREMAN,
    description: "User's position. Options: FOREMAN, OFFICE_ADMINISTRATOR",
  })
  @Column({ type: 'enum', enum: EPosition, default: EPosition.FOREMAN })
  position: EPosition

  @ApiProperty({
    example: [],
    description: "User's permissions.",
  })
  @Column('simple-array', { nullable: true })
  permissions: EPermission[]

  @ApiProperty({
    example: true,
    description: "User's active status. Boolean value.",
  })
  @Column({ type: 'boolean', default: null, nullable: true })
  isActive: boolean

  @OneToMany(() => OffloadsEntity, (offload) => offload.user)
  offloads: OffloadsEntity[]
}
