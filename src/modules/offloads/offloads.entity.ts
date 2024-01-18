import { Entity, JoinTable, ManyToMany } from 'typeorm'

import { Category } from '@mush/modules/category/category.entity'
import { ClientsEntity } from '@mush/modules/clients/clients.entity'
import { UsersEntity } from '@mush/modules/core-module/users/users.entity'

import { DatedBasicEntity } from '@mush/core/basic-entities'

@Entity({ name: 'offloads' })
export class OffloadsEntity extends DatedBasicEntity {
  @ManyToMany(() => UsersEntity, (user) => user.offloads)
  users: UsersEntity[]

  @ManyToMany(() => ClientsEntity, (client) => client.offloads)
  clients: ClientsEntity[]

  @ManyToMany(() => Category, (category) => category.offloads)
  @JoinTable()
  categories: Category[]
}
