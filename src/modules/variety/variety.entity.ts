import { Column, Entity, Index, OneToMany } from 'typeorm'

import { ApiProperty } from '@nestjs/swagger'

import { Cutting } from '@mush/modules/cutting/cutting.entity'
import { Offload } from '@mush/modules/offload/offload.entity'
import { Storage } from '@mush/modules/storage/storage.entity'
import { Yield } from '@mush/modules/yield/yield.entity'

import { DatedBasicEntity } from '@mush/core/basic-entities'

@Entity({ name: 'varieties' })
export class Variety extends DatedBasicEntity {
  @ApiProperty({ example: '1 variety', description: 'Variety name' })
  @Index()
  @Column({ type: 'varchar', length: 35, default: null, nullable: true })
  name: string

  @OneToMany(() => Cutting, (cutting) => cutting.variety)
  cuttings: Cutting[]

  @OneToMany(() => Storage, (storage) => storage.variety)
  storages: Storage[]

  @OneToMany(() => Offload, (offload) => offload.wave)
  offloads: Offload[]

  @OneToMany(() => Yield, (yieldItem) => yieldItem.category)
  yields: Yield[]
}
