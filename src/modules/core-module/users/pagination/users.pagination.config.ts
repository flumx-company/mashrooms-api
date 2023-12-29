import { PaginateConfig } from "nestjs-paginate";
import { UsersEntity } from "../users.entity";

export const usersPaginationConfig: PaginateConfig<UsersEntity> = {
  sortableColumns: ["id"],
  defaultSortBy: [["id", "ASC"]],
};
