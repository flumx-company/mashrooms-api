import { Column, Entity, ManyToOne } from 'typeorm'

import { ApiProperty } from '@nestjs/swagger'

import { DatedBasicEntity } from '@mush/core/basic-entities'
import { formatDateToDateTime } from '@mush/core/utils'

import { Shift } from '../shift/shift.entity'
import { Work } from '../work/work.entity'

@Entity({ name: 'work-records' })
export class WorkRecord extends DatedBasicEntity {
  @ApiProperty({
    example: '2024-01-15',
    description: 'Work record date',
  })
  @Column({
    type: 'date',
    transformer: {
      from: (value: Date) => {
        return formatDateToDateTime({ value, dateFrom: true })
      },
      to: (value: string) => {
        return new Date(value)
      },
    },
  })
  date: Date

  @ApiProperty({
    example: true,
    description: 'Percentage value. Example: 0.15 means 15%.',
  })
  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  percent: number

  @ApiProperty({
    example: true,
    description: 'Percentage amount in hryvna.',
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  percentAmount: number

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
}
