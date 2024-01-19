import { PaginateConfig } from 'nestjs-paginate'

import { Client } from '../client.entity'

export const clientPaginationConfig: PaginateConfig<Client> = {
  sortableColumns: ['id'],
  defaultSortBy: [['id', 'ASC']],
}
