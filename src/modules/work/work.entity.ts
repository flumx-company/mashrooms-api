import { Column, Entity, Index, OneToMany } from 'typeorm'

import { ApiProperty } from '@nestjs/swagger'

import { DatedBasicEntity } from '@mush/core/basic-entities'
import { EWorkType } from '@mush/core/enums'

import { WorkRecord } from '../work-record/work.record.entity'

@Entity({ name: 'works' })
export class Work extends DatedBasicEntity {
  @ApiProperty({
    example: 'Take photos',
    description: `Work title. Max length is ${process.env.MAX_WORK_TITLE} characters.`,
  })
  @Index()
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

  @ApiProperty({
    example: EWorkType.CUSTOM,
    description: 'Work type.',
  })
  @Column({ type: 'enum', enum: EWorkType, default: EWorkType.CUSTOM })
  workType: EWorkType

  @OneToMany(() => WorkRecord, (workRecord) => workRecord.work)
  workRecords: WorkRecord[]
}
