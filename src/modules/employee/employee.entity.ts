import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm'

import { ApiProperty } from '@nestjs/swagger'

import { PublicFile } from '@mush/modules/file-upload/public-file.entity'
import { Shift } from '@mush/modules/shift/shift.entity'

import { DatedBasicEntity } from '@mush/core/basic-entities'
import { ERegion } from '@mush/core/enums'

@Entity({ name: 'employees' })
export class Employee extends DatedBasicEntity {
  @ApiProperty({
    example: 'John',
    description: `Employee's first name. Max length is ${process.env.MAX_FIRST_NAME_LENGTH} characters.`,
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
    description: `Employee's last name. Max length is ${process.env.MAX_LAST_NAME_LENGTH} characters.`,
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
    description: `Employee's patronymic. Max length is ${process.env.MAX_PATRONYMIC_LENGTH} characters.`,
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
    description: `Employee's telephone number. Max length is ${process.env.MAX_PHONE_LENGTH} characters.`,
  })
  @Column({
    type: 'varchar',
    length: process.env.MAX_PHONE_LENGTH,
    default: null,
    nullable: true,
  })
  phone: string

  @ApiProperty({
    example: '5375111122223333',
    description: `Employee's bank card number. Max length is ${process.env.MAX_BANK_CARD_NUMBER_LENGTH} characters.`,
  })
  @Column({
    type: 'varchar',
    length: process.env.MAX_BANK_CARD_NUMBER_LENGTH,
    default: null,
    nullable: true,
  })
  bankCard: string

  @ApiProperty({
    example: ERegion.DNIPRO,
    description: "Employee's region.",
  })
  @Column({ type: 'enum', enum: ERegion, default: ERegion.DNIPRO })
  region: ERegion

  @ApiProperty({
    example: 'Нью-Васюки',
    description: "Employee's town.",
  })
  @Column({
    type: 'varchar',
    length: process.env.MAX_TOWN_LENGTH,
    default: null,
    nullable: true,
  })
  town: string

  @ApiProperty({
    example: true,
    description: "User's active status. Boolean value.",
  })
  @Column({ type: 'boolean', default: false, nullable: true })
  isActive: boolean

  @ApiProperty({
    example: true,
    description: "User's realibity status. Boolean value.",
  })
  @Column({ type: 'boolean', default: true, nullable: true })
  isUnreliable: boolean

  @ApiProperty({
    example: true,
    description:
      'Boolean value is true when an employee has a criminal record.',
  })
  @Column({ type: 'boolean', default: false, nullable: true })
  hasCriminalRecord: boolean

  @ManyToMany(() => PublicFile, (publicFile) => publicFile.employeeDocuments)
  @JoinTable()
  documents: PublicFile[]

  @ManyToMany(() => PublicFile, (publicFile) => publicFile.employeeAvatars)
  @JoinTable()
  avatars: PublicFile[]

  @OneToMany(() => Shift, (shift) => shift.employee)
  shifts: Shift[]
}
