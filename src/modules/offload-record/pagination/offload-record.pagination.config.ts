import { FilterOperator, PaginateConfig } from 'nestjs-paginate'

import { OffloadRecord } from '../offload-record.entity'

export const offloadRecordPaginationConfig: PaginateConfig<OffloadRecord> = {
  relations: [
    'batch',
    'category',
    'offload',
    'storeContainer',
    'wave',
    'variety',
  ],
  sortableColumns: ['id', 'createdAt'],
  defaultSortBy: [['id', 'ASC']],
  filterableColumns: {
    createdAt: [FilterOperator.ILIKE],
    ['batch.id']: [FilterOperator.EQ],
    ['category.id']: [FilterOperator.EQ],
    ['offload.id']: [FilterOperator.EQ],
    ['storeContainer.id']: [FilterOperator.EQ],
    ['wave.id']: [FilterOperator.EQ],
    ['variety.id']: [FilterOperator.EQ],
  },
}
