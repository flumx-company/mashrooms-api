import { CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm'

import { BasicEntity } from './basic.entity'

@Entity('dated-basic')
export class DatedBasicEntity extends BasicEntity {
  @CreateDateColumn({
    type: 'timestamp',
    // default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date

  @UpdateDateColumn({
    type: 'timestamp',
    // default: () => 'CURRENT_TIMESTAMP(6)',
    // onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updatedAt: Date
}
