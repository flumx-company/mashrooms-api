import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm'

import { ApiProperty } from '@nestjs/swagger'

import { PublicFile } from '@mush/modules/file-upload/public-file.entity'
import { Offload } from '@mush/modules/offload/offload.entity'

import { DatedBasicEntity } from '@mush/core/basic-entities'

@Entity({ name: 'clients' })
export class Client extends DatedBasicEntity {
  @ApiProperty({
    example: 'John',
    description: `Client's first name. Max length is ${process.env.MAX_FIRST_NAME_LENGTH} characters.`,
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
    description: `Client's last name. Max length is ${process.env.MAX_LAST_NAME_LENGTH} characters.`,
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
    example: 'son of Jeremy',
    description: `Client's patronymic. Max length is ${process.env.MAX_PATRONYMIC_LENGTH} characters.`,
  })
  @Column({
    type: 'varchar',
    length: process.env.MAX_PATRONYMIC_LENGTH,
    default: null,
    nullable: true,
  })
  patronymic: string

  @ApiProperty({
    example: 'son of Jeremy',
    description: `Client's nickname. Max length is ${process.env.MAX_NICKNAME_LENGTH} characters.`,
  })
  @Column({
    type: 'varchar',
    length: process.env.MAX_NICKNAME_LENGTH,
    default: null,
    nullable: true,
  })
  nickname: string

  @ApiProperty({
    example: '380681234567',
    description: `Client's telephone number. Max length is ${process.env.MAX_PHONE_LENGTH} characters.`,
  })
  @Index()
  @Column({
    type: 'varchar',
    length: process.env.MAX_PHONE_LENGTH,
    default: null,
    nullable: true,
  })
  phone: string

  @ApiProperty({
    example: 0,
    description:
      'Money debt in hryvna. Positive number means the client owes money. The negative numver means the company owes money to the client.',
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  moneyDebt: number

  @ApiProperty({
    example: 0,
    description:
      '1.7 kg delivery container debt. Positive number means the client owes money. The negative numver means the company owes money to the client.',
  })
  @Column({ type: 'decimal', precision: 5, scale: 0, default: 0 })
  delContainer1_7Debt: number

  @ApiProperty({
    example: 0,
    description:
      '0.5 kg delivery container debt. Positive number means the client owes money. The negative numver means the company owes money to the client.',
  })
  @Column({ type: 'decimal', precision: 5, scale: 0, default: 0 })
  delContainer0_5Debt: number

  @ApiProperty({
    example: 0,
    description:
      '0.4 kg delivery container debt. Positive number means the client owes money. The negative numver means the company owes money to the client.',
  })
  @Column({ type: 'decimal', precision: 5, scale: 0, default: 0 })
  delContainer0_4Debt: number

  @ApiProperty({
    example: 0,
    description:
      'Schoeller delivery container debt. Positive number means the client owes money. The negative numver means the company owes money to the client.',
  })
  @Column({ type: 'decimal', precision: 5, scale: 0, default: 0 })
  delContainerSchoellerDebt: number

  @OneToMany(() => Offload, (offload) => offload.client)
  @JoinTable()
  offloads: Offload[]

  @ManyToMany(() => PublicFile, (publicFile) => publicFile.clientFiles)
  @JoinTable()
  files: PublicFile[]
}
