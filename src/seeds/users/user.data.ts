import { UsersEntity } from '@users/users.entity'

import { EPermission, EPosition, ERole } from '@enums/index'

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
    isActive: true,
  },
]
