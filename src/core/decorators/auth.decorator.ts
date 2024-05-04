import { JwtStrategy } from '@mush/modules/core-module';
import { UseGuards, applyDecorators } from '@nestjs/common'
import { ApiUnauthorizedResponse } from '@nestjs/swagger'

import { EPermission, ERole } from '@mush/core/enums'
import { IsActiveGuard, PermissionGuard, RolesGuard } from '@mush/core/guards'
import { Permission } from './permission.decorator';
import { Roles } from './roles.decorator';

type auth = { roles: ERole[]; permission: EPermission }

export function Auth({ roles, permission }: Partial<auth>) {
  return applyDecorators(
    Roles(roles),
    Permission(permission),
    UseGuards(JwtStrategy, IsActiveGuard, RolesGuard, PermissionGuard),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  )
}
