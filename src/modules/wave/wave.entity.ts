import { Watering } from '@mush/modules/watering/watering.entity';
import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger'

import { Batch } from '@mush/modules/batch/batch.entity'
import { Cutting } from '@mush/modules/cutting/cutting.entity'
import { OffloadRecord } from '@mush/modules/offload-record/offload-record.entity'
import { Storage } from '@mush/modules/storage/storage.entity'
import { Yield } from '@mush/modules/yield/yield.entity'

import { DatedBasicEntity } from '@mush/core/basic-entities'
import { formatDateToDateTime } from '@mush/core/utils'

@Entity({ name: 'waves' })
export class Wave extends DatedBasicEntity {
  @ApiProperty({ example: 1, description: 'Wave order number' })
  @Column({ type: 'decimal', precision: 2, scale: 0, default: 0 })
  order: number

  @ApiProperty({
    example: '2024-01-15',
    description: 'Wave start date',
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
  dateFrom: Date

  @ApiProperty({
    example: '2024-01-15',
    description: 'Wave end date',
  })
  @Column({
    type: 'date',
    default: null,
    transformer: {
      from: (value: Date) => {
        return formatDateToDateTime({ value, dateFrom: false })
      },
      to: (value: string) => {
        return value ? new Date(value) : value
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

  @OneToOne(() => Watering, (wave) => wave.wave)
  watering: Wave
}
