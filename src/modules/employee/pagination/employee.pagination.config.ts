import { PaginateConfig } from 'nestjs-paginate'

import { Employee } from '../employee.entity'

export const employeePaginationConfig: PaginateConfig<Employee> = {
  sortableColumns: ['id'],
  defaultSortBy: [['id', 'ASC']],
  relations: ['avatars'],
}
