import { Column, Entity, JoinTable, ManyToMany } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'

import { DatedBasicEntity } from '@mush/core/basic-entities'

import { OffloadsEntity } from '@mush/modules/offloads/offloads.entity'
import { Picking } from '@mush/modules/picking/picking.entity'
import { Yield } from '@mush/modules/yield/yield.entity'

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

  @ManyToMany(() => OffloadsEntity)
  offloads: OffloadsEntity[]

  @ManyToMany(() => Picking)
  picking: Picking[]

  @ManyToMany(() => Yield)
  yields: Yield[]
}
