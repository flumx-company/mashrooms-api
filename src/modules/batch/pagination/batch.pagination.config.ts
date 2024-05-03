import { FilterOperator, PaginateConfig, FilterSuffix } from 'nestjs-paginate'

import { Batch } from '../batch.entity'

export const batchPaginationConfig: PaginateConfig<Batch> = {
  sortableColumns: ['id'],
  searchableColumns: ['chamber.id', 'dateFrom', 'dateTo'],
  defaultSortBy: [['id', 'ASC']],
  relations: ['waves', 'chamber', 'cuttings', 'waterings', 'subbatches'],
  filterableColumns: {
    dateTo: [FilterOperator.NULL, FilterSuffix.NOT],
    dateFrom: [FilterOperator.ILIKE],
    ['chamber.id']: [FilterOperator.EQ],
  },
}
