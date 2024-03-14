import { FilterOperator, PaginateConfig } from 'nestjs-paginate'

import { Watering } from '../watering.entity'

export const wateringPaginationConfig: PaginateConfig<Watering> = {
  sortableColumns: ['id'],
  searchableColumns: ['dateTimeFrom', 'batch.dateFrom'],
  defaultSortBy: [['id', 'ASC']],
  relations: ['shift', 'batch', 'shift.employee'],
  filterableColumns: {
    ['batch.id']: [FilterOperator.EQ],
    ['shift.employee.id']: [FilterOperator.EQ],
    target: [FilterOperator.EQ],
    dateTimeFrom: [FilterOperator.ILIKE],
  },
}
