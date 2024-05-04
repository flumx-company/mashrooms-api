import { Column, Entity, Index, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { PublicFile } from '../file-upload/public-file.entity'
import { ApiProperty } from '@nestjs/swagger'

import { Chamber } from '@mush/modules/chamber/chamber.entity'
import { Cutting } from '@mush/modules/cutting/cutting.entity'
import { OffloadRecord } from '@mush/modules/offload-record/offload-record.entity'
import { Subbatch } from '@mush/modules/subbatch/subbatch.entity'
import { Watering } from '@mush/modules/watering/watering.entity'
import { Wave } from '@mush/modules/wave/wave.entity'
import { Yield } from '@mush/modules/yield/yield.entity'

import { DatedBasicEntity } from '@mush/core/basic-entities'
import { formatDateToDateTime } from '@mush/core/utils'

@Entity({ name: 'batches' })
export class Batch extends DatedBasicEntity {
  @ApiProperty({
    example: '2024-01',
    description: 'Batch name',
  })
  @Index()
  @Column({ type: 'varchar', length: 8, default: null, nullable: true })
  name: string

  @ApiProperty({
    example: '2024-01-15',
    description: 'Batch start date',
  })
  @Index()
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
    description: 'Batch end date',
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

  @ApiProperty({ example: 3, description: 'Maximum wave quantity' })
  @Column({ type: 'decimal', precision: 2, scale: 0, default: 0 })
  waveQuantity: number

  @ManyToOne(() => Chamber, (chamber) => chamber.batches)
  chamber: Chamber

  @OneToMany(() => Subbatch, (subbatch) => subbatch.batch)
  subbatches: Subbatch[]

  @OneToMany(() => Wave, (wave) => wave.batch)
  waves: Wave[]

  @OneToMany(() => Watering, (watering) => watering.batch)
  waterings: Watering[]

  @OneToMany(() => Cutting, (cutting) => cutting.batch)
  cuttings: Cutting[]

  @OneToMany(() => OffloadRecord, (record) => record.batch)
  offloadRecords: OffloadRecord[]

  @OneToMany(() => Yield, (yieldItem) => yieldItem.category)
  yields: Yield[]

  @ManyToMany(() => PublicFile, (file) => file.batchDocuments)
  @JoinTable()
  documents: PublicFile[]
}
