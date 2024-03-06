import { Column, Entity, ManyToOne, OneToMany } from 'typeorm'

import { ApiProperty } from '@nestjs/swagger'

import { Employee } from '@mush/modules/employee/employee.entity'

import { DatedBasicEntity } from '@mush/core/basic-entities'
import { formatDateToDateTime } from '@mush/core/utils'

import { Watering } from '../watering/watering.entity'
import { WorkRecord } from '../work-record/work.record.entity'

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
  waterings: WorkRecord[]
}
