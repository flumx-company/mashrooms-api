import { UseGuards, applyDecorators } from '@nestjs/common'
import { ApiUnauthorizedResponse } from '@nestjs/swagger'

import { JwtStrategy } from '@core-module/index'

import { EPermission, ERole } from '@enums/index'
import { Roles, Permission } from '@decorators/index'
import { RolesGuard, PermissionGuard, IsActiveGuard } from '@guards/index'

type auth = { roles: ERole[]; permission: EPermission }

export function Auth({ roles, permission }: Partial<auth>) {
  return applyDecorators(
    Roles(roles),
    Permission(permission),
    UseGuards(JwtStrategy, IsActiveGuard, RolesGuard, PermissionGuard),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  )
}
