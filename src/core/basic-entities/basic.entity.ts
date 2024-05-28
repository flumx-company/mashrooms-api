import { Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('basic')
export class BasicEntity {
  @PrimaryGeneratedColumn()
  id: number
}
