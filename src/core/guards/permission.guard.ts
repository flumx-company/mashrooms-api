import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { ERole } from '@mush/enums'
import { Permission } from '@mush/decorators'

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  private checkPermissions(permission: string, userPermissions: string[]) {
    const hasPermission = (userPermissions || []).includes(permission)

    if (!hasPermission) {
      throw new UnauthorizedException(
        'No permission',
        'The user does not have the appropriate permission.',
      )
    }

    return true
  }

  canActivate(context: ExecutionContext): boolean {
    const permission = this.reflector.get(Permission, context.getHandler())
    const request = context.switchToHttp().getRequest()
    const user = request.user
    const existsPermission = typeof permission === 'string' //NOTE: no permission is received as empty object
    const isUserSuperAdmin = user.role === ERole.SUPERADMIN

    if (!existsPermission || isUserSuperAdmin) {
      return true
    }

    return this.checkPermissions(permission, user.permissions)
  }
}
