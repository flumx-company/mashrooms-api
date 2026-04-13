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
  sortableColumns: ['id', 'dateFrom', 'dateTo'],
  searchableColumns: ['dateTo', 'employee.id'],
  /** Хронологічний порядок: новіші вахти вище (сортування по реальній даті, не як рядок). */
  defaultSortBy: [['dateFrom', 'DESC']],
  filterableColumns: {
    dateTo: [FilterOperator.ILIKE, FilterOperator.NULL, FilterSuffix.NOT],
    ['employee.id']: [FilterOperator.EQ],
  },
}
