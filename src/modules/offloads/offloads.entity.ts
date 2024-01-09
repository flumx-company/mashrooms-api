import { Entity, ManyToMany, ManyToOne, JoinTable } from 'typeorm'

import { UsersEntity } from '@mush/modules/core-module/users/users.entity'
import { Category } from '@mush/modules/category/category.entity'

import { DatedBasicEntity } from '@mush/core/basic-entities'

@Entity({ name: 'offloads' })
export class OffloadsEntity extends DatedBasicEntity {
  @ManyToOne(() => UsersEntity, (user) => user.offloads)
  user: UsersEntity

  @ManyToMany(() => Category)
  @JoinTable()
  categories: Category[]
}
