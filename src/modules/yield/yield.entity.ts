import { Column, Entity, JoinTable, ManyToMany } from 'typeorm'

import { ApiProperty } from '@nestjs/swagger'

import { Category } from '@mush/modules/category/category.entity'

import { DatedBasicEntity } from '@mush/core/basic-entities'

@Entity({ name: 'yields' })
export class Yield extends DatedBasicEntity {
  @ApiProperty({ example: 'YieldName', description: 'Yield name' })
  @Column({ type: 'varchar', length: 70, default: null, nullable: true })
  name: string

  @ManyToMany(() => Category)
  @JoinTable()
  categories: Category[]
}
