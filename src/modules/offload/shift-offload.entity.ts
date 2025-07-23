import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Offload } from './offload.entity';
import { Shift } from '../shift/shift.entity';

@Entity()
export class ShiftOffload {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Offload, { onDelete: 'CASCADE' })
  offload: Offload;

  @ManyToOne(() => Shift, { onDelete: 'CASCADE' })
  shift: Shift;

  @Column('int')
  boxQuantity: number;
} 