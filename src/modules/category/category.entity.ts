import { Column, Entity, Index, OneToMany } from 'typeorm'

import { ApiProperty } from '@nestjs/swagger'

import { Cutting } from '@mush/modules/cutting/cutting.entity'
import { OffloadRecord } from '@mush/modules/offload-record/offload-record.entity'
import { Storage } from '@mush/modules/storage/storage.entity'
import { Subbatch } from '@mush/modules/subbatch/subbatch.entity'
import { Yield } from '@mush/modules/yield/yield.entity'

import { DatedBasicEntity } from '@mush/core/basic-entities'

@Entity({ name: 'categories' })
export class Category extends DatedBasicEntity {
  @ApiProperty({ example: 'Category name', description: 'Category name' })
  @Index()
  @Column({ type: 'varchar', length: 100, default: null, nullable: true })
  name: string

  @ApiProperty({
    example: 'Category description',
    description: 'Category description',
  })
  @Column({ type: 'varchar', length: 255, default: null, nullable: true })
  description: string

  @OneToMany(() => OffloadRecord, (offloadRecord) => offloadRecord.category)
  offloadRecords: OffloadRecord[]

  @OneToMany(() => Yield, (yieldItem) => yieldItem.category)
  yields: Yield[]

  @OneToMany(() => Cutting, (cutting) => cutting.category)
  cuttings: Cutting[]

  @OneToMany(() => Subbatch, (subbatch) => subbatch.batch)
  subbatches: Subbatch[]

  @OneToMany(() => Storage, (storage) => storage.category)
  storages: Storage[]
}
