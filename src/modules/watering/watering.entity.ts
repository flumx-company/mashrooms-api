import { Wave } from '@mush/modules/wave/wave.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { Transform } from 'class-transformer'

import { ApiProperty } from '@nestjs/swagger'

import { Batch } from '@mush/modules/batch/batch.entity'
import { Shift } from '@mush/modules/shift/shift.entity'

import { DatedBasicEntity } from '@mush/core/basic-entities'
import { EWaterTarget } from '@mush/core/enums'
import { formatDateTimeForClient } from '@mush/core/utils'

@Entity({ name: 'waterings' })
export class Watering extends DatedBasicEntity {
  @ApiProperty({ example: 1, description: 'Water volume by litres' })
  @Column({ type: 'decimal', precision: 7, scale: 0, default: 0 })
  volume: number

  @ApiProperty({
    example: '15.01.2024, 10:00',
    description: 'Watering start date time (день.месяц.год, часы:минуты)',
  })
  @Index()
  @Transform(({ value }) => (value != null ? formatDateTimeForClient(value) : value))
  @Column({
    type: 'timestamp',
    default: null,
  })
  dateTimeFrom: Date

  @ApiProperty({
    example: '15.01.2024, 10:00',
    description: 'Watering end date time (день.месяц.год, часы:минуты)',
  })
  @Transform(({ value }) => (value != null ? formatDateTimeForClient(value) : value))
  @Column({
    type: 'timestamp',
    default: null,
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

  @ManyToOne(() => Wave, (wave) => wave.watering)
  wave: Wave
}
