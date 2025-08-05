import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Offload } from './offload.entity';
import { Shift } from '../shift/shift.entity';
import {DatedBasicEntity} from "@mush/core/basic-entities";
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class ShiftOffload  extends DatedBasicEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Offload, { onDelete: 'CASCADE' })
  offload: Offload;

  @ManyToOne(() => Shift, { onDelete: 'CASCADE' })
  shift: Shift;

  @Column('int')
  boxQuantity: number;

  @ApiProperty({
    example: 1500.00,
    description: 'Сумма за проделанную работу (количество ящиков умноженное на цену ящика)',
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  workAmount: number;
} 