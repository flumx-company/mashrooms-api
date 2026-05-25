import { FilterOperator, PaginateConfig } from 'nestjs-paginate'

import { Offload } from '../offload.entity'

export const offloadPaginationConfig: PaginateConfig<Offload> = {
  relations: ['author', 'client', 'driver', 'documents', 'shiftOffloads.shift.employee'],
  sortableColumns: ['id', 'createdAt', 'author.id', 'client.id', 'driver.id'],
  defaultSortBy: [['createdAt', 'DESC']],
  filterableColumns: {
    createdAt: [FilterOperator.GTE, FilterOperator.LT],
    isClosed: [FilterOperator.EQ],
    ['shiftOffloads.shift.employee.id']: [FilterOperator.EQ],
    ['author.id']: [FilterOperator.EQ],
    ['client.id']: [FilterOperator.EQ],
    ['driver.id']: [FilterOperator.EQ],
  },

}
