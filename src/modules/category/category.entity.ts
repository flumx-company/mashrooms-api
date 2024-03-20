import { Column, Entity, Index, ManyToMany, OneToMany } from 'typeorm'

import { ApiProperty } from '@nestjs/swagger'

import { Cutting } from '@mush/modules/cutting/cutting.entity'
import { Offload } from '@mush/modules/offload/offload.entity'
import { Picking } from '@mush/modules/picking/picking.entity'
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

  @OneToMany(() => Offload, (offload) => offload.category)
  offloads: Offload[]

  @ManyToMany(() => Picking, (picking) => picking.categories)
  pickings: Picking[]

  @ManyToMany(() => Yield, (yieldItem) => yieldItem.categories)
  yields: Yield[]

  @OneToMany(() => Cutting, (cutting) => cutting.category)
  cuttings: Cutting[]

  @OneToMany(() => Subbatch, (subbatch) => subbatch.batch)
  subbatches: Subbatch[]

  @OneToMany(() => Storage, (storage) => storage.category)
  storages: Storage[]
}
