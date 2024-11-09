import { PaginateConfig } from 'nestjs-paginate'

import { Storage } from '../storage.entity'

export const storagePaginationConfig: PaginateConfig<Storage> = {
  sortableColumns: ['id'],
  searchableColumns: ['date'],
  defaultSortBy: [['id', 'DESC']],
  relations: ['wave.batch', 'wave.batch.chamber', 'variety', 'category'],
}
