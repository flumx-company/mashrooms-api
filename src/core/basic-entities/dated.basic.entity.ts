import { CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm'
import { Transform } from 'class-transformer'

import { BasicEntity } from './basic.entity'
import { formatDateTimeForClient } from '@mush/core/utils'

/**
 * Все даты на сервере хранятся в UTC.
 * В ответах API даты отдаются в формате «день.месяц.год» для отображения на клиенте.
 */
@Entity('dated-basic')
export class DatedBasicEntity extends BasicEntity {
  @CreateDateColumn({
    type: 'timestamp',
  })
  @Transform(({ value }) => (value != null ? formatDateTimeForClient(value) : value))
  public createdAt: Date

  @UpdateDateColumn({
    type: 'timestamp',
  })
  @Transform(({ value }) => (value != null ? formatDateTimeForClient(value) : value))
  public updatedAt: Date
}
