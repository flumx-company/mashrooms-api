import { Watering } from '@mush/modules/watering/watering.entity';
import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { Transform } from 'class-transformer'

import { ApiProperty } from '@nestjs/swagger'

import { Batch } from '@mush/modules/batch/batch.entity'
import { Cutting } from '@mush/modules/cutting/cutting.entity'
import { OffloadRecord } from '@mush/modules/offload-record/offload-record.entity'
import { Storage } from '@mush/modules/storage/storage.entity'
import { Yield } from '@mush/modules/yield/yield.entity'

import { DatedBasicEntity } from '@mush/core/basic-entities'
import { formatDateToDateTime, dateOnlyStringToUTCDate, formatDateForClient } from '@mush/core/utils'

@Entity({ name: 'waves' })
export class Wave extends DatedBasicEntity {
  @ApiProperty({ example: 1, description: 'Wave order number' })
  @Column({ type: 'decimal', precision: 2, scale: 0, default: 0 })
  order: number

  @ApiProperty({
    example: '15.01.2024',
    description: 'Wave start date (день.месяц.год)',
  })
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
  dateFrom: Date

  @ApiProperty({
    example: '15.01.2024',
    description: 'Wave end date (день.месяц.год)',
  })
  @Transform(({ value }) => (value != null ? formatDateForClient(value) : value))
  @Column({
    type: 'date',
    default: null,
    transformer: {
      from: (value: Date) => {
        return formatDateToDateTime({ value, dateFrom: false })
      },
      to: (value: string) => {
        return value ? (dateOnlyStringToUTCDate(value) as Date) : value
      },
    },
  })
  dateTo: Date

  @ManyToOne(() => Batch, (batch) => batch.waves)
  batch: Batch

  @OneToMany(() => Cutting, (cutting) => cutting.wave)
  cuttings: Cutting[]

  @OneToMany(() => Storage, (storage) => storage.wave)
  storages: Storage[]

  @OneToMany(() => OffloadRecord, (offloadRecord) => offloadRecord.wave)
  offloadRecords: OffloadRecord[]

  @OneToMany(() => Yield, (yieldItem) => yieldItem.category)
  yields: Yield[]

  @OneToMany(() => Watering, (wave) => wave.wave)
  watering: Wave
}
