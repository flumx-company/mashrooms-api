import { Entity, ManyToOne } from 'typeorm'

import { UsersEntity } from '@users/users.entity'

import { DatedBasicEntity } from '@basic-entities/dated.basic.entity'

@Entity({ name: 'offloads' })
export class OffloadsEntity extends DatedBasicEntity {
  @ManyToOne(() => UsersEntity, (user) => user.offloads)
  user: UsersEntity
}
