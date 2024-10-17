import { Wave } from '@mush/modules/wave/wave.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';

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
  @Index()
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
    example: 'Some drug name or empty string',
    description: 'Drug name if used',
  })
  @Column({ type: 'varchar', length: 50, default: null, nullable: true })
  drug: string

  @ManyToOne(() => Shift, (shift) => shift.waterings)
  shift: Shift

  @ManyToOne(() => Batch, (batch) => batch.waterings)
  batch: Batch

  @OneToOne(() => Wave, (wave) => wave.watering)
  @JoinColumn()
  wave: Wave
}
