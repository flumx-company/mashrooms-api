import { FilterOperator, PaginateConfig } from 'nestjs-paginate'

import { Cutting } from '../cutting.entity'

export const cuttingPaginationConfig: PaginateConfig<Cutting> = {
  sortableColumns: ['id'],
  searchableColumns: ['createdAt'],
  defaultSortBy: [['id', 'ASC']],
  relations: [
    'batch',
    'wave',
    'cutterShift',
    'cutterShift.employee',
    'category',
    'variety',
    'loaderShift',
    'loaderShift.employee',
    'author',
  ],
  filterableColumns: {
    ['batch.id']: [FilterOperator.EQ],
  },
}
