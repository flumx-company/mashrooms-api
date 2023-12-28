import { EPermission } from "src/core/enums/permissions";
import { EPosition } from "src/core/enums/positions";
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
    position: EPosition.SUPERADMINISTRATOR,
    permissions: Object.values(EPermission),
  },
];
