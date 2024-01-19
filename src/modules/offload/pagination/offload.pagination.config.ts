import { PaginateConfig } from 'nestjs-paginate'

import { Offload } from '../offload.entity'

export const offloadPaginationConfig: PaginateConfig<Offload> = {
  relations: ['users', 'clients', 'categories'],
  sortableColumns: ['id', 'users.id', 'clients.id', 'categories.id'],
  defaultSortBy: [['id', 'ASC']],
  select: [
    'id',
    'createdAt',
    'updatedAt',
    'users.id',
    'clients.id',
    'categories.id',
  ],
  filterableColumns: {
    createdAt: true, // NOTE: date time in endpoint request should look the following way: $btw:2024-01-01 00:00:00, 2024-01-02 23:59:59
  },
}
