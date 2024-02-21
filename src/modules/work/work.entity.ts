import { Column, Entity } from 'typeorm'

import { ApiProperty } from '@nestjs/swagger'

import { DatedBasicEntity } from '@mush/core/basic-entities'

@Entity({ name: 'works' })
export class Work extends DatedBasicEntity {
  @ApiProperty({
    example: 'Take photos',
    description: `Work title. Max length is ${process.env.MAX_WORK_TITLE} characters.`,
  })
  @Column({
    type: 'varchar',
    length: process.env.MAX_WORK_TITLE,
    default: null,
    nullable: true,
  })
  title: string

  @ApiProperty({
    example: true,
    description: "Work's regular status. Boolean value.",
  })
  @Column({ type: 'boolean', default: true, nullable: true })
  isRegular: boolean

  @ApiProperty({
    example: true,
    description: "Work's pay. Will be used as initial value.",
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number
}
