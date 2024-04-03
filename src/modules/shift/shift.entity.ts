import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm'

import { ApiProperty } from '@nestjs/swagger'

import { Cutting } from '@mush/modules/cutting/cutting.entity'
import { Employee } from '@mush/modules/employee/employee.entity'
import { Offload } from '@mush/modules/offload/offload.entity'
import { Watering } from '@mush/modules/watering/watering.entity'
import { WorkRecord } from '@mush/modules/work-record/work.record.entity'

import { DatedBasicEntity } from '@mush/core/basic-entities'
import { EPaymentMethod } from '@mush/core/enums'
import { formatDateToDateTime } from '@mush/core/utils'

@Entity({ name: 'shifts' })
export class Shift extends DatedBasicEntity {
  @ApiProperty({
    example: '2024-01-15',
    description: 'Shift start date',
  })
  @Column({
    type: 'date',
    transformer: {
      from: (value: Date) => {
        return formatDateToDateTime({ value, dateFrom: true })
      },
      to: (value: string) => {
        return new Date(value)
      },
    },
  })
  dateFrom: Date

  @ApiProperty({
    example: '2024-01-15',
    description: 'Shift end date',
  })
  @Index()
  @Column({
    type: 'date',
    default: null,
    transformer: {
      from: (value: Date) => {
        return formatDateToDateTime({ value, dateFrom: false })
      },
      to: (value: string) => {
        return value ? new Date(value) : value
      },
    },
  })
  dateTo: Date

  @ManyToOne(() => Employee, (employee) => employee.shifts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
    orphanedRowAction: 'delete',
  })
  employee: Employee

  @OneToMany(() => WorkRecord, (workRecord) => workRecord.shift)
  workRecords: WorkRecord[]

  @OneToMany(() => Watering, (watering) => watering.shift)
  waterings: Watering[]

  @OneToMany(() => Cutting, (cutting) => cutting.cutterShift)
  cuttings: Cutting[]

  @OneToMany(() => Cutting, (cutting) => cutting.loaderShift)
  loadings: Cutting[]

  @OneToMany(() => Offload, (offload) => offload.loaderShift)
  offloadLoadings: Offload[]

  @ApiProperty({
    example: false,
    description:
      'The status indicates if an employee has returned the knife. Boolean value.',
  })
  @Column({ type: 'boolean', default: false, nullable: true })
  returnsKnife: boolean

  @ApiProperty({
    example: false,
    description:
      'The status indicates if an employee has returned the bed sheets. Boolean value.',
  })
  @Column({ type: 'boolean', default: false, nullable: true })
  returnsBedSheets: boolean

  @ApiProperty({
    example: false,
    description:
      'The status indicates if an employee has returned the wardrobe key. Boolean value.',
  })
  @Column({ type: 'boolean', default: false, nullable: true })
  returnsWardrobeKey: boolean

  @ApiProperty({
    example: false,
    description:
      'The status indicates if an employee has covered the kitchen expanses. Boolean value.',
  })
  @Column({ type: 'boolean', default: false, nullable: true })
  paysForKitchen: boolean

  @ApiProperty({
    example: EPaymentMethod.CASH,
    description: 'The payment method used for "paysForKitchen" status.',
  })
  @Column({ type: 'enum', enum: EPaymentMethod, default: EPaymentMethod.CASH })
  kitchenPaymentMethod: EPaymentMethod

  @ApiProperty({
    example: true,
    description: 'Kitchen expenses: kitchen price multiplied by dayNumber.',
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  kitchenExpenses: number

  @ApiProperty({
    example: true,
    description: 'The automatically calculated quantity of calendar days.',
  })
  @Column({ type: 'decimal', precision: 3, scale: 0, default: 0 })
  calendarDayNumber: number

  @ApiProperty({
    example: true,
    description: 'The automatically calculated quantity of working days.',
  })
  @Column({ type: 'decimal', precision: 3, scale: 0, default: 0 })
  workingDayNumber: number

  @ApiProperty({
    example: true,
    description: 'Wages from all works done over the shift.',
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  wage: number

  @ApiProperty({
    example: true,
    description: `This ${process.env.AUTOMATIC_WAGE_BONUS_PERCENT} bonus to the wage is added in case an employee worked ${process.env.AUTOMATIC_WAGE_BONUS_MINIMUM_DAY_AMOUNT} days within the shift.`,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  bonus: number

  @ApiProperty({
    example: true,
    description: 'This bonus is given by the employer whenever he decides.',
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  customBonus: number

  @ApiProperty({
    example: 'Description for the custom bonus.',
    description: 'Description for the custom bonus.',
  })
  @Column({
    type: 'varchar',
    length: 255,
    default: null,
    nullable: true,
  })
  customBonusDescription: string

  @ApiProperty({
    example: true,
    description: 'All the wages plus all bonuses minus kitchenExpenses.',
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  wageTotal: number

  @ApiProperty({
    example: true,
    description: 'The amount of money paid to the employee.',
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  paidAmount: number

  @ApiProperty({
    example: true,
    description: 'WageTotal minus paidAmount.',
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  remainedPayment: number
}
