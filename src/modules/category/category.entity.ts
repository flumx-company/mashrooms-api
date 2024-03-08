import { Column, Entity, ManyToMany, OneToMany } from 'typeorm'

import { ApiProperty } from '@nestjs/swagger'

import { Cutting } from '@mush/modules/cutting/cutting.entity'
import { Offload } from '@mush/modules/offload/offload.entity'
import { Picking } from '@mush/modules/picking/picking.entity'
import { Yield } from '@mush/modules/yield/yield.entity'

import { DatedBasicEntity } from '@mush/core/basic-entities'

@Entity({ name: 'categories' })
export class Category extends DatedBasicEntity {
  @ApiProperty({ example: 'Category name', description: 'Category name' })
  @Column({ type: 'varchar', length: 100, default: null, nullable: true })
  name: string

  @ApiProperty({
    example: 'Category description',
    description: 'Category description',
  })
  @Column({ type: 'varchar', length: 255, default: null, nullable: true })
  description: string

  @ManyToMany(() => Offload, (offload) => offload.categories)
  offloads: Offload[]

  @ManyToMany(() => Picking, (picking) => picking.categories)
  pickings: Picking[]

  @ManyToMany(() => Yield, (yieldItem) => yieldItem.categories)
  yields: Yield[]

  @OneToMany(() => Cutting, (cutting) => cutting.category)
  cuttings: Cutting[]
}
