import { PaginateConfig } from 'nestjs-paginate'

import { Employee } from '../employee.entity'

export const employeePaginationConfig: PaginateConfig<Employee> = {
  sortableColumns: ['id'],
  searchableColumns: ['firstName', 'lastName'],
  defaultSortBy: [['id', 'ASC']],
  relations: ['avatars'],
}
