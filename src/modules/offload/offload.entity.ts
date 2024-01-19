import { Entity, JoinTable, ManyToMany } from 'typeorm'

import { Category } from '@mush/modules/category/category.entity'
import { Client } from '@mush/modules/client/client.entity'
import { User } from '@mush/modules/core-module/user/user.entity'

import { DatedBasicEntity } from '@mush/core/basic-entities'

@Entity({ name: 'offloads' })
export class Offload extends DatedBasicEntity {
  @ManyToMany(() => User, (user) => user.offloads)
  users: User[]

  @ManyToMany(() => Client, (client) => client.offloads)
  clients: Client[]

  @ManyToMany(() => Category, (category) => category.offloads)
  @JoinTable()
  categories: Category[]
}
