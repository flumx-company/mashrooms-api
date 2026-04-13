import { FilterOperator, PaginateConfig, FilterSuffix } from 'nestjs-paginate'

import { Batch } from '../batch.entity'

export const batchPaginationConfig: PaginateConfig<Batch> = {
  // Сначала по номеру/ид камеры (1, 2, 3…), внутри камеры — новее ниже
  sortableColumns: ['id', 'chamber.id', 'dateTo'],
  searchableColumns: ['chamber.id', 'dateFrom', 'dateTo'],
  defaultSortBy: [
    ['chamber.id', 'ASC'],
    ['id', 'DESC'],
  ],
  relations: ['waves', 'chamber', 'cuttings', 'waterings', 'subbatches', 'subbatches.category'],
  filterableColumns: {
    dateTo: [FilterOperator.NULL, FilterSuffix.NOT],
    dateFrom: [FilterOperator.ILIKE],
    ['chamber.id']: [FilterOperator.EQ],
  },
}
