import { Column, Entity, ManyToOne } from 'typeorm'

import { ApiProperty } from '@nestjs/swagger'

import { DatedBasicEntity } from '@mush/core/basic-entities'

import { Batch } from '../batch/batch.entity'
import { Category } from '../category/category.entity'
import { User } from '../core-module/user/user.entity'
import { Shift } from '../shift/shift.entity'
import { Variety } from '../variety/variety.entity'
import { Wave } from '../wave/wave.entity'

@Entity({ name: 'cuttings' })
export class Cutting extends DatedBasicEntity {
  @ApiProperty({ example: 3, description: 'Maximum wave quantity' })
  @Column({ type: 'decimal', precision: 0, scale: 0, default: 0 })
  boxQuantity: number

  @ApiProperty({ example: 2, description: 'The trip number' })
  @Column({ type: 'decimal', precision: 0, scale: 0, default: 0 })
  trip: number

  @ManyToOne(() => Category, (category) => category.cuttings, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
    orphanedRowAction: 'delete',
  })
  category: Category

  @ManyToOne(() => Variety, (variety) => variety.cuttings, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
    orphanedRowAction: 'delete',
  })
  variety: Variety

  @ManyToOne(() => Batch, (batch) => batch.cuttings, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
    orphanedRowAction: 'delete',
  })
  batch: Batch

  @ManyToOne(() => Wave, (wave) => wave.cuttings, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
    orphanedRowAction: 'delete',
  })
  wave: Wave

  @ManyToOne(() => Shift, (shift) => shift.cuttings, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
    orphanedRowAction: 'delete',
  })
  shift: Shift[]

  @ManyToOne(() => User, (user) => user.cuttings, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
    orphanedRowAction: 'delete',
  })
  author: User
}
