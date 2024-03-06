import { Column, Entity, ManyToOne } from 'typeorm'

import { ApiProperty } from '@nestjs/swagger'

import { Batch } from '@mush/modules/batch/batch.entity'
import { Shift } from '@mush/modules/shift/shift.entity'

import { DatedBasicEntity } from '@mush/core/basic-entities'
import { EWaterTarget } from '@mush/core/enums'
import { formatDateToDateTime } from '@mush/core/utils'

@Entity({ name: 'waterings' })
export class Watering extends DatedBasicEntity {
  @ApiProperty({ example: 1, description: 'Water volume by litres' })
  @Column({ type: 'decimal', precision: 7, scale: 0, default: 0 })
  volume: number

  @ApiProperty({
    example: '2024-01-15',
    description: 'Watering start date time',
  })
  @Column({
    type: 'datetime',
    transformer: {
      from: (value: Date) => {
        return formatDateToDateTime({
          value,
          dateFrom: true,
          withTime: true,
          providesHours: true,
          providesMinutes: true,
        })
      },
      to: (value: string) => {
        return new Date(value)
      },
    },
  })
  dateTimeFrom: Date

  @ApiProperty({
    example: '2024-01-15',
    description: 'Wateriing end date time',
  })
  @Column({
    type: 'datetime',
    default: null,
    transformer: {
      from: (value: Date) => {
        return formatDateToDateTime({
          value,
          dateFrom: false,
          withTime: true,
          providesHours: true,
          providesMinutes: true,
        })
      },
      to: (value: string) => {
        return value ? new Date(value) : value
      },
    },
  })
  dateTimeTo: Date

  @ApiProperty({
    example: EWaterTarget.MUSHROOM,
    description: 'Target of watering: MUSHROOM, PEAT.',
  })
  @Column({ type: 'enum', enum: EWaterTarget, default: EWaterTarget.MUSHROOM })
  target: EWaterTarget

  @ApiProperty({
    example: true,
    description:
      'Status indicates if drugs were used in watering. Boolean value.',
  })
  @Column({ type: 'boolean', default: false, nullable: true })
  hasDrug: boolean

  @ManyToOne(() => Shift, (shift) => shift.waterings)
  shift: Shift

  @ManyToOne(() => Batch, (batch) => batch.waterings)
  batch: Batch
}
