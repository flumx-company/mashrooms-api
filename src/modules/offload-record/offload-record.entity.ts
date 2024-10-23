import { Column, Entity, ManyToOne } from 'typeorm'

import { ApiProperty } from '@nestjs/swagger'

import { Batch } from '@mush/modules/batch/batch.entity'
import { Category } from '@mush/modules/category/category.entity'
import { Offload } from '@mush/modules/offload/offload.entity'
import { StoreContainer } from '@mush/modules/store-container/store-container.entity'
import { Variety } from '@mush/modules/variety/variety.entity'
import { Wave } from '@mush/modules/wave/wave.entity'

import { DatedBasicEntity } from '@mush/core/basic-entities'
import { formatDateToDateTime } from '@mush/core/utils'

@Entity({ name: 'offload-records' })
export class OffloadRecord extends DatedBasicEntity {
  @ManyToOne(() => Batch, (batch) => batch.offloadRecords, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
    orphanedRowAction: 'delete',
  })
  batch: Batch

  @ApiProperty({
    example: true,
    description: 'Box quantity.',
  })
  @Column({ type: 'decimal', precision: 5, scale: 0, default: 0 })
  boxQuantity: number

  @ManyToOne(() => Category, (category) => category.offloadRecords, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
    orphanedRowAction: 'delete',
  })
  category: Category

  @ApiProperty({
    example: '2024-01-15',
    description: 'Cutting date',
  })
  @Column({
    type: 'date',
    transformer: {
      from: (value: Date) => formatDateToDateTime({ value }),
      to: (value: string) => new Date(value),
    },
  })
  cuttingDate: Date

  @ApiProperty({
    example: true,
    description:
      'Commmon id for all offloads in one price group of the document.',
  })
  @Column({ type: 'decimal', precision: 16, scale: 0, default: 0 })
  priceId: number

  @ApiProperty({
    example: 200,
    description: 'Price per kg.',
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  pricePerKg: number

  @ManyToOne(() => Offload, (offload) => offload.offloadRecords, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
    orphanedRowAction: 'delete',
  })
  offload: Offload

  @ManyToOne(
    () => StoreContainer,
    (storeContainer) => storeContainer.offloadRecords,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      nullable: false,
      orphanedRowAction: 'delete',
    },
  )
  storeContainer: StoreContainer

  @ManyToOne(() => Wave, (wave) => wave.offloadRecords, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
    orphanedRowAction: 'delete',
  })
  wave: Wave

  @ApiProperty({
    example: true,
    description: 'Brutto weight in kg.',
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  weight: number

  // @ApiProperty({
  //   example: 200,
  //   description:
  //     'Mushroom weight without box weight and store container weight',
  // })
  // @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  // netWeight: number
  //
  // @ApiProperty({
  //   example: 200,
  //   description: 'Mushroom weight after shrinkage, which is minus 1%',
  // })
  // @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  // shrinkedNetWeight: number

  @ManyToOne(() => Variety, (variety) => variety.offloadRecords, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
    orphanedRowAction: 'delete',
  })
  variety: Variety
}
