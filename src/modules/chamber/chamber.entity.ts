import { Column, Entity } from 'typeorm'

import { ApiProperty } from '@nestjs/swagger'

import { DatedBasicEntity } from '@mush/core/basic-entities'

@Entity({ name: 'chambers' })
export class Chamber extends DatedBasicEntity {
  @ApiProperty({ example: 'Chamber 1', description: 'Chamber name' })
  @Column({ type: 'varchar', length: 35, default: null, nullable: true })
  name: string

  @ApiProperty({ example: 3, description: 'Maximum possible wave quantity' })
  @Column({ type: 'decimal', precision: 3, scale: 0, default: 0 })
  waveQuantity: number

  @ApiProperty({ example: 100, description: 'Chamber area by m2' })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  area: number
}
