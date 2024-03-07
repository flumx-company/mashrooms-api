import { PaginateConfig } from 'nestjs-paginate'

import { Driver } from '../driver.entity'

export const driverPaginationConfig: PaginateConfig<Driver> = {
  sortableColumns: ['id'],
  defaultSortBy: [['id', 'ASC']],
}
