import { PaginateConfig } from 'nestjs-paginate'

import { ClientsEntity } from '../clients.entity'

export const clientsPaginationConfig: PaginateConfig<ClientsEntity> = {
  sortableColumns: ['id'],
  defaultSortBy: [['id', 'ASC']],
}
