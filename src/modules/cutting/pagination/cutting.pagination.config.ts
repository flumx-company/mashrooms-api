import { PaginateConfig } from 'nestjs-paginate'

import { Cutting } from '../cutting.entity'

export const cuttingPaginationConfig: PaginateConfig<Cutting> = {
  sortableColumns: ['id'],
  searchableColumns: ['createdAt'],
  defaultSortBy: [['id', 'ASC']],
  relations: ['batch', 'shift', 'shift.employee'],
}
