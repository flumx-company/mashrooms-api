import { Column, Entity, OneToMany } from 'typeorm'

import { ApiProperty } from '@nestjs/swagger'

import { Offload } from '@mush/modules/offload/offload.entity'

import { DatedBasicEntity } from '@mush/core/basic-entities'

@Entity({ name: 'store-container' })
export class StoreContainer extends DatedBasicEntity {
  @ApiProperty({
    example: 'Pallette',
    description: 'This is a container, in which mushrooms are weighted.',
  })
  @Column({
    type: 'varchar',
    length: 35,
    default: null,
    nullable: true,
  })
  name: string

  @ApiProperty({
    example: 200,
    description: 'Weight in kg',
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  weight: number

  @OneToMany(() => Offload, (offload) => offload.storeContainer)
  offloads: Offload[]
}
