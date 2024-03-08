import { Exclude } from 'class-transformer'
import * as dotenv from 'dotenv'
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm'

import { ApiProperty } from '@nestjs/swagger'

import { Cutting } from '@mush/modules/cutting/cutting.entity'
import { Offload } from '@mush/modules/offload/offload.entity'

import { DatedBasicEntity } from '@mush/core/basic-entities'
import { EPermission, EPosition, ERole } from '@mush/core/enums'

dotenv.config()

@Entity({ name: 'users' })
export class User extends DatedBasicEntity {
  @ApiProperty({
    example: 'John',
    description: `User's name. Max length is ${process.env.MAX_FIRST_NAME_LENGTH} characters.`,
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
    description: `User's name. Max length is ${process.env.MAX_LAST_NAME_LENGTH} characters.`,
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
    description: `User's patronymic. Max length is ${process.env.MAX_PATRONYMIC_LENGTH} characters.`,
  })
  @Column({
    type: 'varchar',
    length: process.env.MAX_PATRONYMIC_LENGTH,
    default: null,
    nullable: true,
  })
  patronymic: string

  @ApiProperty({
    example: 'test@email.com',
    description: `User's email. Max length is ${process.env.MAX_EMAIL_LENGTH} characters.`,
  })
  @Column({
    type: 'varchar',
    length: process.env.MAX_EMAIL_LENGTH,
    default: null,
    nullable: true,
  })
  email: string

  @ApiProperty({
    example: '380681234567',
    description: `User's telephone number. Max length is ${process.env.MAX_PHONE_LENGTH} characters.`,
  })
  @Column({
    type: 'varchar',
    length: process.env.MAX_PHONE_LENGTH,
    default: null,
    nullable: true,
  })
  phone: string

  @ApiProperty({
    example: '123Abc!',
    description: "User's password",
  })
  @Exclude({ toPlainOnly: true })
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

  @ManyToMany(() => Offload, (offload) => offload.users)
  @JoinTable()
  offloads: Offload[]

  @OneToMany(() => Cutting, (cutting) => cutting.author)
  cuttings: Cutting[]
}
