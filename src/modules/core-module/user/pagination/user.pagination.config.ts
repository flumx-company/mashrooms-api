import { PaginateConfig } from 'nestjs-paginate'

import { User } from '../user.entity'

export const userPaginationConfig: PaginateConfig<User> = {
  sortableColumns: ['id'],
  defaultSortBy: [['id', 'ASC']],
}
