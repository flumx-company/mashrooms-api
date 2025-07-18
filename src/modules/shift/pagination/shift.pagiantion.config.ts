import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';

import { Shift } from '../shift.entity'

export const shiftPaginationConfig: PaginateConfig<Shift> = {
  relations: [
    'employee',
    'bonusShifts',
    // 'workRecords',
    // 'waterings',
    // 'cuttings',
    // 'loadings',
    // 'offloadLoadings',
    // 'workRecords.work',
  ],
  sortableColumns: ['id'],
  searchableColumns: ['dateTo', 'employee.id'],
  defaultSortBy: [['id', 'DESC']],
  filterableColumns: {
    dateTo: [FilterOperator.ILIKE, FilterOperator.NULL, FilterSuffix.NOT],
    ['employee.id']: [FilterOperator.EQ],
  },
}
