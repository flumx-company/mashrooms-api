import { UseGuards, applyDecorators } from '@nestjs/common'
import { ApiUnauthorizedResponse } from '@nestjs/swagger'

import { JwtStrategy } from '@mush/core-module/jwt.strategy'

import { EPermission, ERole } from '@mush/enums'
import { Roles, Permission } from '@mush/decorators'
import { RolesGuard, PermissionGuard, IsActiveGuard } from '@mush/guards'

type auth = { roles: ERole[]; permission: EPermission }

export function Auth({ roles, permission }: Partial<auth>) {
  return applyDecorators(
    Roles(roles),
    Permission(permission),
    UseGuards(JwtStrategy, IsActiveGuard, RolesGuard, PermissionGuard),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  )
}
