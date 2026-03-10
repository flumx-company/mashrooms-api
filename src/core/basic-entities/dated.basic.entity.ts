import { CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm'

import { BasicEntity } from './basic.entity'

/**
 * Все даты на сервере хранятся и отдаются в UTC.
 * Форматирование в локальное время и часовые пояса — на клиенте.
 */
@Entity('dated-basic')
export class DatedBasicEntity extends BasicEntity {
  @CreateDateColumn({
    type: 'timestamp',
  })
  public createdAt: Date

  @UpdateDateColumn({
    type: 'timestamp',
  })
  public updatedAt: Date
}
