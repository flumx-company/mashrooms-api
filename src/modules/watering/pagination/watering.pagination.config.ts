import { PaginateConfig } from 'nestjs-paginate'

import { Watering } from '../watering.entity'

export const wateringPaginationConfig: PaginateConfig<Watering> = {
  sortableColumns: ['id'],
  defaultSortBy: [['id', 'ASC']],
  relations: ['shift', 'batch'],
}
