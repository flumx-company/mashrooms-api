import { Column, Entity, OneToMany } from 'typeorm'

import { ApiProperty } from '@nestjs/swagger'

// import { Batch } from '@mush/modules/batch/batch.entity'
import { DatedBasicEntity } from '@mush/core/basic-entities'

import { WorkRecord } from '../work-record/work.record.entity'

@Entity({ name: 'chambers' })
export class Chamber extends DatedBasicEntity {
  @ApiProperty({ example: 'Chamber 1', description: 'Chamber name' })
  @Column({ type: 'varchar', length: 35, default: null, nullable: true })
  name: string

  @ApiProperty({ example: 100, description: 'Chamber area by m2' })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  area: number

  // @OneToMany(() => Batch, (batch) => batch.chamber)
  // batches: Batch[]

  @OneToMany(() => WorkRecord, (workRecord) => workRecord.chamber)
  workRecords: WorkRecord[]
}
