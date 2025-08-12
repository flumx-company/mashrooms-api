import { PaginateConfig, FilterOperator } from 'nestjs-paginate'

import { Employee } from '../employee.entity'

export const employeePaginationConfig: PaginateConfig<Employee> = {
  sortableColumns: ['id'],
  searchableColumns: ['firstName', 'lastName'],
  defaultSortBy: [['id', 'DESC']],
  relations: ['avatars'],
  filterableColumns: {
    isActive: [FilterOperator.EQ],
  },
}
