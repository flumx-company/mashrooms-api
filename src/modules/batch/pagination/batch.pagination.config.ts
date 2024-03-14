import { FilterOperator, PaginateConfig } from 'nestjs-paginate'

import { Batch } from '../batch.entity'

export const batchPaginationConfig: PaginateConfig<Batch> = {
  sortableColumns: ['id'],
  searchableColumns: ['chamber.id', 'dateFrom', 'dateTo'],
  defaultSortBy: [['id', 'ASC']],
  relations: ['waves', 'chamber', 'cuttings', 'waterings'],
  filterableColumns: {
    dateTo: [FilterOperator.NULL],
    dateFrom: [FilterOperator.ILIKE],
    ['chamber.id']: [FilterOperator.EQ],
  },
}
