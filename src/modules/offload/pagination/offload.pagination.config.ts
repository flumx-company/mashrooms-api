import { PaginateConfig } from 'nestjs-paginate'

import { Offload } from '../offload.entity'

export const offloadPaginationConfig: PaginateConfig<Offload> = {
  relations: [
    'author',
    'client',
    'category',
    'batch',
    'wave',
    'storeContainer',
    'variety',
    'driver',
  ],
  sortableColumns: ['id', 'author.id', 'client.id', 'category.id'],
  defaultSortBy: [['id', 'ASC']],
  filterableColumns: {
    createdAt: true, // NOTE: date time in endpoint request should look the following way: $btw:2024-01-01 00:00:00, 2024-01-02 23:59:59
  },
}
