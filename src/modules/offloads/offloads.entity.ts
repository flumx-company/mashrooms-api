import { Entity, ManyToOne } from 'typeorm'

import { UsersEntity } from '@mush/modules/core-module/users/users.entity'

import { DatedBasicEntity } from '@mush/core/basic-entities'

@Entity({ name: 'offloads' })
export class OffloadsEntity extends DatedBasicEntity {
  @ManyToOne(() => UsersEntity, (user) => user.offloads)
  user: UsersEntity
}
