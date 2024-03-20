import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm'

import { ApiProperty } from '@nestjs/swagger'

import { Chamber } from '@mush/modules/chamber/chamber.entity'
import { Cutting } from '@mush/modules/cutting/cutting.entity'
import { Offload } from '@mush/modules/offload/offload.entity'
import { Subbatch } from '@mush/modules/subbatch/subbatch.entity'
import { Watering } from '@mush/modules/watering/watering.entity'
import { Wave } from '@mush/modules/wave/wave.entity'

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

  @ApiProperty({ example: 100, description: 'Briquette quantity' })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  briquetteQuantity: number

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

  @OneToMany(() => Offload, (offload) => offload.batch)
  offloads: Offload[]
}
