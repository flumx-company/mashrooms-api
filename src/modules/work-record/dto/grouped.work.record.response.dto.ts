import { ApiProperty } from '@nestjs/swagger'

export class EmployeeDto {
  @ApiProperty({ example: 1 })
  id: number

  @ApiProperty({ example: 'qweqwe' })
  firstName: string

  @ApiProperty({ example: 'wqewe' })
  lastName: string

  @ApiProperty({ example: 'qweww' })
  patronymic: string
}

export class ShiftDto {
  @ApiProperty({ example: 10 })
  id: number

  @ApiProperty({ example: '28.07.2025', description: 'день.месяц.год' })
  dateFrom: string

  @ApiProperty({ example: '29.07.2025', description: 'день.месяц.год' })
  dateTo: string

  @ApiProperty()
  employee: EmployeeDto
}

export class WorkDto {
  @ApiProperty({ example: 1 })
  id: number

  @ApiProperty({ example: 'робота1' })
  title: string

  @ApiProperty({ example: false })
  isRegular: boolean

  @ApiProperty({ example: 10000 })
  price: number
}

export class ChamberDto {
  @ApiProperty({ example: 1 })
  id: number

  @ApiProperty({ example: 'камера1' })
  name: string

  @ApiProperty({ example: 1000 })
  area: number
}

export class WorkRecordItemDto {
  @ApiProperty({ example: 1 })
  id: number

  @ApiProperty({ example: '29.07.2025', description: 'день.месяц.год' })
  date: string

  @ApiProperty({ example: 10000 })
  amount: number

  @ApiProperty({ example: 0 })
  reward: number

  @ApiProperty({ example: 1753776378056 })
  recordGroupId: number

  @ApiProperty()
  shift: ShiftDto

  @ApiProperty()
  work: WorkDto

  @ApiProperty()
  chamber: ChamberDto

  @ApiProperty({ example: 1 })
  employeeId: number
}

export class GroupedWorkRecordResponseDto {
  @ApiProperty({ example: 'exist' })
  type: string

  @ApiProperty({ example: '29.07.2025', description: 'день.месяц.год' })
  createdAt: string

  @ApiProperty()
  work: WorkDto

  @ApiProperty({ example: 1 })
  workId: number

  @ApiProperty({ example: 1753776378056 })
  recordGroupId: number

  @ApiProperty()
  chamber: ChamberDto

  @ApiProperty({ example: 1 })
  chamberId: number

  @ApiProperty({ type: [WorkRecordItemDto] })
  items: WorkRecordItemDto[]

  @ApiProperty({ type: [WorkRecordItemDto] })
  initialItems: WorkRecordItemDto[]

  @ApiProperty({ example: '20000.00' })
  sum: string
} 