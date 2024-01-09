import { Column, Entity, JoinTable, ManyToMany } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'

import { DatedBasicEntity } from '@mush/core/basic-entities'

import { Category } from '@mush/modules/category/category.entity'

@Entity({ name: 'picking' })
export class Picking extends DatedBasicEntity {
  @ApiProperty({ example: 'PickingName', description: 'Picking name' })
  @Column({ type: 'varchar', length: 70, default: null, nullable: true })
  name: string

  @ManyToMany(() => Category)
  @JoinTable()
  categories: Category[]
}
