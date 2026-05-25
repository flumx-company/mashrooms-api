import { FilterOperator, PaginateConfig } from 'nestjs-paginate'

import { Cutting } from '../cutting.entity'

export const cuttingPaginationConfig: PaginateConfig<Cutting> = {
  sortableColumns: ['id'],
  searchableColumns: ['createdAt'],
  defaultSortBy: [['id', 'DESC']],
  relations: [
    'batch',
    'batch.chamber',
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
    ['wave.id']: [FilterOperator.EQ],
    createdAt: [FilterOperator.GTE, FilterOperator.LT],
    ['batch.chamber.id']: [FilterOperator.EQ],
  },
}
