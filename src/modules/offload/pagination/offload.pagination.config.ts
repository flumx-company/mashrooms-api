import { FilterOperator, PaginateConfig } from 'nestjs-paginate'

import { Offload } from '../offload.entity'

export const offloadPaginationConfig: PaginateConfig<Offload> = {
  relations: ['author', 'client', 'driver', 'documents'],
  sortableColumns: ['id', 'author.id', 'client.id', 'driver.id'],
  defaultSortBy: [['id', 'ASC']],
  filterableColumns: {
    createdAt: [FilterOperator.ILIKE],
  },
}
