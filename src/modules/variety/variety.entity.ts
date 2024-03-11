import { Column, Entity, Index, OneToMany } from 'typeorm'

import { ApiProperty } from '@nestjs/swagger'

import { Cutting } from '@mush/modules/cutting/cutting.entity'

import { DatedBasicEntity } from '@mush/core/basic-entities'

@Entity({ name: 'varieties' })
export class Variety extends DatedBasicEntity {
  @ApiProperty({ example: '1 variety', description: 'Variety name' })
  @Index()
  @Column({ type: 'varchar', length: 35, default: null, nullable: true })
  name: string

  @OneToMany(() => Cutting, (cutting) => cutting.variety)
  cuttings: Cutting[]
}
