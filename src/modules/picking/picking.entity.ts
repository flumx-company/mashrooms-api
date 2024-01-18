import { Column, Entity, JoinTable, ManyToMany } from 'typeorm'

import { ApiProperty } from '@nestjs/swagger'

import { Category } from '@mush/modules/category/category.entity'

import { DatedBasicEntity } from '@mush/core/basic-entities'

@Entity({ name: 'picking' })
export class Picking extends DatedBasicEntity {
  @ApiProperty({ example: 'PickingName', description: 'Picking name' })
  @Column({ type: 'varchar', length: 70, default: null, nullable: true })
  name: string

  @ManyToMany(() => Category, (category) => category.pickings)
  @JoinTable()
  categories: Category[]
}
