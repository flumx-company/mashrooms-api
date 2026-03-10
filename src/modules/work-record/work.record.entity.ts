import { Column, Entity, Index, ManyToOne } from 'typeorm'
import { Transform } from 'class-transformer'

import { ApiProperty } from '@nestjs/swagger'

import { DatedBasicEntity } from '@mush/core/basic-entities'
import { formatDateToDateTime, dateOnlyStringToUTCDate, formatDateForClient } from '@mush/core/utils'

import { Chamber } from '../chamber/chamber.entity'
import { Shift } from '../shift/shift.entity'
import { Work } from '../work/work.entity'

@Entity({ name: 'work-records' })
export class WorkRecord extends DatedBasicEntity {
  @ApiProperty({
    example: '15.01.2024',
    description: 'Work record date (день.месяц.год)',
  })
  @Index()
  @Transform(({ value }) => (value != null ? formatDateForClient(value) : value))
  @Column({
    type: 'date',
    transformer: {
      from: (value: Date) => {
        return formatDateToDateTime({ value, dateFrom: true })
      },
      to: (value: string) => {
        return dateOnlyStringToUTCDate(value) as Date
      },
    },
  })
  date: Date

  @ApiProperty({
    example: true,
    description: 'Percentage amount in hryvna.',
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  amount: number

  @ApiProperty({
    example: true,
    description: 'One-time bonus in hryvna.',
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  reward: number

  @ManyToOne(() => Work, (work) => work.workRecords, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
    orphanedRowAction: 'delete',
  })
  work: Work

  @ManyToOne(() => Shift, (shift) => shift.workRecords, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
    orphanedRowAction: 'delete',
  })
  shift: Shift

  @ManyToOne(() => Chamber, (chamber) => chamber.workRecords, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
    orphanedRowAction: 'delete',
  })
  chamber: Chamber

  @ApiProperty({
    example: true,
    description: 'Commmon id for work record group.',
  })
  @Column({ type: 'decimal', precision: 15, scale: 0, default: 0 })
  recordGroupId: number
}
