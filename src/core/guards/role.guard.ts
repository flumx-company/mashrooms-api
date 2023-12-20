import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "../decorators/role.decorator";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  private matchRoles(role: number, userRole: number) {
    const isRoleAppropriate = role <= userRole;

    if (!isRoleAppropriate) {
      throw new UnauthorizedException(
        "Wrong role",
        "This endpoint is not accessible for the user's role."
      );
    }

    return isRoleAppropriate;
  }

  canActivate(context: ExecutionContext): boolean {
    const role = this.reflector.get(Role, context.getHandler());

    //NOTE: no role is received as empty object
    if (typeof role !== "string") {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return this.matchRoles(role, user.role);
  }
}
