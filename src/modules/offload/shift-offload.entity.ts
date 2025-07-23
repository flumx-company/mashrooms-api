import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Offload } from './offload.entity';
import { Shift } from '../shift/shift.entity';
import {DatedBasicEntity} from "@mush/core/basic-entities";

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
} 