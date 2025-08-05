import { FilterOperator, PaginateConfig } from 'nestjs-paginate'

import { GroupedWorkRecordResponseDto } from '../dto/grouped.work.record.response.dto'

export const groupedWorkRecordPaginationConfig: PaginateConfig<GroupedWorkRecordResponseDto> = {
  sortableColumns: ['createdAt', 'workId', 'chamberId'],
  defaultSortBy: [['createdAt', 'DESC']],
  searchableColumns: ['work.title', 'chamber.name'],
  filterableColumns: {
    date: [FilterOperator.EQ],
    chamberId: [FilterOperator.EQ],
    workId: [FilterOperator.EQ],
    shiftId: [FilterOperator.EQ],
    employeeId: [FilterOperator.EQ],
    workType: [FilterOperator.EQ],
    isRegular: [FilterOperator.EQ],
    recordGroupId: [FilterOperator.EQ],
  },
  defaultLimit: 5,
  maxLimit: 100,
} 
