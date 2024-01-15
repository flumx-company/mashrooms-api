import { Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm'

import { Category } from '@mush/modules/category/category.entity'
import { ClientsEntity } from '@mush/modules/clients/clients.entity'
import { UsersEntity } from '@mush/modules/core-module/users/users.entity'

import { DatedBasicEntity } from '@mush/core/basic-entities'

@Entity({ name: 'offloads' })
export class OffloadsEntity extends DatedBasicEntity {
  @ManyToOne(() => UsersEntity, (user) => user.offloads)
  user: UsersEntity

  @ManyToOne(() => ClientsEntity, (client) => client.offloads)
  client: ClientsEntity

  @ManyToMany(() => Category)
  @JoinTable()
  categories: Category[]
}
