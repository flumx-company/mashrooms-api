import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Permission } from "../decorators/permission.decorator";

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  private checkPermissions(permission: string, userPermissions: string[]) {
    const hasPermission = (userPermissions || []).includes(permission);

    if (!hasPermission) {
      throw new UnauthorizedException(
        "No permission",
        "The user does not have the appropriate permission."
      );
    }

    return true;
  }

  canActivate(context: ExecutionContext): boolean {
    const permission = this.reflector.get(Permission, context.getHandler());

    //NOTE: no permission is received as empty object
    if (typeof permission !== "string") {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return this.checkPermissions(permission, user.permissions);
  }
}
