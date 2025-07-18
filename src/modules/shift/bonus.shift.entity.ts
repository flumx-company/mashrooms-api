import { Column, Entity, ManyToOne } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { DatedBasicEntity } from '@mush/core/basic-entities'
import { Shift } from './shift.entity'
import { IsNumber, IsNotEmpty } from 'class-validator'

@Entity({ name: 'bonus-shifts' })
export class BonusShiftEntity extends DatedBasicEntity {
  @ApiProperty({
    example: 0,
    description: `This ${process.env.AUTOMATIC_WAGE_BONUS_PERCENT} bonus to the wage is added in case an employee worked ${process.env.AUTOMATIC_WAGE_BONUS_MINIMUM_DAY_AMOUNT} days within the shift.`,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  bonus: number

  @ManyToOne(() => Shift, (shift) => shift.bonusShifts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
    orphanedRowAction: 'delete',
  })
  shift: Shift
}

export class CreateBonusShiftDto {
  @ApiProperty({
    example: 1000,
    description: 'Bonus amount',
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  bonus: number
} 