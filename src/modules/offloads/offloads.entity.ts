import { Entity, ManyToOne } from 'typeorm'

import { UsersEntity } from '@mush/users/users.entity'

import { DatedBasicEntity } from '@mush/basic-entities'

@Entity({ name: 'offloads' })
export class OffloadsEntity extends DatedBasicEntity {
  @ManyToOne(() => UsersEntity, (user) => user.offloads)
  user: UsersEntity
}
