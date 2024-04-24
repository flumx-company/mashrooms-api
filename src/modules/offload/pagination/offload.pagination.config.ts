import { FilterOperator, PaginateConfig } from 'nestjs-paginate'

import { Offload } from '../offload.entity'

export const offloadPaginationConfig: PaginateConfig<Offload> = {
  relations: ['author', 'client', 'driver', 'documents', 'loaderShift'],
  sortableColumns: ['id', 'author.id', 'client.id', 'driver.id'],
  defaultSortBy: [['id', 'ASC']],
  filterableColumns: {
    createdAt: [FilterOperator.ILIKE],
    ['loaderShift.employee.id']: [FilterOperator.EQ],
    ['author.id']: [FilterOperator.EQ],
    ['client.id']: [FilterOperator.EQ],
    ['driver.id']: [FilterOperator.EQ],
  },
}
