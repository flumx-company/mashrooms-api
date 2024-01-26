import * as dotenv from 'dotenv'

import { User } from '@mush/modules/core-module/user/user.entity'

import { EPermission, EPosition, ERole } from '@mush/core/enums'

dotenv.config()

export const userList: Partial<User>[] = [
  {
    firstName: process.env.SEED_SUPERADMIN_FIRSTNAME,
    lastName: process.env.SEED_SUPERADMIN_LASTNAME,
    patronimic: process.env.SEED_SUPERADMIN_PATRONIMIC,
    phone: process.env.SEED_SUPERADMIN_PHONE,
    email: process.env.SEED_SUPERADMIN_EMAIL,
    password: process.env.SEED_SUPERADMIN_PASSWORD,
    role: ERole.SUPERADMIN,
    position: EPosition.SUPERADMINISTRATOR,
    permissions: Object.values(EPermission),
    isActive: true,
  },
]
