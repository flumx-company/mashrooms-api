import { PaginateConfig } from 'nestjs-paginate'

import { GroupedWorkRecordResponseDto } from '../dto/grouped.work.record.response.dto'

export const groupedWorkRecordPaginationConfig: PaginateConfig<GroupedWorkRecordResponseDto> = {
  sortableColumns: ['createdAt', 'workId', 'chamberId'],
  defaultSortBy: [['createdAt', 'DESC']],
  searchableColumns: ['work.title', 'chamber.name'],
  defaultLimit: 5,
  maxLimit: 100,
} 
