import { EPermission } from "src/core/enums/permissions";
import { ERole } from "src/core/enums/roles";
import { UsersEntity } from "src/modules/core-module/users/users.entity";

export const userList: Partial<UsersEntity>[] = [
  {
    firstName: "Jason",
    lastName: "Statham",
    phone: "+38123456789",
    email: "superadmin@dmail.com",
    password: "123Abc!_z",
    role: ERole.SUPERADMIN,
    permissions: Object.values(EPermission),
  },
];
