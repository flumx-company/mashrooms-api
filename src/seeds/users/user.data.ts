import { EPermission } from "src/core/enums/permissions";
import { ERole } from "src/core/enums/roles";
import { UsersEntity } from "src/modules/core-module/users/users.entity";

export const userList: Partial<UsersEntity>[] = [
  {
    firstName: process.env.SEED_SUPERADMIN_FIRSTNAME,
    lastName: process.env.SEED_SUPERADMIN_LASTNAME,
    phone: process.env.SEED_SUPERADMIN_PHONE,
    email: process.env.SEED_SUPERADMIN_EMAIL,
    password: process.env.SEED_SUPERADMIN_PASSWORD,
    role: ERole.SUPERADMIN,
    permissions: Object.values(EPermission),
  },
];
