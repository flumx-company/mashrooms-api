import { PaginateConfig } from 'nestjs-paginate'

import { Work } from '../work.entity'

export const workPaginationConfig: PaginateConfig<Work> = {
  sortableColumns: ['id', 'isRegular'],
  defaultSortBy: [
    ['isRegular', 'DESC'],
    ['title', 'ASC'],
  ],
}
