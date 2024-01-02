import { PaginateConfig } from "nestjs-paginate";
import { OffloadsEntity } from "../offloads.entity";



export const offloadsPaginationConfig: PaginateConfig<OffloadsEntity> = {
  relations: ["user"],
  sortableColumns: ["id", "user.id"],
  defaultSortBy: [["id", "ASC"]],
  select: ["id", "created_at", "updated_at", "user.id"],
  filterableColumns: {
    created_at: true, // NOTE: date time in endpoint request should look the following way: $btw:2024-01-01 00:00:00, 2024-01-02 23:59:59
  },
};
