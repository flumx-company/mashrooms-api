import { FilterOperator, PaginateConfig } from 'nestjs-paginate'

import { Offload } from '../offload.entity'

export const offloadPaginationConfig: PaginateConfig<Offload> = {
  relations: ['author', 'client', 'driver', 'documents', 'loaderShifts', 'loaderShifts.employee'],
  sortableColumns: ['id', 'author.id', 'client.id', 'driver.id'],
  defaultSortBy: [['id', 'DESC']],
  filterableColumns: {
    createdAt: [FilterOperator.ILIKE],
    isClosed: [FilterOperator.EQ],
    ['loaderShifts.employee.id']: [FilterOperator.EQ],
    ['author.id']: [FilterOperator.EQ],
    ['client.id']: [FilterOperator.EQ],
    ['driver.id']: [FilterOperator.EQ],
  },

}
