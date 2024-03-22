import { FilterOperator, PaginateConfig } from 'nestjs-paginate'

import { Offload } from '../offload.entity'

export const offloadPaginationConfig: PaginateConfig<Offload> = {
  relations: [
    'author',
    'client',
    'category',
    'batch',
    'wave',
    'storeContainer',
    'variety',
    'driver',
  ],
  sortableColumns: ['id', 'author.id', 'client.id', 'category.id'],
  defaultSortBy: [['id', 'ASC']],
  filterableColumns: {
    createdAt: [FilterOperator.ILIKE],
  },
}
